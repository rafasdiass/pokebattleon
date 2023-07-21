import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { Player } from '../../../models/player.model';
import { MessagingService } from '../../../services/serviceonline/messaging.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  player1: Player | null = null;
  player2: Player | null = null;
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private playerService: PlayerService,
    private messagingService: MessagingService
  ) {}

  async ngOnInit() {
    this.player1 = this.playerService.getPlayer1();
    this.player2 = this.playerService.getPlayer2();

    if (this.player1 && this.player2) {
      this.getChatMessages();
      this.listenForNewMessages();
    }
  }

  getChatMessages() {
    if (this.player1 && this.player2) {
      this.messagingService.getMessages(this.player1, this.player2).then(messages => {
        this.messages = messages;
      });
    }
  }

  listenForNewMessages() {
    if (this.player1 && this.player2) {
      this.messagingService.listenForNewMessages(this.player1, this.player2, (newMessage) => {
        this.messages.push(newMessage);
      });
    }
  }

  sendMessage() {
    if (this.player1 && this.player2 && this.newMessage !== '') {
      try {
        this.messagingService.sendMessage(this.player1, this.player2.uid, this.newMessage).then(() => {
          console.log('Mensagem enviada com sucesso!');
          this.newMessage = '';
        }).catch(err => {
          console.error('Falha ao enviar a mensagem: ', err);
        });
      } catch (e) {
        console.error('Exception caught while calling sendMessage: ', e);
      }
    }
  }
  
}
