import express, { Router } from "express";
import {
  signUp,
  signIn,
  getCurrentUser,
  updatePassword,
  signOut
} from "../controllers/authControllers";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/signin", signIn);

// Protected routes (require authentication)
router.get("/me", authenticateToken, getCurrentUser);
router.put("/update-password", authenticateToken, updatePassword);
router.post("/signout", authenticateToken, signOut);

export default router;