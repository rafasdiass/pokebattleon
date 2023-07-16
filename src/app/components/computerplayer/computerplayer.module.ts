import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComputerplayerPageRoutingModule } from './computerplayer-routing.module';
import { ComputerPlayerPage } from './computerplayer.page';
import { CardPageModule } from '../card/card.module';  // Import CardPageModule
import { ComputerPlayerCardPageModule } from '../computer-player-card/computer-player-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComputerplayerPageRoutingModule,
    CardPageModule,
    ComputerPlayerCardPageModule  // Add CardPageModule to imports
  ],
  declarations: [ComputerPlayerPage],
  exports: [ComputerPlayerPage]
})
export class ComputerplayerPageModule {}
