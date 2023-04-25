import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    // Getting the token from the request header
    let token = req.header("Authorization");

    // Sending "Access Denied" response if token is missing
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // Removing "Bearer " prefix from the token if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verifying the token using the JWT secret Key stored in .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Adding the verified user object to the request object
    req.user = verified;

    // Calling the next middleware function
    next();
  } catch (err) {
    // Handling any errors that may occur and sending error response
    res.status(500).json({ error: err.message });
  }
};
