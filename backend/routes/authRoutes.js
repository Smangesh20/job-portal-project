const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const AuthOtp = require("../db/AuthOtp");

// Import new middleware infrastructure
const { asyncHandler } = require("../middleware/errorHandler");
const { sanitizeInput, validateRequest } = require("../middleware/validation");
const {
  AuthenticationError,
  ValidationError,
  RateLimitError,
} = require("../utils/errorClasses");
const featureFlags = require("../middleware/featureFlags");

const router = express.Router();

/**
 * Validation schema identifiers
 */
const signupSchema = "POST /auth/signup";
const loginSchema = "POST /auth/login";
const otpRequestSchema = "POST /auth/otp/request";
const otpVerifySchema = "POST /auth/otp/verify";

/**
 * OTP config
 */
const OTP_LENGTH = 6;
const OTP_TTL_MS = parseInt(process.env.OTP_TTL_MS || "300000", 10); // 5 mins
const OTP_MAX_REQUESTS_PER_WINDOW = parseInt(
  process.env.OTP_MAX_REQUESTS_PER_WINDOW || "3",
  10
);
const OTP_RATE_WINDOW_MS = parseInt(
  process.env.OTP_RATE_WINDOW_MS || "300000",
  10
); // 5 mins
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10);
const OTP_AUTO_SIGNUP = process.env.OTP_AUTO_SIGNUP !== "false";
const OTP_EXPOSE_IN_RESPONSE =
  process.env.OTP_EXPOSE_IN_RESPONSE === "true" ||
  process.env.NODE_ENV !== "production";
const OTP_HMAC_SECRET =
  process.env.OTP_HMAC_SECRET || authKeys.jwtSecretKey || "otp-dev-secret";

/**
 * Basic identifier helpers
 */
function isEmailIdentifier(identifier) {
  return typeof identifier === "string" && identifier.includes("@");
}

