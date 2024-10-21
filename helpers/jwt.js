const JWT = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.jwtSignToken = (jwtPayloadData) => {
  return JWT.sign(jwtPayloadData, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

exports.jwtVerifyToken = (jwtToken, cb = (err, jwtPayload) => {}) => {
  JWT.verify(jwtToken, JWT_SECRET_KEY, cb);
};
