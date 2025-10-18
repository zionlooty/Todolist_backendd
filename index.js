const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
const taskRouter = require("./routes/taskroutes");

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://todolist-frontend-orcin.vercel.app",
  "https://todolist-frontend-git-main-yusuf-sodiqs-projects.vercel.app",
];
const extraOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : [];
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (allowedOrigins.includes(origin) || extraOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    // Allow any *.vercel.app frontend by default
    return hostname.endsWith(".vercel.app");
  } catch (_) {
    return false;
  }
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ TodoList Backend running successfully on Vercel!");
});

// ✅ API routes
app.use("/", userRouter);
app.use("/task", taskRouter);

// ❌ No app.listen() — Vercel handles it
module.exports = app;
