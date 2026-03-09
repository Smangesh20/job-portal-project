import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  Divider,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
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

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "40px 60px",
  },
  inputBox: {
    width: "340px",
  },
  submitButton: {
    width: "340px",
  },
  modeButton: {
    width: "165px",
  },
  sectionDivider: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const LOGIN_FIELDS = ["email", "password"];
const EMPTY_LOGIN_ERRORS = createFieldErrorState(LOGIN_FIELDS);

const validateLoginField = (field, value) => {
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
    return "";
  }

  return "";
};

const Login = () => {
  const classes = useStyles();
  const { showError, showSuccess, showWarning } = useNotification();

  const [loggedin, setLoggedin] = useState(isAuth());
  const [authMode, setAuthMode] = useState("otp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState(EMPTY_LOGIN_ERRORS);

  const validateForm = () => {
    const nextErrors = {
      ...EMPTY_LOGIN_ERRORS,
    };

    LOGIN_FIELDS.forEach((field) => {
      nextErrors[field] = validateLoginField(field, loginDetails[field] || "");
    });

    return nextErrors;
  };

  const handleInput = (field, value) => {
    setLoginDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      return {
        ...prev,
        [field]: validateLoginField(field, value),
      };
    });
  };

  const handleBlur = (field) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateLoginField(field, loginDetails[field] || ""),
    }));
  };

  const handlePasswordLogin = async () => {
    const nextErrors = validateForm();
    setFieldErrors(nextErrors);

    if (hasFieldErrors(nextErrors)) {
      showWarning("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(apiList.login, loginDetails);
      const authData = response.data?.data || response.data;
      localStorage.setItem("token", authData.token);
      localStorage.setItem("type", authData.type);
      setLoggedin(isAuth());
      showSuccess("Logged in successfully");
    } catch (error) {
      if (error.code === "VALIDATION_ERROR" && Array.isArray(error.details)) {
        const apiErrors = mapApiFieldErrors(error.details, {
          allowedFields: LOGIN_FIELDS,
        });
        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(mergeFieldErrors(EMPTY_LOGIN_ERRORS, apiErrors));
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
            Sign In
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Fastest entry: OTP. Password login remains available.
          </Typography>
        </Grid>

        <Grid item container spacing={1} justify="center">
          <Grid item>
            <Button
              variant={authMode === "otp" ? "contained" : "outlined"}
              color="primary"
              className={classes.modeButton}
              onClick={() => setAuthMode("otp")}
            >
              OTP Login
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={authMode === "password" ? "contained" : "outlined"}
              color="primary"
              className={classes.modeButton}
              onClick={() => setAuthMode("password")}
            >
              Password Login
            </Button>
          </Grid>
        </Grid>

        <Grid item className={classes.sectionDivider}>
          <Divider />
        </Grid>

        {authMode === "otp" ? (
          <Grid item className={classes.inputBox}>
            <AuthOtpPanel
              mode="login"
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
                label="Email"
                value={loginDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                onBlur={() => handleBlur("email")}
                className={classes.inputBox}
                variant="outlined"
                {...getFieldErrorProps(fieldErrors, "email")}
              />
            </Grid>
            <Grid item>
              <PasswordInput
                label="Password"
                value={loginDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
                className={classes.inputBox}
                onBlur={() => handleBlur("password")}
                {...getFieldErrorProps(fieldErrors, "password")}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordLogin}
                className={classes.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging In..." : "Login"}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default Login;
