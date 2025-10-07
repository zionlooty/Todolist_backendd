const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
const taskRouter = require("./routes/taskroutes");

const app = express();

// ✅ 1. Enable CORS first
app.use(cors({
  origin: "http://localhost:5173", // your frontend port
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ 2. Enable JSON body parsing AFTER CORS
app.use(express.json());

// ✅ Optional: to parse URL-encoded forms too
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is Running...");
});

app.use("/", userRouter);
app.use("/task", taskRouter);

app.listen(5000, () => console.log("✅ Server running on port 5000"));
