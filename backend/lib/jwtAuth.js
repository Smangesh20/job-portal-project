const passport = require("passport");
const { AuthenticationError } = require("../utils/errorClasses");
const { ERROR_MESSAGES } = require("../utils/errorConstants");

const jwtAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      // Determine specific authentication error type based on info
      let authType = 'token_invalid';
      let message = ERROR_MESSAGES.TOKEN_INVALID;
      
      if (info) {
        // Handle different JWT error scenarios
        if (info.name === 'TokenExpiredError') {
          authType = 'token_expired';
          message = ERROR_MESSAGES.TOKEN_EXPIRED;
        } else if (info.name === 'JsonWebTokenError') {
          if (info.message.includes('malformed')) {
            authType = 'token_malformed';
            message = ERROR_MESSAGES.TOKEN_MALFORMED;
          } else if (info.message.includes('signature')) {
            authType = 'token_signature_invalid';
            message = ERROR_MESSAGES.TOKEN_SIGNATURE_INVALID;
          } else {
            authType = 'token_invalid';
            message = ERROR_MESSAGES.TOKEN_INVALID;
          }
        } else if (info.message === 'No auth token' || info.message === 'JWT Token does not exist') {
          authType = 'token_missing';
          message = ERROR_MESSAGES.TOKEN_MISSING;
        } else if (info.message && (
          info.message.toLowerCase().includes('user') && 
          (info.message.toLowerCase().includes('not found') || 
           info.message.toLowerCase().includes('does not exist') ||
           info.message.toLowerCase().includes('no longer exists'))
        )) {
          authType = 'token_user_not_found';
          message = ERROR_MESSAGES.TOKEN_USER_NOT_FOUND;
        } else if (info.message) {
          // Use the message from passport if available
          message = info.message;
        }
      }
      
      return next(new AuthenticationError(message, authType));
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = jwtAuth;
