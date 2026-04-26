import { Injectable, computed, signal } from '@angular/core';
import { Conversation, Message } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
    readonly currentUserId = 100;
    readonly search = signal('');
    readonly activeChatId = signal(1);
    readonly isTyping = signal(true);

    private readonly conversationsSignal = signal<Conversation[]>([
        {
            id: 1,
            user: { id: 1, name: 'Azizbek', username: '@azizdev', avatar: 'A', online: true, lastSeen: 'online' },
            lastMessage: 'Telegram style bo‘lishi shart 🔥',
            lastMessageTime: '12:40',
            unreadCount: 2,
            pinned: true
        },
        {
            id: 2,
            user: { id: 2, name: 'Madina', username: '@madina_ui', avatar: 'M', online: false, lastSeen: 'last seen recently' },
            lastMessage: 'Design premium chiqibdi',
            lastMessageTime: '11:18',
            unreadCount: 0
        },
        {
            id: 3,
            user: { id: 3, name: 'Frontend Group', username: '@frontenduz', avatar: 'F', online: true, lastSeen: '245 members' },
            lastMessage: 'Angular signals juda qulay ekan',
            lastMessageTime: '10:05',
            unreadCount: 7,
            muted: true
        },
        {
            id: 4,
            user: { id: 4, name: 'Sardor Backend', username: '@sardorapi', avatar: 'S', online: false, lastSeen: 'last seen yesterday' },
            lastMessage: 'Keyin Socket.IO ulaymiz',
            lastMessageTime: '09:44',
            unreadCount: 0
        }
    ]);

    private readonly messagesSignal = signal<Message[]>([
        { id: 1, chatId: 1, senderId: 1, text: 'Assalomu alaykum, project tayyormi?', time: '12:35', status: 'seen' },
        { id: 2, chatId: 1, senderId: 100, text: 'Va alaykum assalom, ha boshladik.', time: '12:36', status: 'seen' },
        { id: 3, chatId: 1, senderId: 1, text: 'Telegram style bo‘lishi shart 🔥', time: '12:38', status: 'seen' },
        { id: 4, chatId: 1, senderId: 100, text: 'Albatta. Sidebar, chat panel, typing indicator hammasi bo‘ladi.', time: '12:40', status: 'delivered' },

        { id: 5, chatId: 2, senderId: 2, text: 'UI juda clean chiqibdi.', time: '11:16', status: 'seen' },
        { id: 6, chatId: 2, senderId: 100, text: 'Rahmat, yana polish qilamiz.', time: '11:18', status: 'seen' },

        { id: 7, chatId: 3, senderId: 3, text: 'Bugun Angular signals haqida gaplashamiz.', time: '10:01', status: 'seen' },
        { id: 8, chatId: 3, senderId: 100, text: 'Zo‘r, signals state management uchun juda qulay.', time: '10:05', status: 'delivered' },

        { id: 9, chatId: 4, senderId: 4, text: 'Frontend tugasa backendga o‘tamiz.', time: '09:40', status: 'seen' },
        { id: 10, chatId: 4, senderId: 100, text: 'Ha, API layerni tayyorlab qo‘yamiz.', time: '09:44', status: 'sent' }
    ]);

    readonly conversations = computed(() => {
        const value = this.search().toLowerCase().trim();
        return this.conversationsSignal().filter(chat =>
            chat.user.name.toLowerCase().includes(value) ||
            chat.user.username.toLowerCase().includes(value)
        );
    });

    readonly activeConversation = computed(() =>
        this.conversationsSignal().find(chat => chat.id === this.activeChatId())
    );

    readonly activeMessages = computed(() =>
        this.messagesSignal().filter(message => message.chatId === this.activeChatId())
    );

    selectChat(chatId: number): void {
        this.activeChatId.set(chatId);
        this.isTyping.set(chatId === 1);

        this.conversationsSignal.update(chats =>
            chats.map(chat => chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)
        );
    }

    sendMessage(text: string): void {
        const cleanText = text.trim();
        if (!cleanText) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const message: Message = {
            id: Date.now(),
            chatId: this.activeChatId(),
            senderId: this.currentUserId,
            text: cleanText,
            time,
            status: 'sent'
        };

        this.messagesSignal.update(messages => [...messages, message]);
        this.updateLastMessage(cleanText, time);

        setTimeout(() => {
            this.messagesSignal.update(messages =>
                messages.map(item =>
                    item.id === message.id ? { ...item, status: 'delivered' } : item
                )
            );
        }, 800);
    }

    private updateLastMessage(text: string, time: string): void {
        this.conversationsSignal.update(chats =>
            chats.map(chat =>
                chat.id === this.activeChatId()
                    ? { ...chat, lastMessage: text, lastMessageTime: time }
                    : chat
            )
        );
    }
}