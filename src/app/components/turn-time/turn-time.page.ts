import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-turn-time',
  templateUrl: './turn-time.page.html',
  styleUrls: ['./turn-time.page.scss'],
})
export class TurnTimePage implements OnInit {
  @Output() timeIsUp = new EventEmitter();
  timer: number = 20;
  intervalId: any;

  constructor(public alertController: AlertController) {}

  ngOnInit() {
    this.startCountdown();
  }

  resetTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.timer = 20;
    this.startCountdown();
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(this.intervalId);
        this.timeIsUp.emit();
      }
    }, 1000);
  }
}
