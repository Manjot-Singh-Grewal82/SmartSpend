import { Component, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ExpenseService } from '../../core/services/expense.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-expense',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],

  templateUrl: './add-expense.component.html',

  styleUrl: './add-expense.component.scss'
})

export class AddExpenseComponent {

  // =========================
  // FORM
  // =========================

  expenseForm = new FormGroup({

    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    amount: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),

    category: new FormControl('', [
      Validators.required
    ]),

    date: new FormControl(
      new Date().toISOString().split('T')[0],
      Validators.required
    ),
  });

  // =========================
  // UI STATE
  // =========================

  isLoading = false;

  error = '';

  // =========================
  // SERVICES
  // =========================

  expenseService = inject(ExpenseService);

  router = inject(Router);

  // =========================
  // SUBMIT
  // =========================

  onSubmit() {

    // validate form

    if (this.expenseForm.invalid) {

      this.error =
        'Please fill all fields correctly';

      return;
    }

    this.isLoading = true;

    this.error = '';

    // payload

    const expenseData = {

      title: this.expenseForm.value.title,

      amount: Number(
        this.expenseForm.value.amount
      ),

      category:
        this.expenseForm.value.category,

      date:
        this.expenseForm.value.date,
    };

    // save to Firebase

    this.expenseService

      .addExpense(expenseData)

      .then(() => {

        console.log(
          'Expense added successfully'
        );

        alert(
          '✅ Expense Added Successfully'
        );

        // reset form

        this.expenseForm.reset({

          title: '',

          amount: '',

          category: '',

          date:
            new Date()
              .toISOString()
              .split('T')[0]
        });

        this.isLoading = false;

        // redirect

        this.router.navigate([
          '/expenses'
        ]);
      })

      .catch((err: any) => {

        console.error(err);

        this.error =
          '❌ Failed to add expense';

        this.isLoading = false;
      });
  }
}