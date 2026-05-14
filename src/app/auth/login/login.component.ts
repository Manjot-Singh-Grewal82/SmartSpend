import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { AuthService }
from '../../core/services/auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './login.component.html',

  styleUrl: './login.component.scss'
})

export class LoginComponent
implements OnInit {

  // =========================
  // FORM
  // =========================

  loginForm: FormGroup =
    new FormGroup({});

  // =========================
  // UI STATE
  // =========================

  error = signal<string>('');

  showPassword =
    signal<boolean>(false);

  isLoading =
    signal<boolean>(false);

  // =========================
  // SERVICES
  // =========================

  authService =
    inject(AuthService);

  router =
    inject(Router);

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {

    this.loginForm =
      new FormGroup({

        email: new FormControl(

          '',

          [
            Validators.required,
            Validators.email
          ]
        ),

        password: new FormControl(

          '',

          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ]
        ),
      });
  }

  ngOnInit(): void {}

  // =========================
  // PASSWORD TOGGLE
  // =========================

  togglePasswordVisibility(): void {

    this.showPassword.update(

      (state) => !state
    );
  }

  // =========================
  // LOGIN
  // =========================

  onSubmit(): void {

    if (this.loginForm.invalid) {

      this.error.set(
        'Please fill all fields correctly'
      );

      return;
    }

    this.isLoading.set(true);

    this.error.set('');

    const userData = {

      email:
        this.loginForm.value.email,

      password:
        this.loginForm.value.password,
    };

    this.authService

      .login(userData)

      .then((res: any) => {

        console.log(
          'Login success:',
          res
        );

        alert(
          '✅ Login successful'
        );

        this.isLoading.set(false);

        // ✅ REDIRECT TO DASHBOARD

        this.router.navigate([
          '/dashboard'
        ]);
      })

      .catch((err: any) => {

        console.error(err);

        let message =
          'Login failed';

        // Firebase errors

        if (
          err.code ===
          'auth/user-not-found'
        ) {

          message =
            'User not found';
        }

        else if (
          err.code ===
          'auth/wrong-password'
        ) {

          message =
            'Incorrect password';
        }

        else if (
          err.code ===
          'auth/invalid-credential'
        ) {

          message =
            'Invalid email or password';
        }

        this.error.set(message);

        this.isLoading.set(false);
      });
  }
}