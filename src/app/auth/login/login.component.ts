import { Component, inject, OnInit, signal } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  error = signal<string>('');

  showPassword = signal<boolean>(false);

  isLoading = signal<boolean>(false);

  authService = inject(AuthService);

  router = inject(Router);

  constructor() {

    this.loginForm = new FormGroup({

      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {

    this.showPassword.update(
      (state) => !state
    );
  }

  // =========================
  // LOGIN
  // =========================

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.error.set('');

    const userData = {

      email: this.loginForm.value.email,

      password: this.loginForm.value.password,
    };

    this.authService.login(userData)

      .then((res: any) => {

        console.log('Login success:', res);

        alert('✅ Login successful');

        this.isLoading.set(false);

        // ✅ redirect to expenses dashboard
        this.router.navigate(['/expenses']);
      })

      .catch((err: any) => {

        console.error(err);

        this.error.set(
          err.message || 'Login failed'
        );

        this.isLoading.set(false);
      });
  }
}