import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getUser(userId: string) {
    return this.firestore.collection('users').doc<User>(userId).valueChanges();
  }

  updateUser(user: User) {
    return this.firestore.collection('users').doc<User>(user.uid).update(user);
  }

  createUser(user: User) {
    return this.firestore.collection('users').doc<User>(user.uid).set(user);
  }
}
