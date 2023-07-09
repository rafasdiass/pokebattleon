import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PokemonSelectionPage } from './pokemon-selection.page';

const routes: Routes = [
  {
    path: '',
    component: PokemonSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokemonSelectionPageRoutingModule {}
