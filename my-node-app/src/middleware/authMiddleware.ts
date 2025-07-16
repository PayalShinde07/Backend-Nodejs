import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Define custom payload shape
interface JwtPayload extends DefaultJwtPayload {
  userId: string;
}

// ✅ Middleware: Authenticate JWT Token
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Access token is required" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: user ? "Your account has been deactivated" : "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Error in authenticateToken:", error);

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ success: false, message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token has expired" });
    } else {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

// ✅ Middleware: Allow only admin users
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }

  next();
};

// ✅ Middleware: Allow admin or resource owner (by userId param/body)
export const requireOwnershipOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const resourceUserId = req.params.userId || req.body.userId;
  const currentUserId = req.user._id.toString();

  if (req.user.role === "admin" || currentUserId === resourceUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own resources.",
    });
  }
};
