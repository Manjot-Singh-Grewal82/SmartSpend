import { Component, inject, OnInit, signal } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { NgClass } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],

  templateUrl: './signup.component.html',

  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({});

  error = signal<string>('');

  showPassword = signal<boolean>(false);

  isLoading = signal<boolean>(false);

  authService = inject(AuthService);

  router = inject(Router);

  constructor() {

    this.signupForm = new FormGroup({

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
  // SIGNUP
  // =========================

  onSubmit() {

    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.error.set('');

    const userData = {

      email: this.signupForm.value.email,

      password: this.signupForm.value.password,
    };

    this.authService.signup(userData)

      .then((res: any) => {

        console.log('Signup success:', res);

        alert('✅ Account created successfully');

        this.isLoading.set(false);

        // ✅ redirect to dashboard
        this.router.navigate(['/expenses']);
      })

      .catch((err: any) => {

        console.error(err);

        this.error.set(
          err.message || 'Signup failed'
        );

        this.isLoading.set(false);
      });
  }
}