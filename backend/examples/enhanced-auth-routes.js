/**
 * Enhanced Auth Routes Example
 * Shows how to enhance existing auth routes with new validation and error handling
 * This is an example - actual implementation will be done gradually
 */

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

// Import existing models
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");

// Import new infrastructure
const { enhanceRoute } = require('../middleware/integration');
const { validationSchemas } = require('../middleware/validation');
const { ValidationError, AuthenticationError } = require('../utils/errorClasses');
const { asyncHandler } = require('../middleware/errorHandler');
const featureFlags = require('../middleware/featureFlags');

const router = express.Router();

/**
 * Enhanced Signup Route
 * Shows both old and new implementations side by side
 */

// Original signup handler (unchanged for backward compatibility)
function originalSignupHandler(req, res) {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              contactNumber: data.contactNumber,
              bio: data.bio,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              education: data.education,
              skills: data.skills,
              rating: data.rating,
              resume: data.resume,
              profile: data.profile,
            });

      userDetails
        .save()
        .then(() => {
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
        })
        .catch((err) => {
          user
            .delete()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
            });
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

// Enhanced signup handler with new error handling
const enhancedSignupHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  
  try {
    // Create user with enhanced error handling
    const user = new User({
      email: data.email,
      password: data.password,
      type: data.type,
    });

    await user.save();

    // Create user details based on type
    const userDetails = user.type === "recruiter"
      ? new Recruiter({
          userId: user._id,
          name: data.name,
          contactNumber: data.contactNumber,
          bio: data.bio,
        })
      : new JobApplicant({
          userId: user._id,
          name: data.name,
          education: data.education,
          skills: data.skills,
          rating: data.rating,
          resume: data.resume,
          profile: data.profile,
        });

    await userDetails.save();

    // Generate token
    const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
    
    // Enhanced response format (if feature enabled)
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        data: {
          token: token,
          type: user.type,
          user: {
            id: user._id,
            email: user.email,
            type: user.type
          }
        },
        correlationId: req.correlationId
      });
    } else {
      // Maintain backward compatibility
      res.json({
        token: token,
        type: user.type,
      });
    }

  } catch (error) {
    // Clean up user if userDetails creation fails
    if (error.name === 'ValidationError' && user && user._id) {
      await User.findByIdAndDelete(user._id);
    }
    
    // Let error middleware handle the error
    throw error;
  }
});

// Use enhanced route wrapper to choose between old and new handlers
router.post("/signup", ...enhanceRoute(
  featureFlags.isEnabled('ENHANCED_ERROR_HANDLING') 
    ? enhancedSignupHandler 
    : originalSignupHandler,
  validationSchemas.userRegistration
));

/**
 * Enhanced Login Route
 */

// Original login handler
function originalLoginHandler(req, res, next) {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
}

// Enhanced login handler
const enhancedLoginHandler = asyncHandler(async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      { session: false },
      function (err, user, info) {
        if (err) {
          return reject(err);
        }
        
        if (!user) {
          const authError = new AuthenticationError(
            info?.message || 'Invalid credentials',
            'login'
          );
          return reject(authError);
        }
        
        const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
        
        // Enhanced response format (if feature enabled)
        if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
          res.json({
            success: true,
            data: {
              token: token,
              type: user.type,
              user: {
                id: user._id,
                email: user.email,
                type: user.type
              }
            },
            correlationId: req.correlationId
          });
        } else {
          // Maintain backward compatibility
          res.json({
            token: token,
            type: user.type,
          });
        }
        
        resolve();
      }
    )(req, res, next);
  });
});

// Use enhanced route wrapper
router.post("/login", ...enhanceRoute(
  featureFlags.isEnabled('ENHANCED_ERROR_HANDLING') 
    ? enhancedLoginHandler 
    : originalLoginHandler,
  validationSchemas.userLogin
));

/**
 * Test endpoint to demonstrate feature flag behavior
 */
router.get("/test-features", (req, res) => {
  res.json({
    message: "Auth routes feature test",
    features: featureFlags.getAll(),
    enhanced: featureFlags.isEnabled('ENHANCED_ERROR_HANDLING'),
    correlationId: req.correlationId || 'not-available'
  });
});

module.exports = router;