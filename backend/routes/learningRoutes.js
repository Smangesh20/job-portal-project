const express = require("express");
const Joi = require("joi");
const jwtAuth = require("../lib/jwtAuth");
const LearningProgress = require("../db/LearningProgress");
const {
  ValidationError,
  NotFoundError,
} = require("../utils/errorClasses");
const { asyncHandler } = require("../middleware/errorHandler");
const { sanitizeInput } = require("../middleware/validation");
const featureFlags = require("../middleware/featureFlags");
const {
  getCatalog,
  listSteps,
  getStep,
  getSummaryStats,
} = require("../utils/learningContentService");

const router = express.Router();

const answerSchema = Joi.object({
  processSlug: Joi.string().trim().required(),
  erpSlug: Joi.string().trim().required(),
  stepNumber: Joi.number().integer().min(1).required(),
  answer: Joi.string().allow("").optional(),
  selectedOptionIndex: Joi.number().integer().min(0).optional(),
});

const progressSchema = Joi.object({
  processSlug: Joi.string().trim().required(),
  erpSlug: Joi.string().trim().required(),
  stepNumber: Joi.number().integer().min(1).required(),
  score: Joi.number().min(0).max(100).required(),
  isCompleted: Joi.boolean().required(),
  answer: Joi.string().allow("").optional(),
});

const followupSchema = Joi.object({
  processSlug: Joi.string().trim().required(),
  erpSlug: Joi.string().trim().required(),
  stepNumber: Joi.number().integer().min(1).required(),
  intent: Joi.string()
    .valid(
      "Explain simpler",
      "Give real example",
      "Common mistakes",
      "Interview perspective",
      "Ethics and Responsible AI",
      "Creative memory trick"
    )
    .required(),
});

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function buildFollowupResponse(intent, stepPayload) {
  const stepText = stepPayload.stepText || `Step ${stepPayload.stepNumber}`;
  const processLabel = stepPayload.processLabel || stepPayload.processSlug;
  const erpLabel = stepPayload.erpLabel || stepPayload.erpSlug;

  if (intent === "Explain simpler") {
    return (
      `Step ${stepPayload.stepNumber} in simple words: ${stepText}. ` +
      `You are capturing correct business data so ${processLabel} in ${erpLabel} stays reliable for the next team.`
    );
  }

  if (intent === "Give real example") {
    return (
      `Real example: while doing "${stepText}", validate quantity, amount, dates, and approvals, ` +
      "then link this document to the previous one to avoid downstream mismatch."
    );
  }

  if (intent === "Common mistakes") {
    return (
      "Common mistakes: missing mandatory fields, invalid dates, skipped approvals, and broken document linkage. " +
      "Use a quick checklist before posting."
    );
  }

  if (intent === "Interview perspective") {
    return (
      `Interview answer frame: explain why Step ${stepPayload.stepNumber} exists, which ERP transaction is used, ` +
      "what controls are validated, and one business risk if this step fails."
    );
  }

  if (intent === "Ethics and Responsible AI") {
    return (
      "Responsible AI checklist: fairness in recommendations, transparency of reasons, privacy-first data usage, " +
      "auditability, and mandatory human review for exceptions."
    );
  }

  if (intent === "Creative memory trick") {
    return (
      "Memory trick: Validate, Link, Explain, Protect. " +
      "Validate data, link documents, explain decisions, protect users and business trust."
    );
  }

  return "Let us review the step controls once again and then continue.";
}

