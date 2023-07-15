import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComputerPlayerCardPageRoutingModule } from './computer-player-card-routing.module';

import { ComputerPlayerCardPage } from './computer-player-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComputerPlayerCardPageRoutingModule,
  ],
  declarations: [ComputerPlayerCardPage], 
  exports:[ComputerPlayerCardPage]
})
export class ComputerPlayerCardPageModule {}
