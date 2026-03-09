import { createContext, useCallback } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";

import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import Learning from "./component/Learning";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import VoiceAssistantWidget from "./lib/VoiceAssistantWidget";
import { useNotification } from "./lib/NotificationContext";
import isAuth, { userType } from "./lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const SetPopupContext = createContext(() => {});

function App() {
  const classes = useStyles();
  const { notification, showNotification, closeNotification } = useNotification();

  // Backward-compatible adapter for existing components using SetPopupContext.
  const setPopup = useCallback(
    (popupConfig = {}) => {
      if (popupConfig.open === false) {
        closeNotification();
        return;
      }

      if (popupConfig.open || popupConfig.message) {
        showNotification(
          popupConfig.message || "",
          popupConfig.severity || "info",
          popupConfig.details || null
        );
      }
    },
    [closeNotification, showNotification]
  );

  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item xs>
            <Navbar />
          </Grid>
          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/">
                <Welcome />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
              <Route exact path="/logout">
                <Logout />
              </Route>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/applications">
                <Applications />
              </Route>
              <Route exact path="/learning">
                <Learning />
              </Route>
              <Route exact path="/profile">
                {userType() === "recruiter" ? (
                  <RecruiterProfile />
                ) : (
                  <Profile />
                )}
              </Route>
              <Route exact path="/addjob">
                <CreateJobs />
              </Route>
              <Route exact path="/myjobs">
                <MyJobs />
              </Route>
              <Route exact path="/job/applications/:jobId">
                <JobApplications />
              </Route>
              <Route exact path="/employees">
                <AcceptedApplicants />
              </Route>
              <Route>
                <ErrorPage />
              </Route>
            </Switch>
          </Grid>
        </Grid>
        <MessagePopup
          open={notification.open}
          setOpen={(status) => {
            if (!status) {
              closeNotification();
            }
          }}
          severity={notification.severity}
          message={notification.message}
          details={notification.details}
          correlationId={notification.correlationId}
        />
        <VoiceAssistantWidget />
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
