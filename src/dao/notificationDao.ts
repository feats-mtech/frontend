import axios from 'axios';
import { Notification } from 'src/types/Notification';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_NOTIFICATION_URL ||
  import.meta.env.VITE_BACKEND_NOTIFICATION_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_NOTIFICATION_PORT ||
  import.meta.env.VITE_BACKEND_NOTIFICATION_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;

export const getNotifications = async (userId: number, limit: number = 5) => {
  try {
    const response = await axios.get(`${backendUrl}/notification/${userId}`, {
      params: { limit },
    });
    return { success: true, data: response.data as Notification[] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUnreadCount = async (userId: number) => {
  try {
    const response = await axios.get(`${backendUrl}/notification/${userId}/unread-count`);
    return { success: true, data: response.data as number };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createNotification = async (
  userId: number,
  notification: Omit<Notification, 'id' | 'userId' | 'createDateTime' | 'isRead'>,
) => {
  try {
    const response = await axios.post(`${backendUrl}/notification/${userId}/create`, notification);
    return { success: true, data: response.data };
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
    await axios.put(`${backendUrl}/notification/${userId}/mark-all-read`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
