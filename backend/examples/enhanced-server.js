/**
 * Enhanced Server Example
 * Shows how to integrate new middleware with existing Express app
 * This is an example - the actual integration will be done gradually
 */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("../lib/passportConfig");
const cors = require("cors");
const fs = require("fs");

// Import new middleware (non-breaking)
const { applyEnhancedMiddleware, applyErrorHandling } = require('../middleware/integration');
const featureFlags = require('../middleware/featureFlags');

// MongoDB connection (existing)
mongoose
  .connect("mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Directory initialization (existing)
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const port = 4444;

// Existing middleware (unchanged)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// NEW: Apply enhanced middleware (only if feature flags enabled)
// This is non-breaking - if flags are disabled, nothing changes
applyEnhancedMiddleware(app);

// Log current feature flag status
console.log('Feature Flags Status:');
console.log('- Enhanced Error Handling:', featureFlags.isEnabled('ENHANCED_ERROR_HANDLING'));
console.log('- Structured Logging:', featureFlags.isEnabled('STRUCTURED_LOGGING'));
console.log('- Input Validation:', featureFlags.isEnabled('INPUT_VALIDATION'));
console.log('- Correlation Tracking:', featureFlags.isEnabled('CORRELATION_TRACKING'));

// Existing routes (unchanged)
app.use("/auth", require("../routes/authRoutes"));
app.use("/api", require("../routes/apiRoutes"));
app.use("/upload", require("../routes/uploadRoutes"));
app.use("/host", require("../routes/downloadRoutes"));

// NEW: Health check endpoint to test new infrastructure
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    features: featureFlags.getAll(),
    correlationId: req.correlationId || 'not-available'
  };
  
  res.json(health);
});

// NEW: Test endpoint to demonstrate error handling
app.get('/test-error', (req, res, next) => {
  const { ValidationError } = require('../utils/errorClasses');
  
  // Throw a test error to see new error handling in action
  const error = new ValidationError('This is a test error', [
    { field: 'test', message: 'This is for testing', code: 'TEST_ERROR' }
  ]);
  
  next(error);
});

// NEW: Apply error handling middleware (after all routes)
// This is non-breaking - behavior depends on feature flags
applyErrorHandling(app);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
  console.log('');
  console.log('Test endpoints:');
  console.log(`- Health check: http://localhost:${port}/health`);
  console.log(`- Test error: http://localhost:${port}/test-error`);
  console.log('');
  console.log('To enable new features, set environment variables:');
  console.log('- ENHANCED_ERROR_HANDLING=true');
  console.log('- STRUCTURED_LOGGING=true');
  console.log('- INPUT_VALIDATION=true');
  console.log('- CORRELATION_TRACKING=true');
});

module.exports = app;