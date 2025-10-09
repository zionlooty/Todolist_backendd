const express = require("express");
const { createTask, updateTask, getTasks, getTaskById, deleteTask } = require("../controllers/taskcontroller");
const { verifyUser } = require("../middleware/auth");
const { body } = require("express-validator");

const taskRouter = express.Router();


taskRouter.post(
  "/",
  verifyUser,
  [
    body("title").trim().notEmpty().withMessage("Title is required").bail(),
    body("due_date")
      .customSanitizer((value, { req }) => {
        if (value) return value;
        if (req.body && req.body.dueDate) {
          req.body.due_date = req.body.dueDate;
          return req.body.dueDate;
        }
        return value;
      })
      .notEmpty()
      .withMessage("Due date is required")
      .bail()
      .isISO8601({ strict: true })
      .withMessage("Due date must be a valid date"),
    body("description").optional().isString().withMessage("Description must be a string"),
    body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),
    body("category").optional().isString().withMessage("Category must be a string"),
  ],
  createTask
);

taskRouter.get("/", verifyUser, getTasks);

taskRouter.put(
  "/:id",
  verifyUser,
  [
    body("title").trim().notEmpty().withMessage("Title is required").bail(),
    body("due_date").optional().isISO8601({ strict: true }).withMessage("Due date must be a valid date"),
    body("status").notEmpty().withMessage("Status is required"),
  ],
  updateTask
);

taskRouter.get("/:id", verifyUser, getTaskById);
taskRouter.delete("/:id", verifyUser, deleteTask);

module.exports = taskRouter;
