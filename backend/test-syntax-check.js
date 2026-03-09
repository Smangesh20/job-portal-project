/**
 * Simple syntax check for the logging module
 */

try {
  console.log('Testing logging module syntax...');
  
  const logging = require('./middleware/logging');
  console.log('✓ Logging module loaded successfully');
  
  const featureFlags = require('./middleware/featureFlags');
  console.log('✓ Feature flags module loaded successfully');
  
  // Test basic functionality
  featureFlags.enable('STRUCTURED_LOGGING');
  console.log('✓ Feature flags enabled');
  
  logging.logger.info('Test message');
  console.log('✓ Basic logging works');
  
  const sanitized = logging.sanitizeLogData({ password: 'secret', name: 'test' });
  console.log('✓ Sanitization works:', sanitized);
  
  console.log('\n✅ All syntax checks passed!');
  
} catch (error) {
  console.error('❌ Syntax error detected:');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}