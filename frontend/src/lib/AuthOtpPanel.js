import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import api from "./apiClient";
import apiList from "./apiList";
import FormErrorSummary from "./FormErrorSummary";
import { useNotification } from "./NotificationContext";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const normalizePhone = (rawValue = "") => {
  const cleaned = rawValue.replace(/[^\d+]/g, "");
  if (!cleaned) {
    return "";
  }
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  return `+${cleaned}`;
};

const AuthOtpPanel = ({
  mode = "login",
  onAuthenticated,
  defaultType = "applicant",
  className = "",
}) => {
  const { showError, showInfo, showSuccess, showWarning } = useNotification();

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState(defaultType);
  const [contactNumber, setContactNumber] = useState("");
  const [bio, setBio] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [developmentOtp, setDevelopmentOtp] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const intent = mode === "signup" ? "signup" : "auto";

  useEffect(() => {
    if (!resendCountdown) {
      return undefined;
    }

    const timer = setInterval(() => {
      setResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  const isIdentifierEmail = useMemo(
    () => EMAIL_REGEX.test(String(identifier).trim().toLowerCase()),
    [identifier]
  );

  const validateBeforeRequest = () => {
    const nextErrors = {};
    const trimmedIdentifier = identifier.trim();
    const normalizedPhone = normalizePhone(trimmedIdentifier);

    if (!trimmedIdentifier) {
      nextErrors.identifier = "Email or phone number is required";
    } else {
      const isValidEmail = EMAIL_REGEX.test(trimmedIdentifier.toLowerCase());
      const isValidPhone = /^\+\d{7,15}$/.test(normalizedPhone);
      if (!isValidEmail && !isValidPhone) {
        nextErrors.identifier = "Enter a valid email or phone number";
      }
    }

    if (mode === "signup" && !name.trim()) {
      nextErrors.name = "Name is required for new account signup";
    }

    if (type === "recruiter" && contactNumber.trim()) {
      const normalized = normalizePhone(contactNumber.trim());
      if (!/^\+\d{7,15}$/.test(normalized)) {
        nextErrors.contactNumber = "Enter a valid recruiter contact number";
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateBeforeVerify = () => {
    const nextErrors = {};
    if (!otp.trim()) {
      nextErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp.trim())) {
      nextErrors.otp = "OTP must be 6 digits";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const requestOtp = async () => {
    if (!validateBeforeRequest()) {
      showWarning("Please fix the highlighted fields.");
      return;
    }

    setIsRequestingOtp(true);
    try {
      const payload = {
        identifier: identifier.trim(),
        intent,
        type,
        name: name.trim() || undefined,
        contactNumber: contactNumber.trim()
          ? normalizePhone(contactNumber.trim())
          : undefined,
        bio: bio.trim() || undefined,
      };
      const response = await api.post(apiList.otpRequest, payload);
      const responseData = response?.data?.data || response?.data || {};

      setOtpSent(true);
      setResendCountdown(Math.max(15, responseData.expiresInSeconds || 60));
      setDevelopmentOtp(responseData.developmentOtp || "");
      showSuccess(responseData.message || "OTP sent successfully.");

      if (responseData.developmentOtp) {
        showInfo(`Development OTP: ${responseData.developmentOtp}`);
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!validateBeforeVerify()) {
      showWarning("Please provide a valid OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const payload = {
        identifier: identifier.trim(),
        otp: otp.trim(),
        intent,
        type,
        name: name.trim() || undefined,
        contactNumber: contactNumber.trim()
          ? normalizePhone(contactNumber.trim())
          : undefined,
        bio: bio.trim() || undefined,
      };

      const response = await api.post(apiList.otpVerify, payload);
      const responseData = response?.data?.data || response?.data || {};

      const token = responseData.token;
      const userType = responseData.type;

      if (!token || !userType) {
        throw new Error("Authentication response is incomplete");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("type", userType);

      showSuccess(
        responseData.isNewUser
          ? "Account created and signed in successfully."
          : "Signed in successfully."
      );

      if (typeof onAuthenticated === "function") {
        onAuthenticated(responseData);
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <Grid container direction="column" spacing={2} className={className}>
      <Grid item>
        <Typography variant="h5">
          {mode === "signup" ? "Quick Signup with OTP" : "Quick Sign In with OTP"}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" color="textSecondary">
          {mode === "signup"
            ? "Create your account in seconds using email or phone OTP."
            : "Use OTP for fast and secure sign in without password."}
        </Typography>
      </Grid>

      <Grid item>
        <FormErrorSummary errors={fieldErrors} />
      </Grid>

      <Grid item>
        <TextField
          label="Email or Phone"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          variant="outlined"
          fullWidth
          error={Boolean(fieldErrors.identifier)}
          helperText={fieldErrors.identifier}
        />
      </Grid>

      <Grid item>
        <TextField
          select
          label="Account Type"
          value={type}
          variant="outlined"
          onChange={(event) => setType(event.target.value)}
          fullWidth
        >
          <MenuItem value="applicant">Applicant</MenuItem>
          <MenuItem value="recruiter">Recruiter</MenuItem>
        </TextField>
      </Grid>

      {mode === "signup" ? (
        <Grid item>
          <TextField
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            variant="outlined"
            fullWidth
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name}
          />
        </Grid>
      ) : null}

      {type === "recruiter" ? (
        <>
          <Grid item>
            <TextField
              label="Recruiter Contact Number"
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              variant="outlined"
              fullWidth
              error={Boolean(fieldErrors.contactNumber)}
              helperText={fieldErrors.contactNumber || "Optional during sign-in"}
            />
          </Grid>
          {mode === "signup" ? (
            <Grid item>
              <TextField
                label="Bio (optional)"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                variant="outlined"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          ) : null}
        </>
      ) : null}

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={requestOtp}
          disabled={isRequestingOtp || resendCountdown > 0}
        >
          {isRequestingOtp
            ? "Sending OTP..."
            : resendCountdown > 0
              ? `Resend OTP in ${resendCountdown}s`
              : otpSent
                ? "Resend OTP"
                : "Send OTP"}
        </Button>
      </Grid>

      {otpSent ? (
        <>
          <Grid item>
            <TextField
              label="Enter 6-digit OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              variant="outlined"
              fullWidth
              error={Boolean(fieldErrors.otp)}
              helperText={fieldErrors.otp}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={verifyOtp}
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP and Continue"}
            </Button>
          </Grid>
          {developmentOtp ? (
            <Grid item>
              <Typography variant="caption" color="textSecondary">
                Dev OTP: {developmentOtp}
              </Typography>
            </Grid>
          ) : null}
        </>
      ) : null}

      <Grid item>
        <Typography variant="caption" color="textSecondary">
          {isIdentifierEmail
            ? "OTP will be delivered to your email address."
            : "OTP will be delivered to your phone number if configured."}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthOtpPanel;
