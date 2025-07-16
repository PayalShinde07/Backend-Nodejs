"use strict";
// src/controllers/authControllers.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.updatePassword = exports.getCurrentUser = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Token generator
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const options = {
        expiresIn: expiresIn
    };
    return jsonwebtoken_1.default.sign({ userId }, secret, options);
};
// SIGN UP
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role = "user" } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }
        const existingUser = yield userModel_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(409).json({ success: false, message: "User already exists" });
            return;
        }
        const newUser = yield userModel_1.default.create({ username, email, password, role });
        const token = generateToken(newUser._id.toString());
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: newUser,
                token
            }
        });
    }
    catch (error) {
        console.error("Error in signUp:", error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ success: false, message: "Validation error", errors });
        }
        else if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            res.status(409).json({ success: false, message: `Duplicate field: ${field}` });
        }
        else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
});
exports.signUp = signUp;
// SIGN IN
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: "Invalid credentials or inactive account" });
            return;
        }
        const isPasswordValid = yield user.comparePassword(password);
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
    }
    catch (error) {
        console.error("Error in signIn:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.signIn = signIn;
// GET CURRENT USER
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
    }
    res.status(200).json({
        success: true,
        data: { user }
    });
});
exports.getCurrentUser = getCurrentUser;
// UPDATE PASSWORD
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: "Current and new password are required" });
            return;
        }
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("+password");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const isValid = yield user.comparePassword(currentPassword);
        if (!isValid) {
            res.status(401).json({ success: false, message: "Incorrect current password" });
            return;
        }
        user.password = newPassword;
        yield user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error in updatePassword:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.updatePassword = updatePassword;
// SIGN OUT
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optional: Blacklist JWT here if needed
        res.status(200).json({ success: true, message: "Signed out successfully" });
    }
    catch (error) {
        console.error("Error in signOut:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.signOut = signOut;
