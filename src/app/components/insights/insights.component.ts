import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  BaseChartDirective
} from 'ng2-charts';

import {
  ChartOptions
} from 'chart.js';

import { ExpenseService }
from '../../core/services/expense.service';

@Component({
  selector: 'app-insights',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BaseChartDirective
  ],

  templateUrl:
    './insights.component.html',

  styleUrls:
    ['./insights.component.scss']
})

export class InsightsComponent
implements OnInit {

  expenseService =
    inject(ExpenseService);

  expenses: any[] = [];

  filteredExpenses: any[] = [];

  // =========================
  // FILTERS
  // =========================

  selectedCategory = '';

  startDate = '';

  endDate = '';

  // =========================
  // ANALYTICS
  // =========================

  totalAmount = 0;

  averageExpense = 0;

  highestExpense = 0;

  lowestExpense = 0;

  totalTransactions = 0;

  // =========================
  // CHART
  // =========================

  pieChartLabels: string[] = [];

  pieChartDatasets = [
    {
      data: [] as number[]
    }
  ];

  pieChartType: 'pie' = 'pie';

  pieChartOptions:
    ChartOptions<'pie'> = {

      responsive: true,

      plugins: {
        legend: {
          position: 'top'
        }
      }
    };

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadExpenses();
  }

  // =========================
  // LOAD DATA
  // =========================

  loadExpenses(): void {

    this.expenseService

      .getExpenses()

      .subscribe((data: any[]) => {

        this.expenses = data;

        this.filteredExpenses =
          data;

        this.calculateInsights();
      });
  }

  // =========================
  // APPLY FILTERS
  // =========================

  applyFilters(): void {

    this.filteredExpenses =
      this.expenses.filter(
        (expense) => {

          const expenseDate =
            new Date(expense.date);

          const start =
            this.startDate
              ? new Date(this.startDate)
              : null;

          const end =
            this.endDate
              ? new Date(this.endDate)
              : null;

          const categoryMatch =
            this.selectedCategory
              ? expense.category ===
                this.selectedCategory
              : true;

          const startMatch =
            start
              ? expenseDate >= start
              : true;

          const endMatch =
            end
              ? expenseDate <= end
              : true;

          return (
            categoryMatch &&
            startMatch &&
            endMatch
          );
        }
      );

    this.calculateInsights();
  }

  // =========================
  // RESET FILTERS
  // =========================

  resetFilters(): void {

    this.selectedCategory = '';

    this.startDate = '';

    this.endDate = '';

    this.filteredExpenses =
      this.expenses;

    this.calculateInsights();
  }

  // =========================
  // CALCULATE ANALYTICS
  // =========================

  calculateInsights(): void {

    const amounts =
      this.filteredExpenses.map(
        (e) => Number(e.amount)
      );

    this.totalTransactions =
      amounts.length;

    this.totalAmount =
      amounts.reduce(
        (a, b) => a + b,
        0
      );

    this.averageExpense =
      amounts.length
        ? this.totalAmount /
          amounts.length
        : 0;

    this.highestExpense =
      amounts.length
        ? Math.max(...amounts)
        : 0;

    this.lowestExpense =
      amounts.length
        ? Math.min(...amounts)
        : 0;

    // =====================
    // CATEGORY CHART
    // =====================

    const categoryMap: any = {};

    this.filteredExpenses.forEach(
      (expense) => {

        const category =
          expense.category ||
          'Others';

        if (!categoryMap[category]) {

          categoryMap[category] = 0;
        }

        categoryMap[category] +=
          Number(expense.amount);
      }
    );

    this.pieChartLabels =
      Object.keys(categoryMap);

    this.pieChartDatasets = [
      {
        data: Object.values(
          categoryMap
        ) as number[]
      }
    ];
  }
}