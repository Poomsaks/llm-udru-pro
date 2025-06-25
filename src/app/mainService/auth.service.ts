import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth'; // เปลี่ยนเป็น URL ของ backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Promise<any> {
    return firstValueFrom(this.http.post<any>(`${this.apiUrl}/login`, {
      username,
      password
    }));
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
