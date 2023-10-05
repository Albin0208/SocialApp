import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Middleware function to verify a JSON Web Token (JWT) in the Authorization header of a request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a response object with an error message if the token is invalid or missing, otherwise calls the next middleware function.
 */
export const verifyJWT = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (!authToken)
    return res.status(401).json({ error: "Authentication required." });

  const token = authToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Access Forbidden: Invalid token." });
  }
};
