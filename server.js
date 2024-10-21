// library
require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

// helper or util
const date = require("./helpers/date");

// middleware
const errorMiddleware = require("./middlewares/error");

// config
const { mongoDBConnection } = require("./configs/mongoDB");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.MAIN_APP_DOMAIN],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(passport.initialize());

// server health check
app.get("/health-check", (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: date.START_TIME,
  };
  res.json(healthCheck);
});

require("./routes/routes")(app);
app.use(errorMiddleware);

mongoDBConnection
  .then(() => {
    return app.listen(PORT);
  })
  .then(() => {
    console.log(`I am running on PORT: ${PORT}...`);
  })
  .catch((err) => {
    console.log(err);
  });
