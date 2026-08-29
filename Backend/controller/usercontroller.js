const express = require("express");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTPtoEmail = require("../services/LoginOTP");
const OTPModel = require("../models/OTPModel");

const create_new_user = async (req, res) => {
  try {
    const errors = validationResult(req);
    // console.log(req.body);

    if (errors.array().length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        success: false,
        errors: errors.array(),
      });
    }

    const exist_otp = await OTPModel.findOne({ email: req.body.email })
      .sort({ _id: -1 })
      .limit(1);

    // console.log(exist_otp);

    if (exist_otp.length === 0) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
    // const exist_otp = await OTPModel.findOne({otpCode: req.body.otp});
    // console.log(exist_otp);

    if (exist_otp.otpCode !== req.body.otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    const exist_email = await UserModel.findOne({ email: req.body.email });
    if (exist_email) {
      return res.status(400).json({ message: "Email already exists", success:false });
    }

    const exist_mobile = await UserModel.findOne({ mobile: req.body.mobile });
    if (exist_mobile) {
      return res.status(400).json({ message: "Mobile already exists", success:false });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match", success: false });
    }

    // if(req.body.otp == exist_email.otpCode)

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hash,
    });

    return res
      .status(200)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const user_login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (errors.array().length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        success: false,
        errors: errors.array(),
      });
    }

    const exist_email = await UserModel.findOne({ email: req.body.email });
    // console.log(exist_email);

    if (!exist_email) {
      return res
        .status(400)
        .json({ message: "Email does not Exists", success: false });
    }

    const flag = bcrypt.compareSync(req.body.password, exist_email.password);
    if (!flag) {
      return res
        .status(400)
        .json({ message: "Password does not match", success: false });
    }

    const token = jwt.sign(
      {
        _id: exist_email._id,
        email: exist_email.email,
        mobile: exist_email.mobile,
      },
      process.env.SECRET_KEY,
    );

    return res
      .status(200)
      .json({ message: "Login successfully", token: token, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const sendOTPtouser = async (req, res) => {
  try {
    const errors = validationResult(req);
    // console.log(req.body);

    if (errors.array().length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        success: false,
        errors: errors.array(),
      });
    }

    const exist_email = await UserModel.findOne({ email: req.body.email });
    if (!exist_email) {
      sendOTPtoEmail(req.body.email);

      return res
        .status(200)
        .json({ message: "OTP sent successfully", success: true });
    }

    return res
      .status(400)
      .json({ message: "Email already exists", success: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { create_new_user, user_login, sendOTPtouser };
