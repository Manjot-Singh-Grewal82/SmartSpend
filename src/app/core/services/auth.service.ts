import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  signup(user: any) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  login(user: any) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuthenticated() {
    return !!this.auth.currentUser;
  }

  // dummy methods to stop errors
  getToken() { return null; }
  getRefreshToken() { return null; }
  getLastKnownToken() { return null; }
  refreshAccessToken() { return null as any; }
  isAdmin() { return false; }
  redirectToExpenses() {}
  handleSocialAuth() {}
  forgotPassword() { return null as any; }
  resetPassword() { return null as any; }
}