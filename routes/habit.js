const express = require("express");
const { body, query, param } = require("express-validator");

const { passportJWT } = require("../middlewares/passport");
const habitController = require("../controllers/habit");

const router = express.Router();

router.get("/", passportJWT, habitController.getHabits);

router.get("/dashboard-data", passportJWT, habitController.getDashboardData);

router.get(
  "/:habitId",
  passportJWT,
  [param("habitId").trim().notEmpty().isMongoId().withMessage("Invalid Id")],
  habitController.getHabit
);

router.post(
  "/add-habit",
  passportJWT,
  [
    body("habitName")
      .trim()
      .notEmpty()
      .withMessage("Please provide habit name"),
    body("goal").notEmpty().isNumeric().withMessage("Goal must be a number"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Please provide description"),
  ],
  habitController.addHabit
);

router.delete(
  "/:habitId",
  passportJWT,
  [param("habitId").trim().notEmpty().isMongoId().withMessage("Invalid Id")],
  habitController.deleteHabit
);

router.post(
  "/add-record",
  passportJWT,
  [
    body("habitId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid habit id"),
    body("record")
      .notEmpty()
      .isNumeric()
      .withMessage("Record must be a number"),
  ],
  habitController.addNewRecord
);

router.put(
  "/edit-record",
  passportJWT,
  [
    body("habitId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid habit id"),
    body("recordId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid record id"),
    body("record")
      .notEmpty()
      .isNumeric()
      .withMessage("Record must be a number"),
  ],
  habitController.editRecord
);

router.put(
  "/:habitId",
  passportJWT,
  [
    param("habitId").trim().notEmpty().isMongoId().withMessage("Invalid Id"),
    body("habitName")
      .trim()
      .notEmpty()
      .withMessage("Please provide habit name"),
    body("goal").notEmpty().isNumeric().withMessage("Goal must be a number"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Please provide description"),
  ],
  habitController.editHabit
);

module.exports = router;
