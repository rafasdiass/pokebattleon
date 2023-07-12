import { Injectable, Inject } from '@angular/core';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { CardPokemonService } from './card-pokemon.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Firestore } from '@angular/fire/firestore';
import { setDoc, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<FirebaseUser | null>;

  constructor(@Inject(Auth) public auth: Auth, private cardPokemonService: CardPokemonService, private userService: UserService, private db: Firestore) {
    this.user$ = new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => subscriber.next(user));
      // Return the unsubscribe function to clean up the listener
      return unsubscribe;
    });
  }

  signIn(email: string, password: string): Promise<FirebaseUser> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  async register(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
  
      if (firebaseUser && firebaseUser.email) { // Check if email is not null
        // Update user profile with displayName
        await updateProfile(firebaseUser, { displayName });
  
        // Create a new user document in Firestore
        const user = new User(firebaseUser.uid, firebaseUser.email, displayName);
        await setDoc(doc(this.db, 'users', firebaseUser.uid), user.toFirestore());
  
        // Get 5 random Pokemons
        const randomPokemons = await this.cardPokemonService.getRandomPokemon(5);
  
        // Save each Pokemon to the user's Pokemon collection
        for (const pokemon of randomPokemons) {
            await this.cardPokemonService.updateUserCard(firebaseUser.uid, pokemon.toFirestore());
        }
      }
  
      return firebaseUser;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
  

  signOut(): Promise<void> {
    return signOut(this.auth)
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  getUser(): Observable<FirebaseUser | null> {
    return this.user$;
  }
  
  async updateProfile(user: FirebaseUser, displayName: string): Promise<void> {
    return updateProfile(user, { displayName })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }
}
