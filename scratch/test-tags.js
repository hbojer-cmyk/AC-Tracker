const fs = require('fs');

const content = fs.readFileSync('index.tsx', 'utf8');
const lines = content.split('\n');

// Simple tag stack tracker for JSX
const tagRegex = /<\/?([a-zA-Z0-9_-]+)[^>]*\/?>/g;
const stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let match;
  // regex match tags
  while ((match = tagRegex.exec(line)) !== null) {
    const full = match[0];
    const tagName = match[1];
    
    // Ignore self-closing tags
    if (full.endsWith('/>')) continue;
    // Ignore void elements
    if (['img', 'input', 'br', 'hr'].includes(tagName)) continue;
    
    if (full.startsWith('</')) {
      // Closing tag
      if (stack.length === 0) {
        console.log(`Line ${i + 1}: Unexpected closing tag </${tagName}> (empty stack)`);
      } else {
        const top = stack.pop();
        if (top.tagName !== tagName) {
          console.log(`Line ${i + 1}: Mismatched closing tag </${tagName}>, expected </${top.tagName}> (opened at line ${top.line})`);
        }
      }
    } else {
      // Opening tag
      stack.push({ tagName, line: i + 1 });
    }
  }
}

if (stack.length > 0) {
  console.log(`Unclosed tags at end of file:`);
  stack.forEach(s => console.log(`  <${s.tagName}> opened at line ${s.line}`));
} else {
  console.log('All tags matched cleanly!');
}
