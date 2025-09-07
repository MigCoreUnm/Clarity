const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const http = require('http');
const multer = require('multer');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage (no file saved to disk)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// File paths
const TRANSACTIONS_FILE = path.join(__dirname, 'data', 'transactions.json');
const POLICIES_FILE = path.join(__dirname, 'data', 'policies.json');

// WebSocket connections
const wsClients = new Set();

wss.on('connection', (ws) => {
  wsClients.add(ws);
  console.log('New WebSocket connection');
  
  ws.on('close', () => {
    wsClients.delete(ws);
    console.log('WebSocket connection closed');
  });
});

// Broadcast to all WebSocket clients
function broadcast(event, data) {
  const message = JSON.stringify({ event, data });
  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Helper functions to read/write JSON files
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return filePath.includes('transactions') ? [] : { groups: [] };
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// GPT Approval Recommendation
async function getApprovalRecommendation(transaction, policies) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      approved: true,
      policyStatus: 'Needs review',
      approvalStatus: 'Pending',
      reason: 'API key not configured - defaulting to pending'
    };
  }

  try {
    const policyText = policies.groups.map(group => 
      `${group.title}:\n${group.policies.map(p => `- ${p.title}: ${p.description}`).join('\n')}`
    ).join('\n\n');

    const prompt = `Analyze this expense transaction against company policies:
    
Transaction:
- Merchant: ${transaction.merchantName}
- Amount: ${transaction.amount}
- Date: ${transaction.date}
- Memo: ${transaction.memo}
- Category: ${transaction.merchantCategory || 'N/A'}

Company Policies:
${policyText}

Determine:
1. Should this be approved? (true/false)
2. Policy status: "In policy", "Out of policy", or "Needs review"
3. Approval status: "Approved", "Rejected", or "Pending"
4. Brief reason (1-2 sentences)

Respond in JSON format: { "approved": boolean, "policyStatus": string, "approvalStatus": string, "reason": string }`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-5',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('GPT API error:', error.message);
    return {
      approved: true,
      policyStatus: 'Needs review',
      approvalStatus: 'Pending',
      reason: 'Error processing approval - requires manual review'
    };
  }
}

