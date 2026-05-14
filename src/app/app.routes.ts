import { Routes } from '@angular/router';

import { EditExpenseComponent } from './expenses/edit-expense/edit-expense.component';

import { AddExpenseComponent } from './expenses/add-expense/add-expense.component';

import { ExpenseResolverService } from './core/services/expense-resolver.service';

export const routes: Routes = [

  // =========================
  // HOME
  // =========================

  {
    path: '',

    loadComponent: () =>

      import('./components/home/home.component')

        .then((m) => m.HomeComponent),
  },

  // =========================
  // DASHBOARD
  // =========================

  {
    path: 'dashboard',

    loadComponent: () =>

      import('./components/dashboard/dashboard.component')

        .then((m) => m.DashboardComponent),
  },

  // =========================
  // USERS
  // =========================

  {
    path: 'users',

    loadComponent: () =>

      import('./users/user-management/user-management.component')

        .then((m) => m.UserManagementComponent),

    children: [

      {
        path: '',

        loadComponent: () =>

          import('./users/user-list/user-list.component')

            .then((m) => m.UserListComponent),
      },

      {
        path: ':id',

        loadComponent: () =>

          import('./users/user-details/user-details.component')

            .then((m) => m.UserDetailsComponent),
      },
    ],
  },

  // =========================
  // AUTH
  // =========================

  {
    path: 'login',

    loadComponent: () =>

      import('./auth/login/login.component')

        .then((m) => m.LoginComponent),
  },

  {
    path: 'signup',

    loadComponent: () =>

      import('./auth/signup/signup.component')

        .then((m) => m.SignupComponent),
  },

  {
    path: 'forgot-password',

    loadComponent: () =>

      import('./auth/forgot-password/forgot-password.component')

        .then((m) => m.ForgotPasswordComponent),
  },

  {
    path: 'reset-password/:token',

    loadComponent: () =>

      import('./auth/reset-password/reset-password.component')

        .then((m) => m.ResetPasswordComponent),
  },

  {
    path: 'auth/social',

    loadComponent: () =>

      import('./auth/social-auth/social-auth.component')

        .then((m) => m.SocialAuthComponent),
  },

  // =========================
  // EXPENSES
  // =========================

  

  {
    path: 'add-expense',

    component: AddExpenseComponent,
  },

  {
    path: 'edit-expense/:id',

    component: EditExpenseComponent,

    resolve: {
      expense: ExpenseResolverService,
    },
  },

  // =========================
  // INSIGHTS
  // =========================

  {
    path: 'insights',

    loadComponent: () =>

      import('./components/insights/insights.component')

        .then((m) => m.InsightsComponent),
  },

  // =========================
  // PRIVACY POLICY
  // =========================

  {
    path: 'privacy-policy',

    loadComponent: () =>

      import('./pages/privacy-policy/privacy-policy.component')

        .then((m) => m.PrivacyPolicyComponent),
  },

  // =========================
  // TERMS
  // =========================

  {
    path: 'terms-of-service',

    loadComponent: () =>

      import('./pages/terms-of-service/terms-of-service.component')

        .then((m) => m.TermsOfServiceComponent),
  },

  // =========================
  // FALLBACK
  // =========================

  {
    path: '**',

    redirectTo: '',
  },
];