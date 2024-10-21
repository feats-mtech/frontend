import axios from 'axios';

const backendUrl = window.RUNTIME_CONFIG?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL;

export interface Notification {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createDateTime: string;
}

export const getNotifications = async (userId: number, limit: number = 5) => {
  try {
    const response = await axios.get(`${backendUrl}/notification`, {
      params: { userId, limit },
    });
    return { success: true, data: response.data as Notification[] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUnreadCount = async (userId: number) => {
  try {
    const response = await axios.get(`${backendUrl}/notification/unread-count`, {
      params: { userId },
    });
    return { success: true, data: response.data as number };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markAsRead = async (notificationId: number, userId: number) => {
  try {
    await axios.put(`${backendUrl}/notification/${notificationId}/mark-read`, null, {
      params: { userId },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markAllAsRead = async (userId: number) => {
  try {
    await axios.put(`${backendUrl}/notification/mark-all-read`, null, {
      params: { userId },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
