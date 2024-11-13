import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminView } from '../../src/sections/profile/view/admin-view';
import * as userDao from '../../src/dao/userDao';
import { AuthProvider } from '../../src/context/AuthContext';
import { mockCurrentUser, mockUsers, USER_ROLES, USER_STATUS } from '../utils/mockUsers';

// Mock the required modules
jest.mock('src/dao/userDao');
jest.mock('src/layouts/dashboard', () => ({
  DashboardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/context/AuthContext', () => ({
  ...jest.requireActual('src/context/AuthContext'),
  useAuth: () => ({
    user: mockCurrentUser,
    isAuthenticated: true,
  }),
}));

describe('AdminView Ban/Unban Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the admin view with user list', async () => {
    // Use existing mockUsers for test data
    const testUsers = mockUsers.filter((user) => user.role === USER_ROLES.USER);

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('active.user')).toBeInTheDocument();
      expect(screen.getByText('banned.user')).toBeInTheDocument();
    });
  });

  it('should display correct button text based on user status', async () => {
    const testUsers = mockUsers.filter((user) => user.role === USER_ROLES.USER);

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Ban');
      expect(buttons[1]).toHaveTextContent('Ban');
      expect(buttons[2]).toHaveTextContent('Unban');
    });
  });

  it('should call banUser when banning an active user', async () => {
    const testUsers = mockUsers.filter(
      (user) => user.status === USER_STATUS.ACTIVE && user.role === USER_ROLES.USER,
    );

    const activeUserId = testUsers.find((user) => user.name === 'active.user')?.id;

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);
    (userDao.banUser as jest.Mock).mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('active.user')).toBeInTheDocument();
    });

    const banButtons = screen.getAllByRole('button', { name: /ban/i });
    fireEvent.click(banButtons[1]);

    await waitFor(() => {
      expect(userDao.banUser).toHaveBeenCalledWith(activeUserId);
      expect(userDao.getAllUsers).toHaveBeenCalledTimes(2);
    });
  });

  it('should call unbanUser when unbanning a banned user', async () => {
    const testUsers = mockUsers.filter(
      (user) => user.status === USER_STATUS.BANNED && user.role === USER_ROLES.USER,
    );

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);
    (userDao.unbanUser as jest.Mock).mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('banned.user')).toBeInTheDocument();
    });

    const unbanButton = screen.getByRole('button', { name: /unban/i });
    fireEvent.click(unbanButton);

    await waitFor(() => {
      expect(userDao.unbanUser).toHaveBeenCalledWith(4); // Replace 4 with the ID of 'banned.user'
      expect(userDao.getAllUsers).toHaveBeenCalledTimes(2);
    });
  });

  it('should not display admin users in the list', async () => {
    const testUsers = mockUsers.filter((user) => user.role !== USER_ROLES.ADMIN);

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('should filter out current user from the list', async () => {
    const testUsers = mockUsers.filter((user) => user.id !== mockCurrentUser.id);

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });
});
