import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  readonly connected = signal(false);

  connect(): void {
    // Backend kelganda Socket.IO shu yerga ulanadi.
    // this.socket = io(environment.socketUrl);
    this.connected.set(true);
  }

  disconnect(): void {
    this.connected.set(false);
  }

  emit(event: string, payload: unknown): void {
    console.log('[socket emit ready]', event, payload);
  }

  on<T>(event: string, callback: (payload: T) => void): void {
    console.log('[socket listener ready]', event, callback);
  }
}