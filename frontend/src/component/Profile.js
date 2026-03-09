import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

import api from "../lib/apiClient";
import apiList from "../lib/apiList";
import { useNotification } from "../lib/NotificationContext";
import FormErrorSummary from "../lib/FormErrorSummary";
import {
  createFieldErrorState,
  getFieldErrorProps,
  hasFieldErrors,
  mapApiFieldErrors,
  mergeFieldErrors,
} from "../lib/formErrorUtils";

const useStyles = makeStyles(() => ({
  body: {
    height: "inherit",
  },
  inputBox: {
    width: "100%",
  },
}));

const PROFILE_FIELDS = ["name", "education", "skills", "general"];
const EMPTY_PROFILE_ERRORS = createFieldErrorState(PROFILE_FIELDS);

const MultifieldInput = ({ education, setEducation }) => {
  const classes = useStyles();

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
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
              fullWidth
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
      <Grid item style={{ alignSelf: "center" }}>
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

const Profile = () => {
  const classes = useStyles();
  const { showError, showSuccess, showWarning } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_PROFILE_ERRORS);

  const handleInput = (key, value) => {
    setProfileDetails((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "name") {
      setFieldErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : "Name is required",
      }));
    }
  };

  const getData = async () => {
    try {
      const response = await api.get(apiList.user);
      setProfileDetails(response.data);
      if (response.data.education && response.data.education.length > 0) {
        setEducation(
          response.data.education.map((edu) => ({
            institutionName: edu.institutionName || "",
            startYear: edu.startYear || "",
            endYear: edu.endYear || "",
          }))
        );
      }
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
      education: normalizeEducation(education),
    };

    const nextErrors = { ...EMPTY_PROFILE_ERRORS };
    if (!updatedDetails.name || !updatedDetails.name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (updatedDetails.education.some((item) => !item.startYear)) {
      nextErrors.education = "Education entries must include a start year";
    }

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
          aliases: {
            "education.institutionName": "education",
            "education.startYear": "education",
            "education.endYear": "education",
          },
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
        <Grid item xs>
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
                  {...getFieldErrorProps(fieldErrors, "name")}
                />
              </Grid>
              <MultifieldInput education={education} setEducation={setEducation} />
              {fieldErrors.education ? (
                <Grid item>
                  <FormErrorSummary errors={{ education: fieldErrors.education }} />
                </Grid>
              ) : null}
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={profileDetails.skills || []}
                  onAdd={(chip) =>
                    setProfileDetails((prev) => ({
                      ...prev,
                      skills: [...(prev.skills || []), chip],
                    }))
                  }
                  onDelete={(chip, index) => {
                    const skills = [...(profileDetails.skills || [])];
                    skills.splice(index, 1);
                    setProfileDetails((prev) => ({
                      ...prev,
                      skills,
                    }));
                  }}
                  fullWidth
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
