// Student interface for type safety
export interface MyStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  grade: string;
  course: string;
  phoneNumber: string;
  enrollmentNumber: number;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  subjects: string[];
  cgpa: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Partial type for updates
export type StudentUpdate = Partial<MyStudent>;

// Type for search filters
export interface StudentFilters {
  course?: string;
  grade?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Type for pagination response
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStudents: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  pagination?: PaginationInfo;
}

// Search query type
export interface SearchQuery {
  query: string;
  page?: number;
  limit?: number;
}