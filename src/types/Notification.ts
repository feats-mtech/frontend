export interface Notification {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createDateTime: string;
}
