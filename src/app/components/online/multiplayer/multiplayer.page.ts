import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { Player } from '../../../models/player.model';
import { ModalController } from '@ionic/angular';
import { ChatPage } from '../chat/chat.page';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.page.html',
  styleUrls: ['./multiplayer.page.scss'],
})
export class MultiplayerPage implements OnInit {
  onlinePlayers: Player[] = [];

  constructor(
    private playerService: PlayerService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.onlinePlayers = await this.playerService.getOnlinePlayers();
  }

  async openChatWithUser(player: Player) {
    await this.playerService.onPlayer2Selected(player.uid);
    
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { 'uid': player.uid }
    });
    
    return await modal.present();
  }
}