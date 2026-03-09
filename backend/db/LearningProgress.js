const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    processSlug: {
      type: String,
      required: true,
      index: true,
    },
    erpSlug: {
      type: String,
      required: true,
      index: true,
    },
    stepNumber: {
      type: Number,
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    bestScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastAnswer: {
      type: String,
      default: "",
    },
    lastCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collation: { locale: "en" },
  }
);

schema.index(
  { userId: 1, processSlug: 1, erpSlug: 1, stepNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("LearningProgress", schema);
