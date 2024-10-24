import React, { useState, useEffect } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { Icon as Iconify } from '@iconify/react';
import {
  Notification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from 'src/dao/notificationDao';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { formatTime } from 'src/utils/format-time';

const NotificationsPopover: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (anchorEl) {
          fetchNotifications();
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
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
    if (!user) return;
    const result = await getUnreadCount(user.id);
    if (result.success && result.data) {
      setUnreadCount(result.data);
    } else {
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
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

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color={anchorEl ? 'primary' : 'default'} onClick={handleOpenPopover}>
        <Badge badgeContent={unreadCount} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} height={24} />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0} size="small">
              Mark all as read
            </Button>
          </Box>
          {loading && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Loading notifications...</Typography>
            </Box>
          )}
          {error && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          {!loading && !error && notifications.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="solar:bell-off-bold"
                style={{
                  width: 40,
                  height: 40,
                  color: 'rgba(145, 158, 171, 0.8)', // 对应 text.secondary 的颜色
                  marginBottom: 16, // 对应 mb: 2
                }}
              />
              <Typography variant="subtitle1" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          )}

          <List disablePadding>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <ListItemIcon sx={{ mt: 0.5 }}>
                  <Iconify icon="mdi:information" color="primary.main" width={24} />
                </ListItemIcon>

                <ListItemText
                  primary={notification.title}
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          whiteSpace: 'pre-wrap',
                          mb: 0.5,
                        }}
                      >
                        {notification.content}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {formatTime(notification.createDateTime)}
                      </Typography>

                      {!notification.isRead && (
                        <Button
                          size="small"
                          sx={{ mt: 0.5 }}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </Box>
                  }
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    sx: { mb: 0.5 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export { NotificationsPopover };
