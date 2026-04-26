import { Injectable, computed, signal } from '@angular/core';
import { Conversation, Message } from '../models/chat.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    readonly currentUserId = 100;
    readonly search = signal('');
    readonly activeChatId = signal(1);

    private readonly conversationsSignal = signal<Conversation[]>([
        {
            id: 1,
            user: {
                id: 1,
                name: 'Azizbek',
                username: '@azizdev',
                avatar: 'A',
                online: true,
                lastSeen: 'online'
            },
            lastMessage: 'Bugun projectni boshlaymizmi?',
            lastMessageTime: '12:40',
            unreadCount: 2,
            pinned: true
        },
        {
            id: 2,
            user: {
                id: 2,
                name: 'Madina',
                username: '@madina_ui',
                avatar: 'M',
                online: false,
                lastSeen: 'last seen recently'
            },
            lastMessage: 'Design juda premium chiqibdi 🔥',
            lastMessageTime: '11:18',
            unreadCount: 0
        },
        {
            id: 3,
            user: {
                id: 3,
                name: 'Frontend Group',
                username: '@frontenduz',
                avatar: 'F',
                online: true,
                lastSeen: '245 members'
            },
            lastMessage: 'Angular signals juda qulay ekan',
            lastMessageTime: '10:05',
            unreadCount: 7,
            muted: true
        }
    ]);

    private readonly messagesSignal = signal<Message[]>([
        { id: 1, chatId: 1, senderId: 1, text: 'Assalomu alaykum, project tayyormi?', time: '12:35', status: 'seen' },
        { id: 2, chatId: 1, senderId: 100, text: 'Va alaykum assalom, ha boshladik.', time: '12:36', status: 'seen' },
        { id: 3, chatId: 1, senderId: 1, text: 'Telegram style bo‘lishi shart 🔥', time: '12:38', status: 'seen' },
        { id: 4, chatId: 1, senderId: 100, text: 'Albatta. Sidebar, chat panel, typing indicator hammasi bo‘ladi.', time: '12:40', status: 'delivered' }
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

        this.conversationsSignal.update(chats =>
            chats.map(chat =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            )
        );
    }

    sendMessage(text: string): void {
        const cleanText = text.trim();

        if (!cleanText) return;

        const message: Message = {
            id: Date.now(),
            chatId: this.activeChatId(),
            senderId: this.currentUserId,
            text: cleanText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        this.messagesSignal.update(messages => [...messages, message]);

        this.conversationsSignal.update(chats =>
            chats.map(chat =>
                chat.id === this.activeChatId()
                    ? { ...chat, lastMessage: cleanText, lastMessageTime: message.time }
                    : chat
            )
        );
    }
}