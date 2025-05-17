import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../mainService/main-service.service';
import { Router } from '@angular/router';

interface SidebarItem {
  title: string;
  subtitle?: string;
}

@Component({
  selector: 'sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(
    private _serviceService: MainServiceService,
    private router: Router,
  ) { }

  sidebarItems: SidebarItem[] = [
    { title: 'Explain quantum computing in simple terms' },
    { title: 'Got any creative ideas for a 10 year old sbirthday' },
    { title: 'How do I make an HTTP request in JavaScript?' },
    { title: 'Remember what user said earlier in the conversation' },
    { title: 'Allow user to provide follow-up corrections' },
    { title: 'Trained to decline inappropriate requests' }
  ];

  selectedFiles: string[] = [
    'archive-undergraduate.pdf',
    '100 creative ideas.pdf'
  ];

  fileSelection: { [key: string]: boolean } = {};
  allFiles: string[] = [];

  ngOnInit(): void {
    this.getListDoc();
  }

  loadingFileSelection = false;

  getListDoc() {
    this.loadingFileSelection = true;

    this._serviceService.listDoc().subscribe({
      next: (res) => {
        this.fileSelection = {};
        this.allFiles = [];

        if (res?.documents && res.documents.length > 0) {
          res.documents.forEach((doc: { filename: string }) => {
            this.fileSelection[doc.filename] = false;
            this.allFiles.push(doc.filename);
          });
        } else {
          // ถ้าไม่มีข้อมูล
          this.fileSelection = {};
          this.allFiles = [];
        }

        console.log('fileSelection:', this.fileSelection);
        console.log('allFiles:', this.allFiles);
      },
      error: (err) => {
        console.error('Error loading listDoc:', err);
        // กรณี error ก็ให้เป็นค่าว่าง
        this.fileSelection = {};
        this.allFiles = [];
      },
      complete: () => {
        this.loadingFileSelection = false;
      }
    });
  }


  toggleFileSelection(fileName: string): void {
    this.fileSelection[fileName] = !this.fileSelection[fileName];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this._serviceService.uploadFile(file).subscribe({
        next: (res) => {
          console.log('Upload successful:', res);
          this.getListDoc();
        },
        error: (err) => {
          console.error('Upload failed:', err);
        }
      });
    }
  }
  newChat(): void {
    console.log('Creating new chat');
  }
}
