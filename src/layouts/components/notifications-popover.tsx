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

const NotificationsPopover: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const result = await getNotifications(user.id, 5);
    if (result.success && result.data) {
      setNotifications(result.data);
    } else {
      setError('Failed to load notifications. Please try again later.');
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
    const result = await markAsRead(notificationId, user.id);
    if (result.success) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setError('Failed to mark notification as read. Please try again.');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const result = await markAllAsRead(user.id);
    if (result.success) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setError('Failed to mark all notifications as read. Please try again.');
    }
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color={anchorEl ? 'primary' : 'default'} onClick={handleOpenPopover}>
        <Badge badgeContent={unreadCount} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} height={24} />
        </Badge>
      </IconButton>
      <Popover
        open={open}
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
        <Box sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
          <Box
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0} size="small">
              Mark all as read
            </Button>
          </Box>
          {loading && <Typography sx={{ p: 2 }}>Loading notifications...</Typography>}
          {error && <Typography sx={{ p: 2, color: 'error.main' }}>{error}</Typography>}
          {!loading && !error && (
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.isRead ? 'background.default' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.content}
                        </Typography>
                        <Typography component="p" variant="caption" color="text.secondary">
                          {new Date(notification.createDateTime).toLocaleString()}
                        </Typography>
                        {!notification.isRead && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            size="small"
                            sx={{ mt: 1 }}
                          >
                            Mark as read
                          </Button>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export { NotificationsPopover };