function evaluateAnswer(stepPayload, body) {
  const question = stepPayload.question || {};

  if (
    Array.isArray(question.options) &&
    Number.isInteger(question.correct_option_index)
  ) {
    const selectedOptionIndex = Number.isInteger(body.selectedOptionIndex)
      ? body.selectedOptionIndex
      : -1;
    const isCorrect = selectedOptionIndex === question.correct_option_index;

    return {
      mode: "mcq",
      isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? question.explain_correct ||
          "Correct. You selected the best process control option."
        : "Not quite right. Recheck the step context and try again.",
      correctOptionIndex: question.correct_option_index,
      correctOption:
        question.correct_option ||
        question.options[question.correct_option_index] ||
        "",
      selectedOptionIndex,
      expectedKeywords: question.expected_keywords || [],
    };
  }

  const expectedKeywords = Array.isArray(question.expected_keywords)
    ? question.expected_keywords
    : Array.isArray(stepPayload.script?.expected_keywords)
      ? stepPayload.script.expected_keywords
      : [];

  const answer = normalizeText(body.answer || "");
  const matchedKeywords = expectedKeywords.filter((keyword) =>
    answer.includes(normalizeText(keyword))
  );
  const totalKeywords = expectedKeywords.length || 1;
  const score = Math.min(
    100,
    Math.round((matchedKeywords.length / totalKeywords) * 100)
  );
  const isCorrect = score >= 60;

  return {
    mode: "text",
    isCorrect,
    score,
    feedback: isCorrect
      ? "Good understanding. Your response covers key control terms."
      : "Add more ERP control keywords and business context to improve the answer.",
    correctOptionIndex: null,
    correctOption: "",
    selectedOptionIndex: null,
    expectedKeywords,
    matchedKeywords,
  };
}

/**
 * Catalog endpoint
 */
router.get(
  "/catalog",
  asyncHandler(async (req, res) => {
    const catalog = getCatalog();
    const summary = getSummaryStats(catalog);

    const payload = {
      summary,
      processes: catalog.processes,
    };

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: payload,
        correlationId: req.correlationId,
      });
    }

    return res.json(payload);
  })
);

/**
 * Steps list for a selected process + ERP
 */
router.get(
  "/steps",
  asyncHandler(async (req, res) => {
    const processSlug = String(req.query.processSlug || req.query.process || "").trim();
    const erpSlug = String(req.query.erpSlug || req.query.erp || "").trim();

    if (!processSlug || !erpSlug) {
      throw new ValidationError("processSlug and erpSlug are required", [
        {
          field: "processSlug",
          message: "Provide processSlug and erpSlug",
          code: "REQUIRED_FIELD",
        },
      ]);
    }

    const steps = listSteps(processSlug, erpSlug);

    if (!steps.length) {
      throw new NotFoundError("No learning steps found for this ERP process.");
    }

    const payload = {
      processSlug,
      erpSlug,
      steps,
      total: steps.length,
    };

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: payload,
        correlationId: req.correlationId,
      });
    }

    return res.json(payload);
  })
);

/**
 * Step details endpoint
 */
router.get(
  "/step/:processSlug/:erpSlug/:stepNumber",
  asyncHandler(async (req, res) => {
    const { processSlug, erpSlug, stepNumber } = req.params;
    const stepPayload = getStep(processSlug, erpSlug, stepNumber);

    if (!stepPayload) {
      throw new NotFoundError("Requested learning step does not exist.");
    }

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: stepPayload,
        correlationId: req.correlationId,
      });
    }

    return res.json(stepPayload);
  })
);

/**
 * Evaluate answer endpoint
 */
router.post(
  "/check-answer",
  sanitizeInput(),
  asyncHandler(async (req, res) => {
    const { error, value } = answerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ValidationError("Invalid answer payload", [
        {
          field: "payload",
          message: error.message,
          code: "VALIDATION_ERROR",
        },
      ]);
    }

    const stepPayload = getStep(
      value.processSlug,
      value.erpSlug,
      value.stepNumber
    );
    if (!stepPayload) {
      throw new NotFoundError("Requested learning step does not exist.");
    }

    const evaluation = evaluateAnswer(stepPayload, value);
    const payload = {
      ...evaluation,
      processSlug: value.processSlug,
      erpSlug: value.erpSlug,
      stepNumber: value.stepNumber,
    };

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: payload,
        correlationId: req.correlationId,
      });
    }

    return res.json(payload);
  })
);

/**
 * Save progress endpoint (authenticated)
 */
