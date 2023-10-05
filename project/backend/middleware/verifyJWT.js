import jwt from "jsonwebtoken";
import "dotenv/config";

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
