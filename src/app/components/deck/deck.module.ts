import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeckPageRoutingModule } from './deck-routing.module';

import { DeckPage } from './deck.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeckPageRoutingModule
  ],
  declarations: [DeckPage],
  exports: [DeckPage],
})
export class DeckPageModule {}
