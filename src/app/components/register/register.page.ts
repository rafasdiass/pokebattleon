import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { PlayerService } from '../../services/player.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private cardPokemonService: CardPokemonService,
    private playerService: PlayerService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    try {
      const { email, password, displayName } = this.registerForm.value;

      // Register user with Firebase Auth
      const firebaseUser = await this.authService.register(email, password);

      if (firebaseUser) {
        console.log('User successfully registered with Firebase.');

        // Create new User document in Firestore
        const user: User = new User(
          firebaseUser.uid,
          email,
          displayName
        );

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        };

        await this.userService.createUser(userData);

        console.log('User successfully created in Firestore.');

        // Create initial Pokemon Card for user with an empty array of pokemons
        await this.cardPokemonService.updateUserCard(firebaseUser.uid, { pokemons: [] });

        console.log('Created initial Pokemon Card for user.');

        // Add Pokemons to user's card
        for (let i = 0; i < 3; i++) {
          await this.cardPokemonService.addPokemon(firebaseUser.uid);
        }

        console.log('Added initial pokemons to user card.');

        // Navigate to the login page
        this.router.navigate(['/login']);

        console.log('Successfully navigated to login page.');

        alert('User successfully registered.');
      }
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/email-already-in-use') {
        console.log('Email already in use. Please choose a different email or login with your existing account.');
        alert('Email already in use. Please choose a different email or login with your existing account.');
      } else {
        console.log('Error in registration. Please try again.');
        alert('Error in registration. Please try again.');
      }
    }
  }
}
