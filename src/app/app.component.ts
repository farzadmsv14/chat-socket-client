import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  messages: { text: string; isSent: boolean }[] = [];
  newMessage: string = '';

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.websocketService.connect('ws://localhost:3000');

    this.websocketService.onMessage((message: string) => {
      this.messages.push({ text: message, isSent: false });
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ text: this.newMessage, isSent: true });
      this.websocketService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
