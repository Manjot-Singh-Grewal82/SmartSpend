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
  FormBuilder,
  FormsModule
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { ExpenseService } from '../../core/services/expense.service';

// ✅ EXPORT LIBRARIES

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-list-expenses',

  standalone: true,

  imports: [
    DatePipe,
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
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

  filteredExpenses = signal<any[]>([]);

  totalAmount = signal<number>(0);

  currentMonthTotal = 0;

  averagePerDay = 0;

  searchText = '';

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

          this.expenses.set(res);

          this.filteredExpenses.set(res);

          const total = res.reduce(

            (sum, expense) =>
              sum + Number(expense.amount || 0),

            0
          );

          this.totalAmount.set(total);

          const now = new Date();

          // CURRENT MONTH

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

          // AVERAGE

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

          console.error(err);

          this.errorMsg.set(

            err?.message ||

            'Failed to load expenses'
          );

          this.isLoading.set(false);
        }
      });
  }

  // =========================
  // FILTER
  // =========================

  filterExpenses(): void {

    let filtered = this.expenses();

    // SEARCH

    if (this.searchText.trim()) {

      filtered = filtered.filter(

        expense =>

          expense.title
            ?.toLowerCase()
            .includes(

              this.searchText
                .toLowerCase()
            )
      );
    }

    const filterValue =

      this.filterForm.get('filter')?.value;

    const now = new Date();

    // WEEK

    if (filterValue === 'week') {

      const weekAgo = new Date();

      weekAgo.setDate(now.getDate() - 7);

      filtered = filtered.filter(

        expense =>

          new Date(expense.date) >= weekAgo
      );
    }

    // MONTH

    if (filterValue === 'month') {

      filtered = filtered.filter(

        expense => {

          const expenseDate =

            new Date(expense.date);

          return (

            expenseDate.getMonth()

            ===

            now.getMonth()

            &&

            expenseDate.getFullYear()

            ===

            now.getFullYear()
          );
        }
      );
    }

    // CUSTOM

    if (filterValue === 'custom') {

      const startDate =

        this.filterForm.get('startDate')?.value;

      const endDate =

        this.filterForm.get('endDate')?.value;

      if (startDate && endDate) {

        filtered = filtered.filter(

          expense => {

            const expenseDate =

              new Date(expense.date);

            return (

              expenseDate >= new Date(startDate)

              &&

              expenseDate <= new Date(endDate)
            );
          }
        );
      }
    }

    this.filteredExpenses.set(filtered);
  }

  // =========================
  // FILTER EVENTS
  // =========================

  onFilterChange(): void {

    this.filterExpenses();
  }

  applyCustomFilter(): void {

    this.filterExpenses();
  }

  onStartDateChange(): void {

    this.minDate.set(

      this.filterForm.get('startDate')?.value || ''
    );
  }

  // =========================
  // DELETE
  // =========================

  deleteExpense(id: string): void {

    const confirmed = confirm(

      'Delete this expense?'
    );

    if (!confirmed) return;

    this.expenseService.deleteExpense(id)

      .then(() => {

        alert('✅ Expense deleted');

      })

      .catch((err: any) => {

        console.error(err);

        alert('❌ Failed to delete');
      });
  }

  // =========================
  // CSV EXPORT
  // =========================

  exportCSV(): void {

    const expenses = this.filteredExpenses();

    if (expenses.length === 0) {

      alert('No expenses to export');

      return;
    }

    const exportData = expenses.map(

      expense => ({

        Title:
          expense.title,

        Amount:
          expense.amount,

        Category:
          expense.category,

        Date:
          expense.date,
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(
      exportData
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Expenses'
    );

    const excelBuffer = XLSX.write(

      workbook,

      {
        bookType: 'xlsx',

        type: 'array',
      }
    );

    const fileData = new Blob(

      [excelBuffer],

      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      }
    );

    saveAs(
      fileData,
      'smartspend-expenses.xlsx'
    );
  }

  // =========================
  // PDF EXPORT
  // =========================

  exportPDF(): void {

    const expenses = this.filteredExpenses();

    if (expenses.length === 0) {

      alert('No expenses to export');

      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      'SmartSpend Expense Report',
      20,
      20
    );

    let y = 40;

    expenses.forEach((expense) => {

      doc.text(
        `Title: ${expense.title}`,
        20,
        y
      );

      doc.text(
        `Amount: ₹${expense.amount}`,
        20,
        y + 8
      );

      doc.text(
        `Category: ${expense.category}`,
        20,
        y + 16
      );

      doc.text(
        `Date: ${expense.date}`,
        20,
        y + 24
      );

      y += 40;

      if (y > 260) {

        doc.addPage();

        y = 20;
      }
    });

    doc.save(
      'smartspend-report.pdf'
    );
  }

  // =========================
  // EDIT
  // =========================

  editExpense(expense: any): void {

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