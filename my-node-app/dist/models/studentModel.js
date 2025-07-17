"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Address subdocument schema
const addressSchema = new mongoose_1.Schema({
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
}, { _id: false });
// Main student schema
const studentSchema = new mongoose_1.Schema({
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [3, 'Student ID must be at least 3 characters long'],
        maxlength: [20, 'Student ID cannot exceed 20 characters']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email address'
        ]
    },
    age: {
        type: String,
        required: [true, 'Age is required'],
        min: [16, 'Age must be at least 16'],
        max: [100, 'Age cannot exceed 100']
    },
    grade: {
        type: String,
        required: [true, 'Grade is required'],
        enum: {
            values: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
            message: 'Grade must be one of: A+, A, B+, B, C+, C, D, F'
        }
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true,
        minlength: [2, 'Course name must be at least 2 characters long'],
        maxlength: [100, 'Course name cannot exceed 100 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [
            /^(\+\d{1,3}[- ]?)?\d{10}$/,
            'Please enter a valid phone number'
        ]
    },
    enrollmentNumber: {
        type: Number,
        required: [true, 'Enrollment number is required'],
        unique: true,
        min: [1, 'Enrollment number must be positive']
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required']
    },
    subjects: {
        type: [String],
        required: [true, 'At least one subject is required'],
        validate: {
            validator: function (subjects) {
                return subjects.length > 0;
            },
            message: 'At least one subject must be provided'
        }
    },
    cgpa: {
        type: Number,
        required: [true, 'CGPA is required'],
        min: [0, 'CGPA cannot be negative'],
        max: [10, 'CGPA cannot exceed 10'],
        validate: {
            validator: function (cgpa) {
                return Number.isFinite(cgpa) && cgpa >= 0 && cgpa <= 10;
            },
            message: 'CGPA must be a valid number between 0 and 10'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});
// Indexes for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ grade: 1 });
studentSchema.index({ isActive: 1 });
studentSchema.index({ createdAt: -1 });
// Compound indexes for common queries
studentSchema.index({ course: 1, grade: 1 });
studentSchema.index({ isActive: 1, createdAt: -1 });
// Virtual for full name
studentSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Pre-save middleware to validate email domain (optional)
studentSchema.pre('save', function (next) {
    // You can add custom validation logic here
    if (this.subjects.length === 0) {
        next(new Error('At least one subject is required'));
    }
    else {
        next();
    }
});
// Static method to find active students
studentSchema.statics.findActiveStudents = function () {
    return this.find({ isActive: true });
};
// Instance method to deactivate student
studentSchema.methods.deactivate = function () {
    this.isActive = false;
    return this.save();
};
// Instance method to activate student
studentSchema.methods.activate = function () {
    this.isActive = true;
    return this.save();
};
// Export the model
const Student = mongoose_1.default.model("Student", studentSchema);
exports.default = Student;
