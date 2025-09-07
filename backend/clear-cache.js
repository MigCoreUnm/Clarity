#!/usr/bin/env node

/**
 * Script to clear AI caches (OpenAI and Toolhouse)
 * Usage: node clear-cache.js [options]
 * 
 * Options:
 *   --gpt     Clear only OpenAI/GPT caches (approvalReason)
 *   --toolhouse Clear only Toolhouse caches (policySuggestion)
 *   --all     Clear all caches (default)
 *   --id=<id> Clear cache for specific transaction ID only
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  clearGPT: false,
  clearToolhouse: false,
  transactionId: null
};

// Parse arguments
args.forEach(arg => {
  if (arg === '--gpt') {
    options.clearGPT = true;
  } else if (arg === '--toolhouse') {
    options.clearToolhouse = true;
  } else if (arg === '--all') {
    options.clearGPT = true;
    options.clearToolhouse = true;
  } else if (arg.startsWith('--id=')) {
    options.transactionId = arg.split('=')[1];
  }
});

// Default to clearing all if no specific option provided
if (!options.clearGPT && !options.clearToolhouse) {
  options.clearGPT = true;
  options.clearToolhouse = true;
}

// Read transactions file
const transactionsPath = path.join(__dirname, 'data', 'transactions.json');

try {
  const data = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));
  let clearedCount = 0;
  let gptCleared = 0;
  let toolhouseCleared = 0;

  data.forEach(transaction => {
    // Skip if specific ID requested and doesn't match
    if (options.transactionId && transaction.id !== options.transactionId) {
      return;
    }

    let cleared = false;

    // Clear GPT cache
    if (options.clearGPT && transaction.approvalReason) {
      delete transaction.approvalReason;
      gptCleared++;
      cleared = true;
      console.log(`✓ Cleared GPT cache for transaction ${transaction.id}`);
    }

    // Clear Toolhouse cache
    if (options.clearToolhouse && transaction.policySuggestion) {
      delete transaction.policySuggestion;
      toolhouseCleared++;
      cleared = true;
      console.log(`✓ Cleared Toolhouse cache for transaction ${transaction.id}`);
    }

    if (cleared) {
      clearedCount++;
    }
  });

  // Write back to file
  fs.writeFileSync(transactionsPath, JSON.stringify(data, null, 2));

  // Summary
  console.log('\n========================================');
  console.log('Cache Clearing Complete!');
  console.log('========================================');
  console.log(`Transactions processed: ${options.transactionId ? 1 : data.length}`);
  console.log(`Transactions with cache cleared: ${clearedCount}`);
  if (options.clearGPT) {
    console.log(`GPT caches cleared: ${gptCleared}`);
  }
  if (options.clearToolhouse) {
    console.log(`Toolhouse caches cleared: ${toolhouseCleared}`);
  }
  console.log('\nNext steps:');
  console.log('1. Restart the backend server if it\'s running');
  console.log('2. Refresh your browser to see fresh AI suggestions');
  console.log('3. New API calls will fetch fresh data from OpenAI/Toolhouse');

} catch (error) {
  console.error('Error clearing cache:', error.message);
  process.exit(1);
}