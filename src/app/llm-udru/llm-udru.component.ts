import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../mainService/main-service.service';
import { ChatService } from '../mainService/chat.service';
import { ChatMessage } from '../chat/chat.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'llm-udru',
  standalone: false,
  templateUrl: './llm-udru.component.html',
  styleUrl: './llm-udru.component.css'
})
export class LlmUdruComponent {

  private intervalId: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // เรียกครั้งแรก
    this.fetchStats();

    // เรียกทุก 5 นาที (300,000 มิลลิวินาที)
    this.intervalId = setInterval(() => {
      this.fetchStats();
    }, 300000); // 5 นาที
  }

  fetchStats() {
    this.http.get('http://localhost:5000/stats').subscribe({
      next: (data) => {
        console.log('Stats:', data);
        // ทำสิ่งที่ต้องการกับข้อมูลที่ได้
      },
      error: (err) => {
        console.error('Error fetching stats', err);
      }
    });
  }

  ngOnDestroy() {
    // ล้าง interval ตอน component ถูกทำลาย
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
