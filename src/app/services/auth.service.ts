import { Injectable, Inject } from '@angular/core';
import { User, Auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { updateProfile } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth;
  user$: Observable<User | null>;

  constructor(@Inject(Auth) auth: Auth) {
    this.auth = auth;
    this.user$ = new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => subscriber.next(user));
      // Return the unsubscribe function to clean up the listener
      return unsubscribe;
    });
  }

  signIn(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  register(email: string, password: string): Promise<User> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  signOut(): Promise<void> {
    return signOut(this.auth)
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  getUser(): Observable<User | null> {
    return this.user$;
  }
  async updateProfile(user: User, displayName: string): Promise<void> {
    return updateProfile(user, { displayName })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }
}
