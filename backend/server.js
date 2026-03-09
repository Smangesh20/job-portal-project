const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const {
  applyEnhancedMiddleware,
  applyErrorHandling,
} = require("./middleware/integration");

const PORT = Number.parseInt(process.env.PORT || "4444", 10);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/jobPortal";

// MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const publicRoot = path.join(__dirname, "public");
const resumeDir = path.join(publicRoot, "resume");
const profileDir = path.join(publicRoot, "profile");
const frontendBuildPath = path.resolve(__dirname, "../frontend/build");

// Initializing storage directories
if (!fs.existsSync(publicRoot)) {
  fs.mkdirSync(publicRoot, { recursive: true });
}
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());
applyEnhancedMiddleware(app);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "askyacham-api",
    timestamp: new Date().toISOString(),
  });
});

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/api/learning", require("./routes/learningRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res, next) => {
    const apiPrefixPaths = ["/auth", "/api", "/upload", "/host"];
    if (apiPrefixPaths.some((prefix) => req.path.startsWith(prefix))) {
      return next();
    }

    return res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

applyErrorHandling(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
