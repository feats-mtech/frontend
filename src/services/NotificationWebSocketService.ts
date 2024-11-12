import { Notification } from 'src/types/Notification';
import { getNotifications, markAsRead, markAllAsRead } from 'src/dao/notificationDao';

class NotificationWebSocketService {
    private webSocket: WebSocket | null = null;
    private onMessageCallback: (notification: Notification) => void;
    private onUnreadCountUpdateCallback: (unreadCount: number) => void;

    constructor(
        onMessageCallback: (notification: Notification) => void,
        onUnreadCountUpdateCallback: (unreadCount: number) => void
    ) {
        this.onMessageCallback = onMessageCallback;
        this.onUnreadCountUpdateCallback = onUnreadCountUpdateCallback;
    }

    connect(userId: number) {
        this.webSocket = new WebSocket(`ws://localhost:3030?userId=${userId}`);

        this.webSocket.addEventListener('open', this.handleWebSocketOpen);
        this.webSocket.addEventListener('message', this.handleWebSocketMessage);
        this.webSocket.addEventListener('error', this.handleWebSocketError);
        this.webSocket.addEventListener('close', this.handleWebSocketClose);
    }

    disconnect() {
        if (this.webSocket) {
            this.webSocket.removeEventListener('open', this.handleWebSocketOpen);
            this.webSocket.removeEventListener('message', this.handleWebSocketMessage);
            this.webSocket.removeEventListener('error', this.handleWebSocketError);
            this.webSocket.removeEventListener('close', this.handleWebSocketClose);
            this.webSocket.close();
            this.webSocket = null;
        }
    }

    sendMarkAsReadMessage(notificationId: number) {
        if (this.webSocket) {
            this.webSocket.send(JSON.stringify({ type: 'markAsRead', notificationId }));
        }
    }

    sendMarkAllAsReadMessage() {
        // 发送标记所有为已读的消息到 WebSocket 服务器
        if (this.webSocket) {
            this.webSocket.send(JSON.stringify({ type: 'markAllAsRead' }));
        }
    }

    private handleWebSocketOpen = () => {
        console.log('WebSocket connection established');
    };

    private handleWebSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
            const notification: Notification = data.payload;
            this.onMessageCallback(notification);
            this.onUnreadCountUpdateCallback(data.unreadCount);
        }
    };

    private handleWebSocketError = (event: Event) => {
        console.error('WebSocket error:', event);
    };

    private handleWebSocketClose = (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
    };
}

export default NotificationWebSocketService;
