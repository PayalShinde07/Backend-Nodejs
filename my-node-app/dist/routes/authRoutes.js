"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
//  Public Routes
router.post('/signup', authControllers_1.signUp);
router.post('/signin', authControllers_1.signIn);
//  Protected Routes
router.use(authMiddleware_1.authenticateToken);
router.get('/me', authControllers_1.getCurrentUser);
router.put('/update-password', authControllers_1.updatePassword);
router.post('/signout', authControllers_1.signOut);
exports.default = router;
