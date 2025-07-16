// src/controllers/authControllers.ts

import { Request, Response, RequestHandler } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

// Extend Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Input types
interface SignUpBody {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

interface SignInBody {
  email: string;
  password: string;
}

// Token generator
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"]
  };

  return jwt.sign({ userId }, secret, options);
};
// SIGN UP
export const signUp: RequestHandler = async (
  req: Request<{}, {}, SignUpBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    const newUser = await User.create({ username, email, password, role });
    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: newUser,
        token
      }
    });
  } catch (error: any) {
    console.error("Error in signUp:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ success: false, message: "Validation error", errors });
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(409).json({ success: false, message: `Duplicate field: ${field}` });
    } else {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

// SIGN IN
export const signIn: RequestHandler = async (
  req: Request<{}, {}, SignInBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "Invalid credentials or inactive account" });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Sign in successful",
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
};

// UPDATE PASSWORD
export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: "Current and new password are required" });
      return;
    }

    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      res.status(401).json({ success: false, message: "Incorrect current password" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// SIGN OUT
export const signOut: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Optional: Blacklist JWT here if needed
    res.status(200).json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    console.error("Error in signOut:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
