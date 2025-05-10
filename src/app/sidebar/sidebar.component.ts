import { Component } from '@angular/core';

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
export class SidebarComponent {
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

  allFiles: string[] = [
    'archive-undergraduate.pdf',
    '100 creative ideas.pdf',
    'HTTP request in JavaScript.pdf'
  ];

  fileSelection: { [key: string]: boolean } = {
    'archive-undergraduate.pdf': true,
    '100 creative ideas.pdf': true,
    'HTTP request in JavaScript.pdf': false
  };

  toggleFileSelection(fileName: string): void {
    this.fileSelection[fileName] = !this.fileSelection[fileName];
  }

  newChat(): void {
    console.log('Creating new chat');
  }
}
