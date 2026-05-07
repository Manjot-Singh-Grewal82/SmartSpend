import {
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  DatePipe,
  NgClass
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-list-expenses',

  standalone: true,

  imports: [
    DatePipe,
    NgClass,
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl: './list-expenses.component.html',

  styleUrl: './list-expenses.component.scss',
})

export class ListExpensesComponent
implements OnInit, OnDestroy {

  // =========================
  // SIGNALS
  // =========================

  expenses = signal<any[]>([]);

  totalAmount = signal<number>(0);

  currentMonthTotal = 0;

  averagePerDay = 0;

  // =========================
  // FILTER FORM
  // =========================

  filterForm = inject(FormBuilder).group({

    filter: [''],

    startDate: [''],

    endDate: ['']
  });

  // =========================
  // UI STATE
  // =========================

  filter = signal<string>('');

  minDate = signal<string>('');

  showConfirmDialog = signal<boolean>(false);

  selectedExpenseId = signal<string>('');

  isLoading = signal<boolean>(false);

  errorMsg = signal<string>('');

  // =========================
  // SERVICES
  // =========================

  expenseService = inject(ExpenseService);

  router = inject(Router);

  expenseSubscription!: Subscription;

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.getExpenses();
  }

  // =========================
  // LOAD EXPENSES
  // =========================

  getExpenses(): void {

    this.isLoading.set(true);

    this.expenseSubscription =
      this.expenseService.getExpenses()

      .subscribe({

        next: (res: any[]) => {

          console.log('✅ Expenses loaded:', res);

          // update expenses
          this.expenses.set(res);

          // total amount
          const total = res.reduce(

            (sum, expense) =>
              sum + Number(expense.amount || 0),

            0
          );

          this.totalAmount.set(total);

          const now = new Date();

          // current month total
          this.currentMonthTotal = res

            .filter(expense => {

              const expenseDate =
                new Date(expense.date);

              return (

                expenseDate.getMonth() === now.getMonth()

                &&

                expenseDate.getFullYear() === now.getFullYear()
              );
            })

            .reduce(

              (sum, expense) =>
                sum + Number(expense.amount || 0),

              0
            );

          // average per day
          if (res.length > 0) {

            const oldestExpenseDate = new Date(

              Math.min(

                ...res.map(expense =>

                  new Date(expense.date).getTime()
                )
              )
            );

            const daysDifference = Math.ceil(

              (
                now.getTime()

                -

                oldestExpenseDate.getTime()
              )

              /

              (1000 * 60 * 60 * 24)
            );

            this.averagePerDay =

              Math.round(

                (total / (daysDifference || 1)) * 100

              ) / 100;

          } else {

            this.averagePerDay = 0;
          }

          this.isLoading.set(false);
        },

        error: (err: any) => {

          console.log('🔥 FIREBASE ERROR:', err);

          this.errorMsg.set(

            err?.message ||

            'Failed to load expenses'
          );

          this.isLoading.set(false);
        }
      });
  }

  // =========================
  // FILTERS
  // =========================

  onFilterChange(): void {

    console.log('Filter changed');
  }

  applyCustomFilter(): void {

    console.log('Custom filter applied');
  }

  onStartDateChange(): void {

    this.minDate.set(

      this.filterForm.get('startDate')?.value || ''
    );
  }

  // =========================
  // DELETE
  // =========================

  showDeleteConfirm(id: string): void {

    this.selectedExpenseId.set(id);

    this.showConfirmDialog.set(true);
  }

  deleteExpense(id: string): void {

    const confirmed = confirm(

      'Are you sure you want to delete this expense?'
    );

    if (!confirmed) return;

    this.expenseService.deleteExpense(id)

      .then(() => {

        alert('✅ Expense deleted successfully');

        this.getExpenses();

        this.showConfirmDialog.set(false);
      })

      .catch((err: any) => {

        console.error(err);

        alert('❌ Failed to delete expense');
      });
  }

  // =========================
  // EXPORT
  // =========================

  exportCSV(): void {

    console.log('Export CSV clicked');
  }

  // =========================
  // EDIT
  // =========================

  editExpense(expense: any): void {

    if (!expense.id) {

      console.error('Expense ID missing');

      return;
    }

    this.router.navigate([

      '/edit-expense',

      expense.id
    ]);
  }

  // =========================
  // CATEGORY COLORS
  // =========================

  getCategoryClass(category: string): string {

    const classes: { [key: string]: string } = {

      Groceries:
        'bg-green-100 text-green-800',

      Leisure:
        'bg-blue-100 text-blue-800',

      Electronics:
        'bg-yellow-100 text-yellow-800',

      Utilities:
        'bg-red-100 text-red-800',

      Clothing:
        'bg-purple-100 text-purple-800',

      Health:
        'bg-pink-100 text-pink-800',

      Others:
        'bg-gray-100 text-gray-800',
    };

    return (

      classes[category]

      ||

      'bg-gray-100 text-gray-800'
    );
  }

  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    if (this.expenseSubscription) {

      this.expenseSubscription.unsubscribe();
    }
  }
}