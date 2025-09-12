import jwt from "jsonwebtoken";
export default function authMiddleware(req, res, next) {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "failure", message: "JWT TOKEN WRONG" });
  }
}
