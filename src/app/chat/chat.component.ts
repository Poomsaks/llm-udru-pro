import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../mainService/main-service.service';
import { ChatService } from '../mainService/chat.service';
import { ChatMessage } from '../chat/chat.model';

@Component({
  selector: 'chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  selectedFiles: string[] = [];

  constructor(
    private _serviceService: MainServiceService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    //เลือกไฟล์
    this.chatService.selectedFiles$.subscribe(files => {
      this.selectedFiles = files;
      console.log('Received files in ChatComponent:', this.selectedFiles);
    });
    //แชทใหม่
    this.chatService.saveChat$.subscribe(() => {
      this.saveChatHistory();
    });
    //เลือกเชท
    this.chatService.selectedSourceId$.subscribe(id => {
      if (id !== null) {
        this.loadChatMessagesBySource(id);
      }
    });
  }
  loadChatMessagesBySource(sourceId: number) {
    console.log(`Fetching messages for source ID ${sourceId}`);

    this._serviceService.getChatsBySource(sourceId).subscribe({
      next: (data) => {
        console.log('chatSource', data);

        this.messages = data.map((msg: any) => ({
          sender: msg.sender,
          content: msg.content,
          timestamp: new Date(msg.timestamp), // แปลง timestamp string -> Date
          source_name: msg.source_name
        }));
      },
      error: (err) => {
        console.error('Error fetching chat messages:', err);
      }
    });
  }

  saveChatHistory() {
    console.log('Saving chat history:', this.messages);

    if (this.messages[0].source_name) {
      this.messages = [];
    } else {
      this._serviceService.saveChat(this.messages).subscribe({
        next: () => {
          this.chatService.setMessages(this.messages);
          this.chatService.triggerUpdateListSource(); // รันหลังจาก save เสร็จ
          this.messages = [];
        },
        error: (err) => {
          console.error('Error saving chat history:', err);
        }
      });
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      content: this.newMessage,
      timestamp: new Date(),
      source_name: ''
    };

    this.messages.push(userMessage);

    // เก็บข้อความแล้วล้าง input
    const query = this.newMessage;
    this.newMessage = '';

    // แสดงข้อความกำลังประมวลผล
    const loadingMessage: ChatMessage = {
      sender: 'bot',
      content: 'กำลังประมวลผลคำถามของคุณ...',
      timestamp: new Date(),
      source_name: ''
    };
    this.messages.push(loadingMessage);

    // เรียก API generate
    this._serviceService.generate(query, this.selectedFiles).subscribe({
      next: (response) => {
        // ลบข้อความกำลังประมวลผล
        this.messages = this.messages.filter(msg => msg !== loadingMessage);

        const botMessage: ChatMessage = {
          sender: 'bot',
          content: response?.summary || 'ไม่สามารถตอบได้ในขณะนี้',
          timestamp: new Date(),
          source_name: ''
        };
        this.messages.push(botMessage);
        // this._serviceService.saveChat(botMessage).subscribe();
      },
      error: (err) => {
        console.error('Error from generate API:', err);
        this.messages = this.messages.filter(msg => msg !== loadingMessage);

        const errorMessage: ChatMessage = {
          sender: 'bot',
          content: 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง',
          timestamp: new Date(),
          source_name: ''
        };
        this.messages.push(errorMessage);
      }
    });

  }

}
