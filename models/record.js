const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recordSchema = new Schema(
  {
    record: {
      type: Number,
      required: true,
    },
    habit: { type: Schema.ObjectId, ref: "Habit" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
