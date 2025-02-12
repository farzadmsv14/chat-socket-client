import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<any>();

  constructor() {
    console.log('WebsocketService Initialized');
  }

  connect(url: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Already connected to WebSocket, no need to reconnect.');
      return;
    }

    console.log('Connecting to WebSocket server at:', url);

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
    };

    this.ws.onmessage = (event) => {
      const data = event.data;

      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const text = reader.result as string;
          console.log('Received message from WebSocket:', text);
          this.messageSubject.next(text);
        };
        reader.readAsText(data);
      } else {
        console.log('Received message from WebSocket:', data);
        this.messageSubject.next(data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error occurred:', error);
      this.ws?.close();
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event);
      setTimeout(() => this.reconnect(url), 1000);
    };
  }

  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      this.ws.send(message);
    } else {
      console.log('WebSocket is not open, cannot send message');
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.messageSubject.asObservable().subscribe(callback);
  }

  private reconnect(url: string): void {
    console.log('Attempting to reconnect to WebSocket...');
    this.connect(url);
  }
}
