import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminView } from '../../src/sections/profile/view/admin-view';
import * as userDao from '../../src/dao/userDao';
import { AuthProvider } from '../../src/context/AuthContext';
import { mockCurrentUser, USER_ROLES } from '../utils/mockUsers';

// Define user status according to the component's implementation
const USER_STATUS = {
  BANNED: 0,
  ACTIVE: 1,
} as const;

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
    // Prepare test users with both active and banned status
    const testUsers = [
      {
        id: 2,
        name: 'active.user',
        displayName: 'Active User',
        email: 'active@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.USER,
      },
      {
        id: 3,
        name: 'banned.user',
        displayName: 'Banned User',
        email: 'banned@example.com',
        status: USER_STATUS.BANNED,
        role: USER_ROLES.USER,
      },
    ];

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
    // Set up test users with different statuses to verify button text
    const testUsers = [
      {
        id: 2,
        name: 'active.user',
        displayName: 'Active User',
        email: 'active@example.com',
        status: USER_STATUS.ACTIVE, // status: 1
        role: USER_ROLES.USER,
      },
      {
        id: 3,
        name: 'banned.user',
        displayName: 'Banned User',
        email: 'banned@example.com',
        status: USER_STATUS.BANNED, // status: 0
        role: USER_ROLES.USER,
      },
    ];

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Ban');
      expect(buttons[1]).toHaveTextContent('Unban');
    });
  });

  it('should call banUser when banning an active user', async () => {
    // Set up a single active user for testing ban functionality
    const testUsers = [
      {
        id: 2,
        name: 'active.user',
        displayName: 'Active User',
        email: 'active@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.USER,
      },
    ];

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

    const banButton = screen.getByRole('button', { name: /ban/i });
    fireEvent.click(banButton);

    await waitFor(() => {
      // Verify the ban API was called and users were refreshed
      expect(userDao.banUser).toHaveBeenCalledWith(2);
      expect(userDao.getAllUsers).toHaveBeenCalledTimes(2);
    });
  });

  it('should call unbanUser when unbanning a banned user', async () => {
    // Set up a single banned user for testing unban functionality
    const testUsers = [
      {
        id: 3,
        name: 'banned.user',
        displayName: 'Banned User',
        email: 'banned@example.com',
        status: USER_STATUS.BANNED,
        role: USER_ROLES.USER,
      },
    ];

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
      // Verify the unban API was called and users were refreshed
      expect(userDao.unbanUser).toHaveBeenCalledWith(3);
      expect(userDao.getAllUsers).toHaveBeenCalledTimes(2);
    });
  });

  it('should not display admin users in the list', async () => {
    // Set up test users including an admin user
    const testUsers = [
      {
        id: 1,
        name: 'admin',
        displayName: 'Admin User',
        email: 'admin@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.ADMIN,
      },
      {
        id: 2,
        name: 'user',
        displayName: 'Regular User',
        email: 'user@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.USER,
      },
    ];

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      // Verify admin user is filtered out and regular user is displayed
      expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });
  });

  it('should handle errors when banning a user', async () => {
    // Setup initial test data
    const testUsers = [
      {
        id: 2,
        name: 'active.user',
        displayName: 'Active User',
        email: 'active@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.USER,
      },
    ];

    // Setup mocks
    (userDao.getAllUsers as jest.Mock).mockResolvedValueOnce(testUsers);
    (userDao.banUser as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Failed to ban user',
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Render component
    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('active.user')).toBeInTheDocument();
    });

    // Trigger ban action
    const banButton = screen.getByRole('button', { name: /ban/i });
    fireEvent.click(banButton);

    // Verify the users list was refreshed
    await waitFor(() => {
      expect(userDao.getAllUsers).toHaveBeenCalledTimes(2);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should filter out current user from the list', async () => {
    // Set up test users including the current user
    const testUsers = [
      {
        id: mockCurrentUser.id,
        name: 'current.user',
        displayName: 'Current User',
        email: 'current@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.USER,
      },
      {
        id: 2,
        name: 'other.user',
        displayName: 'Other User',
        email: 'other@example.com',
        status: USER_STATUS.ACTIVE,
        role: USER_ROLES.USER,
      },
    ];

    (userDao.getAllUsers as jest.Mock).mockResolvedValue(testUsers);

    render(
      <AuthProvider>
        <AdminView />
      </AuthProvider>,
    );

    await waitFor(() => {
      // Verify current user is filtered out and other user is displayed
      expect(screen.queryByText('current@example.com')).not.toBeInTheDocument();
      expect(screen.getByText('other@example.com')).toBeInTheDocument();
    });
  });
});
