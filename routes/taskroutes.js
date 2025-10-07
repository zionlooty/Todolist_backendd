const express = require("express");
const { createTask, updateTask, getTasks, getTaskById, deleteTask } = require("../controllers/taskcontroller");
const { verifyUser } = require("../middleware/auth");
const { body } = require("express-validator");

const taskRouter = express.Router();

// ✅ FIXED ORDER HERE
taskRouter.post(
  "/",
  verifyUser,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("due_date").notEmpty().isISO8601().withMessage("Due date must be a valid date"),
    body("category").optional().isString().withMessage("Category must be a string"),
  ],
  createTask
);

taskRouter.get("/", verifyUser, getTasks);

taskRouter.put(
  "/:id",
  verifyUser,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("status").notEmpty().withMessage("Status is required"),
  ],
  updateTask
);

taskRouter.get("/:id", verifyUser, getTaskById);
taskRouter.delete("/:id", verifyUser, deleteTask);

module.exports = taskRouter;