// Toolhouse Policy Suggestion
async function getPolicySuggestion(transactions, policies, currentTransaction = null) {
  if (!process.env.TOOLHOUSE_AGENT_URL) {
    return { suggestion: 'Toolhouse agent URL not configured' };
  }

  try {
    let message = '';
    
    // Build a context-aware message for Toolhouse
    if (currentTransaction) {
      message = `Analyze this specific transaction and provide policy improvement suggestions:
      
Transaction Details:
- Merchant: ${currentTransaction.merchantName}
- Amount: ${currentTransaction.amount}
- Category: ${currentTransaction.merchantCategory || 'Unknown'}
- Date: ${currentTransaction.date}
- Memo: ${currentTransaction.memo || 'N/A'}
- Current Status: ${currentTransaction.approvalStatus}
- Policy Status: ${currentTransaction.policyStatus}

Current Company Policies:
${policies.groups.map(group => 
  `${group.title}:\n${group.policies.map(p => `- ${p.title}: ${p.description}`).join('\n')}`
).join('\n\n')}

Recent Transaction Patterns:
${transactions.slice(-5).map(t => 
  `- ${t.merchantName}: ${t.amount} (${t.merchantCategory || 'N/A'}) - ${t.approvalStatus}`
).join('\n')}

Please provide specific policy improvement suggestions based on this transaction and overall spending patterns.`;
    } else {
      message = `Review our company expense policies and recent transactions, then provide general policy improvement suggestions.

Current Policies:
${policies.groups.map(group => 
  `${group.title}:\n${group.policies.map(p => `- ${p.title}: ${p.description}`).join('\n')}`
).join('\n\n')}

Recent Transactions:
${transactions.slice(-10).map(t => 
  `- ${t.merchantName}: ${t.amount} (${t.merchantCategory || 'N/A'}) - ${t.approvalStatus}`
).join('\n')}`;
    }
    
    console.log('Sending to Toolhouse:', { message: message.substring(0, 200) + '...' });
    
    // Send as a simple message that Toolhouse expects
    const response = await axios.post(process.env.TOOLHOUSE_AGENT_URL, {
      message: message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Toolhouse response received');
    return { suggestion: response.data };
  } catch (error) {
    console.error('Toolhouse API error:', error.response?.data || error.message);
    return { suggestion: 'Error generating policy suggestion' };
  }
}

// Parse receipt using GPT-5 Vision
async function parseReceiptWithGPT(imageBuffer, mimeType) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      error: 'OpenAI API key not configured',
      merchantName: '',
      merchantCategory: '',
      date: '',
      amount: '',
      memo: ''
    };
  }

  try {
    // Convert image buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const prompt = `Analyze this receipt image and extract the following information. Return ONLY valid JSON with these exact fields:
{
  "merchantName": "name of the merchant/vendor",
  "merchantCategory": "category - MUST be one of these if applicable: Groceries, Restaurants, Department Store, Taxi and Rideshare, Food Delivery, Airlines, Entertainment, Technology, Hotels, Office Supplies, Gas Station, Healthcare, Other",
  "date": "transaction date in YYYY-MM-DD format",
  "amount": "total amount as a number (no currency symbols)",
  "memo": "brief description of items purchased or purpose"
}

IMPORTANT: For merchantCategory, try to match one of the predefined categories listed above. Only use a different category if none of these apply. If any field cannot be determined, use an empty string. Make sure the date is in YYYY-MM-DD format.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const responseContent = response.data.choices[0].message.content;
    console.log('GPT-5 raw response:', responseContent);
    
    // Check if response is empty or invalid
    if (!responseContent || responseContent.trim() === '') {
      console.error('Empty response from GPT-5, retrying with fallback model...');
      // Fallback to gpt-4o if GPT-5 returns empty
      const fallbackResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl } }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      const fallbackContent = fallbackResponse.data.choices[0].message.content;
      const parsed = JSON.parse(fallbackContent);
      console.log('Fallback GPT-4o response:', parsed);
      
      // Ensure amount is a string in the expected format
      if (parsed.amount && typeof parsed.amount === 'number') {
        parsed.amount = parsed.amount.toString();
      }
      
      return parsed;
    }
    
    const parsed = JSON.parse(responseContent);
    console.log('Parsed GPT-5 response:', parsed);
    
    // Ensure amount is a string in the expected format
    if (parsed.amount && typeof parsed.amount === 'number') {
      parsed.amount = parsed.amount.toString();
    }
    
    return parsed;
  } catch (error) {
    console.error('GPT Vision API error:', error.response?.data || error.message);
    return {
      error: 'Failed to parse receipt',
      merchantName: '',
      merchantCategory: '',
      date: '',
      amount: '',
      memo: ''
    };
  }
}

// ============= API ENDPOINTS =============

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Clarity API Server',
    status: 'Running',
    endpoints: {
      transactions: '/api/transactions',
      policies: '/api/policies',
      parseReceipt: '/api/parse-receipt',
      analyzeTransaction: '/api/analyze-transaction',
      suggestPolicy: '/api/suggest-policy'
    }
  });
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read transactions' });
  }
});

