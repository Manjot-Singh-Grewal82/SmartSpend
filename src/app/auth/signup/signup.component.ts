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
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  CommonModule,
  NgClass
} from '@angular/common';

import { AuthService }
from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],

  templateUrl: './signup.component.html',

  styleUrl: './signup.component.scss'
})

export class SignupComponent
implements OnInit {

  // =========================
  // FORM
  // =========================

  signupForm: FormGroup =
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

    this.signupForm =
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
  // SIGNUP
  // =========================

  onSubmit(): void {

    if (this.signupForm.invalid) {

      this.error.set(
        'Please fill all fields correctly'
      );

      return;
    }

    this.isLoading.set(true);

    this.error.set('');

    const userData = {

      email:
        this.signupForm.value.email,

      password:
        this.signupForm.value.password,
    };

    this.authService

      .signup(userData)

      .then((res: any) => {

        console.log(
          'Signup success:',
          res
        );

        alert(
          '✅ Account created successfully'
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
          'Signup failed';

        // Firebase errors

        if (
          err.code ===
          'auth/email-already-in-use'
        ) {

          message =
            'Email already exists';
        }

        else if (
          err.code ===
          'auth/weak-password'
        ) {

          message =
            'Password is too weak';
        }

        this.error.set(message);

        this.isLoading.set(false);
      });
  }
}