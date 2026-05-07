import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  auth = inject(Auth);

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.value.email!;

    sendPasswordResetEmail(this.auth, email)
      .then(() => alert('Reset email sent'))
      .catch(err => console.error(err));
  }
}