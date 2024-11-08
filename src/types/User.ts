export interface User {
  id: number;
  name: string;
  displayName: string;
  email: string;
  status: number;
  role: number;
  isBanned?: boolean; // TODO: remove optional when implemented in backend
}

export interface UserFormDetails {
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  email: string;
}
