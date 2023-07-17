import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PokemonGymPageRoutingModule } from './pokemon-gym-routing.module';

import { PokemonGymPage } from './pokemon-gym.page';
import { PlayerPageModule } from '../player/player.module';
import { ComputerplayerPageModule } from '../computerplayer/computerplayer.module';
import { CardPageModule } from '../card/card.module';
import { ComputerPlayerCardPageModule } from '../computer-player-card/computer-player-card.module';
import { BattleMechanicsPageModule } from '../battle-mechanics/battle-mechanics.module';
import { ScorePageModule } from '../score/score.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PokemonGymPageRoutingModule,
    PlayerPageModule,
    ComputerplayerPageModule,
    CardPageModule,
    ComputerPlayerCardPageModule,
    BattleMechanicsPageModule,
    ReactiveFormsModule,
    ScorePageModule
  ],
  declarations: [PokemonGymPage]
})
export class PokemonGymPageModule {}
