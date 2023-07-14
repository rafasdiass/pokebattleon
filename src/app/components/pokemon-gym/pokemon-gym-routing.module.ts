import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PokemonGymPage } from './pokemon-gym.page';

const routes: Routes = [
  {
    path: '',
    component: PokemonGymPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokemonGymPageRoutingModule {}
