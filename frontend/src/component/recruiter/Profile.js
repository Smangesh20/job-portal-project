import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
} from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

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

const PROFILE_FIELDS = ["name", "bio", "contactNumber", "general"];
const EMPTY_PROFILE_ERRORS = createFieldErrorState(PROFILE_FIELDS);

const validateRecruiterProfile = (payload) => {
  const nextErrors = { ...EMPTY_PROFILE_ERRORS };

  if (!payload.name || !payload.name.trim()) {
    nextErrors.name = "Name is required";
  }

  if (payload.bio && payload.bio.split(" ").filter((word) => word !== "").length > 250) {
    nextErrors.bio = "Bio cannot exceed 250 words";
  }

  if (!payload.contactNumber) {
    nextErrors.contactNumber = "Contact number is required";
  } else if (!/^\+\d{7,15}$/.test(payload.contactNumber)) {
    nextErrors.contactNumber = "Please provide a valid contact number";
  }

  return nextErrors;
};

const Profile = () => {
  const classes = useStyles();
  const { showError, showSuccess, showWarning } = useNotification();

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState(EMPTY_PROFILE_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (key, value) => {
    setProfileDetails((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (["name", "bio"].includes(key)) {
      const nextPayload = {
        ...profileDetails,
        [key]: value,
        contactNumber: phone ? `+${phone}` : "",
      };
      const nextErrors = validateRecruiterProfile(nextPayload);
      setFieldErrors((prev) => ({
        ...prev,
        [key]: nextErrors[key],
      }));
    }
  };

  const getData = async () => {
    try {
      const response = await api.get(apiList.user);
      setProfileDetails(response.data);
      setPhone((response.data.contactNumber || "").replace(/^\+/, ""));
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUpdate = async () => {
    const updatedDetails = {
      ...profileDetails,
      contactNumber: phone ? `+${phone}` : "",
    };

    const nextErrors = validateRecruiterProfile(updatedDetails);
    setFieldErrors(nextErrors);

    if (hasFieldErrors(nextErrors)) {
      showWarning("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(apiList.user, updatedDetails);
      showSuccess(response.data.message || "Profile updated successfully");
      setFieldErrors(EMPTY_PROFILE_ERRORS);
      await getData();
    } catch (error) {
      if (error.code === "VALIDATION_ERROR" && Array.isArray(error.details)) {
        const apiErrors = mapApiFieldErrors(error.details, {
          allowedFields: PROFILE_FIELDS,
        });
        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(mergeFieldErrors(EMPTY_PROFILE_ERRORS, apiErrors));
        }
      }
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h2">Profile</Typography>
        </Grid>
        <Grid item xs style={{ width: "100%" }}>
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
                  label="Name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  style={{ width: "100%" }}
                  {...getFieldErrorProps(fieldErrors, "name")}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Bio (upto 250 words)"
                  multiline
                  rows={8}
                  style={{ width: "100%" }}
                  variant="outlined"
                  value={profileDetails.bio}
                  onChange={(event) => handleInput("bio", event.target.value)}
                  {...getFieldErrorProps(fieldErrors, "bio")}
                />
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PhoneInput
                  country="in"
                  value={phone}
                  onChange={(nextPhone) => {
                    setPhone(nextPhone);
                    const nextPayload = {
                      ...profileDetails,
                      contactNumber: nextPhone ? `+${nextPhone}` : "",
                    };
                    const nextErrors = validateRecruiterProfile(nextPayload);
                    setFieldErrors((prev) => ({
                      ...prev,
                      contactNumber: nextErrors.contactNumber,
                    }));
                  }}
                  style={{ width: "auto" }}
                />
              </Grid>
              {fieldErrors.contactNumber ? (
                <Grid item>
                  <FormErrorSummary
                    errors={{ contactNumber: fieldErrors.contactNumber }}
                  />
                </Grid>
              ) : null}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Details"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
