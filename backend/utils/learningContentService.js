const fs = require("fs");
const path = require("path");

const LEARNING_ROOT = path.resolve(
  __dirname,
  "../../learning/erp-responsible-ai"
);
const CONTENT_VARIANTS = [
  {
    key: "primary",
    scriptsRoot: path.join(LEARNING_ROOT, "scripts"),
    questionsRoot: path.join(LEARNING_ROOT, "Question"),
  },
  {
    key: "learning_content",
    scriptsRoot: path.join(LEARNING_ROOT, "learning_content", "scripts"),
    questionsRoot: path.join(LEARNING_ROOT, "learning_content", "Question"),
  },
];

let cachedCatalog = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 1000;

function titleCaseFromSlug(slug) {
  return String(slug || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseStepNumber(fileName) {
  const match = String(fileName).match(/step_(\d+)\.json$/i);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

function safeReadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function listJsonFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name);
}

function listDirectories(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function collectProcessSlugs() {
  const processSlugs = new Set();
  CONTENT_VARIANTS.forEach((variant) => {
    listDirectories(variant.scriptsRoot).forEach((slug) => processSlugs.add(slug));
    listDirectories(variant.questionsRoot).forEach((slug) =>
      processSlugs.add(slug)
    );
  });
  return Array.from(processSlugs).sort((a, b) => a.localeCompare(b));
}

function collectErpSlugs(processSlug) {
  const erpSlugs = new Set();
  CONTENT_VARIANTS.forEach((variant) => {
    listDirectories(path.join(variant.scriptsRoot, processSlug)).forEach((slug) =>
      erpSlugs.add(slug)
    );
    listDirectories(path.join(variant.questionsRoot, processSlug)).forEach((slug) =>
      erpSlugs.add(slug)
    );
  });
  return Array.from(erpSlugs).sort((a, b) => a.localeCompare(b));
}

function collectStepMetadata(processSlug, erpSlug) {
  const merged = new Map();

  CONTENT_VARIANTS.forEach((variant) => {
    const scriptDir = path.join(variant.scriptsRoot, processSlug, erpSlug);
    listJsonFiles(scriptDir).forEach((fileName) => {
      const stepNumber = parseStepNumber(fileName);
      if (!Number.isInteger(stepNumber)) {
        return;
      }

      const current = merged.get(stepNumber) || {
        stepNumber,
        hasScript: false,
        hasQuestion: false,
      };
      current.hasScript = true;
      merged.set(stepNumber, current);
    });

    const questionDir = path.join(variant.questionsRoot, processSlug, erpSlug);
    listJsonFiles(questionDir).forEach((fileName) => {
      const stepNumber = parseStepNumber(fileName);
      if (!Number.isInteger(stepNumber)) {
        return;
      }

      const current = merged.get(stepNumber) || {
        stepNumber,
        hasScript: false,
        hasQuestion: false,
      };
      current.hasQuestion = true;
      merged.set(stepNumber, current);
    });
  });

  return Array.from(merged.values()).sort((a, b) => a.stepNumber - b.stepNumber);
}

function findStepFile(processSlug, erpSlug, stepNumber, fileType) {
  const rootKey = fileType === "question" ? "questionsRoot" : "scriptsRoot";
  for (const variant of CONTENT_VARIANTS) {
    const directoryPath = path.join(variant[rootKey], processSlug, erpSlug);
    const matchingFile = listJsonFiles(directoryPath).find(
      (fileName) => parseStepNumber(fileName) === stepNumber
    );

    if (matchingFile) {
      return path.join(directoryPath, matchingFile);
    }
  }
  return null;
}

function buildCatalog() {
  const catalog = {
    root: LEARNING_ROOT,
    variants: CONTENT_VARIANTS.map((variant) => ({
      key: variant.key,
      scriptsRoot: variant.scriptsRoot,
      questionsRoot: variant.questionsRoot,
    })),
    processes: [],
  };

  const processSlugs = collectProcessSlugs();
  if (!processSlugs.length) {
    return catalog;
  }

  processSlugs.forEach((processSlug) => {
    const erpSlugs = collectErpSlugs(processSlug);
    const processRecord = {
      slug: processSlug,
      label: titleCaseFromSlug(processSlug),
      erps: [],
      totalSteps: 0,
    };

    erpSlugs.forEach((erpSlug) => {
      const stepMetadata = collectStepMetadata(processSlug, erpSlug);
      const steps = stepMetadata.map((item) => ({
        stepNumber: item.stepNumber,
        hasScript: item.hasScript,
        hasQuestion: item.hasQuestion,
      }));

      processRecord.totalSteps += stepMetadata.length;
      processRecord.erps.push({
        slug: erpSlug,
        label: titleCaseFromSlug(erpSlug),
        stepCount: stepMetadata.length,
        steps,
      });
    });

    catalog.processes.push(processRecord);
  });

  return catalog;
}

function getCatalog({ forceRefresh = false } = {}) {
  const now = Date.now();
  if (!forceRefresh && cachedCatalog && now - cachedAt < CACHE_TTL_MS) {
    return cachedCatalog;
  }

  cachedCatalog = buildCatalog();
  cachedAt = now;
  return cachedCatalog;
}

function getStep(processSlug, erpSlug, stepNumber) {
  const normalizedStep = Number.parseInt(stepNumber, 10);
  if (!Number.isInteger(normalizedStep) || normalizedStep < 1) {
    return null;
  }

  const scriptPath = findStepFile(processSlug, erpSlug, normalizedStep, "script");
  const questionPath = findStepFile(
    processSlug,
    erpSlug,
    normalizedStep,
    "question"
  );
  const scriptData = safeReadJson(scriptPath);
  const questionData = safeReadJson(questionPath);

  if (!scriptData && !questionData) {
    return null;
  }

  const stepText =
    scriptData?.step_text ||
    questionData?.step_text ||
    `Step ${normalizedStep}`;

  return {
    processSlug,
    processLabel: titleCaseFromSlug(processSlug),
    erpSlug,
    erpLabel: titleCaseFromSlug(erpSlug),
    stepNumber: normalizedStep,
    fileName: scriptPath ? path.basename(scriptPath) : path.basename(questionPath),
    stepText,
    script: scriptData || {},
    question: questionData || {},
    isMcq:
      Array.isArray(questionData?.options) &&
      Number.isInteger(questionData?.correct_option_index),
    scriptSource: scriptPath || null,
    questionSource: questionPath || null,
  };
}

function listSteps(processSlug, erpSlug) {
  return collectStepMetadata(processSlug, erpSlug).map((item) => {
    const fullStep = getStep(processSlug, erpSlug, item.stepNumber);
    return {
      stepNumber: item.stepNumber,
      stepText: fullStep?.stepText || `Step ${item.stepNumber}`,
      hasScript: item.hasScript,
      hasQuestion: item.hasQuestion,
    };
  });
}

function getSummaryStats(catalog) {
  const processCount = catalog.processes.length;
  const erpCount = catalog.processes.reduce(
    (acc, processItem) => acc + processItem.erps.length,
    0
  );
  const stepCount = catalog.processes.reduce(
    (acc, processItem) => acc + processItem.totalSteps,
    0
  );

  return {
    processCount,
    erpCount,
    stepCount,
  };
}

module.exports = {
  LEARNING_ROOT,
  CONTENT_VARIANTS,
  titleCaseFromSlug,
  getCatalog,
  listSteps,
  getStep,
  getSummaryStats,
};
