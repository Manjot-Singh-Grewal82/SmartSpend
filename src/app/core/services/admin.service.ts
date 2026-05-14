import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';

import {
  Auth
} from '@angular/fire/auth';

import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AdminService {

  firestore = inject(Firestore);

  auth = inject(Auth);

  // =========================
  // DASHBOARD STATS
  // =========================

  getStats(): Observable<any> {

    const user = this.auth.currentUser;

    const expenseQuery = query(

      collection(
        this.firestore,
        'expenses'
      ),

      where(
        'uid',
        '==',
        user?.uid || ''
      )
    );

    return collectionData(
      expenseQuery,
      { idField: 'id' }

    ).pipe(

      map((expenses: any[]) => {

        const totalAmount = expenses.reduce(

          (sum, expense) =>

            sum + Number(expense.amount || 0),

          0
        );

        // =========================
        // CATEGORY DISTRIBUTION
        // =========================

        const categoryMap: any = {};

        expenses.forEach((expense) => {

          const category =
            expense.category || 'Others';

          if (!categoryMap[category]) {

            categoryMap[category] = 0;
          }

          categoryMap[category] +=
            Number(expense.amount || 0);
        });

        const categoryDistribution =

          Object.keys(categoryMap).map(

            (key) => {

              return {

                _id: key,

                total: categoryMap[key],
              };
            }
          );

        return {

          userCount: 1,

          newUsers: 1,

          expenseCount: expenses.length,

          totalAmount,

          categoryDistribution,
        };
      })
    );
  }

  // =========================
  // USERS PLACEHOLDER
  // =========================

  getAllUsers(
    page = 1,
    limit = 10,
    search = ''
  ): Observable<any> {

    return new Observable((observer) => {

      observer.next({

        users: [],

        total: 0,

        page,

        limit,

        search,
      });

      observer.complete();
    });
  }

  // =========================
  // USER DETAILS
  // =========================

  getUserDetails(
    userId: string
  ): Observable<any> {

    return new Observable((observer) => {

      observer.next({

        id: userId,

        name: 'Demo User',

        email: 'demo@example.com',
      });

      observer.complete();
    });
  }

  // =========================
  // USER EXPENSES
  // =========================

  getUserExpenses(
    userId: string
  ): Observable<any> {

    const user = this.auth.currentUser;

    const expenseQuery = query(

      collection(
        this.firestore,
        'expenses'
      ),

      where(
        'uid',
        '==',
        user?.uid || ''
      )
    );

    return collectionData(
      expenseQuery,
      { idField: 'id' }

    ) as Observable<any>;
  }
}