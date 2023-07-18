import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Importamos o AlertController para mostrar alertas

@Component({
  selector: 'app-turn-time',
  templateUrl: './turn-time.page.html',
  styleUrls: ['./turn-time.page.scss'],
})
export class TurnTimePage implements OnInit {
  @Output() timeIsUp = new EventEmitter();
  timer: number = 20; // Inicializado para 20
  preTurnTimer: number = 3; // Inicializado para 3
  intervalId: any;
  preTurnIntervalId: any;

  constructor(public alertController: AlertController) {} // Injetamos o AlertController

  ngOnInit() {
    this.startPreTurnCountdown();
  }

  resetTimer() {
    // Se já houver um temporizador rodando, limpá-lo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.timer = 20; // 20 segundos para cada turno
    this.startCountdown();
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(this.intervalId);
        this.timeIsUp.emit(); // emite o evento timeIsUp
      }
    }, 1000);
  }

  async startPreTurnCountdown() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'O turno começará em 3 segundos!',
      buttons: ['OK']
    });

    await alert.present();

    this.preTurnIntervalId = setInterval(() => {
      this.preTurnTimer--;
      if (this.preTurnTimer === 0) {
        clearInterval(this.preTurnIntervalId);
        this.resetTimer(); // Inicia a contagem regressiva do turno
      }
    }, 1000);
  }
}
