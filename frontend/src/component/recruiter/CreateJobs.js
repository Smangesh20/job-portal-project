import { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";

import api from "../../lib/apiClient";
import apiList from "../../lib/apiList";
import { useNotification } from "../../lib/NotificationContext";
import FormErrorSummary from "../../lib/FormErrorSummary";
import {
  createFieldErrorState,
  getFieldErrorProps,
  hasFieldErrors,
  mapApiFieldErrors,
  mergeFieldErrors,
} from "../../lib/formErrorUtils";

const useStyles = makeStyles(() => ({
  body: {
    height: "inherit",
  },
  inputBox: {
    width: "100%",
  },
}));

const JOB_FIELDS = [
  "title",
  "skillsets",
  "jobType",
  "duration",
  "salary",
  "deadline",
  "maxApplicants",
  "maxPositions",
];
const EMPTY_JOB_ERRORS = createFieldErrorState(JOB_FIELDS);

const getInitialJobDetails = () => ({
  title: "",
  maxApplicants: 100,
  maxPositions: 30,
  deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substr(0, 16),
  skillsets: [],
  jobType: "Full Time",
  duration: 0,
  salary: 0,
});

const validateJobDetails = (jobDetails) => {
  const nextErrors = { ...EMPTY_JOB_ERRORS };

  if (!jobDetails.title.trim()) {
    nextErrors.title = "Job title is required";
  }

  if (!Array.isArray(jobDetails.skillsets) || jobDetails.skillsets.length === 0) {
    nextErrors.skillsets = "At least one skill is required";
  }

  if (!jobDetails.deadline) {
    nextErrors.deadline = "Application deadline is required";
  } else if (new Date(jobDetails.deadline) <= new Date()) {
    nextErrors.deadline = "Deadline must be in the future";
  }

  if (Number(jobDetails.salary) < 0) {
    nextErrors.salary = "Salary cannot be negative";
  }

  if (Number(jobDetails.maxApplicants) < 1) {
    nextErrors.maxApplicants = "Maximum applicants must be at least 1";
  }

  if (Number(jobDetails.maxPositions) < 1) {
    nextErrors.maxPositions = "Positions available must be at least 1";
  }

  if (Number(jobDetails.maxPositions) > Number(jobDetails.maxApplicants)) {
    nextErrors.maxPositions = "Positions cannot exceed maximum applicants";
  }

  return nextErrors;
};

const CreateJobs = () => {
  const classes = useStyles();
  const { showError, showSuccess, showWarning } = useNotification();

  const [jobDetails, setJobDetails] = useState(getInitialJobDetails());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_JOB_ERRORS);

  const handleInput = (key, value) => {
    setJobDetails((prev) => ({
      ...prev,
      [key]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleUpdate = async () => {
    const nextErrors = validateJobDetails(jobDetails);
    setFieldErrors(nextErrors);

    if (hasFieldErrors(nextErrors)) {
      showWarning("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(apiList.jobs, jobDetails);
      showSuccess(response.data.message || "Job created successfully");
      setJobDetails(getInitialJobDetails());
      setFieldErrors(EMPTY_JOB_ERRORS);
    } catch (error) {
      if (error.code === "VALIDATION_ERROR" && Array.isArray(error.details)) {
        const apiErrors = mapApiFieldErrors(error.details, {
          allowedFields: JOB_FIELDS,
          aliases: {
            skillsets: "skillsets",
          },
        });
        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(mergeFieldErrors(EMPTY_JOB_ERRORS, apiErrors));
        }
      }
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh", width: "" }}
    >
      <Grid item>
        <Typography variant="h2">Add Job</Typography>
      </Grid>
      <Grid item container xs direction="column" justify="center">
        <Grid item>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <FormErrorSummary errors={fieldErrors} />
              </Grid>
              <Grid item>
                <TextField
                  label="Title"
                  value={jobDetails.title}
                  onChange={(event) => handleInput("title", event.target.value)}
                  variant="outlined"
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "title")}
                />
              </Grid>
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText={
                    fieldErrors.skillsets || "Press enter to add required skills"
                  }
                  value={jobDetails.skillsets}
                  onAdd={(chip) =>
                    handleInput("skillsets", [...jobDetails.skillsets, chip])
                  }
                  onDelete={(chip, index) => {
                    const updated = [...jobDetails.skillsets];
                    updated.splice(index, 1);
                    handleInput("skillsets", updated);
                  }}
                  fullWidth
                  error={Boolean(fieldErrors.skillsets)}
                />
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Job Type"
                  variant="outlined"
                  value={jobDetails.jobType}
                  onChange={(event) => {
                    handleInput("jobType", event.target.value);
                  }}
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "jobType")}
                >
                  <MenuItem value="Full Time">Full Time</MenuItem>
                  <MenuItem value="Part Time">Part Time</MenuItem>
                  <MenuItem value="Work From Home">Work From Home</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Duration"
                  variant="outlined"
                  value={jobDetails.duration}
                  onChange={(event) => {
                    handleInput("duration", event.target.value);
                  }}
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "duration")}
                >
                  <MenuItem value={0}>Flexible</MenuItem>
                  <MenuItem value={1}>1 Month</MenuItem>
                  <MenuItem value={2}>2 Months</MenuItem>
                  <MenuItem value={3}>3 Months</MenuItem>
                  <MenuItem value={4}>4 Months</MenuItem>
                  <MenuItem value={5}>5 Months</MenuItem>
                  <MenuItem value={6}>6 Months</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  label="Salary"
                  type="number"
                  variant="outlined"
                  value={jobDetails.salary}
                  onChange={(event) => {
                    handleInput("salary", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "salary")}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Application Deadline"
                  type="datetime-local"
                  value={jobDetails.deadline}
                  onChange={(event) => {
                    handleInput("deadline", event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "deadline")}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Maximum Number Of Applicants"
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxApplicants}
                  onChange={(event) => {
                    handleInput("maxApplicants", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "maxApplicants")}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Positions Available"
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxPositions}
                  onChange={(event) => {
                    handleInput("maxPositions", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                  {...getFieldErrorProps(fieldErrors, "maxPositions")}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;
