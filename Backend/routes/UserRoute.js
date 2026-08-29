const express = require("express");
const {body, validationResult} = require("express-validator");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const {create_new_user, user_login, sendOTPtouser} = require("../controller/usercontroller");

const router = express().router

router.post("/create-new-user",[
    body("name").isString().withMessage("Invalid Name").isLength({min:3}).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("mobile").isMobilePhone("en-IN").withMessage("Invalid Mobile Number"),
    body("otp").isString().isLength({min:6}, {max:6}).withMessage("Invalid OTP"),
    body("password").isString().withMessage("Invalid Password").isLength({min:6}, {max:20}).withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").isString().withMessage("Invalid Confirm Password").isLength({min:6}, {max:20}).withMessage("Confirm Password must be at least 6 characters long"),

], create_new_user)

router.post("/login-user", [
   body("email").isEmail().withMessage("Invalid Email"), 
   body("password").isString().withMessage("Invalid Password").isLength({min:6}, {max:20}).withMessage("Password must be at least 6 characters long")
],user_login)

router.post("/send-otp-user",[
     body("email").isEmail().withMessage("Invalid Email")
], sendOTPtouser)

module.exports = router