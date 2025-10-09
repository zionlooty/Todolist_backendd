const jwt = require("jsonwebtoken")
const { DB } = require("../sql")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")




module.exports.createUser = (req, res) => {

    const { full_name, email, password } = req.body
    const errorResponse = validationResult(req)
    try {
        if (!validationResult(req).isEmpty()) {
            res.status(400).json({
                message: errorResponse.errors[0].msg
            })
        } else {
            DB.query("SELECT * FROM users WHERE email = ?", [email], (e, user) => {
                if (e) {
                    res.status(500).json({ message: "Error fetching user" })
                } else {
                    if (user.length > 0) {
                        res.status(400).json({ message: " email already exist" })
                    } else {
                        const encryptedPassword = bcrypt.hashSync(password, 10)
                        DB.query("INSERT INTO users(full_name, email, pass_word) VALUES(?,?,?)", [full_name, email, encryptedPassword], (er, _) => {
                            if (er) {
                                console.log(er)
                                res.status(500).json({ message: "Unable to add user" })
                            } else {
                                res.status(200).json({ message: "Account created Successfully" })
                            }
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
}






module.exports.loginUser = (req, res) => {
   
    const { email, password } = req.body
    const errors = validationResult(req)

    try {
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg
            })
        }

        DB.query("SELECT * FROM users WHERE email = ?", [email], (er, result) => {
            if (er) {
                
                return res.status(500).json({ message: "Unable to get user" })
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "User not found" })
            }

            const user = result[0]
            const db_password = user.pass_word

            const match = bcrypt.compareSync(password, db_password)

            if (match) {
                const token = jwt.sign(
                    { id: user.user_id, fullname: user.full_name  },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                )
                return res.status(200).json({
                    message: "Login successful",
                    token
                })
            } else {
                return res.status(400).json({
                    message: "Email or password incorrect"
                })
            }
        })
    } catch (error) {
        console.error("Unexpected error:", error)
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
}





module.exports.getUser = (req, res) => {
    const { id } = req.user

    try {
        DB.query("SELECT * FROM users WHERE user_id =?", [id], (e, user) => {
            if (e) {
                res.status(500).json({ message: "unable to fetch user" })
            } else {
                if (user.length > 0) {
                    res.status(200).json({ message: user })
                } else {
                    res.status(400).json({ message: "user not found" })
                }
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message ?? "something went wrong" })
    }
} 



module.exports.deleteUser = (req, res) => {
    const { user_id } = req.params;

    try {
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // First check if user exists
        DB.query("SELECT user_id FROM users WHERE user_id = ?", [user_id], (checkErr, user) => {
            if (checkErr) {
                console.error("Error checking user:", checkErr);
                return res.status(500).json({ message: "Error checking user" });
            }

            if (user.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            // Delete user
            DB.query("DELETE FROM users WHERE user_id = ?", [user_id], (deleteErr, result) => {
                if (deleteErr) {
                    console.error("Error deleting user:", deleteErr);
                    return res.status(500).json({ message: "Unable to delete user" });
                }

                return res.status(200).json({ message: "User deleted successfully" });
            });
        });
    } catch (error) {
        console.error("Unexpected error in deleteUser:", error);
        return res.status(500).json({ message: error.message ?? "Something went wrong" });
    }
};