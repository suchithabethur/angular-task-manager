
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

errorMessage = '';

login() {
  this.authService.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res: any) => {
      this.errorMessage = '';

      localStorage.setItem('token', 'true');
      this.router.navigate(['/tasks']);
    },
    error: (err) => {
      this.errorMessage =
        err?.error?.message || 'Invalid email or password';
    }
  });
}
  showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}
}