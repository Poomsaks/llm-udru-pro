import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { ChatMessage } from '../chat/chat.model';

@Component({
  selector: 'app-data',
  standalone: false,
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent implements OnInit {
  stats: any = {};
  latencyHistory: number[] = [];
 messages: ChatMessage[] = [];
  // Pie Chart
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#28a745', '#dc3545']
      }
    ]
  };

  // Bar Chart
  barChartData: ChartData<'bar'> = {
    labels: ['Total Calls', 'Success', 'Failed'],
    datasets: [
      {
        label: 'Call Summary',
        data: [0, 0, 0],
        backgroundColor: ['#007bff', '#28a745', '#dc3545']
      }
    ]
  };

  // Line Chart
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Latency (s)',
        data: [],
        fill: false,
        borderColor: '#007bff',
        tension: 0.3
      }
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStats();
    setInterval(() => this.fetchStats(), 300000); // ทุก 5 นาที
  }

  fetchStats() {
    this.http.get<any>('http://localhost:5000/stats').subscribe(data => {
      this.stats = data;

      // Pie chart
      this.pieChartData.datasets[0].data = [
        data.success_calls,
        data.failed_calls
      ];

      // Bar chart
      this.barChartData.datasets[0].data = [
        data.total_calls,
        data.success_calls,
        data.failed_calls
      ];

      // Line chart (latency)
      this.latencyHistory.push(data.average_latency_sec);
      if (this.latencyHistory.length > 10) this.latencyHistory.shift();

      const now = new Date().toLocaleTimeString();
      this.lineChartData.labels!.push(now);
      if (this.lineChartData.labels!.length > 10) this.lineChartData.labels!.shift();

      this.lineChartData.datasets[0].data = [...this.latencyHistory];
    });
  }
}
