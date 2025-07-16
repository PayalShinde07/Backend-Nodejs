import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

interface AuthRequest extends Request {
  user?: IUser;
}

interface SignUpBody {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

interface SignInBody {
  email: string;
  password: string;
}

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as jwt.SignOptions);
};

// Sign Up Controller
export const signUp: RequestHandler = async (
  req: Request<{}, {}, SignUpBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email, and password are required"
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email or username already exists"
      });
      return;
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role
    });

    // Generate token
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
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
      return;
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Sign In Controller
export const signIn: RequestHandler = async (
  req: Request<{}, {}, SignInBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Your account has been deactivated"
      });
      return;
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Remove password from user object
    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      message: "Sign in successful",
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error: any) {
    console.error("Error in signIn:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get Current User Controller
export const getCurrentUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      data: { user }
    });
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update Password Controller
export const updatePassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as AuthRequest).user?._id;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
      return;
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error: any) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Sign Out Controller (Optional - for token blacklisting)
export const signOut: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // In a real-world scenario, you might want to implement token blacklisting
    // For now, we'll just send a success response
    res.status(200).json({
      success: true,
      message: "Sign out successful"
    });
  } catch (error: any) {
    console.error("Error in signOut:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};