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
exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const studentModel_1 = __importDefault(require("../models/studentModel"));
//Create a new student
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get request body
        const studentData = req.body;
        //Create student
        const newStudent = yield studentModel_1.default.create(studentData);
        //return created student
        res.status(201).json(newStudent);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createStudent = createStudent;
//Get all students
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course, isActive } = req.query;
        const query = {};
        if (course) {
            query.course = course;
        }
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        const Students = yield studentModel_1.default.find(query);
        res.status(200).json(Students);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
});
exports.getAllStudents = getAllStudents;
//Get student by id
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, isActive } = req.query;
        const query = {};
        if (typeof id === 'string' && id.trim() !== '') {
            query.id = id;
        }
        if (isActive !== undefined) {
            query.inStock = isActive === 'true';
        }
        const Students = yield studentModel_1.default.find(query);
        res.status(200).json(Students);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
});
exports.getStudentById = getStudentById;
