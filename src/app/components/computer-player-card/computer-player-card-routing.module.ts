import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComputerPlayerCardPage } from './computer-player-card.page';

const routes: Routes = [
  {
    path: '',
    component: ComputerPlayerCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerPlayerCardPageRoutingModule {}
