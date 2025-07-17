"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.validateStudentIdParam = exports.validateObjectId = exports.validateGetAllStudents = exports.validateSearch = exports.validateStudentUpdate = exports.validateStudent = void 0;
// Validation utility functions
const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const isValidStudentId = (studentId) => {
    const studentIdRegex = /^[A-Z0-9]+$/;
    return studentIdRegex.test(studentId);
};
const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
};
const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return phoneRegex.test(phone);
};
const isValidGrade = (grade) => {
    const validGrades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
    return validGrades.includes(grade);
};
// Student validation middleware
const validateStudent = (req, res, next) => {
    const errors = [];
    const { studentId, firstName, lastName, email, age, grade, course, phoneNumber, enrollmentNumber, address, subjects, cgpa, isActive } = req.body;
    // Student ID validation
    if (!studentId) {
        errors.push({ field: 'studentId', message: 'Student ID is required' });
    }
    else if (typeof studentId !== 'string' || studentId.length < 3 || studentId.length > 20) {
        errors.push({ field: 'studentId', message: 'Student ID must be between 3 and 20 characters' });
    }
    else if (!isValidStudentId(studentId)) {
        errors.push({ field: 'studentId', message: 'Student ID must contain only uppercase letters and numbers' });
    }
    // First name validation
    if (!firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
    }
    else if (typeof firstName !== 'string' || firstName.length < 2 || firstName.length > 50) {
        errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
    }
    else if (!isValidName(firstName)) {
        errors.push({ field: 'firstName', message: 'First name must contain only letters and spaces' });
    }
    // Last name validation
    if (!lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
    }
    else if (typeof lastName !== 'string' || lastName.length < 2 || lastName.length > 50) {
        errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
    }
    else if (!isValidName(lastName)) {
        errors.push({ field: 'lastName', message: 'Last name must contain only letters and spaces' });
    }
    // Email validation
    if (!email) {
        errors.push({ field: 'email', message: 'Email is required' });
    }
    else if (!isEmail(email)) {
        errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }
    // Age validation
    if (age !== undefined) {
        if (typeof age !== 'number' || age < 16 || age > 100) {
            errors.push({ field: 'age', message: 'Age must be between 16 and 100' });
        }
    }
    // Grade validation
    if (grade !== undefined) {
        if (!isValidGrade(grade)) {
            errors.push({ field: 'grade', message: 'Grade must be one of: A+, A, B+, B, C+, C, D, F' });
        }
    }
    // Course validation
    if (!course) {
        errors.push({ field: 'course', message: 'Course is required' });
    }
    else if (typeof course !== 'string' || course.length < 2 || course.length > 100) {
        errors.push({ field: 'course', message: 'Course name must be between 2 and 100 characters' });
    }
    // Phone number validation
    if (phoneNumber !== undefined) {
        if (!isValidPhoneNumber(phoneNumber)) {
            errors.push({ field: 'phoneNumber', message: 'Please provide a valid phone number' });
        }
    }
    // Enrollment number validation
    if (enrollmentNumber !== undefined) {
        if (typeof enrollmentNumber !== 'number' || enrollmentNumber < 1) {
            errors.push({ field: 'enrollmentNumber', message: 'Enrollment number must be a positive integer' });
        }
    }
    // Address validation
    if (address !== undefined) {
        if (typeof address !== 'object' || address === null || Array.isArray(address)) {
            errors.push({ field: 'address', message: 'Address must be an object' });
        }
    }
    // Subjects validation
    if (!subjects) {
        errors.push({ field: 'subjects', message: 'At least one subject is required' });
    }
    else if (!Array.isArray(subjects) || subjects.length === 0) {
        errors.push({ field: 'subjects', message: 'At least one subject is required' });
    }
    else {
        subjects.forEach((subject, index) => {
            if (typeof subject !== 'string') {
                errors.push({ field: `subjects[${index}]`, message: 'Each subject must be a string' });
            }
        });
    }
    // CGPA validation
    if (cgpa !== undefined) {
        if (typeof cgpa !== 'number' || cgpa < 0 || cgpa > 10) {
            errors.push({ field: 'cgpa', message: 'CGPA must be between 0 and 10' });
        }
    }
    // isActive validation
    if (isActive !== undefined) {
        if (typeof isActive !== 'boolean') {
            errors.push({ field: 'isActive', message: 'isActive must be a boolean' });
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};
exports.validateStudent = validateStudent;
// Student update validation (all fields optional)
const validateStudentUpdate = (req, res, next) => {
    const errors = [];
    const { studentId, firstName, lastName, email, age, grade, course, phoneNumber, enrollmentNumber, address, subjects, cgpa, isActive } = req.body;
    // Student ID validation (optional)
    if (studentId !== undefined) {
        if (typeof studentId !== 'string' || studentId.length < 3 || studentId.length > 20) {
            errors.push({ field: 'studentId', message: 'Student ID must be between 3 and 20 characters' });
        }
        else if (!isValidStudentId(studentId)) {
            errors.push({ field: 'studentId', message: 'Student ID must contain only uppercase letters and numbers' });
        }
    }
    // First name validation (optional)
    if (firstName !== undefined) {
        if (typeof firstName !== 'string' || firstName.length < 2 || firstName.length > 50) {
            errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
        }
        else if (!isValidName(firstName)) {
            errors.push({ field: 'firstName', message: 'First name must contain only letters and spaces' });
        }
    }
    // Last name validation (optional)
    if (lastName !== undefined) {
        if (typeof lastName !== 'string' || lastName.length < 2 || lastName.length > 50) {
            errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
        }
        else if (!isValidName(lastName)) {
            errors.push({ field: 'lastName', message: 'Last name must contain only letters and spaces' });
        }
    }
    // Email validation (optional)
    if (email !== undefined) {
        if (!isEmail(email)) {
            errors.push({ field: 'email', message: 'Please provide a valid email address' });
        }
    }
    // Age validation (optional)
    if (age !== undefined) {
        if (typeof age !== 'number' || age < 16 || age > 100) {
            errors.push({ field: 'age', message: 'Age must be between 16 and 100' });
        }
    }
    // Grade validation (optional)
    if (grade !== undefined) {
        if (!isValidGrade(grade)) {
            errors.push({ field: 'grade', message: 'Grade must be one of: A+, A, B+, B, C+, C, D, F' });
        }
    }
    // Course validation (optional)
    if (course !== undefined) {
        if (typeof course !== 'string' || course.length < 2 || course.length > 100) {
            errors.push({ field: 'course', message: 'Course name must be between 2 and 100 characters' });
        }
    }
    // Phone number validation (optional)
    if (phoneNumber !== undefined) {
        if (!isValidPhoneNumber(phoneNumber)) {
            errors.push({ field: 'phoneNumber', message: 'Please provide a valid phone number' });
        }
    }
    // Enrollment number validation (optional)
    if (enrollmentNumber !== undefined) {
        if (typeof enrollmentNumber !== 'number' || enrollmentNumber < 1) {
            errors.push({ field: 'enrollmentNumber', message: 'Enrollment number must be a positive integer' });
        }
    }
    // Address validation (optional)
    if (address !== undefined) {
        if (typeof address !== 'object' || address === null || Array.isArray(address)) {
            errors.push({ field: 'address', message: 'Address must be an object' });
        }
    }
    // Subjects validation (optional)
    if (subjects !== undefined) {
        if (!Array.isArray(subjects) || subjects.length === 0) {
            errors.push({ field: 'subjects', message: 'At least one subject is required' });
        }
        else {
            subjects.forEach((subject, index) => {
                if (typeof subject !== 'string') {
                    errors.push({ field: `subjects[${index}]`, message: 'Each subject must be a string' });
                }
            });
        }
    }
    // CGPA validation (optional)
    if (cgpa !== undefined) {
        if (typeof cgpa !== 'number' || cgpa < 0 || cgpa > 10) {
            errors.push({ field: 'cgpa', message: 'CGPA must be between 0 and 10' });
        }
    }
    // isActive validation (optional)
    if (isActive !== undefined) {
        if (typeof isActive !== 'boolean') {
            errors.push({ field: 'isActive', message: 'isActive must be a boolean' });
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};
exports.validateStudentUpdate = validateStudentUpdate;
// Search validation
const validateSearch = (req, res, next) => {
    const errors = [];
    const { query, page, limit } = req.query;
    // Query validation
    if (!query) {
        errors.push({ field: 'query', message: 'Search query is required' });
    }
    else if (typeof query !== 'string' || query.length < 1 || query.length > 100) {
        errors.push({ field: 'query', message: 'Search query must be between 1 and 100 characters' });
    }
    // Page validation
    if (page !== undefined) {
        const pageNum = parseInt(page);
        if (isNaN(pageNum) || pageNum < 1) {
            errors.push({ field: 'page', message: 'Page must be a positive integer' });
        }
    }
    // Limit validation
    if (limit !== undefined) {
        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};
exports.validateSearch = validateSearch;
// Get all students validation
const validateGetAllStudents = (req, res, next) => {
    const errors = [];
    const { course, grade, isActive, page, limit } = req.query;
    // Course validation
    if (course !== undefined) {
        if (typeof course !== 'string' || course.length < 2 || course.length > 100) {
            errors.push({ field: 'course', message: 'Course name must be between 2 and 100 characters' });
        }
    }
    // Grade validation
    if (grade !== undefined) {
        if (!isValidGrade(grade)) {
            errors.push({ field: 'grade', message: 'Grade must be one of: A+, A, B+, B, C+, C, D, F' });
        }
    }
    // isActive validation
    if (isActive !== undefined) {
        if (isActive !== 'true' && isActive !== 'false') {
            errors.push({ field: 'isActive', message: 'isActive must be true or false' });
        }
    }
    // Page validation
    if (page !== undefined) {
        const pageNum = parseInt(page);
        if (isNaN(pageNum) || pageNum < 1) {
            errors.push({ field: 'page', message: 'Page must be a positive integer' });
        }
    }
    // Limit validation
    if (limit !== undefined) {
        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};
exports.validateGetAllStudents = validateGetAllStudents;
// ObjectId validation
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    next();
};
exports.validateObjectId = validateObjectId;
// Student ID parameter validation
const validateStudentIdParam = (req, res, next) => {
    const { studentId } = req.params;
    if (!studentId || studentId.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Student ID is required'
        });
    }
    if (!isValidStudentId(studentId)) {
        return res.status(400).json({
            success: false,
            message: 'Student ID must contain only uppercase letters and numbers'
        });
    }
    next();
};
exports.validateStudentIdParam = validateStudentIdParam;
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors
        });
    }
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry found'
        });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
