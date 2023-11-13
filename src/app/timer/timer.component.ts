import { Component, OnDestroy } from '@angular/core';

import { EMPTY, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
})
export class TimerComponent implements OnDestroy {
  tempoDecorridoEmSegundos: number = 0;
  dataInicioTimer: Date = new Date();
  subscriptionTimer: Subscription = EMPTY.subscribe();

  ngOnDestroy(): void {
    this.pararTimer();
  }

  iniciarTimer() {
    const umSegundoEmMS = 1e3;

    this.dataInicioTimer = new Date();
    this.tempoDecorridoEmSegundos = 0;

    this.subscriptionTimer = interval(
      umSegundoEmMS
    ).subscribe(() => this.atualizarTimer());
  }

  atualizarTimer() {
    const dataAtual = new Date();

    this.tempoDecorridoEmSegundos = Math.floor(
      (dataAtual.getTime() -
        this.dataInicioTimer.getTime()) /
        1000
    );
  }

  pararTimer() {
    this.subscriptionTimer.unsubscribe();
  }
}
