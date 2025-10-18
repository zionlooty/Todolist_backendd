const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
const taskRouter = require("./routes/taskroutes");

const app = express();

// ✅ CORS setup — allow only your deployed frontend
app.use(
  cors({
    origin: "https://todolist-frontend.vercel.app", // your React frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ TodoList Backend running successfully on Vercel!");
});

// ✅ API routes
app.use("/", userRouter);
app.use("/task", taskRouter);

// ❌ No app.listen() — Vercel handles this
module.exports = app;
