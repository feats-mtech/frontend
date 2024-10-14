export interface User {
  id: number;
  name: string;
  displayName: string;
  email: string;
  status: number;
  role: number;
}

export interface UserFormDetails {
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  email: string;
}
