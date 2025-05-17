import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../mainService/main-service.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}

@Component({
  selector: 'chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  constructor(private _serviceService: MainServiceService) { }

  ngOnInit() {
    this._serviceService.getChat().subscribe((res: ChatMessage[]) => {
      this.messages = res;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      content: this.newMessage,
      timestamp: new Date()
    };

    this.messages.push(userMessage);

    this.newMessage = '';

    const botMessage: ChatMessage = {
      sender: 'bot',
      content: 'กำลังประมวลผลคำถามของคุณ...',
      timestamp: new Date()
    };

    setTimeout(() => {
      this.messages.push(botMessage);
      // this._serviceService.saveChat(botMessage).subscribe();
    }, 1000);
  }

  startNewChat() {
    // 1. บันทึกแชททั้งหมดที่มีอยู่ก่อนเริ่มใหม่
    if (this.messages.length > 0) {
      this._serviceService.saveChat(this.messages).subscribe(() => {
        // 2. หลังบันทึกสำเร็จ ค่อยเริ่มแชทใหม่
        const userMessage: ChatMessage = {
          sender: 'user',
          content: 'เริ่มแชทใหม่',
          timestamp: new Date()
        };

        const welcomeMessage: ChatMessage = {
          sender: 'bot',
          content: 'ยินดีต้อนรับสู่แชทใหม่ค่ะ',
          timestamp: new Date()
        };

        this.messages = [userMessage, welcomeMessage];

        this._serviceService.saveChat(userMessage).subscribe();
        this._serviceService.saveChat(welcomeMessage).subscribe();
      });
    }
  }


}
