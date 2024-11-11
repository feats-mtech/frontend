import { Notification } from '../../src/types/Notification';

export const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    title: 'Ingredient Expiring Soon',
    content: 'Your apple will expire in 2 days',
    type: 'WARNING',
    isRead: false,
    createDateTime: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
  },
  {
    id: 2,
    userId: 1,
    title: 'Welcome',
    content: 'Welcome to the system!',
    type: 'INFO',
    isRead: true,
    createDateTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: 3,
    userId: 1,
    title: 'System Update',
    content: 'System will be under maintenance',
    type: 'INFO',
    isRead: false,
    createDateTime: new Date(new Date().setMinutes(new Date().getMinutes() - 30)).toISOString(),
  },
];