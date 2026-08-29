const express = require("express");
const router = express.Router();
const NoteModel = require("../models/NoteModel");
const UserModel = require("../models/UserModel");
const {  validationResult } = require("express-validator");

const create_new_note = async (req, res) => {
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

      const exist_user = await UserModel.findOne({ _id: req.token._id });

      if (!exist_user) {
        return res
          .status(400)
          .json({ message: "User does not exist", success: false });
      }

      const newNote = new NoteModel({
        user_id: req.token._id,
        title: req.body.title,
        description: req.body.description,
      });
      await newNote.save();

      return res
        .status(200)
        .json({ message: "Note created successfully", success: true });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false, error });
    }
  }

  const fetch_user_notes = async (req, res) => {
  try {
    const exist_user = await UserModel.findOne({ _id: req.token._id });

    if (!exist_user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const notes = await NoteModel.find({ user_id: req.token._id }).sort({
      _id: -1,
    });

    return res.status(200).json({
      message: "Notes Fetched Successfully",
      success: true,
      notes: notes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}

const update_specific_note =async (req, res) => {
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

      const exist_user = await UserModel.findOne({ _id: req.token._id });

      if (!exist_user) {
        return res
          .status(400)
          .json({ message: "User does not exist", success: false });
      }

      const exist_note = await NoteModel.findOne({
        _id: req.body._id,
        user_id: req.token._id,
      });
      if (!exist_note) {
        return res
          .status(400)
          .json({ message: "Notes not exists for this user", success: false });
      }

      exist_note.title = req.body.title;
      exist_note.description = req.body.description;

      await exist_note.save();
      return res.status(200).json({
        message: "Notes updated successfully",
        success: true,
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  }


  const delete_specific_note = async (req, res) => {
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

      const exist_user = await UserModel.findOne({ _id: req.token._id });

      if (!exist_user) {
        return res
          .status(400)
          .json({ message: "User does not exist", success: false });
      }

      const exist_note = await NoteModel.findOne({
        _id: req.body._id,
        user_id: req.token._id,
      });

      //   console.log(exist_note);
      if (!exist_note) {
        return res
          .status(400)
          .json({ message: "Notes not exists for this user", success: false });
      }

      await NoteModel.deleteOne({ _id: req.body._id });

      return res
        .status(200)
        .json({ message: "Specific Note Deleted successfully", success: true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false, error });
    }
  }

  module.exports = {create_new_note, fetch_user_notes, update_specific_note, delete_specific_note}