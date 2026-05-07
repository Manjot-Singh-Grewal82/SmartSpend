import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Expense } from '../../core/models/expense.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-expense.component.html',
  styleUrl: './edit-expense.component.scss'
})
export class EditExpenseComponent implements OnInit, OnDestroy {

  expenseForm: FormGroup;

  categories: string[] = [
    'Groceries',
    'Leisure',
    'Electronics',
    'Utilities',
    'Clothing',
    'Health',
    'Others',
  ];

  error = signal<string>('');
  expense = signal<Expense>({} as Expense);

  route = inject(ActivatedRoute);
  expenseService = inject(ExpenseService);
  router = inject(Router);

  private unsubscribe$ = new Subject<void>();

  constructor() {
    this.expenseForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),

      amount: new FormControl('', [
        Validators.required,
        Validators.min(0)
      ]),

      category: new FormControl('', Validators.required),

      date: new FormControl(
        new Date().toISOString().split('T')[0],
        Validators.required
      ),
    });
  }

  ngOnInit() {
    this.route.data.subscribe({
      next: (res) => {

        this.expense.set(res['expense']);

        this.expenseForm.patchValue({
          title: this.expense().title,
          amount: this.expense().amount,
          category: this.expense().category,
          date: this.formatDate(this.expense().date),
        });
      },

      error: (err) => {
        console.error(err);
        this.error.set(err?.error?.message || 'An error occurred');
      },
    });
  }

  // ✅ getters

  get title() {
    return this.expenseForm.get('title');
  }

  get amount() {
    return this.expenseForm.get('amount');
  }

  get category() {
    return this.expenseForm.get('category');
  }

  get date() {
    return this.expenseForm.get('date');
  }

  // ✅ date formatter

  formatDate(date: string): string {
    const newDate = new Date(date);

    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');

    const day = newDate.getDate()
      .toString()
      .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // ✅ reset form

  reset() {
    this.expenseForm.get('title')?.reset();
    this.expenseForm.get('amount')?.reset();
    this.expenseForm.get('category')?.reset();
  }

  // ✅ update expense

  onSubmit() {

    if (this.expenseForm.invalid) {
      return;
    }

    const id = this.expense().id;

    if (!id) {
      console.error('Expense ID missing');
      return;
    }

    this.expenseService.updateExpense(id, this.expenseForm.value)
      .then(() => {

        alert('✅ Expense Updated Successfully');

        this.router.navigate(['/expenses']);
      })

      .catch((err: any) => {
        console.error(err);

        alert('❌ Failed to update expense');
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}