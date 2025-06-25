import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../mainService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    try {
      const result = await this.authService.login(username, password);
      if (result.success) {
        localStorage.setItem('token', result.token); // หรือ sessionStorage ตามต้องการ
        this.router.navigate(['/llm-udru']);
      } else {
        this.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      }
    } catch (err) {
      this.errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
    }
  }
}
