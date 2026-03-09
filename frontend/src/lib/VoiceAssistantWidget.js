import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Chip,
  Divider,
  Fab,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import StopIcon from "@material-ui/icons/Stop";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import { useHistory, useLocation } from "react-router-dom";

import {
  VOICE_LANGUAGES,
  getSpeechRecognitionConstructor,
  getVoiceCapabilities,
  normalizeVoiceCommand,
  resolveNavigationCommand,
  speakText,
  stopSpeaking,
} from "./voiceAssistantService";

const ROUTE_GUIDANCE = {
  "/":
    "Welcome to AskYaCham. You can say open login, open signup, or open learning.",
  "/home":
    "Home page. Explore jobs and opportunities. Say open applications or open profile.",
  "/learning":
    "Learning page. ERP and voice coaching are available here.",
  "/applications":
    "Applications page. Track your job application progress.",
  "/profile": "Profile page. Update your personal and professional information.",
  "/login": "Login page. Fast sign in with OTP or password.",
  "/signup": "Signup page. Fast onboarding with OTP is available.",
  "/addjob": "Add job page for recruiters.",
  "/myjobs": "My jobs page for recruiters.",
  "/employees": "Employees page for recruiters.",
  "/logout": "Logout page.",
};

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    zIndex: 1300,
  },
  panel: {
    position: "fixed",
    right: theme.spacing(3),
    bottom: theme.spacing(12),
    width: "min(420px, calc(100vw - 24px))",
    maxHeight: "78vh",
    overflowY: "auto",
    zIndex: 1301,
    padding: theme.spacing(2),
    borderRadius: "12px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controls: {
    marginTop: theme.spacing(1),
  },
  actionRow: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  statusBox: {
    marginTop: theme.spacing(1),
    background: "#f8fafc",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
  },
  ethicalNote: {
    marginTop: theme.spacing(1),
    background: "#f3f7ff",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    borderLeft: "4px solid #1976d2",
  },
  installNote: {
    marginTop: theme.spacing(1),
    background: "#fff8e1",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    borderLeft: "4px solid #ef6c00",
  },
}));

const isIosDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

const isStandaloneMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const mediaStandalone =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = Boolean(window.navigator.standalone);
  return mediaStandalone || iosStandalone;
};

