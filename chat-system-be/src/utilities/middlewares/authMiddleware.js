const jwt = require("jsonwebtoken");

const invalidTokenResponse = (res) => {
  const result = {
    message: "Invalid token",
    statusCode: 400,
  };
  res.status(result.statusCode).json(result)
};

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token)

  if (!token) {
    invalidTokenResponse(res);
  } else {
    try {
      const userData = jwt.verify(token, process.env.SECRETE_KEY);
      req.body["loginResponse"] = userData;

      next();
    } catch (error) {
      invalidTokenResponse(res);
    }
  }
};