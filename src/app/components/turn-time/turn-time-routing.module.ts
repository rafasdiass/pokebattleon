import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TurnTimePage } from './turn-time.page';

const routes: Routes = [
  {
    path: '',
    component: TurnTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TurnTimePageRoutingModule {}
