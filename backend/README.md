# Clarity Backend

Simple Node.js backend for the Clarity expense management system.

## Features

- **Transaction Management**: CRUD operations for expense transactions
- **Policy Management**: Store and update company expense policies  
- **AI Approval Recommendations**: Uses GPT-5 to analyze transactions against policies
- **Policy Suggestions**: Integrates with Toolhouse AI agent for policy improvements
- **Real-time Updates**: WebSocket support for live data synchronization
- **Simple JSON Storage**: No database required, uses local JSON files

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - Add your Toolhouse agent URL

3. Start the server:
```bash
npm start
```

The server will run on http://localhost:3001

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add new transaction (auto-analyzes for approval)
- `DELETE /api/transactions/:id` - Delete a transaction

### Policies
- `GET /api/policies` - Get all policy groups and policies
- `POST /api/policies` - Update all policies (complete replacement)

### AI Features
- `POST /api/analyze-transaction` - Get GPT approval recommendation for a transaction
- `POST /api/reanalyze-transaction/:id` - Re-analyze existing transaction with GPT
- `POST /api/suggest-policy` - Get Toolhouse policy suggestion based on recent data
- `GET /api/transactions/:id/policy-suggestion` - Get cached or new Toolhouse policy suggestion for specific transaction

## WebSocket Events

The server broadcasts these events:
- `transaction:new` - When a new transaction is added
- `transaction:deleted` - When a transaction is deleted  
- `policies:updated` - When policies are updated

## Data Storage

Data is stored in JSON files in the `/data` directory:
- `transactions.json` - All expense transactions
- `policies.json` - Company policies organized by groups

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key for GPT-5 analysis
- `TOOLHOUSE_AGENT_URL` - URL of your Toolhouse agent for policy suggestions
- `PORT` - Server port (default: 3001)

## How It Works

1. When a new transaction is added, it's automatically analyzed against company policies using GPT-5
2. The AI determines if it should be approved, rejected, or needs review
3. Policy suggestions can be generated based on transaction patterns
4. All changes are broadcast via WebSocket for real-time frontend updates

## Cache Management

The system caches AI-generated content to reduce API calls and improve performance. Here's how to clear caches:

### Clearing OpenAI (GPT) Cache

OpenAI recommendations are stored in the `approvalReason` field of each transaction. To clear and regenerate:

#### Method 1: Re-analyze a specific transaction
```bash
# Using the API endpoint
curl -X POST http://localhost:3038/api/reanalyze-transaction/[TRANSACTION_ID]
```

#### Method 2: Clear all GPT cache manually
1. Edit `backend/data/transactions.json`
2. Remove the `approvalReason` field from transactions you want to re-analyze
3. Use the re-analyze endpoint or the "Re-analyze with AI" button in the UI

### Clearing Toolhouse Policy Suggestion Cache

Toolhouse suggestions are cached in the `policySuggestion` field of each transaction for 24 hours.

#### Method 1: Force refresh for a specific transaction
```bash
# Force refresh (bypasses cache)
curl -X GET "http://localhost:3038/api/transactions/[TRANSACTION_ID]/policy-suggestion?force=true"
```

#### Method 2: Using the UI
- Click the "Refresh Analysis" button in the AI Policy Analysis card
- This will fetch a new suggestion from Toolhouse

#### Method 3: Clear all Toolhouse cache manually
1. Edit `backend/data/transactions.json`
2. Remove the `policySuggestion` object from transactions you want to refresh
3. The next request will fetch fresh data from Toolhouse

#### Method 4: Use the provided cache clearing script

A convenient script is provided to clear caches:

```bash
# Clear all caches (both OpenAI and Toolhouse)
node clear-cache.js

# Clear only OpenAI/GPT caches
node clear-cache.js --gpt

# Clear only Toolhouse caches
node clear-cache.js --toolhouse

# Clear cache for a specific transaction
node clear-cache.js --id=28

# Clear GPT cache for a specific transaction
node clear-cache.js --gpt --id=28
```

The script will show you:
- How many caches were cleared
- Which transactions were affected
- Next steps to see the changes

### Cache Behavior

- **GPT Cache**: Permanent until manually cleared or re-analyzed
- **Toolhouse Cache**: Valid for 24 hours, then automatically refreshes
- **Force Refresh**: Add `?force=true` to bypass Toolhouse cache
- **Automatic Updates**: Cache updates when transactions are re-analyzed