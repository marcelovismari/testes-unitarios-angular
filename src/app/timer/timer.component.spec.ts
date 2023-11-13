import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { TimerComponent } from './timer.component';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent],
    });
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('deve iniciar dataInicioTimer e tempoDecorridoEmSegundos e chamar o atualizarTimerSpy a cada segundo', () => {
    // Criamos um "spy" para saber quantas vezes o método
    // `atualizarTimer` foi chamado:
    const atualizarTimerSpy = spyOn(
      component,
      'atualizarTimer'
    );

    // Valor da data corrente que usaremos como valor simulado,
    // ou seja, dentro deste teste qualquer `new Date()`
    // retornará o valor abaixo:
    const dataMock = new Date('2020-01-01T12:00:00.000Z');

    // Configura um "relógio" de teste, permitindo o
    // controle do tempo de execução do código de teste.
    //
    // Documentação: https://jasmine.github.io/api/2.6/Clock.html
    jasmine.clock().install();

    // Configuramos a data atual
    jasmine.clock().mockDate(dataMock);

    // Chama o método que está sendo testado:
    component.iniciarTimer();

    // Esperamos que as variáveis sejam inicializadas com os
    // valores de `new Date()` e `0` respectivamente
    expect(component.dataInicioTimer.getTime()).toBe(
      dataMock.getTime()
    );

    expect(component.tempoDecorridoEmSegundos).toBe(0);

    // Avançamos 3 segundos na linha do tempo para verificar
    // se o método `atualizarTimer` foi chamado 3 vezes.
    // Lembrando que o método deve ser chamado a cada 1 segundo
    jasmine.clock().tick(3000);
    expect(atualizarTimerSpy).toHaveBeenCalledTimes(3);
  });

  it('deve atualizar o tempoDecorridoEmSegundos quando atualizarTimer() for chamado', () => {
    // Configuramos um valor conhecido para o `dataInicioTimer`
    component.dataInicioTimer = new Date(
      '2020-01-01T12:00:00.000Z'
    );

    jasmine.clock().install();

    const mockNewDate = new Date(
      component.dataInicioTimer.getTime()
    );

    // Configuramos a linha do tempo de modo que a data corrente
    // seja exatamente igual a `component.dataInicioTimer`, ou seja,
    // 2020-01-01T12:00:00.000Z
    jasmine.clock().mockDate(mockNewDate);

    // Vamos avançar alguns segundos na linha do tempo:
    const avancaRelogioEmXSegundos = 10;
    jasmine.clock().tick(avancaRelogioEmXSegundos * 1000);

    // Ao chamar o `atualizarTimer`, esperamos que seja
    // calculada a diferença de tempo entre `component.dataInicioTimer`
    // e `new Date()`. Lembrando que `new Date()` é um valor
    // conhecido, mockado logo acima.
    component.atualizarTimer();
    expect(component.tempoDecorridoEmSegundos).toBe(
      avancaRelogioEmXSegundos
    );

    // Também testamos se o valor de `component.tempoDecorridoEmSegundos`
    // está sendo atualizado na tela. Para isto chamamos o
    // `detectChanges` para que o Angular atualize o HTML
    fixture.detectChanges();

    const divTimer = fixture.debugElement.query(
      By.css('div.timer')
    );

    const divTimerElement =
      divTimer.nativeElement as HTMLDivElement;

    expect(divTimerElement.textContent).toContain(
      `Timer: ${avancaRelogioEmXSegundos}s`
    );
  });
});
