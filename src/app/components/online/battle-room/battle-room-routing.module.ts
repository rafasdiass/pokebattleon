import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BattleRoomPage } from './battle-room.page';

const routes: Routes = [
  {
    path: '',
    component: BattleRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BattleRoomPageRoutingModule {}
