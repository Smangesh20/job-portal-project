import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";

import api from "../lib/apiClient";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import { useNotification } from "../lib/NotificationContext";

const VOICE_INTENTS = [
  "Explain simpler",
  "Give real example",
  "Common mistakes",
  "Interview perspective",
  "Ethics and Responsible AI",
  "Creative memory trick",
];

const VOICE_LANGUAGES = [
  { value: "en-US", label: "English" },
  { value: "hi-IN", label: "Hindi" },
  { value: "ta-IN", label: "Tamil" },
  { value: "te-IN", label: "Telugu" },
  { value: "kn-IN", label: "Kannada" },
  { value: "ml-IN", label: "Malayalam" },
];

const useStyles = makeStyles((theme) => ({
  page: {
    width: "100%",
    maxWidth: "1200px",
    padding: theme.spacing(3),
  },
  card: {
    width: "100%",
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  controlsRow: {
    marginTop: theme.spacing(1),
  },
  selector: {
    minWidth: "260px",
  },
  summaryCard: {
    padding: theme.spacing(2),
    textAlign: "center",
    background: "#f5f8ff",
  },
  stepsContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  stepChip: {
    cursor: "pointer",
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  explanationBlock: {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: theme.spacing(2),
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
  },
  answerField: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  actionRow: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  followupBox: {
    marginTop: theme.spacing(1),
    borderRadius: "8px",
    background: "#f4f9f6",
    padding: theme.spacing(2),
    borderLeft: "4px solid #2e7d32",
  },
  voiceGrid: {
    marginTop: theme.spacing(1),
  },
}));

const extractData = (response) => response?.data?.data || response?.data || {};

const fallbackFollowup = (intent, stepData) => {
  const stepText = stepData?.stepText || "the selected step";
  if (intent === "Explain simpler") {
    return `Simple view: ${stepText}. Validate the key fields and approvals before moving to the next step.`;
  }
  if (intent === "Give real example") {
    return `Real example: execute "${stepText}", verify quantity, value, date, and linkage to prior documents.`;
  }
  if (intent === "Common mistakes") {
    return "Common mistakes are missing required fields, incorrect date/value entries, and skipped approvals.";
  }
  if (intent === "Interview perspective") {
    return "Interview tip: explain the business objective, transaction flow, control checks, and one risk if skipped.";
  }
  if (intent === "Ethics and Responsible AI") {
    return "Use fairness, transparency, privacy, and auditability checks while making ERP-related decisions.";
  }
  return "Memory trick: Validate, Link, Explain, Protect.";
};

const Learning = () => {
  const classes = useStyles();
  const recognitionRef = useRef(null);
  const authenticated = isAuth();
  const { showError, showInfo, showSuccess, showWarning } = useNotification();

  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [catalog, setCatalog] = useState({ processes: [], summary: null });
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedErp, setSelectedErp] = useState("");
  const [steps, setSteps] = useState([]);
  const [activeStepNumber, setActiveStepNumber] = useState(null);
  const [stepData, setStepData] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [progressRecords, setProgressRecords] = useState([]);
  const [progressSummary, setProgressSummary] = useState({
    totalStepsAttempted: 0,
    totalCompleted: 0,
    avgBestScore: 0,
  });
  const [voiceLanguage, setVoiceLanguage] = useState("en-US");
  const [followupIntent, setFollowupIntent] = useState(VOICE_INTENTS[0]);
  const [followupText, setFollowupText] = useState("");

  const selectedProcessRecord = useMemo(
    () => catalog.processes.find((item) => item.slug === selectedProcess) || null,
    [catalog, selectedProcess]
  );
  const progressByStep = useMemo(() => {
    const map = {};
    progressRecords.forEach((item) => {
      map[item.stepNumber] = item;
    });
    return map;
  }, [progressRecords]);
  const progressPercent = steps.length
    ? Math.round((progressSummary.totalCompleted / steps.length) * 100)
    : 0;

  const stopSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakText = (text) => {
    if (!text) {
      return;
    }
    if (typeof window === "undefined" || !window.speechSynthesis) {
      showWarning("Speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      showWarning("Voice playback failed. Try another browser voice language.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const loadCatalog = async () => {
    setIsLoadingCatalog(true);
    try {
      const response = await api.get(apiList.learningCatalog);
      const payload = extractData(response);
      const nextCatalog = {
        summary: payload.summary || null,
        processes: Array.isArray(payload.processes) ? payload.processes : [],
      };
      setCatalog(nextCatalog);

      if (nextCatalog.processes.length > 0) {
        const firstProcess = nextCatalog.processes[0];
        const firstErp = firstProcess.erps?.[0];
        setSelectedProcess(firstProcess.slug);
        setSelectedErp(firstErp?.slug || "");
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  const loadSteps = async (processSlug, erpSlug) => {
    if (!processSlug || !erpSlug) {
      return;
    }

    setIsLoadingSteps(true);
    try {
      const response = await api.get(
        `${apiList.learningSteps}?process=${encodeURIComponent(
          processSlug
        )}&erp=${encodeURIComponent(erpSlug)}`
      );
      const payload = extractData(response);
      const nextSteps = Array.isArray(payload.steps) ? payload.steps : [];
      setSteps(nextSteps);

      if (nextSteps.length > 0) {
        const firstStep = nextSteps[0].stepNumber;
        const hasExisting = nextSteps.some(
          (item) => item.stepNumber === activeStepNumber
        );
        setActiveStepNumber(hasExisting ? activeStepNumber : firstStep);
      } else {
        setActiveStepNumber(null);
      }
    } catch (error) {
      setSteps([]);
      setActiveStepNumber(null);
      showError(error);
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const loadStep = async (processSlug, erpSlug, stepNumber) => {
    if (!processSlug || !erpSlug || !stepNumber) {
      return;
    }

    setIsLoadingStep(true);
    try {
      const response = await api.get(
        `${apiList.learningStep}/${encodeURIComponent(
          processSlug
        )}/${encodeURIComponent(erpSlug)}/${encodeURIComponent(stepNumber)}`
      );
      setStepData(extractData(response));
      setEvaluation(null);
      setFollowupText("");
    } catch (error) {
      setStepData(null);
      showError(error);
    } finally {
      setIsLoadingStep(false);
    }
  };

  const loadProgress = async (processSlug, erpSlug) => {
    if (!authenticated || !processSlug || !erpSlug) {
      return;
    }

    setIsLoadingProgress(true);
    try {
      const response = await api.get(
        `${apiList.learningProgress}?process=${encodeURIComponent(
          processSlug
        )}&erp=${encodeURIComponent(erpSlug)}`
      );
      const payload = extractData(response);
      setProgressRecords(Array.isArray(payload.records) ? payload.records : []);
      setProgressSummary(
        payload.summary || {
          totalStepsAttempted: 0,
          totalCompleted: 0,
          avgBestScore: 0,
        }
      );
    } catch (error) {
      if (error.status !== 401) {
        showError(error);
      }
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!stepData) {
      return;
    }

    const payload = {
      processSlug: selectedProcess,
      erpSlug: selectedErp,
      stepNumber: stepData.stepNumber,
    };

    if (stepData.isMcq) {
      if (selectedOptionIndex < 0) {
        showWarning("Select an option before checking the answer.");
        return;
      }
      payload.selectedOptionIndex = selectedOptionIndex;
    } else {
      if (!answerText.trim()) {
        showWarning("Provide an answer before checking.");
        return;
      }
      payload.answer = answerText;
    }

    setIsCheckingAnswer(true);
    try {
      const response = await api.post(apiList.learningCheckAnswer, payload);
      const result = extractData(response);
      setEvaluation(result);

      if (result.isCorrect) {
        showSuccess(`Well done. Score ${result.score}%.`);
      } else {
        showInfo(`Score ${result.score}%. Review feedback and try again.`);
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!stepData || !evaluation) {
      showWarning("Check your answer first, then save progress.");
      return;
    }

    if (!authenticated) {
      showInfo("Sign in to save your learning progress.");
      return;
    }

    setIsSavingProgress(true);
    try {
      await api.post(apiList.learningProgress, {
        processSlug: selectedProcess,
        erpSlug: selectedErp,
        stepNumber: stepData.stepNumber,
        score: evaluation.score || 0,
        isCompleted: evaluation.isCorrect === true,
        answer: stepData.isMcq ? String(selectedOptionIndex) : answerText,
      });
      showSuccess("Progress saved.");
      loadProgress(selectedProcess, selectedErp);
    } catch (error) {
      showError(error);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleFollowup = async () => {
    if (!stepData) {
      return;
    }
    try {
      const response = await api.post(apiList.learningFollowup, {
        processSlug: selectedProcess,
        erpSlug: selectedErp,
        stepNumber: stepData.stepNumber,
        intent: followupIntent,
      });
      const payload = extractData(response);
      setFollowupText(payload.responseText || "");
    } catch (error) {
      setFollowupText(fallbackFollowup(followupIntent, stepData));
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      showWarning("Speech-to-text is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setAnswerText((prev) => [prev, transcript].filter(Boolean).join(" ").trim());
    };
    recognition.onerror = () => {
      showWarning("Voice capture failed. Please type your answer.");
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    loadCatalog();
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProcessRecord) {
      return;
    }
    const exists = selectedProcessRecord.erps?.some(
      (item) => item.slug === selectedErp
    );
    if (!exists) {
      setSelectedErp(selectedProcessRecord.erps?.[0]?.slug || "");
    }
  }, [selectedProcessRecord, selectedErp]);

  useEffect(() => {
    if (selectedProcess && selectedErp) {
      loadSteps(selectedProcess, selectedErp);
      loadProgress(selectedProcess, selectedErp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProcess, selectedErp, authenticated]);

  useEffect(() => {
    if (selectedProcess && selectedErp && activeStepNumber) {
      loadStep(selectedProcess, selectedErp, activeStepNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProcess, selectedErp, activeStepNumber]);

  useEffect(() => {
    if (!stepData) {
      return;
    }

    const existing = progressByStep[stepData.stepNumber];
    if (stepData.isMcq) {
      const parsed = Number.parseInt(existing?.lastAnswer || "-1", 10);
      setSelectedOptionIndex(Number.isInteger(parsed) ? parsed : -1);
      setAnswerText("");
    } else {
      setAnswerText(existing?.lastAnswer || "");
      setSelectedOptionIndex(-1);
    }
  }, [stepData, progressByStep]);

  return (
    <Grid container item direction="column" alignItems="center" className={classes.page}>
      <Grid item>
        <Typography variant="h3">Learning Section</Typography>
      </Grid>

      <Grid item style={{ width: "100%" }}>
        <Paper elevation={2} className={classes.card}>
          <Typography variant="h5">ERP Responsible AI and Voice Coach</Typography>
          <Typography variant="body2" color="textSecondary">
            Imported content from <strong>learning/erp-responsible-ai</strong>, now running directly inside AskYaCham.com
            without separate Streamlit ports.
          </Typography>

          {isLoadingCatalog ? (
            <Grid container justify="center" style={{ marginTop: 24 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              <Grid container spacing={2} className={classes.controlsRow}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Process"
                    variant="outlined"
                    className={classes.selector}
                    value={selectedProcess}
                    onChange={(event) => setSelectedProcess(event.target.value)}
                  >
                    {catalog.processes.map((processItem) => (
                      <MenuItem key={processItem.slug} value={processItem.slug}>
                        {processItem.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="ERP System"
                    variant="outlined"
                    className={classes.selector}
                    value={selectedErp}
                    onChange={(event) => setSelectedErp(event.target.value)}
                  >
                    {(selectedProcessRecord?.erps || []).map((erpItem) => (
                      <MenuItem key={erpItem.slug} value={erpItem.slug}>
                        {erpItem.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Voice Language"
                    variant="outlined"
                    value={voiceLanguage}
                    onChange={(event) => setVoiceLanguage(event.target.value)}
                  >
                    {VOICE_LANGUAGES.map((language) => (
                      <MenuItem key={language.value} value={language.value}>
                        {language.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={2} style={{ marginTop: 8 }}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} className={classes.summaryCard}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Steps
                    </Typography>
                    <Typography variant="h5">{steps.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} className={classes.summaryCard}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Completed
                    </Typography>
                    <Typography variant="h5">{progressSummary.totalCompleted}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} className={classes.summaryCard}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Best Score Avg
                    </Typography>
                    <Typography variant="h5">{progressSummary.avgBestScore}%</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" className={classes.sectionTitle}>
                Progress ({progressPercent}%)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, progressPercent))}
              />

              {isLoadingSteps ? (
                <Grid container justify="center" style={{ marginTop: 16 }}>
                  <CircularProgress size={24} />
                </Grid>
              ) : (
                <div className={classes.stepsContainer}>
                  {steps.map((stepItem) => {
                    const progressItem = progressByStep[stepItem.stepNumber];
                    const color = progressItem?.isCompleted ? "primary" : "default";
                    return (
                      <Chip
                        key={stepItem.stepNumber}
                        className={classes.stepChip}
                        label={`Step ${stepItem.stepNumber}`}
                        color={activeStepNumber === stepItem.stepNumber ? "secondary" : color}
                        onClick={() => setActiveStepNumber(stepItem.stepNumber)}
                      />
                    );
                  })}
                </div>
              )}

              <Divider style={{ marginTop: 20, marginBottom: 20 }} />

              {isLoadingStep ? (
                <Grid container justify="center">
                  <CircularProgress />
                </Grid>
              ) : stepData ? (
                <>
                  <Typography variant="h6">
                    Step {stepData.stepNumber}: {stepData.stepText}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stepData.processLabel} | {stepData.erpLabel}
                  </Typography>

                  {stepData?.script?.detailed_explanation ? (
                    <>
                      <Typography variant="subtitle1" className={classes.sectionTitle}>
                        Guided Explanation
                      </Typography>
                      <div className={classes.explanationBlock}>
                        {stepData.script.detailed_explanation}
                      </div>
                    </>
                  ) : null}

                  <Typography variant="subtitle1" className={classes.sectionTitle}>
                    Knowledge Check
                  </Typography>
                  <Typography variant="body1">
                    {stepData?.question?.question ||
                      stepData?.script?.question ||
                      "Explain this step in your own words with key controls."}
                  </Typography>

                  {stepData.isMcq ? (
                    <FormControl component="fieldset" className={classes.answerField}>
                      <RadioGroup
                        value={selectedOptionIndex}
                        onChange={(event) =>
                          setSelectedOptionIndex(Number.parseInt(event.target.value, 10))
                        }
                      >
                        {(stepData?.question?.options || []).map((option, index) => (
                          <FormControlLabel
                            key={option}
                            value={index}
                            control={<Radio color="primary" />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <>
                      <TextField
                        multiline
                        rows={5}
                        variant="outlined"
                        value={answerText}
                        onChange={(event) => setAnswerText(event.target.value)}
                        placeholder="Write your answer with controls, checks, and business impact"
                        className={classes.answerField}
                      />
                      <Grid container spacing={1} className={classes.voiceGrid}>
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleVoiceInput}
                            disabled={isCheckingAnswer}
                          >
                            {isListening ? "Stop Voice Input" : "Voice Input"}
                          </Button>
                        </Grid>
                        {isListening ? (
                          <Grid item>
                            <Typography variant="body2" color="textSecondary">
                              Listening...
                            </Typography>
                          </Grid>
                        ) : null}
                      </Grid>
                    </>
                  )}

                  <div className={classes.actionRow}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCheckAnswer}
                      disabled={isCheckingAnswer}
                    >
                      {isCheckingAnswer ? "Checking..." : "Check Answer"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleSaveProgress}
                      disabled={!evaluation || isSavingProgress}
                    >
                      {isSavingProgress ? "Saving..." : "Save Progress"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setActiveStepNumber((prev) =>
                          prev && prev > 1 ? prev - 1 : prev
                        )
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setActiveStepNumber((prev) => {
                          if (!prev || steps.length === 0) {
                            return prev;
                          }
                          const currentIndex = steps.findIndex(
                            (item) => item.stepNumber === prev
                          );
                          if (currentIndex < 0 || currentIndex >= steps.length - 1) {
                            return prev;
                          }
                          return steps[currentIndex + 1].stepNumber;
                        })
                      }
                    >
                      Next
                    </Button>
                  </div>

                  {evaluation ? (
                    <Paper elevation={0} className={classes.followupBox}>
                      <Typography variant="subtitle2">
                        Score: {evaluation.score}% | {evaluation.isCorrect ? "Passed" : "Retry"}
                      </Typography>
                      <Typography variant="body2">{evaluation.feedback}</Typography>
                      {Number.isInteger(evaluation.correctOptionIndex) ? (
                        <Typography variant="body2" color="textSecondary">
                          Correct option: {evaluation.correctOption}
                        </Typography>
                      ) : null}
                    </Paper>
                  ) : null}

                  <Typography variant="subtitle1" className={classes.sectionTitle}>
                    Voice Coach
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          speakText(
                            stepData?.script?.speech_text ||
                              stepData?.question?.spoken_prompt ||
                              stepData.stepText
                          )
                        }
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? "Speaking..." : "Speak Step"}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" onClick={stopSpeech}>
                        Stop Voice
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} style={{ marginTop: 8 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Voice Follow-up"
                        variant="outlined"
                        value={followupIntent}
                        onChange={(event) => setFollowupIntent(event.target.value)}
                      >
                        {VOICE_INTENTS.map((intent) => (
                          <MenuItem key={intent} value={intent}>
                            {intent}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        style={{ height: "100%" }}
                        onClick={handleFollowup}
                      >
                        Generate Follow-up Response
                      </Button>
                    </Grid>
                  </Grid>

                  {followupText ? (
                    <Paper elevation={0} className={classes.followupBox}>
                      <Typography variant="body2">{followupText}</Typography>
                      <div className={classes.actionRow}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => speakText(followupText)}
                        >
                          Speak Follow-up
                        </Button>
                      </div>
                    </Paper>
                  ) : null}
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Select a process and ERP to begin.
                </Typography>
              )}

              {!authenticated ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: 16 }}
                >
                  Progress sync requires sign in. Learning content and voice coaching remain open.
                </Typography>
              ) : isLoadingProgress ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: 16 }}
                >
                  Loading progress...
                </Typography>
              ) : null}
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Learning;
