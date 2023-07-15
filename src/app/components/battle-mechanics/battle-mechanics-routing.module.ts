import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BattleMechanicsPage } from './battle-mechanics.page';

const routes: Routes = [
  {
    path: '',
    component: BattleMechanicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class BattleMechanicsPageRoutingModule {}
