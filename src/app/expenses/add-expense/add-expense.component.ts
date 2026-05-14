import { Component, inject } from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { ExpenseService }
from '../../core/services/expense.service';

import { AiCategoryService }
from '../../core/services/ai-category.service';

@Component({
  selector: 'app-add-expense',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './add-expense.component.html',

  styleUrl:
    './add-expense.component.scss'
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

  detectedCategory = '';

  // =========================
  // SERVICES
  // =========================

  expenseService =
    inject(ExpenseService);

  aiCategoryService =
    inject(AiCategoryService);

  router =
    inject(Router);

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {

    // =========================
    // AI CATEGORY DETECTION
    // =========================

    this.expenseForm

      .get('title')

      ?.valueChanges

      .subscribe((value: any) => {

        if (!value) {

          this.detectedCategory = '';

          return;
        }

        const detected =

          this.aiCategoryService
            .detectCategory(value);

        this.detectedCategory =
          detected;

        // auto-fill category

        this.expenseForm.patchValue({

          category: detected
        });
      });
  }

  // =========================
  // SUBMIT
  // =========================

  onSubmit(): void {

    // validate form

    if (this.expenseForm.invalid) {

      this.error =
        'Please fill all fields correctly';

      return;
    }

    this.isLoading = true;

    this.error = '';

    // =========================
    // PAYLOAD
    // =========================

    const expenseData = {

      title:
        this.expenseForm.value.title,

      amount: Number(
        this.expenseForm.value.amount
      ),

      category:
        this.expenseForm.value.category,

      date:
        this.expenseForm.value.date,
    };

    // =========================
    // SAVE TO FIREBASE
    // =========================

    this.expenseService

      .addExpense(expenseData)

      .then(() => {

        console.log(
          'Expense added successfully'
        );

        alert(
          '✅ Expense Added Successfully'
        );

        // =========================
        // RESET FORM
        // =========================

        this.expenseForm.reset({

          title: '',

          amount: '',

          category: '',

          date:
            new Date()
              .toISOString()
              .split('T')[0]
        });

        this.detectedCategory = '';

        this.isLoading = false;

        // =========================
        // REDIRECT TO DASHBOARD
        // =========================

        this.router.navigate([
          '/dashboard'
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