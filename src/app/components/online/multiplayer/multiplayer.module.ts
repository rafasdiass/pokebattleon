import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiplayerPageRoutingModule } from './multiplayer-routing.module';

import { MultiplayerPage } from './multiplayer.page';
import { ChatPageModule } from '../chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiplayerPageRoutingModule,
    ChatPageModule
  ],
  declarations: [MultiplayerPage]
})
export class MultiplayerPageModule {}
