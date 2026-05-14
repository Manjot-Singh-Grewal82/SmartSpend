import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  updateDoc,
  doc
} from '@angular/fire/firestore';

import {
  Auth
} from '@angular/fire/auth';

import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  firestore = inject(Firestore);

  auth = inject(Auth);

  // =========================
  // SET BUDGET
  // =========================

  async setBudget(amount: number): Promise<void> {

    const user = this.auth.currentUser;

    if (!user) return;

    const budgetRef = collection(
      this.firestore,
      'budgets'
    );

    await addDoc(budgetRef, {

      uid: user.uid,

      amount
    });
  }

  // =========================
  // GET BUDGET
  // =========================

  getBudget(): Observable<any[]> {

    const user = this.auth.currentUser;

    const budgetQuery = query(

      collection(
        this.firestore,
        'budgets'
      ),

      where(
        'uid',
        '==',
        user?.uid || ''
      )
    );

    return collectionData(
      budgetQuery,
      { idField: 'id' }
    ) as Observable<any[]>;
  }
}