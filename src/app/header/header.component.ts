import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../mainService/shared.service';

@Component({
  selector: 'header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router,private http: HttpClient,private sharedService: SharedService) { }

  gotoLogin() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/llm-udru']);
    }
  }
  gotoHome() {
    this.router.navigate(['/']);
  }
  gotoDashboard() {
    this.router.navigate(['/dashboard']);
  }
  isLoggedIn = false;
  total = 0;
  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    this.sharedService.total$.subscribe(value => {
      this.total = value;
    });
  }
  refreshLoginState() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }
}
