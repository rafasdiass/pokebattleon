import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  login() {
    const formValue = this.loginForm.value;
    this.authService.signIn(formValue.email, formValue.password).then(
      () => {
        this.router.navigate(['/home']);
      },
      (error: any) => {
        console.log(error);
        this.errorMessage = error.message;
      }
    );
  }

  register() {
    this.router.navigate(['/register']);
  }
}
