import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PokemonGymPageRoutingModule } from './pokemon-gym-routing.module';

import { PokemonGymPage } from './pokemon-gym.page';
import { PlayerPageModule } from '../player/player.module';
import { ComputerplayerPageModule } from '../computerplayer/computerplayer.module';
import { CardPageModule } from '../card/card.module';
import { ComputerPlayerCardPageModule } from '../computer-player-card/computer-player-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PokemonGymPageRoutingModule,
    PlayerPageModule,
    ComputerplayerPageModule,
    CardPageModule,
    ComputerPlayerCardPageModule
  ],
  declarations: [PokemonGymPage]
})
export class PokemonGymPageModule {}
