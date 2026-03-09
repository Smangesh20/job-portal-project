# Migration Guide: Error Handling and Validation Infrastructure

This guide explains how to safely migrate from the current error handling to the new enhanced system using a non-breaking, incremental approach.

## Overview

The migration strategy ensures:
- **Zero downtime** during transition
- **Full backward compatibility** maintained
- **Gradual rollout** with feature flags
- **Easy rollback** if issues arise
- **No breaking changes** to existing APIs

## Migration Phases

### Phase 1: Infrastructure Setup ✅ COMPLETED

**What was done:**
- Installed new dependencies (Joi, Winston, correlation-id, etc.)
- Created middleware structure alongside existing code
- Set up centralized error classes and constants
- Implemented feature flags for gradual rollout
- Created integration helpers

**Status:** All infrastructure is in place and tested.

### Phase 2: Enable Basic Features (Next Steps)

**Recommended order:**

1. **Enable Correlation Tracking**
   ```bash
   # In .env file
   CORRELATION_TRACKING=true
   ```
   - **Risk:** Very low - only adds headers
   - **Benefit:** Better error tracking
   - **Rollback:** Set to `false` and restart

2. **Enable Structured Logging**
   ```bash
   STRUCTURED_LOGGING=true
   ```
   - **Risk:** Low - only changes log format
   - **Benefit:** Better debugging and monitoring
   - **Rollback:** Set to `false` and restart

3. **Enable Input Validation**
   ```bash
   INPUT_VALIDATION=true
   ```
   - **Risk:** Medium - may reject previously accepted input
   - **Benefit:** Better security and data quality
   - **Rollback:** Set to `false` and restart
   - **Note:** Test thoroughly with existing data

4. **Enable Enhanced Error Handling**
   ```bash
   ENHANCED_ERROR_HANDLING=true
   ```
   - **Risk:** Medium - changes error response format
   - **Benefit:** Consistent error responses
   - **Rollback:** Set to `false` and restart
   - **Note:** May require frontend updates

### Phase 3: Route Migration (Future)

**Process for each route:**
1. Create enhanced version alongside original
2. Use feature flags to switch between versions
3. Test thoroughly with existing data
4. Monitor for issues
5. Gradually enable for all users

## Integration Steps

### Step 1: Update Main Server File

```javascript
// In server.js - add after existing middleware
const { applyEnhancedMiddleware, applyErrorHandling } = require('./middleware/integration');

// Apply new middleware (only if feature flags enabled)
applyEnhancedMiddleware(app);

// ... existing routes unchanged ...

// Apply error handling (after all routes)
applyErrorHandling(app);
```

### Step 2: Test with Feature Flags Disabled

```bash
# Ensure all flags are false
ENHANCED_ERROR_HANDLING=false
STRUCTURED_LOGGING=false
INPUT_VALIDATION=false
CORRELATION_TRACKING=false

# Start server and test existing functionality
npm start
```

**Verify:**
- All existing endpoints work unchanged
- Error responses maintain original format
- No new headers or logging changes
- Performance is unaffected

### Step 3: Enable Features One by One

```bash
# Enable correlation tracking first
CORRELATION_TRACKING=true

# Restart and test
npm start
```

**Test checklist:**
- [ ] All endpoints still work
- [ ] New `X-Correlation-ID` header appears in responses
- [ ] No breaking changes to functionality
- [ ] Performance impact is minimal

```bash
# Enable structured logging
STRUCTURED_LOGGING=true

# Restart and test
npm start
```

**Test checklist:**
- [ ] All endpoints still work
- [ ] Logs now use JSON format
- [ ] Correlation IDs appear in logs
- [ ] No sensitive data in logs
- [ ] Log performance is acceptable

### Step 4: Validate Input Sanitization

```bash
# Enable input validation
INPUT_VALIDATION=true

# Restart and test
npm start
```

**Test checklist:**
- [ ] Valid requests still work
- [ ] Malicious input is sanitized
- [ ] XSS attempts are blocked
- [ ] Existing data validation still works
- [ ] No legitimate requests are blocked

### Step 5: Enable Enhanced Error Handling

```bash
# Enable enhanced error handling
ENHANCED_ERROR_HANDLING=true

# Restart and test
npm start
```

**Test checklist:**
- [ ] Error responses use new format
- [ ] All error types are handled correctly
- [ ] Correlation IDs appear in error responses
- [ ] No sensitive information leaked
- [ ] Frontend can handle new format (may need updates)

## Testing Strategy

### Automated Testing

```bash
# Run infrastructure tests
node test/infrastructure.test.js

# Run existing tests (should all pass)
npm test

# Test with different feature flag combinations
```

### Manual Testing

1. **Test existing functionality:**
   - User registration and login
   - Job creation and application
   - File uploads
   - Profile management

