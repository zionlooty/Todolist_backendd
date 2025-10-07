const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
const taskRouter = require("./routes/taskroutes");

const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is Running...");
});

app.use("/", userRouter);
app.use("/task", taskRouter);

app.listen(5000, () => console.log("✅ Server running on port 5000"));
