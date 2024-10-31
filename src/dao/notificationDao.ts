import axios from 'axios';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_NOTIFICATION_URL ||
  import.meta.env.VITE_BACKEND_NOTIFICATION_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_NOTIFICATION_PORT ||
  import.meta.env.VITE_BACKEND_NOTIFICATION_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;

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
    const response = await axios.get(`${backendUrl}/notification/get/${userId}`, {
      params: { limit },
    });
    return { success: true, data: response.data as Notification[] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUnreadCount = async (userId: number) => {
  try {
    const response = await axios.get(`${backendUrl}/notification/unread-count/${userId}`);
    return { success: true, data: response.data as number };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markAsRead = async (notificationId: number, userId: number) => {
  try {
    await axios.get(`${backendUrl}/notification/mark-read/${userId}/${notificationId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markAllAsRead = async (userId: number) => {
  try {
    await axios.get(`${backendUrl}/notification/mark-all-read/${userId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
