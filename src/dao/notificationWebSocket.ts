import { Notification } from 'src/types/Notification';
const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_NOTIFICATION_URL ||
  import.meta.env.VITE_BACKEND_NOTIFICATION_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_NOTIFICATION_PORT ||
  import.meta.env.VITE_BACKEND_NOTIFICATION_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;
class notificationWebSocketDao {
  private webSocket: WebSocket | null = null;
  private setWebsocketReply: React.Dispatch<React.SetStateAction<any>>;

  constructor(setWebsocketReply: React.Dispatch<React.SetStateAction<any>>) {
    this.setWebsocketReply = setWebsocketReply;
  }

  connect(userId: number) {
    this.webSocket = new WebSocket(`ws://localhost:8089/ws?userId=${userId}`);

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

  public sendMessage(message: string): void {
    //console.log('We shouldnt send at all! Sending message:', message);
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.error('WebSocket is not open. Ready state:', this.webSocket?.readyState);
    }
  }
  private handleWebSocketOpen = () => {
    //console.log('WebSocket connection established');
  };

  private handleWebSocketMessage = (event: MessageEvent) => {
    //console.log('WebSocket message received:', event);
    const data = JSON.parse(event.data);
    this.setWebsocketReply(data);
  };

  private handleWebSocketError = (event: Event) => {
    //console.error('WebSocket error:', event);
  };

  private handleWebSocketClose = (event: CloseEvent) => {
    //console.log('WebSocket connection closed:', event.code, event.reason);
  };
}

export default notificationWebSocketDao;
