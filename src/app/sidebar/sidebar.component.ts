import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../mainService/main-service.service';
import { Router } from '@angular/router';
import { ChatService } from '../mainService/chat.service';

interface SidebarItem {
  id: number;
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
    private chatService: ChatService
  ) { }

  sidebarItems: SidebarItem[] = [];

  selectedFiles: string[] = [];

  fileSelection: { [key: string]: boolean } = {};
  allFiles: string[] = [];

  ngOnInit(): void {
    this.getListDoc();
    this.getChatSources()

    //update list chat
    this.chatService.listSource$.subscribe(() => {
      console.log('this.chatService.listSource$');

      this.getChatSources();
    });
  }

  loadingFileSelection = false;

  getListDoc() {
    this.loadingFileSelection = true;

    this._serviceService.listDoc().subscribe({
      next: (res) => {
        this.fileSelection = {};
        this.allFiles = [];

        if (res?.documents && res.documents.length > 0) {
          res.documents.forEach((doc: { filename: string; is_active: boolean }) => {
            this.fileSelection[doc.filename] = doc.is_active;
            this.allFiles.push(doc.filename);
          });
        } else {
          this.fileSelection = {};
          this.allFiles = [];
        }
      },
      error: (err) => {
        console.error('Error loading listDoc:', err);
        this.fileSelection = {};
        this.allFiles = [];
      },
      complete: () => {
        this.loadingFileSelection = false;
      }
    });
  }
  loadingChat = false;
  getChatSources() {
    this.loadingChat = true;

    this._serviceService.getChatSources().subscribe({
      next: (sources) => {
        this.sidebarItems = sources.map((source: any) => ({
          id: source.id,
          title: source.source_name
        }));
        this.loadingChat = false;
      },
      error: (err) => {
        console.error('Failed to load sources', err);
        this.loadingChat = false;
      }
    });
  }
  selectedSourceId: number | null = null;
  chatItems: any[] = [];
  onSidebarItemClick(item: SidebarItem) {
    this.selectedSourceId = item.id;
    console.log('step1', this.selectedSourceId);
    this.chatService.setSelectedSourceId(item.id);
  }

  toggleFileSelection(fileName: string): void {
    // สลับสถานะเลือก/ไม่เลือก
    this.fileSelection[fileName] = !this.fileSelection[fileName];

    // เก็บชื่อไฟล์ที่ถูกเลือกทั้งหมด
    this.selectedFiles = Object.keys(this.fileSelection).filter(
      fname => this.fileSelection[fname]
    );
    console.log('Selected Files:', this.selectedFiles);

    // เรียก API อัพเดตสถานะ
    this.updateStatus(this.selectedFiles, true);
  }

  // ฟังก์ชันเรียก API อัพเดตสถานะไฟล์
  updateStatus(files: string[], isActive: boolean): void {
    const payload = {
      files: files,
      is_active: isActive
    };

    this._serviceService.updateSelectedFiles(payload).subscribe({
      next: (res) => {
        console.log('Status updated:', res);
      },
      error: (err) => {
        console.error('Error updating status:', err);
      }
    });
  }


  onFileSelected(event: any) {
    this.loadingFileSelection = true;
    const file: File = event.target.files[0];
    if (file) {
      this._serviceService.uploadFile(file).subscribe({
        next: (res) => {
          console.log('Upload successful:', res);
          this.getListDoc();
        },
        error: (err) => {
          this.loadingFileSelection = false;
          console.error('Upload failed:', err);
        }
      });
    }
  }
  newChat(): void {
    console.log('Creating new chat');
    this.chatService.triggerSaveChat();
  }
}