2. **Test error scenarios:**
   - Invalid input data
   - Authentication failures
   - Database errors
   - File upload errors

3. **Test new features:**
   - Correlation ID tracking
   - Structured logging
   - Input sanitization
   - Enhanced error responses

### Load Testing

```bash
# Test performance impact
# Compare before and after enabling features
# Monitor memory usage and response times
```

## Rollback Procedures

### Immediate Rollback (Emergency)

```bash
# Disable all features immediately
ENHANCED_ERROR_HANDLING=false
STRUCTURED_LOGGING=false
INPUT_VALIDATION=false
CORRELATION_TRACKING=false

# Restart application
npm restart
```

**Result:** Application reverts to original behavior immediately.

### Selective Rollback

```bash
# Disable only problematic features
# For example, if validation is too strict:
INPUT_VALIDATION=false

# Keep other features enabled
CORRELATION_TRACKING=true
STRUCTURED_LOGGING=true
```

### Complete Rollback

If major issues arise:

1. Set all feature flags to `false`
2. Restart application
3. Remove new middleware from server.js (optional)
4. Revert to previous deployment (if needed)

## Monitoring and Alerts

### Key Metrics to Monitor

1. **Error Rates:**
   - Monitor for increased error rates after enabling features
   - Check for new validation errors

2. **Response Times:**
   - Ensure middleware doesn't significantly impact performance
   - Monitor database query times

3. **Memory Usage:**
   - Watch for memory leaks in logging or error handling
   - Monitor correlation ID storage

4. **Log Volume:**
   - Structured logging may increase log volume
   - Ensure log rotation is configured

### Alert Conditions

```bash
# Set up alerts for:
# - Error rate > 5% increase
# - Response time > 200ms increase
# - Memory usage > 20% increase
# - Log errors containing "correlation"
```

## Frontend Considerations

### Error Response Changes

When `ENHANCED_ERROR_HANDLING=true`, error responses change from:

```javascript
// Old format
{
  "error": "Validation failed"
}
```

To:

```javascript
// New format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [...],
    "correlationId": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Frontend Updates Needed

1. **Update error handling code:**
   ```javascript
   // Handle both old and new formats
   const errorMessage = response.error?.message || response.error || 'Unknown error';
   ```

2. **Use correlation IDs:**
   ```javascript
   // Include correlation ID in error reports
   const correlationId = response.error?.correlationId;
   ```

3. **Handle field-level errors:**
   ```javascript
   // Display field-specific validation errors
   const fieldErrors = response.error?.details || [];
   ```

## Troubleshooting

### Common Issues

1. **Feature flag not working:**
   - Check `.env` file syntax
   - Restart application after changes
   - Verify environment variable loading

2. **Validation too strict:**
   - Review validation schemas
   - Temporarily disable `INPUT_VALIDATION`
   - Adjust validation rules

3. **Performance issues:**
   - Disable `STRUCTURED_LOGGING` temporarily
   - Check log file sizes
   - Monitor memory usage

4. **Frontend errors:**
   - Update error handling code
   - Handle both old and new response formats
   - Test with enhanced error responses

### Debug Commands

```bash
# Check feature flag status
curl http://localhost:4444/health

# Test error handling
curl http://localhost:4444/test-error

# Check correlation ID
curl -H "X-Correlation-ID: test-123" http://localhost:4444/health
```

## Success Criteria

### Phase 2 Complete When:
- [ ] All feature flags can be enabled without breaking existing functionality
- [ ] Correlation IDs are tracked across all requests
- [ ] Structured logging provides useful debugging information
- [ ] Input validation prevents malicious input without blocking legitimate requests
- [ ] Enhanced error responses provide better debugging information
- [ ] Performance impact is minimal (< 10% increase in response time)
- [ ] All existing tests pass
- [ ] Rollback procedures are tested and working

### Ready for Phase 3 When:
- [ ] All Phase 2 criteria met
- [ ] Feature flags stable for 1 week in production
- [ ] No critical issues reported
- [ ] Monitoring and alerting in place
- [ ] Team trained on new error handling
- [ ] Frontend updated to handle new error formats

## Next Steps

After completing this migration:

1. **Route Enhancement:** Gradually update individual routes with enhanced validation
2. **Advanced Features:** Enable error analytics, rate limiting, OAuth integration
3. **Monitoring Dashboard:** Implement real-time error monitoring
4. **Performance Optimization:** Fine-tune middleware for optimal performance
5. **Security Hardening:** Add advanced security features

## Support

For issues during migration:

1. **Check this guide** for common solutions
2. **Review feature flag configuration**
3. **Test with features disabled** to isolate issues
4. **Check correlation IDs** in logs for debugging
5. **Use rollback procedures** if needed
6. **Consult middleware documentation** in `/middleware/README.md`