import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Middleware to authenticate JWT token
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is required"
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    // Find user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Your account has been deactivated"
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error: any) {
    console.error("Error in authenticateToken:", error);

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: "Invalid token"
      });
      return;
    }

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: "Token has expired"
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: "Admin access required"
    });
    return;
  }

  next();
};

// Middleware to check if user owns the resource or is admin
export const requireOwnershipOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  const resourceUserId = req.params.userId || req.body.userId;
  const currentUserId = req.user._id.toString();

  if (req.user.role === 'admin' || currentUserId === resourceUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own resources."
    });
  }
};