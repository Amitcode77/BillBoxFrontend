export interface User {
  _id?: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  role: 'admin' | 'manager' | 'staff';
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserApiResponse {
  success: boolean;
  data: User;
}

export interface UsersApiResponse {
  success: boolean;
  data: User[];
} 