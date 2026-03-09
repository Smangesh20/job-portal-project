const { sanitizeStringWithThreatDetection, generateCorrelationId } = require('./middleware/validation');

const context = { 
  timestamp: new Date().toISOString(), 
  correlationId: generateCorrelationId() 
};

// Test with content that has < and > but not in dangerous patterns
const testInputs = [
  'Math: 5 < 10 and 15 > 8',
  'Expression: x < y and z > w',
  'Text with "quotes" and \'apostrophes\'',
  'Safe content without dangerous patterns'
];

testInputs.forEach((input, index) => {
  const result = sanitizeStringWithThreatDetection(input, context);
  console.log(`\nTest ${index + 1}:`);
  console.log('Input:', input);
  console.log('Output:', result.sanitized);
  console.log('Threats detected:', result.detected.length);
  console.log('Contains &lt;:', result.sanitized.includes('&lt;'));
  console.log('Contains &gt;:', result.sanitized.includes('&gt;'));
  console.log('Contains &quot;:', result.sanitized.includes('&quot;'));
});