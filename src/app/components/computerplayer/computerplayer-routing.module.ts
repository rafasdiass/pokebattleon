import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComputerPlayerPage } from './computerplayer.page';

const routes: Routes = [
  {
    path: '',
    component: ComputerPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerplayerPageRoutingModule {}
