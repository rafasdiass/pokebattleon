import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PokemonSelectionPageRoutingModule } from './pokemon-selection-routing.module';

import { PokemonSelectionPage } from './pokemon-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PokemonSelectionPageRoutingModule
  ],
  declarations: [PokemonSelectionPage]
})
export class PokemonSelectionPageModule {}
