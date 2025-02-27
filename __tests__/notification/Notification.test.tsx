import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';

import * as useAuth from '../../src/context/AuthContext';
import { act, render, screen, waitFor } from '@testing-library/react';
import { NotificationsPopover } from '../../src/layouts/components/notifications-popover';
import { mockNotifications } from '../utils/mockNotifications';

// Mock the notification dao functions
jest.mock('../../src/dao/notificationDao', () => ({
  getNotifications: jest.fn(),
  getUnreadCount: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
}));

const notificationDao = require('../../src/dao/notificationDao');

jest.setTimeout(60 * 1000); // 1 minute

describe('NotificationsPopover', () => {
  // mock auth context
  beforeEach(() => {
    jest.spyOn(useAuth, 'useAuth').mockImplementation(() => ({
      isAuthenticated: true,
      user: {
        id: 1,
        name: 'testuser',
        displayName: 'Test User',
        email: 'test@email.com',
        status: 1,
        role: 1,
      },
      loginUser: jest.fn(),
      getLoginUserDetails: jest.fn(),
      loginUserByGoogle: jest.fn(),
      logoutUser: jest.fn(),
      refreshJwt: jest.fn(),
    }));

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    const { unmount } = render(<NotificationsPopover enabled={true} />);
    unmount();
  });

  it('renders NotificationsPopover component', async () => {
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 2 });

    render(<NotificationsPopover enabled />);

    // Check if the notification bell icon is rendered
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays notifications when bell icon is clicked', async () => {
    // Mock the API responses
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 2 });
    notificationDao.getNotifications.mockResolvedValue({ success: true, data: mockNotifications });

    render(<NotificationsPopover enabled />);

    // Click the notification bell
    const bellIcon = screen.getByRole('button');
    await userEvent.click(bellIcon);

    // Check if notifications are displayed
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Ingredient Expiring Soon')).toBeInTheDocument();
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('System Update')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching notifications', async () => {
    // Mock a delayed API response
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 0 });
    notificationDao.getNotifications.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<NotificationsPopover enabled />);
    jest.advanceTimersByTime(60000); // Simulate time passing

    // Click the notification bell
    const bellIcon = screen.getByRole('button');
    await userEvent.click(bellIcon);

    // Check if loading message is displayed
    expect(screen.getByText(/Loading notifications/i)).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    // Mock failed API responses
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 0 });
    notificationDao.getNotifications.mockResolvedValue({
      success: false,
      error: 'Failed to load notifications',
    });

    render(<NotificationsPopover enabled />);
    jest.advanceTimersByTime(60000); // Simulate time passing

    // Click the notification bell
    const bellIcon = screen.getByRole('button');
    act(() => {
      userEvent.click(bellIcon);
    });

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
    });
  });

  it('marks notification as read when clicking mark as read button', async () => {
    // Mock API responses
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 2 });
    notificationDao.getNotifications.mockResolvedValue({ success: true, data: mockNotifications });
    notificationDao.markAsRead.mockResolvedValue({ success: true });

    render(<NotificationsPopover enabled />);

    // Click the notification bell
    const bellIcon = screen.getByRole('button');
    await userEvent.click(bellIcon);

    // Find and click the first "Mark as read" button
    const markAsReadButtons = await screen.findAllByText('Mark as read');
    await userEvent.click(markAsReadButtons[0]);

    // Verify that markAsRead was called with correct parameters
    await waitFor(() => {
      expect(notificationDao.markAsRead).toHaveBeenCalledWith(mockNotifications[0].id, 1);
    });
  });

  it('marks all notifications as read when clicking mark all as read button', async () => {
    // Mock API responses
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 2 });
    notificationDao.getNotifications.mockResolvedValue({ success: true, data: mockNotifications });
    notificationDao.markAllAsRead.mockResolvedValue({ success: true });

    render(<NotificationsPopover enabled />);

    // Click the notification bell
    const bellIcon = screen.getByRole('button');
    await userEvent.click(bellIcon);

    // Find and click "Mark all as read" button
    const markAllAsReadButton = screen.getByText('Mark all as read');
    await userEvent.click(markAllAsReadButton);

    // Verify that markAllAsRead was called with correct parameters
    await waitFor(() => {
      expect(notificationDao.markAllAsRead).toHaveBeenCalledWith(1);
    });
  });

  it('shows no notifications message when there are no notifications', async () => {
    // Mock empty notifications response
    notificationDao.getUnreadCount.mockResolvedValue({ success: true, data: 0 });
    notificationDao.getNotifications.mockResolvedValue({ success: true, data: [] });

    render(<NotificationsPopover enabled />);

    // Click the notification bell
    const bellIcon = screen.getByRole('button');
    act(() => {
      userEvent.click(bellIcon);
    });

    // Check if "No notifications" message is displayed
    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });
  });
});
