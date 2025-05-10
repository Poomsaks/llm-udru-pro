import { Component, OnInit } from '@angular/core';

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

  ngOnInit() {
    // Add initial welcome message
    // this.messages = [
    //   {
    //     sender: 'bot',
    //     content: 'สวัสดี คุณ UDRU Admin\n\nเสริมพลังชีวิตนักศึกษา ด้วยผู้ช่วย AI จาก UDRU ที่เข้าใจทุกคำถาม ตอบได้ทุกที่!',
    //     timestamp: new Date()
    //   }
    // ];
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Add user message
    this.messages.push({
      sender: 'user',
      content: this.newMessage,
      timestamp: new Date()
    });

    // Clear input
    this.newMessage = '';

    // Simulate bot response (in a real app, this would call a service)
    setTimeout(() => {
      this.messages.push({
        sender: 'bot',
        content: 'กำลังประมวลผลคำถามของคุณ...',
        timestamp: new Date()
      });
    }, 1000);
  }

  startNewChat() {
    // Reset chat messages except for welcome message
    this.messages = [this.messages[0]];
  }
}