function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") {
    return null;
  }

  let normalized = phone.replace(/[^\d+]/g, "");
  if (!normalized) {
    return null;
  }

  if (!normalized.startsWith("+")) {
    normalized = `+${normalized}`;
  }

  if (!/^\+\d{7,15}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function normalizeIdentifier(identifier) {
  if (!identifier || typeof identifier !== "string") {
    return null;
  }

  const trimmed = identifier.trim();
  if (!trimmed) {
    return null;
  }

  if (isEmailIdentifier(trimmed)) {
    return {
      channel: "email",
      value: trimmed.toLowerCase(),
    };
  }

  const normalizedPhone = normalizePhone(trimmed);
  if (!normalizedPhone) {
    return null;
  }

  return {
    channel: "phone",
    value: normalizedPhone,
  };
}

function generateOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function hashOtp(identifier, otpCode) {
  return crypto
    .createHmac("sha256", OTP_HMAC_SECRET)
    .update(`${identifier}:${otpCode}`)
    .digest("hex");
}

function safeHashCompare(left, right) {
  if (!left || !right || left.length !== right.length) {
    return false;
  }

  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function deriveDisplayName(rawName, identifier) {
  if (rawName && rawName.trim()) {
    return rawName.trim();
  }

  if (isEmailIdentifier(identifier)) {
    const localPart = identifier.split("@")[0] || "user";
    return localPart.slice(0, 50);
  }

  const phoneTail = identifier.slice(-4);
  return `User-${phoneTail}`;
}

async function findUserByIdentifier(normalized) {
  if (normalized.channel === "email") {
    return User.findOne({ email: normalized.value });
  }
  return User.findOne({ phone: normalized.value });
}

async function ensureUserDetails(user, payload, normalizedIdentifier) {
  const name = deriveDisplayName(payload.name, normalizedIdentifier.value);
  const safeSkills = Array.isArray(payload.skills) ? payload.skills : [];
  const safeEducation = Array.isArray(payload.education) ? payload.education : [];
  const safeResume = typeof payload.resume === "string" ? payload.resume : "";
  const safeProfile = typeof payload.profile === "string" ? payload.profile : "";

  if (user.type === "recruiter") {
    let recruiter = await Recruiter.findOne({ userId: user._id });
    if (!recruiter) {
      recruiter = new Recruiter({
        userId: user._id,
        name,
        contactNumber:
          payload.contactNumber ||
          (normalizedIdentifier.channel === "phone"
            ? normalizedIdentifier.value
            : ""),
        bio: payload.bio || "",
      });
      await recruiter.save();
      return;
    }

    if (payload.name && payload.name.trim()) {
      recruiter.name = payload.name.trim();
    }
    if (typeof payload.contactNumber === "string" && payload.contactNumber.trim()) {
      recruiter.contactNumber = payload.contactNumber.trim();
    }
    if (typeof payload.bio === "string") {
      recruiter.bio = payload.bio;
    }
    await recruiter.save();
    return;
  }

  let applicant = await JobApplicant.findOne({ userId: user._id });
  if (!applicant) {
    applicant = new JobApplicant({
      userId: user._id,
      name,
      education: safeEducation,
      skills: safeSkills,
      rating: -1,
      resume: safeResume,
      profile: safeProfile,
    });
    await applicant.save();
    return;
  }

  if (payload.name && payload.name.trim()) {
    applicant.name = payload.name.trim();
  }
  if (Array.isArray(payload.education)) {
    applicant.education = safeEducation;
  }
  if (Array.isArray(payload.skills)) {
    applicant.skills = safeSkills;
  }
  if (typeof payload.resume === "string") {
    applicant.resume = safeResume;
  }
  if (typeof payload.profile === "string") {
    applicant.profile = safeProfile;
  }
  await applicant.save();
}

async function createUserFromOtp(payload, normalizedIdentifier) {
  const type =
    payload.type === "recruiter" || payload.type === "applicant"
      ? payload.type
      : "applicant";

  const randomPassword = crypto.randomBytes(32).toString("hex");
  const userData = {
    password: randomPassword,
    type,
  };

  if (normalizedIdentifier.channel === "email") {
    userData.email = normalizedIdentifier.value;
  } else {
    userData.phone = normalizedIdentifier.value;
  }

  const user = new User(userData);
  await user.save();
  await ensureUserDetails(user, payload, normalizedIdentifier);
  return user;
}

function buildAuthResponse(req, res, payload) {
  const {
    token,
    user,
    isNewUser = false,
    authMethod = "password",
    otpMeta = null,
  } = payload;

  if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
    return res.json({
      success: true,
      data: {
        token,
        type: user.type,
        user: {
          id: user._id,
          email: user.email || null,
          phone: user.phone || null,
          type: user.type,
          isNewUser,
        },
        authMethod,
        otpMeta,
      },
      correlationId: req.correlationId,
    });
  }

  return res.json({
    token,
    type: user.type,
    isNewUser,
    authMethod,
    otpMeta,
  });
}

/**
 * Simulated OTP delivery.
 * Production integration points:
 * - email provider when channel === "email"
 * - SMS provider when channel === "phone"
 */
async function deliverOtp(normalizedIdentifier, otpCode) {
  // Placeholder delivery for development environments.
  console.info(
    `[AUTH][OTP] ${normalizedIdentifier.channel.toUpperCase()} ${normalizedIdentifier.value} -> ${otpCode}`
  );

  return {
    delivered: true,
  };
}

/**
 * Original signup handler (for backward compatibility)
 */
function legacySignupHandler(req, res) {
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
            .catch((cleanupErr) => {
              res.json({ error: cleanupErr });
            });
          err;
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

/**
 * Enhanced signup handler with new error handling
 */
const enhancedSignupHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  let user = null;

  try {
    user = new User({
      email: data.email,
      password: data.password,
      type: data.type,
    });

    await user.save();
    await ensureUserDetails(user, data, {
      channel: "email",
      value: data.email.toLowerCase(),
    });

    const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
    return buildAuthResponse(req, res, {
      token,
      user,
      isNewUser: false,
      authMethod: "password",
    });
  } catch (error) {
    if (user && user._id) {
      try {
        await User.findByIdAndDelete(user._id);
      } catch (cleanupError) {
        console.error("Failed to cleanup user after error:", cleanupError);
      }
    }
    throw error;
  }
});

/**
 * Original login handler (for backward compatibility)
 */
function legacyLoginHandler(req, res, next) {
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

/**
 * Enhanced login handler with new error handling
 */
const enhancedLoginHandler = asyncHandler(async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", { session: false }, function (err, user, info) {
      if (err) {
        return reject(err);
      }

      if (!user) {
        const authError = new AuthenticationError(
          info?.message || "Invalid credentials",
          "invalid_credentials"
        );
        return reject(authError);
      }

      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      buildAuthResponse(req, res, {
        token,
        user,
        isNewUser: false,
        authMethod: "password",
      });
      resolve();
    })(req, res, next);
  });
});

/**
 * OTP request handler
 */
