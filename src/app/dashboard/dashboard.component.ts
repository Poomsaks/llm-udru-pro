import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { SharedService } from '../mainService/shared.service';

@Component({
  selector: 'dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: any = {};
  latencyHistory: number[] = [];
  isBrowser: boolean;
  private statsInterval: any;

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

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @ViewChild('pieChart') pieChartElement!: ElementRef;

  ngOnInit() {
    // เริ่มต้นโหลดข้อมูลครั้งแรก
    if (this.isBrowser) {
      this.fetchStats();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.fetchStats();
    }
  }

  ngOnDestroy() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }


  fetchStats() {
    this.http.get<any>('http://localhost:5000/stats').subscribe({
      next: (data) => {
        this.stats = data;

        // Pie chart
        this.pieChartData = {
          ...this.pieChartData,
          datasets: [{
            ...this.pieChartData.datasets[0],
            data: [data.success_calls || 0, data.failed_calls || 0]
          }]
        };

        // Bar chart
        this.barChartData = {
          ...this.barChartData,
          datasets: [{
            ...this.barChartData.datasets[0],
            data: [
              data.total_calls || 0,
              data.success_calls || 0,
              data.failed_calls || 0
            ]
          }]
        };

        // Line chart (latency)
        this.latencyHistory.push(data.average_latency_sec || 0);
        if (this.latencyHistory.length > 10) {
          this.latencyHistory.shift();
        }

        const now = new Date().toLocaleTimeString();
        const newLabels = [...(this.lineChartData.labels as string[])];
        newLabels.push(now);
        if (newLabels.length > 10) {
          newLabels.shift();
        }

        this.lineChartData = {
          ...this.lineChartData,
          labels: newLabels,
          datasets: [{
            ...this.lineChartData.datasets[0],
            data: [...this.latencyHistory]
          }]
        };

        // Trigger change detection
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching stats:', error);
      }
    });
  }
}
