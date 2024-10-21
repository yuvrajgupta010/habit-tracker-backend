const express = require("express");
const passport = require("passport");
const { body, query } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

// sign up with email and password
router.post(
  "/signup",
  [
    body("fullName")
      .isString()
      .withMessage("Full name have to be string")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your full name"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Account already exists with this email!");
        }
      }),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject("Account not exist!");
        }

        // attach user document to request so we do need to query it again
        req.user = user;
      }),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("Invaild password!"),
  ],
  authController.login
);

module.exports = router;
