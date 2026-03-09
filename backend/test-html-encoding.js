const { sanitizeStringWithThreatDetection, generateCorrelationId } = require('./middleware/validation');

const context = { 
  timestamp: new Date().toISOString(), 
  correlationId: generateCorrelationId() 
};

const testInput = 'Text with < and > and "quotes"';
const result = sanitizeStringWithThreatDetection(testInput, context);

console.log('Input:', testInput);
console.log('Output:', result.sanitized);
console.log('Raw output:', JSON.stringify(result.sanitized));
console.log('Contains &lt;:', result.sanitized.includes('&lt;'));
console.log('Contains &gt;:', result.sanitized.includes('&gt;'));
console.log('Contains &quot;:', result.sanitized.includes('&quot;'));