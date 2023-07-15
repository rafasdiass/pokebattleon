import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BattleMechanicsPageRoutingModule } from './battle-mechanics-routing.module';

import { BattleMechanicsPage } from './battle-mechanics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BattleMechanicsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [BattleMechanicsPage],
  exports: [BattleMechanicsPage]
})
export class BattleMechanicsPageModule {}
