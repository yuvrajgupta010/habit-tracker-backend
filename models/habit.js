const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const habitSchema = new Schema(
  {
    habitName: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: { type: Schema.ObjectId, ref: "User" },
    records: Array,
  },
  { timestamps: true }
);

habitSchema.methods.toClient = function () {
  const obj = this.toObject({ getters: true, versionKey: false }); // Convert the document to a plain JavaScript object

  // Change _id to id
  obj.id = obj._id;
  delete obj._id;

  // Remove password if it exists
  delete obj.user;

  return obj;
};

module.exports = mongoose.model("Habit", habitSchema);