router.post(
  "/progress",
  jwtAuth,
  sanitizeInput(),
  asyncHandler(async (req, res) => {
    const { error, value } = progressSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ValidationError("Invalid progress payload", [
        {
          field: "payload",
          message: error.message,
          code: "VALIDATION_ERROR",
        },
      ]);
    }

    const stepPayload = getStep(
      value.processSlug,
      value.erpSlug,
      value.stepNumber
    );
    if (!stepPayload) {
      throw new NotFoundError("Requested learning step does not exist.");
    }

    const existing = await LearningProgress.findOne({
      userId: req.user._id,
      processSlug: value.processSlug,
      erpSlug: value.erpSlug,
      stepNumber: value.stepNumber,
    });

    const nextAttempts = (existing?.attempts || 0) + 1;
    const nextBestScore = Math.max(existing?.bestScore || 0, value.score);

    const updated = await LearningProgress.findOneAndUpdate(
      {
        userId: req.user._id,
        processSlug: value.processSlug,
        erpSlug: value.erpSlug,
        stepNumber: value.stepNumber,
      },
      {
        $set: {
          score: value.score,
          bestScore: nextBestScore,
          isCompleted: value.isCompleted,
          lastAnswer: value.answer || "",
          lastCompletedAt: value.isCompleted ? new Date() : existing?.lastCompletedAt || null,
        },
        $setOnInsert: {
          userId: req.user._id,
          processSlug: value.processSlug,
          erpSlug: value.erpSlug,
          stepNumber: value.stepNumber,
        },
        $inc: {
          attempts: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    const payload = {
      progress: updated,
      attempts: nextAttempts,
    };

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: payload,
        correlationId: req.correlationId,
      });
    }

    return res.json(payload);
  })
);

/**
 * Fetch authenticated user learning progress
 */
router.get(
  "/progress",
  jwtAuth,
  asyncHandler(async (req, res) => {
    const processSlug = req.query.processSlug || req.query.process
      ? String(req.query.processSlug || req.query.process).trim()
      : null;
    const erpSlug = req.query.erpSlug || req.query.erp
      ? String(req.query.erpSlug || req.query.erp).trim()
      : null;

    const findQuery = {
      userId: req.user._id,
    };
    if (processSlug) {
      findQuery.processSlug = processSlug;
    }
    if (erpSlug) {
      findQuery.erpSlug = erpSlug;
    }

    const records = await LearningProgress.find(findQuery).sort({
      updatedAt: -1,
    });

    const summary = {
      totalStepsAttempted: records.length,
      totalCompleted: records.filter((item) => item.isCompleted).length,
      avgBestScore: records.length
        ? Math.round(
            records.reduce((acc, item) => acc + (item.bestScore || 0), 0) /
              records.length
          )
        : 0,
    };

    const payload = {
      summary,
      records,
    };

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: payload,
        correlationId: req.correlationId,
      });
    }

    return res.json(payload);
  })
);

/**
 * Voice follow-up coaching response endpoint
 */
router.post(
  "/followup",
  sanitizeInput(),
  asyncHandler(async (req, res) => {
    const { error, value } = followupSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ValidationError("Invalid followup payload", [
        {
          field: "payload",
          message: error.message,
          code: "VALIDATION_ERROR",
        },
      ]);
    }

    const stepPayload = getStep(
      value.processSlug,
      value.erpSlug,
      value.stepNumber
    );
    if (!stepPayload) {
      throw new NotFoundError("Requested learning step does not exist.");
    }

    const responseText = buildFollowupResponse(value.intent, stepPayload);
    const payload = {
      processSlug: value.processSlug,
      erpSlug: value.erpSlug,
      stepNumber: value.stepNumber,
      intent: value.intent,
      responseText,
    };

    if (featureFlags.isEnabled("ENHANCED_ERROR_HANDLING")) {
      return res.json({
        success: true,
        data: payload,
        correlationId: req.correlationId,
      });
    }

    return res.json(payload);
  })
);

module.exports = router;
