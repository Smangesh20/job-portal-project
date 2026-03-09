const COMMAND_ROUTE_MAP = [
  { keywords: ["home", "dashboard", "jobs"], path: "/home" },
  { keywords: ["welcome", "landing"], path: "/" },
  { keywords: ["learning", "coach", "training"], path: "/learning" },
  { keywords: ["login", "sign in"], path: "/login" },
  { keywords: ["signup", "sign up", "register"], path: "/signup" },
  { keywords: ["applications", "application"], path: "/applications" },
  { keywords: ["profile", "account"], path: "/profile" },
  { keywords: ["add job", "create job"], path: "/addjob" },
  { keywords: ["my jobs", "jobs posted"], path: "/myjobs" },
  { keywords: ["employees", "hired"], path: "/employees" },
  { keywords: ["logout", "sign out"], path: "/logout" },
];

export const VOICE_LANGUAGES = [
  { value: "en-US", label: "English" },
  { value: "hi-IN", label: "Hindi" },
  { value: "ta-IN", label: "Tamil" },
  { value: "te-IN", label: "Telugu" },
  { value: "kn-IN", label: "Kannada" },
  { value: "ml-IN", label: "Malayalam" },
];

export const getSpeechRecognitionConstructor = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const getVoiceCapabilities = () => {
  if (typeof window === "undefined") {
    return {
      speechSynthesis: false,
      speechRecognition: false,
    };
  }
  return {
    speechSynthesis: Boolean(window.speechSynthesis),
    speechRecognition: Boolean(getSpeechRecognitionConstructor()),
  };
};

export const normalizeVoiceCommand = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const resolveNavigationCommand = (text) => {
  const normalized = normalizeVoiceCommand(text);
  if (!normalized) {
    return null;
  }

  for (const routeRule of COMMAND_ROUTE_MAP) {
    const matched = routeRule.keywords.some((keyword) =>
      normalized.includes(keyword)
    );
    if (matched) {
      return routeRule.path;
    }
  }
  return null;
};

export const stopSpeaking = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }
  window.speechSynthesis.cancel();
};

export const speakText = (text, options = {}) => {
  if (
    !text ||
    typeof window === "undefined" ||
    !window.speechSynthesis ||
    typeof window.SpeechSynthesisUtterance !== "function"
  ) {
    return false;
  }

  const utterance = new window.SpeechSynthesisUtterance(String(text));
  utterance.lang = options.lang || "en-US";
  utterance.rate = Number.isFinite(options.rate) ? options.rate : 0.92;
  utterance.pitch = Number.isFinite(options.pitch) ? options.pitch : 0.96;

  if (typeof options.onStart === "function") {
    utterance.onstart = options.onStart;
  }
  if (typeof options.onEnd === "function") {
    utterance.onend = options.onEnd;
  }
  if (typeof options.onError === "function") {
    utterance.onerror = options.onError;
  }

  stopSpeaking();
  window.speechSynthesis.speak(utterance);
  return true;
};

