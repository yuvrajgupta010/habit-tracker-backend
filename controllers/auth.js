const User = require("../models/user");
const { jwtSignToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.js");
const { expressValidation } = require("../helpers/validation.js");

exports.signup = async (req, res, next) => {
  try {
    expressValidation(req);

    const { fullName, email, password } = req.body;

    const encryptedPassword = await hashPassword(password);

    const user = new User({
      email,
      password: encryptedPassword,
      fullName,
    });

    await user.save();

    return res.status(201).json({
      message: "Account created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    expressValidation(req);

    const { email, password } = req.body;

    const passwordResult = await comparePassword(password, req.user.password);

    if (!passwordResult) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      throw error;
    }

    return res.status(200).json({
      data: {
        user: req.user.toClient(),
        jwtToken: jwtSignToken({ email, userId: req.user.id }),
      },
      message: `Login successfully! Welcome ${req.user.fullName}`,
    });
  } catch (error) {
    next(error);
  }
};
