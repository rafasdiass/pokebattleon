import { Component, OnInit } from '@angular/core';
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
  // Properties to bind to form fields
  email = '';
  password = '';
  displayName = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async register() {
    try {
      // Register user with Firebase Auth
      const firebaseUser = await this.authService.register(this.email, this.password);

      // Create new User document in Firestore
      const user: User = new User(
        firebaseUser.uid,
        this.email,
        this.displayName
      );

      await this.userService.createUser(user);

      // Navigate to the login page 
      this.router.navigate(['/login']); 
    } catch (error) {
      console.log(error);
      // Show error to user
    }
  }
}
