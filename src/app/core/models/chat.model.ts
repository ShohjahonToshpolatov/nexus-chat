export interface User {
    id: number;
    name: string;
    username: string;
    avatar: string;
    online: boolean;
    lastSeen: string;
}

export interface Message {
    id: number;
    chatId: number;
    senderId: number;
    text: string;
    time: string;
    status: 'sent' | 'delivered' | 'seen';
}

export interface Conversation {
    id: number;
    user: User;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    pinned?: boolean;
    muted?: boolean;
}