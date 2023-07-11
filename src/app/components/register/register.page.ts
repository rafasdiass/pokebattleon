import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
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
  
        // Navigate to the login page
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // Handle the case where the email is already in use
        console.log('Email already in use. Please choose a different email or login with your existing account.');
        // Show appropriate error message to the user
      } else {
        console.log(error);
        // Show general error message to the user
      }
    }
  }
}
