import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Supondo que você tenha AuthService

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  constructor(private router: Router, private authService: AuthService) { } 
  isLoggedIn: boolean=true;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
      }
      console.log('isLoggedIn:', this.isLoggedIn);
    });
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);  // Navegar para a rota do dashboard
  }

  navigateToPokemonGym() {
    this.router.navigate(['/game-board']);  // Navegar para a rota do ginásio Pokémon
  }

  logout() {
    this.authService.signOut()  // Chame authService.signOut() para fazer logout
    .then(() => {
        // Aqui você pode adicionar qualquer lógica que deve ocorrer após o logout
        // Por exemplo, redirecionar para a página de login
    })
    .catch((error) => {
        // Se ocorrer um erro durante o logout, você pode lidar com ele aqui
        console.error('Erro ao fazer logout:', error);
    });
}
}