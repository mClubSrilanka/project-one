// backend/middlewares/auth.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return next();

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Unauthorized" });

    req.user = decoded;
    next();
  });
}
