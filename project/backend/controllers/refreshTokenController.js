import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Handles the refresh token request and generates a new access token.
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The new access token.
 */
export const handleRefreshToken = (req, res) => {
  try {
    const cookie = req.cookies;
    
    // Verify that the user has a refresh token
    if (!cookie?.refreshToken)
      return res.sendStatus(401);

    const refreshToken = cookie.refreshToken;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log(user);
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    });

  } catch (error) {
    // Handle errors, such as database errors
    res.status(500).json({ error: error.message });
  }
};
