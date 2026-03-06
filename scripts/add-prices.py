import re
import random

file_path = '/app/order-triage/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

lines = content.split('\n')
new_lines = []
i = 0

# Price ranges for realistic data
prices = [1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00, 4.25, 4.50, 4.99, 5.25, 5.50, 5.99, 6.25, 6.50, 7.25, 7.99, 8.50, 9.99, 10.50, 12.00, 14.99, 15.50]
price_idx = 0

while i < len(lines):
    line = lines[i]
    new_lines.append(line)
    
    # Match pickedQty lines in lineItems data (not in type definitions)
    match = re.match(r'^(\s+)pickedQty:\s*(\d+),\s*$', line)
    if match:
        indent = match.group(1)
        picked = int(match.group(2))
        
        # Check next line doesn't already have unitPrice
        if i + 1 < len(lines) and 'unitPrice' not in lines[i + 1]:
            # Also check we're in a data block (not type def) by checking for quantity line above
            # Look back for quantity
            found_quantity = False
            for back in range(1, 5):
                if i - back >= 0 and 'quantity:' in lines[i - back]:
                    # Extract quantity value
                    q_match = re.search(r'quantity:\s*(\d+)', lines[i - back])
                    if q_match:
                        qty = int(q_match.group(1))
                        found_quantity = True
                        break
            
            if found_quantity:
                unit_price = prices[price_idx % len(prices)]
                price_idx += 1
                line_total = round(unit_price * qty, 2)
                new_lines.append(f'{indent}unitPrice: {unit_price},')
                new_lines.append(f'{indent}lineTotal: {line_total},')
    
    i += 1

with open(file_path, 'w') as f:
    f.write('\n'.join(new_lines))

print(f"Done! Added unitPrice and lineTotal to {price_idx} line items.")
