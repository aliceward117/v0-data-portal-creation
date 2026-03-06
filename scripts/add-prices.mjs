import { readFileSync, writeFileSync } from 'fs';

const file = readFileSync('/app/order-triage/page.tsx', 'utf8');
const lines = file.split('\n');

// Seed for reproducible but varied prices
const prices = [3.45, 7.20, 2.85, 12.50, 4.99, 6.75, 8.30, 1.95, 5.60, 9.15, 
                11.20, 3.80, 7.45, 2.50, 14.99, 6.10, 4.25, 8.90, 3.15, 10.50,
                5.75, 7.80, 2.30, 9.60, 4.40, 11.85, 3.50, 6.95, 8.20, 1.75,
                13.40, 5.25, 7.10, 2.90, 10.15, 4.60, 9.35, 6.50, 3.70, 8.55,
                12.00, 5.90, 7.35, 2.65, 11.50, 4.80, 9.75, 6.20, 3.95, 8.10,
                14.25, 5.40, 7.65, 2.15, 10.80, 4.15, 9.50, 6.85, 3.30, 8.70,
                12.60, 5.05];

let priceIdx = 0;
const result = [];

for (let i = 0; i < lines.length; i++) {
  result.push(lines[i]);
  
  // Match "pickedQty: N," in sample data (not in type definition)
  const match = lines[i].match(/^(\s+)pickedQty: (\d+),$/);
  if (match) {
    const indent = match[1];
    const pickedQty = parseInt(match[2]);
    
    // Check we're in sample data (next line shouldn't be a type field)
    // and that we haven't already added unitPrice
    const nextLine = lines[i + 1] || '';
    if (!nextLine.includes('unitPrice')) {
      // Look back to find quantity
      let qty = pickedQty;
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const qtyMatch = lines[j].match(/quantity: (\d+)/);
        if (qtyMatch) {
          qty = parseInt(qtyMatch[1]);
          break;
        }
      }
      
      const unitPrice = prices[priceIdx % prices.length];
      const lineTotal = parseFloat((qty * unitPrice).toFixed(2));
      priceIdx++;
      
      result.push(`${indent}unitPrice: ${unitPrice},`);
      result.push(`${indent}lineTotal: ${lineTotal},`);
    }
  }
}

writeFileSync('/app/order-triage/page.tsx', result.join('\n'));
console.log(`Added unitPrice and lineTotal to ${priceIdx} line items`);
