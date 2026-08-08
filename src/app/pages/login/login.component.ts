import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  submit() {
    if (!this.username || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/inicio');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Usuario o contraseña incorrectos.');
      },
    });
  }
}
