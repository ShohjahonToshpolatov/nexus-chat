import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  readonly chatService = inject(ChatService);
  readonly messageInput = signal('');
  readonly showSidebar = signal(true);

  send(): void {
    const text = this.messageInput();
    this.chatService.sendMessage(text);
    this.messageInput.set('');
  }

  openChat(chatId: number): void {
    this.chatService.selectChat(chatId);

    if (window.innerWidth <= 760) {
      this.showSidebar.set(false);
    }
  }

  backToChats(): void {
    this.showSidebar.set(true);
  }
}