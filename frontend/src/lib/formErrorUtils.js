/**
 * Shared helpers for field-level form error handling.
 */

export const createFieldErrorState = (fields = []) => {
  return fields.reduce((acc, field) => {
    acc[field] = "";
    return acc;
  }, {});
};

export const hasFieldErrors = (errors = {}) => {
  return Object.values(errors).some((message) => Boolean(message));
};

export const getFieldError = (errors = {}, field) => {
  return errors[field] || "";
};

export const getFieldErrorProps = (errors = {}, field) => {
  const helperText = getFieldError(errors, field);
  return {
    error: Boolean(helperText),
    helperText,
  };
};

const normalizeFieldKey = (field = "") => {
  if (typeof field !== "string") {
    return "general";
  }

  // Convert indexed paths (education.0.startYear, education[0].startYear) to base keys.
  const normalized = field
    .replace(/\[\d+\]/g, "")
    .replace(/\.\d+(\.|$)/g, ".");

  return normalized.endsWith(".") ? normalized.slice(0, -1) : normalized;
};

export const mapApiFieldErrors = (
  details = [],
  {
    allowedFields = [],
    aliases = {},
  } = {}
) => {
  if (!Array.isArray(details)) {
    return {};
  }

  const allowed = new Set(allowedFields);
  const mapped = {};

  details.forEach((detail) => {
    if (!detail || typeof detail !== "object") {
      return;
    }

    const rawField = normalizeFieldKey(detail.field || "general");
    const baseField = aliases[rawField] || aliases[detail.field] || rawField;

    if (allowed.size > 0 && !allowed.has(baseField)) {
      return;
    }

    if (mapped[baseField]) {
      return;
    }

    mapped[baseField] =
      (typeof detail.message === "string" && detail.message) ||
      "Invalid value";
  });

  return mapped;
};

export const mergeFieldErrors = (baseErrors = {}, incomingErrors = {}) => {
  return {
    ...baseErrors,
    ...incomingErrors,
  };
};
