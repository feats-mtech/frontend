type NotificationCallback = (notification: any) => void;

export class NotificationService {
    private ws: WebSocket | null = null;
    private callbacks: Set<NotificationCallback> = new Set();

    constructor(private userId: string) {}

    connect = (): void => {
        const wsUrl = `ws://localhost:8080/ws/notifications?userId=${this.userId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onmessage = (event: MessageEvent) => {
            const notification = JSON.parse(event.data);
            this.callbacks.forEach(callback => callback(notification));
        };

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            // Register observer on backend
            fetch(`/api/notifications/register/${this.userId}`, {
                method: 'POST'
            }).catch(error => console.error('Failed to register observer:', error));
        };

        this.ws.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };
    };

    subscribe = (callback: NotificationCallback): void => {
        this.callbacks.add(callback);
    };

    unsubscribe = (): void => {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    };
}