const VoiceAssistantWidget = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const lastHandledRef = useRef({ text: "", at: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(
    localStorage.getItem("voiceAssistantEnabled") === "true"
  );
  const [privacyConsent, setPrivacyConsent] = useState(
    localStorage.getItem("voiceAssistantConsent") === "true"
  );
  const [autoAnnounce, setAutoAnnounce] = useState(
    localStorage.getItem("voiceAssistantAutoAnnounce") !== "false"
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("voiceAssistantLanguage") || "en-US"
  );
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Voice assistant is ready.");
  const [lastTranscript, setLastTranscript] = useState("");
  const [manualCommand, setManualCommand] = useState("");
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const capabilities = useMemo(() => getVoiceCapabilities(), []);
  const currentGuidance =
    ROUTE_GUIDANCE[location.pathname] ||
    "You can say help, read page, or open learning.";

  const safeSpeak = (text) => {
    if (!voiceEnabled || !text) {
      return;
    }
    const didSpeak = speakText(text, {
      lang: language,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        setStatusText("Voice output failed in this browser.");
      },
    });

    if (!didSpeak) {
      setStatusText("Speech output is not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleVoiceCommand = (rawCommand) => {
    const normalized = normalizeVoiceCommand(rawCommand);
    if (!normalized) {
      return;
    }

    const now = Date.now();
    if (
      lastHandledRef.current.text === normalized &&
      now - lastHandledRef.current.at < 1500
    ) {
      return;
    }
    lastHandledRef.current = { text: normalized, at: now };

    setLastTranscript(rawCommand);

    if (normalized.includes("stop listening") || normalized.includes("mute")) {
      stopListening();
      setStatusText("Listening stopped.");
      safeSpeak("Listening stopped.");
      return;
    }

    if (normalized.includes("stop speaking") || normalized.includes("quiet")) {
      stopSpeaking();
      setIsSpeaking(false);
      setStatusText("Voice output stopped.");
      return;
    }

    if (normalized.includes("help") || normalized.includes("what can you do")) {
      const helpText =
        "You can say open learning, open home, open profile, read page, stop speaking, or stop listening.";
      setStatusText(helpText);
      safeSpeak(helpText);
      return;
    }

    if (
      normalized.includes("read page") ||
      normalized.includes("where am i") ||
      normalized.includes("current page")
    ) {
      setStatusText(currentGuidance);
      safeSpeak(currentGuidance);
      return;
    }

    const targetPath = resolveNavigationCommand(normalized);
    if (targetPath) {
      if (targetPath !== location.pathname) {
        history.push(targetPath);
      }
      const reply = `Opening ${targetPath.replace("/", "") || "welcome"} page.`;
      setStatusText(reply);
      safeSpeak(reply);
      return;
    }

    const fallback =
      "Command not recognized. Say help for available voice commands.";
    setStatusText(fallback);
    safeSpeak(fallback);
  };

  const startListening = () => {
    if (!voiceEnabled) {
      setStatusText("Enable voice assistant first.");
      return;
    }
    if (!privacyConsent) {
      setStatusText("Please enable ethical consent before using microphone.");
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setStatusText("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      stopListening();
      setStatusText("Listening stopped.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusText("Listening for voice commands...");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          finalTranscript += `${event.results[i][0].transcript} `;
        }
      }
      const trimmed = finalTranscript.trim();
      if (trimmed) {
        handleVoiceCommand(trimmed);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setStatusText(`Listening error: ${event.error || "unknown"}`);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleVoiceAssistant = (nextEnabled) => {
    setVoiceEnabled(nextEnabled);

    if (!nextEnabled) {
      stopListening();
      stopSpeaking();
      setIsSpeaking(false);
      setStatusText("Voice assistant disabled.");
      return;
    }

    const welcomeText =
      "Voice assistant enabled. For privacy, audio stays in your browser session only.";
    setStatusText(welcomeText);
    safeSpeak(welcomeText);
  };

  const handleInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      setDeferredInstallPrompt(null);
      setStatusText("Install prompt completed.");
      return;
    }

    if (isIosDevice() && !isStandaloneMode()) {
      setShowInstallHelp(true);
      setStatusText("Use Share then Add to Home Screen on iPhone/iPad.");
      return;
    }

    if (isStandaloneMode()) {
      setStatusText("App is already running in installed mode.");
      return;
    }

    setStatusText(
      "Install prompt is not available now. Open this site in Chrome/Edge and try again."
    );
  };

  useEffect(() => {
    localStorage.setItem("voiceAssistantEnabled", String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem("voiceAssistantConsent", String(privacyConsent));
  }, [privacyConsent]);

  useEffect(() => {
    localStorage.setItem("voiceAssistantAutoAnnounce", String(autoAnnounce));
  }, [autoAnnounce]);

  useEffect(() => {
    localStorage.setItem("voiceAssistantLanguage", language);
  }, [language]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };

    const onAppInstalled = () => {
      setDeferredInstallPrompt(null);
      setStatusText("App installed successfully.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (voiceEnabled && privacyConsent && autoAnnounce) {
      safeSpeak(currentGuidance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isOpen ? (
        <Paper elevation={6} className={classes.panel}>
          <div className={classes.titleRow}>
            <Typography variant="h6">Voice Guide</Typography>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              aria-label="Close voice guide"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <Typography variant="body2" color="textSecondary">
            Speak, listen, and navigate across all website sections.
          </Typography>

          <div className={classes.controls}>
            <FormControlLabel
              control={
                <Switch
                  checked={voiceEnabled}
                  onChange={(event) =>
                    toggleVoiceAssistant(event.target.checked)
                  }
                  color="primary"
                />
              }
              label="Enable voice assistant"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={privacyConsent}
                  onChange={(event) => setPrivacyConsent(event.target.checked)}
                  color="primary"
                />
              }
              label="Ethical consent for microphone use"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={autoAnnounce}
                  onChange={(event) => setAutoAnnounce(event.target.checked)}
                  color="primary"
                />
              }
              label="Announce page context automatically"
            />
          </div>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label="Voice Language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {VOICE_LANGUAGES.map((voiceLanguage) => (
                  <MenuItem key={voiceLanguage.value} value={voiceLanguage.value}>
                    {voiceLanguage.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <div className={classes.actionRow}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
              onClick={startListening}
              disabled={!capabilities.speechRecognition}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<VolumeUpIcon />}
              onClick={() => safeSpeak(currentGuidance)}
            >
              Read Page
            </Button>
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={() => {
                stopSpeaking();
                setIsSpeaking(false);
              }}
            >
              Stop Voice
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<GetAppIcon />}
              onClick={handleInstall}
            >
              Install App
            </Button>
          </div>

          <Grid container spacing={1} style={{ marginTop: 8 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Type command"
                value={manualCommand}
                onChange={(event) => setManualCommand(event.target.value)}
                placeholder="open learning"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                style={{ height: "100%" }}
                onClick={() => {
                  if (!manualCommand.trim()) {
                    return;
                  }
                  handleVoiceCommand(manualCommand);
                  setManualCommand("");
                }}
              >
                Run
              </Button>
            </Grid>
          </Grid>

          <div className={classes.statusBox}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body2">{statusText}</Typography>
            {lastTranscript ? (
              <Typography variant="body2" color="textSecondary">
                Heard: "{lastTranscript}"
              </Typography>
            ) : null}
          </div>

          <div className={classes.ethicalNote}>
            <Typography variant="subtitle2">Ethical and Responsible Use</Typography>
            <Typography variant="body2">
              Microphone input is used only for live browser interaction. No audio
              recording is stored by this app.
            </Typography>
          </div>

          {showInstallHelp ? (
            <div className={classes.installNote}>
              <Typography variant="subtitle2">iOS Install</Typography>
              <Typography variant="body2">
                Open Safari Share menu and choose "Add to Home Screen".
              </Typography>
            </div>
          ) : null}

          <Divider style={{ marginTop: 12, marginBottom: 12 }} />

          <Typography variant="caption" color="textSecondary">
            Voice commands: "open learning", "open home", "open profile",
            "read page", "help", "stop speaking".
          </Typography>

          <div className={classes.actionRow}>
            <Chip
              size="small"
              icon={<RecordVoiceOverIcon />}
              label={
                capabilities.speechSynthesis ? "Speech Output OK" : "Speech Output NA"
              }
              color={capabilities.speechSynthesis ? "primary" : "default"}
            />
            <Chip
              size="small"
              icon={<MicIcon />}
              label={
                capabilities.speechRecognition ? "Voice Input OK" : "Voice Input NA"
              }
              color={capabilities.speechRecognition ? "primary" : "default"}
            />
            <Chip
              size="small"
              icon={<HelpOutlineIcon />}
              label={isSpeaking ? "Speaking" : "Idle"}
              color={isSpeaking ? "secondary" : "default"}
            />
          </div>
        </Paper>
      ) : null}

      <Fab
        color={isListening ? "secondary" : "primary"}
        className={classes.fab}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Open voice guide"
      >
        {isListening ? <MicIcon /> : <RecordVoiceOverIcon />}
      </Fab>
    </>
  );
};

export default VoiceAssistantWidget;
