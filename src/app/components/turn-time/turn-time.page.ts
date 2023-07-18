import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-turn-time',
  templateUrl: './turn-time.page.html', // você tinha 'turn-timer' aqui mas parece que o nome do diretório é 'turn-time'
  styleUrls: ['./turn-time.page.scss'], // mesmo aqui
})
export class TurnTimePage implements OnInit {
  @Output() timeIsUp = new EventEmitter();
  timer: number = 20; // Inicializado para 20
  intervalId: any;

  ngOnInit() {
    this.resetTimer();
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
}
