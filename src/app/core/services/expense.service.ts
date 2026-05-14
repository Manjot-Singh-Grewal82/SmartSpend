import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  query,
  where
} from '@angular/fire/firestore';

import {
  Auth
} from '@angular/fire/auth';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {

  firestore = inject(Firestore);

  auth = inject(Auth);

  collectionName = 'expenses';

  // =========================
  // ADD EXPENSE
  // =========================

  addExpense(expense: any): Promise<any> {

    const expenseRef = collection(
      this.firestore,
      this.collectionName
    );

    const user = this.auth.currentUser;

    return addDoc(expenseRef, {

      ...expense,

      uid: user?.uid || ''
    });
  }

  // =========================
  // GET USER EXPENSES
  // =========================

  getExpenses(): Observable<any[]> {

    return new Observable((observer) => {

      const user = this.auth.currentUser;

      const expenseQuery = query(

        collection(
          this.firestore,
          this.collectionName
        ),

        where(
          'uid',
          '==',
          user?.uid || ''
        )
      );

      const unsubscribe = onSnapshot(

        expenseQuery,

        (snapshot) => {

          const expenses = snapshot.docs.map(

            (doc) => {

              return {

                id: doc.id,

                ...doc.data(),
              };
            }
          );

          observer.next(expenses);
        },

        (error) => {

          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  // =========================
  // GET SINGLE EXPENSE
  // =========================

  async getExpense(id: string): Promise<any> {

    const expenseDoc = doc(
      this.firestore,
      `${this.collectionName}/${id}`
    );

    const snapshot = await getDoc(expenseDoc);

    if (snapshot.exists()) {

      return {

        id: snapshot.id,

        ...snapshot.data(),
      };
    }

    return null;
  }

  // =========================
  // UPDATE EXPENSE
  // =========================

  updateExpense(
    id: string,
    data: any
  ): Promise<void> {

    const expenseDoc = doc(
      this.firestore,
      `${this.collectionName}/${id}`
    );

    return updateDoc(expenseDoc, data);
  }

  // =========================
  // DELETE EXPENSE
  // =========================

  deleteExpense(id: string): Promise<void> {

    const expenseDoc = doc(
      this.firestore,
      `${this.collectionName}/${id}`
    );

    return deleteDoc(expenseDoc);
  }
}