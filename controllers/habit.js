const mongoose = require("mongoose");

const Habit = require("../models/habit");
const Record = require("../models/record");
const { expressValidation } = require("../helpers/validation.js");
const ObjectId = mongoose.Types.ObjectId;

exports.getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.jwtPayload;

    const dashboardData = {};
    const habits = await Habit.find({ user: userId });
    if (!habits.length) {
      return res.status(204).json({
        message: "No habits found",
      });
    }

    dashboardData.data = habits; //.map((habit) => habit.toClient());

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate the current week's Sunday (start of the week)
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - currentDayOfWeek); // Go back to the start of the week
    currentWeekSunday.setHours(0, 0, 0, 0); // Set to start of the day

    // Calculate the current week's Saturday (end of the week)
    const currentWeekSaturday = new Date(today);
    currentWeekSaturday.setDate(today.getDate() + (6 - currentDayOfWeek)); // Go forward to the end of the week
    currentWeekSaturday.setHours(23, 59, 59, 999); // Set to end of the day

    // Use Promise.all to ensure all records are fetched before sending the response
    const habitsWithRecords = await Promise.all(
      dashboardData.data.map(async (habitDetail) => {
        const records = await Record.find({
          habit: habitDetail._id,
          createdAt: { $gte: currentWeekSunday, $lte: currentWeekSaturday },
        });
        habitDetail.records = records; // Attach records to the habit
        return habitDetail; // Return the updated habit object
      })
    );

    return res.status(200).json({
      data: habitsWithRecords,
    });
  } catch (err) {
    next(err);
  }
};

exports.addHabit = async (req, res, next) => {
  try {
    expressValidation(req);
    const { habitName, goal, description } = req.body;
    const { userId } = req.jwtPayload;

    const habit = new Habit({
      habitName,
      goal,
      description,
      user: userId,
    });
    await habit.save();

    return res.status(201).json({
      data: habit.toClient(),
      message: "Habit added successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteHabit = async (req, res, next) => {
  try {
    expressValidation(req);
    const { habitId } = req.params;
    const { userId } = req.jwtPayload;

    const habit = await Habit.findOne({ _id: habitId, user: userId });

    if (!habit) {
      const error = new Error("Habit not found");
      error.status = 404;
      throw error;
    }

    await habit.deleteOne();

    return res.status(200).json({
      message: "Habit deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.editHabit = async (req, res, next) => {
  try {
    expressValidation(req);
    const { habitId } = req.params;
    const { habitName, goal, description } = req.body;
    const { userId } = req.jwtPayload;

    const habit = await Habit.findOne({ _id: habitId, user: userId });

    if (!habit) {
      const error = new Error("Habit not found");
      error.status = 404;
      throw error;
    }

    habit.habitName = habitName || habit.habitName;
    habit.goal = goal || habit.goal;
    habit.description = description || habit.description;

    await habit.save();

    return res.status(200).json({
      message: "Habit edited successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.getHabits = async (req, res, next) => {
  try {
    expressValidation(req);
    const { userId } = req.jwtPayload;

    const habits = await Habit.find({ user: userId });

    return res.status(200).json({
      data: habits.map((habit) => habit.toClient()),
    });
  } catch (err) {
    next(err);
  }
};

exports.getHabit = async (req, res, next) => {
  try {
    expressValidation(req);
    const { habitId } = req.params;
    const { userId } = req.jwtPayload;

    const habit = await Habit.findOne({ user: userId, _id: habitId });

    if (!habit) {
      const error = new Error("Habit not found");
      error.status = 404;
      throw error;
    }

    return res.status(200).json({
      data: habit.toClient(),
    });
  } catch (err) {
    next(err);
  }
};

exports.addNewRecord = async (req, res, next) => {
  try {
    expressValidation(req);
    const { habitId, record } = req.body;
    const { userId } = req.jwtPayload;

    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      const error = new Error("Unauthorized Access!");
      error.status = 404;
      throw error;
    }

    if (habit.goal < record) {
      const error = new Error("Record exceeds the habit's goal!");
      error.status = 400;
      throw error;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    const todayRecord = await Record.findOne({
      habit: habitId,
      createdAt: {
        $gte: new Date(year, month, day), // Start of today
        $lt: new Date(year, month, day + 1), // Start of tomorrow (exclusive)
      },
    });

    if (todayRecord) {
      const error = new Error("You've already recorded today's habit!");
      error.status = 400;
      throw error;
    }

    const habits = new Record({ habit: habitId, record });
    await habits.save();

    return res.status(200).json({
      data: habits,
      message: "Record added successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.editRecord = async (req, res, next) => {
  try {
    expressValidation(req);
    const { habitId, record, recordId } = req.body;
    const { userId } = req.jwtPayload;

    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      const error = new Error("Unauthorized Access!");
      error.status = 404;
      throw error;
    }

    if (habit.goal < record) {
      const error = new Error("Record exceeds the habit's goal!");
      error.status = 400;
      throw error;
    }

    const todayRecord = await Record.findOne({
      habit: habitId,
      _id: recordId,
    });

    if (!todayRecord) {
      const error = new Error("Record not found!");
      error.status = 400;
      throw error;
    }

    todayRecord.record = record;
    await todayRecord.save();

    return res.status(200).json({
      data: todayRecord,
      message: "Record updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
