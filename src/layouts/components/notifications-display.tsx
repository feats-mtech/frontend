import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { formatTime } from 'src/utils/format-time';
import { Notification } from 'src/types/Notification';
import { useState } from 'react';
import React from 'react';

interface notificationDisplayProps {
  notifications: Notification[];
  handleMarkAllAsRead: () => void;
  handleMarkAsRead: (id: number) => void;
  error: string | null;
  loading: boolean;
  unreadCount: number;
}

const NotificationsDisplay = (props: notificationDisplayProps) => {
  const { notifications, handleMarkAsRead, handleMarkAllAsRead, error, loading, unreadCount } =
    props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
                  primary={notification.id}
                  secondary={
                    // <Typography
                    //   variant="body2"
                    //   sx={{
                    //     color: 'text.primary',
                    //     whiteSpace: 'pre-wrap',
                    //     mb: 0.5,
                    //   }}
                    // >
                    //   {notification.content}
                    // </Typography>
                    <span>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.primary',
                          whiteSpace: 'pre-wrap',
                          mb: 0.5,
                        }}
                      >
                        {notification.content}
                      </Typography>
                      <br />

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
                    </span>
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

export { NotificationsDisplay };
