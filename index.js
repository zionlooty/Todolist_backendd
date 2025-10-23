const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
const taskRouter = require("./routes/taskroutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://todohubx.vercel.app", // ✅ your new live frontend
  "https://todolist-frontend-git-main-yusuf-sodiqs-projects.vercel.app", // preview deployment
  "https://todolist-frontend-d2ud1g2pm-yusuf-sodiqs-projects.vercel.app" // other deployment
];


// ✅ Custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Base route (for quick check)
app.get("/", (req, res) => {
  res.send("✅ TodoList Backend running successfully on Vercel!");
});

// ✅ API routes
app.use("/", userRouter);
app.use("/task", taskRouter);

// ✅ Only start the server locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ❌ No app.listen() — Vercel handles this automatically
module.exports = app;
