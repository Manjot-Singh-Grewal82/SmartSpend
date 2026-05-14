import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  ChartOptions
} from 'chart.js';

import {
  BaseChartDirective
} from 'ng2-charts';

import {
  ExpenseService
} from '../../core/services/expense.service';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BaseChartDirective
  ],

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent
implements OnInit {

  // =========================
  // SERVICES
  // =========================

  expenseService =
    inject(ExpenseService);

  // =========================
  // DATA
  // =========================

  expenses: any[] = [];

  filteredExpenses: any[] = [];

  searchText = '';

  totalExpenses = 0;

  totalAmount = 0;

  monthlyAmount = 0;

  // =========================
  // BUDGET
  // =========================

  budget = 10000;

  remainingBudget = 0;

  budgetPercentage = 0;

  // =========================
  // PIE CHART
  // =========================

  pieChartLabels: string[] = [];

  pieChartDatasets = [
    {
      data: [] as number[],
    },
  ];

  pieChartType: 'pie' = 'pie';

  pieChartOptions:
    ChartOptions<'pie'> = {

      responsive: true,

      plugins: {

        legend: {
          position: 'bottom',
        },
      },
    };

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadDashboard();
  }

  // =========================
  // LOAD DASHBOARD
  // =========================

  loadDashboard(): void {

    this.expenseService

      .getExpenses()

      .subscribe({

        next: (data: any[]) => {

          this.expenses = data;

          this.filteredExpenses =
            data;

          // =====================
          // TOTALS
          // =====================

          this.totalExpenses =
            data.length;

          this.totalAmount =

            data.reduce(

              (sum, expense) =>

                sum +
                Number(
                  expense.amount || 0
                ),

              0
            );

          // =====================
          // MONTHLY TOTAL
          // =====================

          const currentMonth =
            new Date().getMonth();

          this.monthlyAmount =

            data

              .filter((expense) => {

                const expenseMonth =

                  new Date(
                    expense.date
                  ).getMonth();

                return (
                  expenseMonth ===
                  currentMonth
                );
              })

              .reduce(

                (sum, expense) =>

                  sum +
                  Number(
                    expense.amount || 0
                  ),

                0
              );

          // =====================
          // BUDGET
          // =====================

          this.updateBudget();

          // =====================
          // CATEGORY CHART
          // =====================

          const categoryMap: any = {};

          data.forEach((expense) => {

            const category =

              expense.category ||
              'Others';

            if (!categoryMap[category]) {

              categoryMap[category] = 0;
            }

            categoryMap[category] +=

              Number(
                expense.amount || 0
              );
          });

          this.pieChartLabels =

            Object.keys(categoryMap);

          this.pieChartDatasets = [

            {
              data: Object.values(
                categoryMap
              ) as number[],
            },
          ];
        },

        error: (err) => {

          console.error(err);
        }
      });
  }

  // =========================
  // LIVE BUDGET UPDATE
  // =========================

  updateBudget(): void {

    this.remainingBudget =

      this.budget -
      this.totalAmount;

    this.budgetPercentage =

      Math.min(

        (this.totalAmount /
          this.budget) * 100,

        100
      );
  }

  // =========================
  // SEARCH FILTER
  // =========================

  filterExpenses(): void {

    const text =

      this.searchText
        .toLowerCase();

    this.filteredExpenses =

      this.expenses.filter(

        (expense) =>

          expense.title
            ?.toLowerCase()
            .includes(text)

          ||

          expense.category
            ?.toLowerCase()
            .includes(text)
      );
  }

  // =========================
  // DELETE EXPENSE
  // =========================

  deleteExpense(id: string): void {

    const confirmDelete =

      confirm(
        'Delete this expense?'
      );

    if (!confirmDelete) return;

    this.expenseService

      .deleteExpense(id)

      .then(() => {

        alert(
          'Expense deleted'
        );
      })

      .catch((err) => {

        console.error(err);
      });
  }
}