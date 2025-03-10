import { useState, useEffect } from 'react';
import { useAuth } from 'src/context/AuthContext';

import { Notification } from 'src/types/Notification';

import notificationWebSocketDao from 'src/dao/notificationWebSocket';

import { NotificationsDisplay } from './notifications-display';
import {
  // markAsRead,
  markAllAsRead,
  getNotifications,
  getUnreadCount,
} from 'src/dao/notificationDao';
interface NotificationsWebSocketProps {
  enabled: boolean;
}
const NotificationsWebSocket = (props: NotificationsWebSocketProps) => {
  const { enabled } = props;
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [websocketReply, setWebsocketReply] = useState<any>(null);
  const [webSocketService, setWebSocketService] = useState<notificationWebSocketDao | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (user && isAuthenticated) {
      //set the inital values
      fetchUnreadCount();
      fetchNotifications();
      connectWebSocket();
    }
  }, []);

  const connectWebSocket = () => {
    if (!enabled) {
      return;
    }
    if (user && webSocketService === null) {
      const service = new notificationWebSocketDao(setWebsocketReply);
      setWebSocketService(service);
      service.connect(user.id);
    }
  };

  useEffect(() => {
    if (websocketReply == null) {
      return;
    }
    const action = websocketReply.action;
    const notification: Notification = websocketReply.payload as Notification;
    const allNotifications = [...notifications];
    if (action === 'create') {
      const notificationItems = allNotifications.filter(
        (existingItem) => notification.id === existingItem.id,
      );
      if (notificationItems.length === 0) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        return;
      }
    } else if (action === 'markAsRead') {
      const notificationItems = allNotifications.find(
        (existingItem) => notification.id === existingItem.id,
      );
      (notificationItems as any)['isRead'] = true;
      setUnreadCount((prev) => prev - 1);
    } else if (action === 'markAllAsRead') {
      setUnreadCount(0);
      allNotifications.map((item) => (item.isRead = true));
    }
    setNotifications(allNotifications);
  }, [websocketReply]);

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

  const handleMarkAsRead = async (notificationId: number) => {
    if (!enabled) {
      return;
    }
    if (!user) return;
    try {
      // const result = await markAsRead(notificationId, user.id);
      //dont need to update, the above function should call backend and update the notification, which will then trigger a websocket message to me...
      //   if (result.success && webSocketService) {
      //     webSocketService.sendMarkAsReadMessage(notificationId);
      //   }
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
      //   if (result.success && webSocketService) {
      // webSocketService.sendMarkAllAsReadMessage();
      //   }
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
export { NotificationsWebSocket };
