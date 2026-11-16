const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Authentication token is required"
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decodedToken;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token"
    });
  }
}

module.exports = {
  authenticate
};