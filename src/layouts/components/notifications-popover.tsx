import { useState, useEffect } from 'react';
import { useAuth } from 'src/context/AuthContext';

import { Notification } from 'src/types/Notification';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from 'src/dao/notificationDao';
import { NotificationsDisplay } from './notifications-display';
interface NotificationsPopoverProps {
  enabled: boolean;
}
const NotificationsPopover = (props: NotificationsPopoverProps) => {
  const { enabled } = props;
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchNotifications();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    if (!enabled) {
      return;
    }
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getNotifications(user.id, 5);
      if (result.success && result.data) {
        setNotifications(result.data);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      setError('Error loading notifications');
    }
    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    if (!enabled) {
      return;
    }
    if (!user) return;
    const result = await getUnreadCount(user.id);
    if (result.success && result.data) {
      setUnreadCount(result.data);
    } else {
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (!enabled) {
      return;
    }
    if (!user) return;
    try {
      const result = await markAsRead(notificationId, user.id);
      if (result.success) {
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      }
    } catch (err) {
      setError('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!enabled) {
      return;
    }
    if (!user) return;
    try {
      const result = await markAllAsRead(user.id);
      if (result.success) {
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      }
    } catch (err) {
      setError('Failed to mark all as read');
    }
  };

  return (
    <NotificationsDisplay
      notifications={notifications}
      handleMarkAsRead={handleMarkAsRead}
      handleMarkAllAsRead={handleMarkAllAsRead}
      loading={loading}
      error={error}
      unreadCount={unreadCount}
    />
  );
};

export { NotificationsPopover };
