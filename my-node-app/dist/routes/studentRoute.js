"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const studentMiddleware_1 = require("../middleware/studentMiddleware");
const router = express_1.default.Router();
// GET routes - Order matters! More specific routes should come first
router.get("/search", studentMiddleware_1.validateSearch, studentControllers_1.searchStudents);
router.get("/student-id/:studentId", studentMiddleware_1.validateStudentIdParam, studentControllers_1.getStudentByStudentId);
router.get("/", studentMiddleware_1.validateGetAllStudents, studentControllers_1.getAllStudents);
router.get("/:id", studentMiddleware_1.validateObjectId, studentControllers_1.getStudentById);
// POST routes
router.post("/", studentMiddleware_1.validateStudent, studentControllers_1.createStudent);
// PUT routes
router.put("/:id", studentMiddleware_1.validateObjectId, studentMiddleware_1.validateStudentUpdate, studentControllers_1.updateStudent);
// DELETE routes
router.delete("/:id", studentMiddleware_1.validateObjectId, studentControllers_1.deleteStudent);
// PATCH routes for soft delete/restore
router.patch("/:id/deactivate", studentMiddleware_1.validateObjectId, studentControllers_1.softDeleteStudent);
router.patch("/:id/restore", studentMiddleware_1.validateObjectId, studentControllers_1.restoreStudent);
exports.default = router;
