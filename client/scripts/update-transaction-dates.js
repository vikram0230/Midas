#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Updating transaction dates to Feb-March 2025...');

try {
  // Run the Convex function to update transaction dates
  execSync('npx convex run transactions:updateTransactionDatesToCurrentYear', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Successfully updated all transaction dates to Feb-March 2025!');
} catch (error) {
  console.error('❌ Error updating transaction dates:', error.message);
  process.exit(1);
}
