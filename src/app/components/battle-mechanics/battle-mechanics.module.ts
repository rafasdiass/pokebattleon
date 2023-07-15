import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BattleMechanicsPageRoutingModule } from './battle-mechanics-routing.module';
import { IconService } from '../../services/icon.service';
import { BattleMechanicsPage } from './battle-mechanics.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BattleMechanicsPageRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [BattleMechanicsPage],
  exports: [BattleMechanicsPage],
  providers: [IconService]
})
export class BattleMechanicsPageModule {}
