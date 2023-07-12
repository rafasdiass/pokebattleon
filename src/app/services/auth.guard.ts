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
     if (!loggedIn) {
       console.log('access denied')
       this.router.navigate(['/dashboard']);
     }
   }),
 );
}
}