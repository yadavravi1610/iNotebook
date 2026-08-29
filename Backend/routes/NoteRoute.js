const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const { body } = require("express-validator");
const {
  create_new_note,
  fetch_user_notes,
  update_specific_note,
  delete_specific_note
} = require("../controller/notecontroller");

router.post(
  "/create-new-note",
  VerifyToken,
  [
    body("title")
      .isString()
      .withMessage("Invalid Title")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("description")
      .isString()
      .withMessage("Invalid Description")
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long"),
  ],
  create_new_note,
);

router.get("/fetch-user-notes", VerifyToken, fetch_user_notes);

router.put(
  "/update-specific-note",
  VerifyToken,
  [
    body("_id").isMongoId().withMessage("Invalid Note Id"),
    body("title")
      .isString()
      .withMessage("Invalid Title")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("description")
      .isString()
      .withMessage("Invalid Description")
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long"),
  ],
  update_specific_note,
);

router.delete(
  "/delete-specific-note",
  VerifyToken,
  [body("_id").isMongoId().withMessage("Invalid Note Id")],
  delete_specific_note,
);

module.exports = router;
