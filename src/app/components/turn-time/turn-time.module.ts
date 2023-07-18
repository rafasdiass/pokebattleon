import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TurnTimePageRoutingModule } from './turn-time-routing.module';

import { TurnTimePage } from './turn-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TurnTimePageRoutingModule
  ],
  declarations: [TurnTimePage],
  exports: [TurnTimePage],
})
export class TurnTimePageModule {}
