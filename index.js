const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
const taskRouter = require("./routes/taskroutes");

const app = express();

// ✅ Use CORS before everything else
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://todolist-frontend-orcin.vercel.app", // main prod frontend
      "https://todolist-frontend-git-main-yusuf-sodiqs-projects.vercel.app", // preview build
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle OPTIONS manually for preflight
app.options("*", cors());

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ TodoList Backend running successfully on Vercel!");
});

// ✅ API routes
app.use("/", userRouter);
app.use("/task", taskRouter);

// ❌ No app.listen — Vercel handles it
module.exports = app;
