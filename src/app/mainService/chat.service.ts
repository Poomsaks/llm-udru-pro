// chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChatMessage } from '../chat/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //upload file
  private selectedFilesSource = new BehaviorSubject<string[]>([]);
  selectedFiles$ = this.selectedFilesSource.asObservable();
  updateSelectedFiles(files: string[]) {
    this.selectedFilesSource.next(files);
  }

  //save chat
  private saveChatSubject = new Subject<void>();
  saveChat$ = this.saveChatSubject.asObservable();
  private latestMessages: ChatMessage[] = [];
  triggerSaveChat() {
    this.saveChatSubject.next();
  }
  setMessages(messages: ChatMessage[]) {
    this.latestMessages = messages;
  }
  getMessages(): ChatMessage[] {
    return this.latestMessages;
  }

  //เลือกแชท
  private selectedSourceIdSubject = new BehaviorSubject<number | null>(null);
  selectedSourceId$ = this.selectedSourceIdSubject.asObservable();
  setSelectedSourceId(id: number) {
    this.selectedSourceIdSubject.next(id);
  }

  //update list chat
  private updateListSource = new Subject<void>();
  listSource$ = this.updateListSource.asObservable();
  triggerUpdateListSource() {
    this.updateListSource.next();
  }
}
