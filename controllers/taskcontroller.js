const { DB } = require("../sql")
const { validationResult } = require("express-validator")





module.exports.createTask = async (req, res) => {

  const errorResponse = validationResult(req)

  if (!errorResponse.isEmpty()) {
    return res.status(400).json({
      message: errorResponse.array()[0].msg
    })
  }

  const { title, description, due_date, priority, category } = req.body
  const user_id = req.user.id

  try {

    const [result] = await DB.promise().query(
      "INSERT INTO tasks (title, description, due_date, priority, category, user_id) VALUES (?,?,?,?,?,?)",
      [title, description, due_date, priority, category, user_id]
    )

    return res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId
    })
  } catch (error) {
    console.error(" Unexpected error creating task:", error)
    return res.status(500).json({ message: "Error creating task" })
  }
}





module.exports.updateTask = (req, res) => {
  const { title, description, due_date, priority, category, status } = req.body
  const user_id = req.user.id
  const task_id = req.params.id

  try {
    // ✅ Step 1: validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    // ✅ Step 2: run SQL update
    DB.query(
      `UPDATE tasks 
             SET title=?, description=?, due_date=?, priority=?, category=?, status=? 
             WHERE task_id=? AND user_id=?`,
      [title, description, due_date, priority, category, status, task_id, user_id],
      (er, result) => {
        if (er) {
          console.error("Error updating task:", er)
          return res.status(500).json({ message: "Error updating task" })
        }

        // ✅ Step 3: check if any row was updated
        if (result.affectedRows === 0) {
          console.log(first)
          return res.status(404).json({ message: "Task not found or not yours" })
        }

        // ✅ Step 4: success response
        return res.status(200).json({ message: "Task updated successfully" })
      }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    res.status(500).json({ message: error.message || "Something went wrong" })
  }
}





module.exports.getTasks = (req, res) => {
  const user_id = req.user.id;

  try {
    DB.query(
      "SELECT * FROM tasks WHERE user_id = ?",
      [user_id],
      (er, result) => {
        if (er) {
          return res.status(500).json({ message: "Error fetching tasks" });
        }

        return res.status(200).json({
          message: "Tasks fetched successfully",
          tasks: result,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};



module.exports.getTaskById = (req, res) => {
  const user_id = req.user.id        // logged-in user
  const task_id = req.params.id      // task id from URL

  try {
    DB.query(
      "SELECT * FROM tasks WHERE task_id = ? AND user_id = ?",
      [task_id, user_id],
      (er, result) => {
        if (er) {
          return res.status(500).json({ message: "Error fetching task" })
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "Task not found or not yours" })
        }

        return res.status(200).json({
          message: "Task fetched successfully",
          task: result[0]
        })
      }
    )
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" })
  }
}



module.exports.deleteTask = (req, res) => {
  const user_id = req.user.id       // logged-in user
  const task_id = req.params.id     // task id from URL

  try {
    DB.query(
      "DELETE FROM tasks WHERE task_id = ? AND user_id = ?",
      [task_id, user_id],
      (er, result) => {
        if (er) {
          return res.status(500).json({ message: "Error deleting task" })
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Task not found or not yours" })
        }

        return res.status(200).json({ message: "Task deleted successfully" })
      }
    )
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" })
  }
}