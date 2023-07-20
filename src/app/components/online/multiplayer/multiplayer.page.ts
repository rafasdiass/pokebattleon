import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.page.html',
  styleUrls: ['./multiplayer.page.scss'],
})
export class MultiplayerPage implements OnInit {
  onlineUsers: User[] = [];

  constructor(@Inject(UserService) private userService: UserService) { }

  async ngOnInit() {
    this.onlineUsers = await this.userService.getOnlineUsers();
  }
}
