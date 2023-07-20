import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BattleRoomPageRoutingModule } from './battle-room-routing.module';

import { BattleRoomPage } from './battle-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BattleRoomPageRoutingModule
  ],
  declarations: [BattleRoomPage]
})
export class BattleRoomPageModule {}
