import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameBoardPageRoutingModule } from './game-board-routing.module';
import { GameBoardPage } from './game-board.page';
import { PlayerPageModule } from '../player/player.module';
import { ComputerplayerPageModule } from '../computerplayer/computerplayer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameBoardPageRoutingModule,
    PlayerPageModule,
    ComputerplayerPageModule  
  ],
  declarations: [GameBoardPage],
  exports: [GameBoardPage], 
})
export class GameBoardPageModule {}
