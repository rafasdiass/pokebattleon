import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = getAuth();
  
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async register(email: string, password: string): Promise<FirebaseUser> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.log(error);
    }
  }

  getUser(): Observable<FirebaseUser | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, subscriber);
      // Return the unsubscribe function to clean up the listener
      return unsubscribe;
    });
  }
}
