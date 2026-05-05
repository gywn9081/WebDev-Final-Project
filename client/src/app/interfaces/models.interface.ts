// User interface
export interface User {
  _id: string;
  username: string;
  email: string;
  friends?: User[];
}

// Auth response from login/register
export interface AuthResponse {
  token: string;
  user: User;
}

// Schedule entry interface
export interface Schedule {
  _id?: string;
  userId: string;
  courseName: string;
  courseCode: string;
  days: string[];
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Schedule form input (no _id or userId, used when creating)
export interface ScheduleForm {
  courseName: string;
  courseCode: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

// Comparison result interface
export interface CompareResult {
  sharedClasses: SharedClass[];
  conflicts: Conflict[];
  userScheduleCount: number;
  friendScheduleCount: number;
}

export interface SharedClass {
  courseName: string;
  courseCode: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface Conflict {
  day: string;
  userCourse: string;
  friendCourse: string;
  userTime: string;
  friendTime: string;
}

// Login form
export interface LoginForm {
  email: string;
  password: string;
}

// Register form
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}
