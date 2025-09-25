import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const decoded = jwt.verify(
      req.headers.authorization?.split(" ")[1] || "",
      process.env.JWT_SECRET as string
    );
    req.user = decoded as { id: string; username: string; email: string };
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "failure", message: "JWT TOKEN WRONG" });
  }
}
