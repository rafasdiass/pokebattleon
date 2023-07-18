import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BattleResultPageRoutingModule } from './battle-result-routing.module';

import { BattleResultPage } from './battle-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BattleResultPageRoutingModule
  ],
  declarations: [BattleResultPage],
  exports: [BattleResultPage],  
})
export class BattleResultPageModule {}