// Add new transaction (with automatic approval analysis)
app.post('/api/transactions', async (req, res) => {
  try {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    const policies = await readJSON(POLICIES_FILE);
    
    const newTransaction = {
      ...req.body,
      id: req.body.id || `txn-${Date.now()}`
    };

    // Get AI approval recommendation
    const recommendation = await getApprovalRecommendation(newTransaction, policies);
    
    // Merge recommendation with transaction and remove isAnalyzing flag
    const enhancedTransaction = {
      ...newTransaction,
      policyStatus: recommendation.policyStatus,
      approvalStatus: recommendation.approvalStatus,
      approvalReason: recommendation.reason
    };
    // Remove the isAnalyzing flag since analysis is complete
    delete enhancedTransaction.isAnalyzing;

    transactions.push(enhancedTransaction);
    await writeJSON(TRANSACTIONS_FILE, transactions);
    
    // Broadcast update
    broadcast('transaction:new', enhancedTransaction);
    
    res.json(enhancedTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    const filtered = transactions.filter(t => t.id !== req.params.id);
    await writeJSON(TRANSACTIONS_FILE, filtered);
    
    broadcast('transaction:deleted', req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get all policies
app.get('/api/policies', async (req, res) => {
  try {
    const policies = await readJSON(POLICIES_FILE);
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read policies' });
  }
});

// Update policies (complete replacement)
app.post('/api/policies', async (req, res) => {
  try {
    await writeJSON(POLICIES_FILE, req.body);
    broadcast('policies:updated', req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update policies' });
  }
});

// Analyze single transaction
app.post('/api/analyze-transaction', async (req, res) => {
  try {
    const policies = await readJSON(POLICIES_FILE);
    const recommendation = await getApprovalRecommendation(req.body, policies);
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze transaction' });
  }
});

// Parse receipt image
app.post('/api/parse-receipt', upload.single('receipt'), async (req, res) => {
  try {
    console.log('Receipt upload request received');
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No receipt file provided' });
    }

    const { buffer, mimetype } = req.file;
    console.log('Processing receipt:', { size: buffer.length, mimetype });
    const parsed = await parseReceiptWithGPT(buffer, mimetype);
    console.log('Receipt parsed successfully:', parsed);
    
    res.json(parsed);
  } catch (error) {
    console.error('Receipt parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse receipt',
      merchantName: '',
      merchantCategory: '',
      date: '',
      amount: '',
      memo: ''
    });
  }
});

// Re-analyze existing transaction
app.post('/api/reanalyze-transaction/:id', async (req, res) => {
  try {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    const policies = await readJSON(POLICIES_FILE);
    
    // Find the transaction
    const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = transactions[transactionIndex];
    
    // Get new AI analysis
    const recommendation = await getApprovalRecommendation(transaction, policies);
    
    // Update transaction with new analysis
    transactions[transactionIndex] = {
      ...transaction,
      policyStatus: recommendation.policyStatus,
      approvalStatus: recommendation.approvalStatus,
      approvalReason: recommendation.reason
    };
    
    // Save updated transactions
    await writeJSON(TRANSACTIONS_FILE, transactions);
    
    // Broadcast update
    broadcast('transaction:updated', transactions[transactionIndex]);
    
    res.json(transactions[transactionIndex]);
  } catch (error) {
    console.error('Error re-analyzing transaction:', error);
    res.status(500).json({ error: 'Failed to re-analyze transaction' });
  }
});

// Get policy suggestion
app.post('/api/suggest-policy', async (req, res) => {
  try {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    const policies = await readJSON(POLICIES_FILE);
    
    // If a specific transaction is provided, pass it as context
    const currentTransaction = req.body.transaction || null;
    const suggestion = await getPolicySuggestion(transactions, policies, currentTransaction);
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate policy suggestion' });
  }
});

// Get or generate policy suggestion for specific transaction
app.get('/api/transactions/:id/policy-suggestion', async (req, res) => {
  try {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
    
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = transactions[transactionIndex];
    
    // Check if we already have a cached policy suggestion
    if (transaction.policySuggestion && transaction.policySuggestion.content) {
      // Check if cache is less than 24 hours old
      const cacheAge = Date.now() - new Date(transaction.policySuggestion.timestamp).getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (cacheAge < oneDayMs && !req.query.force) {
        console.log('Returning cached policy suggestion for transaction:', req.params.id);
        return res.json({ 
          suggestion: transaction.policySuggestion.content,
          cached: true,
          timestamp: transaction.policySuggestion.timestamp
        });
      }
    }
    
    // Generate new policy suggestion
    console.log('Generating new policy suggestion for transaction:', req.params.id);
    const policies = await readJSON(POLICIES_FILE);
    const suggestion = await getPolicySuggestion(transactions, policies, transaction);
    
    // Cache the suggestion in the transaction
    transactions[transactionIndex].policySuggestion = {
      content: suggestion.suggestion,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    // Save updated transactions
    await writeJSON(TRANSACTIONS_FILE, transactions);
    
    // Broadcast update
    broadcast('transaction:updated', transactions[transactionIndex]);
    
    res.json({ 
      suggestion: suggestion.suggestion,
      cached: false,
      timestamp: transactions[transactionIndex].policySuggestion.timestamp
    });
  } catch (error) {
    console.error('Error getting policy suggestion:', error);
    res.status(500).json({ error: 'Failed to get policy suggestion' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready for connections`);
});