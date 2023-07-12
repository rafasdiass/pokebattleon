import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';  // Adicionado 'tap' aqui
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map(user => !!user), // Convert 'user' to a boolean
      tap((loggedIn: boolean) => {  // Tipo boolean adicionado
        if (loggedIn) {  // Se o usuário estiver logado
          console.log('access granted')
          this.router.navigate(['/dashboard']);  // Navegar para a página de dashboard
        } else {
          console.log('access denied');
          // Aqui, você pode redirecionar para a página de login, se desejar.
          this.router.navigate(['/login']); 
          // this.router.navigate(['/login']);
        }
      }),
    );
  }
}
