const authRoutes = require("./auth");
const habitRoutes = require("./habit");

///////////////////All initalization imports - start///////////////////////
// Passport
require("../configs/passport");
///////////////////All initalization imports - end///////////////////////

module.exports = function (app) {
  //Handling Routes
  app.use("/auth", authRoutes);
  app.use("/habits", habitRoutes);

  //404 error
  app.use((req, res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "404 NOT FOUND";
    next(error);
  });
};
