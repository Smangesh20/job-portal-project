import { Alert } from "@material-ui/lab";
import { Typography } from "@material-ui/core";

const prettifyField = (field) => {
  if (!field || field === "general") {
    return "General";
  }

  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\./g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
};

const FormErrorSummary = ({
  errors = {},
  title = "Please fix the highlighted fields.",
  maxItems = 5,
  style = {},
}) => {
  const entries = Object.entries(errors).filter(([, message]) => Boolean(message));

  if (entries.length === 0) {
    return null;
  }

  const visibleEntries = entries.slice(0, maxItems);
  const remainingCount = entries.length - visibleEntries.length;

  return (
    <Alert severity="error" style={{ width: "100%", ...style }}>
      <Typography variant="body2" style={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {visibleEntries.map(([field, message]) => (
        <Typography key={`${field}-${message}`} variant="body2">
          {prettifyField(field)}: {message}
        </Typography>
      ))}
      {remainingCount > 0 && (
        <Typography variant="body2">+{remainingCount} more errors</Typography>
      )}
    </Alert>
  );
};

export default FormErrorSummary;
