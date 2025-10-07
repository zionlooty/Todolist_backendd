const express = require("express")
const { createUser, loginUser, getUser, deleteUser } = require("../controllers/usercontroller")
const { body } = require("express-validator")
const { verifyUser } = require("../middleware/auth")



const userRouter = express.Router()


userRouter.post("/new/user",
    [
        body("fullname").isEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],

    createUser)

    
userRouter.post("/user/login", 
    [
        body("email").notEmpty().withMessage("Email required"),
        body("password").notEmpty().withMessage("password required")
    ],
    
    loginUser)


    
    userRouter.get("/user", verifyUser, getUser)

    userRouter.delete("/user/:user_id", verifyUser, deleteUser)



module.exports = userRouter