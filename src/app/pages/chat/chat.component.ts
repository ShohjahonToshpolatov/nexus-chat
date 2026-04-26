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
  readonly showNewChat = signal(false);
  readonly showEmojiPicker = signal(false);
  readonly showMenu = signal(false);
  readonly showHeaderSearch = signal(false);
  readonly showProfile = signal(false);

  newChatName = '';
  newChatUsername = '';

  readonly emojis = ['😀', '😂', '🔥', '❤️', '👍', '👏', '😎', '🚀', '✅', '💻', '🎯', '✨'];
  readonly profilePhone = signal(localStorage.getItem('user') || 'Guest user');

  send(): void {
    const text = this.messageInput();
    this.chatService.sendMessage(text);
    this.messageInput.set('');
    this.showEmojiPicker.set(false);
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

  addEmoji(emoji: string): void {
    this.messageInput.set(this.messageInput() + emoji);
  }

  createChat(): void {
    this.chatService.createChat(this.newChatName, this.newChatUsername);
    this.newChatName = '';
    this.newChatUsername = '';
    this.showNewChat.set(false);

    if (window.innerWidth <= 760) {
      this.showSidebar.set(false);
    }
  }

  attachFile(): void {
    this.chatService.sendSystemMessage('📎 File attached: project-preview.png');
  }

  sendVoice(): void {
    this.chatService.sendSystemMessage('🎙 Voice message · 0:07');
  }

  clearChat(): void {
    this.chatService.clearActiveChat();
    this.showMenu.set(false);
  }

  readonly isDark = signal(true);

  toggleTheme() {
    this.isDark.set(!this.isDark());
    document.body.classList.toggle('light');
  }
} 