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
  async getChatMessages() {
    if (this.player1 && this.player2) {
      this.messagingService.getMessages(this.player1, this.player2).then(async messages => {
        this.messages = await Promise.all(messages.map(async message => {
          const senderName = await this.playerService.getPlayerNameById(message.senderId);
          return {...message, senderName };
        }));
        this.scrollToLatestMessage();
      });
    }
  }
  
  async listenForNewMessages() {
    if (this.player1 && this.player2) {
      this.messagingService.listenForNewMessages(this.player1, this.player2, async (newMessage) => {
        const senderName = await this.playerService.getPlayerNameById(newMessage.senderId);
        this.messages.push({...newMessage, senderName });
        this.scrollToLatestMessage();
      });
    }
  }
  

  sendMessage() {
    if (this.player1 && this.player2 && this.newMessage !== '') {
      try {
        this.messagingService.sendMessage(this.player1, this.player2.uid, this.newMessage).then(() => {
          console.log('Mensagem enviada com sucesso!');
          this.newMessage = '';
          this.scrollToLatestMessage();
        }).catch(err => {
          console.error('Falha ao enviar a mensagem: ', err);
        });
      } catch (e) {
        console.error('Exception caught while calling sendMessage: ', e);
      }
    }
  }

  scrollToLatestMessage() {
    setTimeout(() => {
      const lastMessageElement = document.getElementById('lastMessage');
      lastMessageElement?.scrollIntoView();
    }, 0);
  }
}
