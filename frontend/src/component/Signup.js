import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import FileUploadInput from "../lib/FileUploadInput";
import FormErrorSummary from "../lib/FormErrorSummary";
import AuthOtpPanel from "../lib/AuthOtpPanel";
import api from "../lib/apiClient";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import { useNotification } from "../lib/NotificationContext";
import {
  createFieldErrorState,
  getFieldErrorProps,
  hasFieldErrors,
  mapApiFieldErrors,
  mergeFieldErrors,
} from "../lib/formErrorUtils";

const useStyles = makeStyles(() => ({
  body: {
    padding: "40px 60px",
  },
  inputBox: {
    width: "400px",
  },
  submitButton: {
    width: "400px",
  },
  modeButton: {
    width: "195px",
  },
}));

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const SIGNUP_FIELDS = [
  "name",
  "email",
  "password",
  "contactNumber",
  "education",
  "general",
];
const EMPTY_SIGNUP_ERRORS = createFieldErrorState(SIGNUP_FIELDS);

const MultifieldInput = ({ education, setEducation }) => {
  const classes = useStyles();

  return (
    <>
      {education.map((obj, key) => (
        <Grid
          item
          container
          className={classes.inputBox}
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Grid item xs={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const validateSignupField = (field, value, userType) => {
  if (field === "name") {
    if (!value.trim()) {
      return "Name is required";
    }
    return "";
  }

  if (field === "email") {
    if (!value.trim()) {
      return "Email is required";
    }
    if (!EMAIL_REGEX.test(value.toLowerCase())) {
      return "Please enter a valid email";
    }
    return "";
  }

  if (field === "password") {
    if (!value) {
      return "Password is required";
    }
    if (!PASSWORD_REGEX.test(value)) {
      return "Password must include upper, lower, number and be at least 8 characters";
    }
    return "";
  }

  if (field === "contactNumber" && userType === "recruiter") {
    if (!value) {
      return "Contact number is required for recruiters";
    }
    if (!/^\+\d{7,15}$/.test(value)) {
      return "Please provide a valid contact number";
    }
    return "";
  }

  return "";
};

const normalizeEducation = (education) => {
  return education
    .map((item) => ({
      institutionName: item.institutionName ? item.institutionName.trim() : "",
      startYear: item.startYear,
      endYear: item.endYear,
    }))
    .filter((item) => item.institutionName !== "")
    .map((item) => {
      const normalized = { ...item };
      if (normalized.endYear === "") {
        delete normalized.endYear;
      }
      return normalized;
    });
};

const Signup = () => {
  const classes = useStyles();
  const { showError, showSuccess, showWarning } = useNotification();

  const [loggedin, setLoggedin] = useState(isAuth());
  const [signupMode, setSignupMode] = useState("quickOtp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_SIGNUP_ERRORS);

  const handleInput = (key, value) => {
    setSignupDetails((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (["name", "email", "password"].includes(key)) {
      setFieldErrors((prev) => ({
        ...prev,
        [key]: validateSignupField(key, value, signupDetails.type),
      }));
    }
  };

  const handleBlur = (field) => {
    const value = signupDetails[field] || "";
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateSignupField(field, value, signupDetails.type),
    }));
  };

  const buildSubmissionPayload = () => {
    const updatedEducation = normalizeEducation(education);

    if (signupDetails.type === "recruiter") {
      return {
        ...signupDetails,
        contactNumber: phone ? `+${phone}` : "",
      };
    }

    return {
      ...signupDetails,
      education: updatedEducation,
      contactNumber: "",
    };
  };

  const validateSubmission = (payload) => {
    const nextErrors = { ...EMPTY_SIGNUP_ERRORS };

    nextErrors.name = validateSignupField("name", payload.name, payload.type);
    nextErrors.email = validateSignupField("email", payload.email, payload.type);
    nextErrors.password = validateSignupField(
      "password",
      payload.password,
      payload.type
    );
    nextErrors.contactNumber = validateSignupField(
      "contactNumber",
      payload.contactNumber,
      payload.type
    );

    if (payload.type === "applicant") {
      const hasInvalidEducation = (payload.education || []).some(
        (item) => !item.startYear
      );
      if (hasInvalidEducation) {
        nextErrors.education = "Each education entry requires a start year";
      }
    }

    return nextErrors;
  };

  const submitSignup = async () => {
    const payload = buildSubmissionPayload();
    const nextErrors = validateSubmission(payload);
    setFieldErrors(nextErrors);

    if (hasFieldErrors(nextErrors)) {
      showWarning("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(apiList.signup, payload);
      const authData = response.data?.data || response.data;
      localStorage.setItem("token", authData.token);
      localStorage.setItem("type", authData.type);
      setLoggedin(isAuth());
      showSuccess("Signed up successfully");
    } catch (error) {
      if (error.code === "VALIDATION_ERROR" && Array.isArray(error.details)) {
        const apiErrors = mapApiFieldErrors(error.details, {
          allowedFields: SIGNUP_FIELDS,
          aliases: {
            "education.institutionName": "education",
            "education.startYear": "education",
            "education.endYear": "education",
          },
        });
        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(mergeFieldErrors(EMPTY_SIGNUP_ERRORS, apiErrors));
        }
      }
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Paper elevation={3} className={classes.body}>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2">
            Sign Up
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Recommended: quick OTP onboarding. Advanced profile setup is also available.
          </Typography>
        </Grid>

        <Grid item container spacing={1} justify="center">
          <Grid item>
            <Button
              variant={signupMode === "quickOtp" ? "contained" : "outlined"}
              color="primary"
              className={classes.modeButton}
              onClick={() => setSignupMode("quickOtp")}
            >
              Quick OTP Signup
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={signupMode === "fullProfile" ? "contained" : "outlined"}
              color="primary"
              className={classes.modeButton}
              onClick={() => setSignupMode("fullProfile")}
            >
              Full Profile Signup
            </Button>
          </Grid>
        </Grid>

        <Grid item style={{ width: "100%" }}>
          <Divider />
        </Grid>

        {signupMode === "quickOtp" ? (
          <Grid item className={classes.inputBox}>
            <AuthOtpPanel
              mode="signup"
              onAuthenticated={() => {
                setLoggedin(isAuth());
              }}
            />
          </Grid>
        ) : (
          <>
            <Grid item className={classes.inputBox}>
              <FormErrorSummary errors={fieldErrors} />
            </Grid>
            <Grid item>
              <TextField
                select
                label="Category"
                variant="outlined"
                className={classes.inputBox}
                value={signupDetails.type}
                onChange={(event) => {
                  const nextType = event.target.value;
                  setSignupDetails((prev) => ({ ...prev, type: nextType }));
                  setFieldErrors((prev) => ({
                    ...prev,
                    contactNumber: validateSignupField(
                      "contactNumber",
                      phone ? `+${phone}` : "",
                      nextType
                    ),
                  }));
                }}
              >
                <MenuItem value="applicant">Applicant</MenuItem>
                <MenuItem value="recruiter">Recruiter</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                label="Name"
                value={signupDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                className={classes.inputBox}
                onBlur={() => handleBlur("name")}
                variant="outlined"
                {...getFieldErrorProps(fieldErrors, "name")}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                value={signupDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                className={classes.inputBox}
                onBlur={() => handleBlur("email")}
                variant="outlined"
                {...getFieldErrorProps(fieldErrors, "email")}
              />
            </Grid>
            <Grid item>
              <PasswordInput
                label="Password"
                value={signupDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
                className={classes.inputBox}
                onBlur={() => handleBlur("password")}
                {...getFieldErrorProps(fieldErrors, "password")}
              />
            </Grid>
            {signupDetails.type === "applicant" ? (
              <>
                <MultifieldInput education={education} setEducation={setEducation} />
                {fieldErrors.education ? (
                  <Grid item className={classes.inputBox}>
                    <FormErrorSummary
                      errors={{ education: fieldErrors.education }}
                    />
                  </Grid>
                ) : null}
                <Grid item>
                  <ChipInput
                    className={classes.inputBox}
                    label="Skills"
                    variant="outlined"
                    helperText="Press enter to add skills"
                    value={signupDetails.skills}
                    onChange={(chips) =>
                      setSignupDetails((prev) => ({ ...prev, skills: chips }))
                    }
                  />
                </Grid>
                <Grid item>
                  <FileUploadInput
                    className={classes.inputBox}
                    label="Resume (.pdf)"
                    icon={<DescriptionIcon />}
                    uploadTo={apiList.uploadResume}
                    handleInput={handleInput}
                    identifier="resume"
                  />
                </Grid>
                <Grid item>
                  <FileUploadInput
                    className={classes.inputBox}
                    label="Profile Photo (.jpg/.png)"
                    icon={<FaceIcon />}
                    uploadTo={apiList.uploadProfileImage}
                    handleInput={handleInput}
                    identifier="profile"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item style={{ width: "100%" }}>
                  <TextField
                    label="Bio (upto 250 words)"
                    multiline
                    rows={8}
                    style={{ width: "100%" }}
                    variant="outlined"
                    value={signupDetails.bio}
                    onChange={(event) => {
                      if (
                        event.target.value
                          .split(" ")
                          .filter((word) => word !== "").length <= 250
                      ) {
                        handleInput("bio", event.target.value);
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <PhoneInput
                    country="in"
                    value={phone}
                    onChange={(nextPhone) => {
                      setPhone(nextPhone);
                      const normalized = nextPhone ? `+${nextPhone}` : "";
                      setFieldErrors((prev) => ({
                        ...prev,
                        contactNumber: validateSignupField(
                          "contactNumber",
                          normalized,
                          signupDetails.type
                        ),
                      }));
                    }}
                  />
                </Grid>
                {fieldErrors.contactNumber ? (
                  <Grid item className={classes.inputBox}>
                    <FormErrorSummary
                      errors={{ contactNumber: fieldErrors.contactNumber }}
                    />
                  </Grid>
                ) : null}
              </>
            )}

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={submitSignup}
                className={classes.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Signup"}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default Signup;