const requestOtpHandler = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(payload.identifier);

  if (!normalizedIdentifier) {
    throw new ValidationError("Identifier must be a valid email or phone number", [
      {
        field: "identifier",
        message: "Provide a valid email or phone number",
        code: "INVALID_FORMAT",
      },
    ]);
  }

  const windowStart = new Date(Date.now() - OTP_RATE_WINDOW_MS);
  const recentOtpCount = await AuthOtp.countDocuments({
    identifier: normalizedIdentifier.value,
    createdAt: { $gte: windowStart },
  });

  if (recentOtpCount >= OTP_MAX_REQUESTS_PER_WINDOW) {
    throw new RateLimitError(
      "Too many OTP requests. Please wait before requesting again.",
      Math.ceil(OTP_RATE_WINDOW_MS / 1000)
    );
  }

  const otpCode = generateOtpCode();
  const otpHash = hashOtp(normalizedIdentifier.value, otpCode);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  const otpRecord = new AuthOtp({
    identifier: normalizedIdentifier.value,
    channel: normalizedIdentifier.channel,
    otpHash,
    expiresAt,
    intent: payload.intent || "auto",
    maxAttempts: OTP_MAX_ATTEMPTS,
    metadata: {
      requestedType: payload.type || "applicant",
      correlationId: req.correlationId || null,
    },
  });
  await otpRecord.save();

  const delivery = await deliverOtp(normalizedIdentifier, otpCode);
  if (!delivery.delivered) {
    throw new AuthenticationError("Unable to deliver OTP. Try again.", "otp_delivery_failed");
  }

  const responsePayload = {
    message: `OTP sent to your ${normalizedIdentifier.channel}`,
    channel: normalizedIdentifier.channel,
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    identifier: normalizedIdentifier.value,
  };

  if (OTP_EXPOSE_IN_RESPONSE) {
    responsePayload.developmentOtp = otpCode;
  }

  if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
    return res.json({
      success: true,
      data: responsePayload,
      correlationId: req.correlationId,
    });
  }

  return res.json(responsePayload);
});

/**
 * OTP verify handler
 */
const verifyOtpHandler = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(payload.identifier);

  if (!normalizedIdentifier) {
    throw new ValidationError("Identifier must be a valid email or phone number", [
      {
        field: "identifier",
        message: "Provide a valid email or phone number",
        code: "INVALID_FORMAT",
      },
    ]);
  }

  if (!payload.otp) {
    throw new AuthenticationError("OTP is required", "otp_required");
  }

  const otpRecord = await AuthOtp.findOne({
    identifier: normalizedIdentifier.value,
    consumed: false,
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AuthenticationError("OTP expired. Please request a new one.", "otp_expired");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    throw new AuthenticationError("OTP expired. Please request a new one.", "otp_expired");
  }

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    throw new AuthenticationError(
      "Too many invalid OTP attempts. Please request a new OTP.",
      "otp_attempts_exceeded"
    );
  }

  const expectedHash = hashOtp(normalizedIdentifier.value, String(payload.otp));
  const isOtpValid = safeHashCompare(otpRecord.otpHash, expectedHash);

  if (!isOtpValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AuthenticationError("Invalid OTP. Please try again.", "otp_invalid");
  }

  otpRecord.consumed = true;
  otpRecord.consumedAt = new Date();
  await otpRecord.save();

  let user = await findUserByIdentifier(normalizedIdentifier);
  let isNewUser = false;

  const shouldAutoSignup =
    payload.intent === "signup" || payload.intent === "auto" || OTP_AUTO_SIGNUP;

  if (!user && !shouldAutoSignup) {
    throw new AuthenticationError("Account not found for this identifier.", "invalid_credentials");
  }

  if (!user) {
    user = await createUserFromOtp(payload, normalizedIdentifier);
    isNewUser = true;
  } else {
    // Enrich existing accounts when new identifier is verified.
    if (normalizedIdentifier.channel === "phone" && !user.phone) {
      user.phone = normalizedIdentifier.value;
      await user.save();
    }
    if (normalizedIdentifier.channel === "email" && !user.email) {
      user.email = normalizedIdentifier.value;
      await user.save();
    }
    await ensureUserDetails(user, payload, normalizedIdentifier);
  }

  const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
  return buildAuthResponse(req, res, {
    token,
    user,
    isNewUser,
    authMethod: "otp",
    otpMeta: {
      channel: normalizedIdentifier.channel,
      identifier: normalizedIdentifier.value,
    },
  });
});

/**
 * Route handler selector based on feature flags
 */
function selectHandler(enhancedHandler, legacyHandler) {
  return (req, res, next) => {
    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return enhancedHandler(req, res, next);
    }
    return legacyHandler(req, res, next);
  };
}

/**
 * Signup route with integrated middleware stack
 */
router.post(
  "/signup",
  sanitizeInput(),
  validateRequest(signupSchema),
  selectHandler(enhancedSignupHandler, legacySignupHandler)
);

/**
 * Login route with integrated middleware stack
 */
router.post(
  "/login",
  sanitizeInput(),
  validateRequest(loginSchema),
  selectHandler(enhancedLoginHandler, legacyLoginHandler)
);

/**
 * OTP request route for passwordless auth.
 */
router.post(
  "/otp/request",
  sanitizeInput(),
  validateRequest(otpRequestSchema),
  requestOtpHandler
);

/**
 * OTP verify route for passwordless auth.
 */
router.post(
  "/otp/verify",
  sanitizeInput(),
  validateRequest(otpVerifySchema),
  verifyOtpHandler
);

module.exports = router;
