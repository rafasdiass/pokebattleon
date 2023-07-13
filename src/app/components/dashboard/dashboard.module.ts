import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { AuthService } from '../../services/auth.service'; // Substitua pelo caminho correto para o AuthService
import { NavbarPageModule } from '../navbar/navbar.module';
import { PlayerPageModule } from '../player/player.module';
import { CardPageModule } from '../card/card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    NavbarPageModule,
    PlayerPageModule,
    CardPageModule
  ],
  declarations: [DashboardPage],
  providers: [AuthService] 
})
export class DashboardPageModule {}
