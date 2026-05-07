import {
  Component,
  OnInit,
  inject,
  HostListener,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent
implements OnInit, AfterViewInit {

  adminService = inject(AdminService);

  elementRef = inject(ElementRef);

  // =========================
  // STATS
  // =========================

  stats: any = {};

  categoryChartData: any[] = [];

  // =========================
  // LOADING
  // =========================

  loading = {
    stats: false,
  };

  // =========================
  // RESPONSIVE
  // =========================

  containerWidth = 700;

  containerHeight = 400;

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadStats();
  }

  ngAfterViewInit(): void {

    this.updateChartDimensions();
  }

  // =========================
  // RESPONSIVE METHODS
  // =========================

  @HostListener('window:resize')

  updateChartDimensions(): void {

    const chartContainer =

      this.elementRef.nativeElement.querySelector(
        '.chart-container'
      );

    if (chartContainer) {

      this.containerWidth =
        chartContainer.clientWidth;

      this.containerHeight = Math.min(

        400,

        Math.max(
          300,
          this.containerWidth * 0.5
        )
      );
    }
  }

  @HostListener('window:resize')

  onResize(): void {

    this.categoryChartData = [

      ...this.categoryChartData
    ];
  }

  // =========================
  // LOAD STATS
  // =========================

  loadStats(): void {

    this.loading.stats = true;

    this.adminService.getStats()

      .subscribe({

        next: (data: any) => {

          console.log('Dashboard stats:', data);

          this.stats = data || {};

          // safe fallback
          if (this.stats?.categoryDistribution) {

            this.categoryChartData =

              this.stats.categoryDistribution.map(

                (item: any) => {

                  return {

                    name: item._id || 'Unknown',

                    value: item.total || 0,
                  };
                }
              );

          } else {

            this.categoryChartData = [];
          }

          this.loading.stats = false;

          setTimeout(() => {

            this.updateChartDimensions();

          }, 0);
        },

        error: (error: any) => {

          console.error(
            'Error loading stats:',
            error
          );

          this.loading.stats = false;
        },
      });
  }

  // =========================
  // FORMATTERS
  // =========================

  formatCurrency(amount: number): string {

    return new Intl.NumberFormat(

      'en-IN',

      {
        style: 'currency',

        currency: 'INR',
      }

    ).format(amount || 0);
  }

  formatDate(dateString: string): string {

    return new Date(dateString)

      .toLocaleDateString(

        'en-US',

        {
          year: 'numeric',

          month: 'short',

          day: 'numeric',
        }
      );
  }
}