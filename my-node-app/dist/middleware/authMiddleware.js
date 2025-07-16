"use strict";
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
exports.requireOwnershipOrAdmin = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
// ✅ Middleware: Authenticate JWT Token
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Access token is required" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const user = yield userModel_1.default.findById(decoded.userId);
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: user ? "Your account has been deactivated" : "User not found",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in authenticateToken:", error);
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ success: false, message: "Invalid token" });
        }
        else if (error.name === "TokenExpiredError") {
            res.status(401).json({ success: false, message: "Token has expired" });
        }
        else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
});
exports.authenticateToken = authenticateToken;
// ✅ Middleware: Allow only admin users
const requireAdmin = (req, res, next) => {
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
exports.requireAdmin = requireAdmin;
// ✅ Middleware: Allow admin or resource owner (by userId param/body)
const requireOwnershipOrAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
    }
    const resourceUserId = req.params.userId || req.body.userId;
    const currentUserId = req.user._id.toString();
    if (req.user.role === "admin" || currentUserId === resourceUserId) {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: "Access denied. You can only access your own resources.",
        });
    }
};
exports.requireOwnershipOrAdmin = requireOwnershipOrAdmin;
