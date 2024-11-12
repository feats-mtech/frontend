// Constants for user status and roles
export const USER_STATUS = {
  ACTIVE: 1,
  BANNED: 0,
} as const;

export const USER_ROLES = {
  ADMIN: 1,
  USER: 2,
} as const;

export const mockUsers = [
  {
    id: 1,
    name: 'admin',
    displayName: 'Admin User',
    email: 'admin@example.com',
    status: USER_STATUS.ACTIVE,
    role: USER_ROLES.ADMIN,
    isBanned: false,
  },
  {
    id: 2,
    name: 'john.doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    status: USER_STATUS.ACTIVE,
    role: USER_ROLES.USER,
    isBanned: false,
  },
  {
    id: 3,
    name: 'banned.user',
    displayName: 'Banned User',
    email: 'banned@example.com',
    status: USER_STATUS.BANNED,
    role: USER_ROLES.USER,
    isBanned: true,
  },
];

// Mock currently logged in user
export const mockCurrentUser = mockUsers[0];

// Mock user form details
export const mockUserFormDetails = {
  username: 'new.user',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  displayName: 'New User',
  email: 'new.user@example.com',
};

// Mock auth context value
export const mockAuthContextValue = {
  user: mockCurrentUser,
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  isAuthenticated: true,
};
