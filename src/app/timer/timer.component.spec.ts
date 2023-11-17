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

  it(`deve iniciar dataInicioTimer e tempoDecorridoEmSegundos
      e chamar o atualizarTimerSpy a cada segundo`, () => {
    // Criamos um "spy" para saber quantas vezes o método
    // `atualizarTimer` foi chamado e simulamos seu
    // retorno:
    const atualizarTimerSpy = spyOn(
      component,
      'atualizarTimer'
    );

    // Valor da data corrente que usaremos como valor
    // simulado, ou seja, dentro deste teste qualquer
    // `new Date()` retornará o valor abaixo:
    const dataMock = new Date('2020-01-01T12:00:00.000Z');

    // No comando a seguir criamos um relógio mockado
    // para o JavaScript, ou seja, ao invés dele pegar
    // a data e hora do computador, ele vai pegar
    // a data e hora que nós vamos informar, de forma
    // simulada:
    jasmine.clock().install();

    // Definimos qual o valor da corrente, ou seja,
    // sempre que algum trecho de código executar
    // `new Date()` o valor abaixo será retornado:
    jasmine.clock().mockDate(dataMock);

    // Chama o método que está sendo testado:
    component.iniciarTimer();

    // Esperamos que as variáveis sejam inicializadas
    // com os valores `0` e `new Date()` respectivamente
    expect(component.tempoDecorridoEmSegundos).toBe(0);
    expect(component.dataInicioTimer.getTime()).toBe(
      dataMock.getTime()
    );

    // Avançamos 3 segundos na linha do tempo p/verificar
    // se o método `atualizarTimer` foi chamado 3 vezes.
    // Lembrando que o método deve ser chamado a cada
    // 1 segundo:
    jasmine.clock().tick(3000);
    expect(atualizarTimerSpy).toHaveBeenCalledTimes(3);
  });

  it(`deve atualizar o tempoDecorridoEmSegundos quando
  atualizarTimer() for chamado`, () => {
    // Configuramos um valor conhecido para a variável
    // `dataInicioTimer`:
    component.dataInicioTimer = new Date(
      '2020-01-01T12:00:00.000Z'
    );

    const mockNewDate = new Date(
      component.dataInicioTimer.getTime()
    );

    // Configuramos a linha do tempo de modo que a
    // data corrente seja exatamente igual a variável
    // `component.dataInicioTimer`
    jasmine.clock().install();
    jasmine.clock().mockDate(mockNewDate);

    // Avançamos alguns segundos na linha do tempo:
    const avancaRelogioEmXSegundos = 10;
    jasmine.clock().tick(avancaRelogioEmXSegundos * 1000);

    // Ao chamar o `atualizarTimer`, esperamos que seja
    // calculada a diferença de tempo entre
    // `component.dataInicioTimer` e `new Date()`.
    // Lembrando que `new Date()` é um valor conhecido,
    // mockado logo acima.
    component.atualizarTimer();
    expect(component.tempoDecorridoEmSegundos).toBe(
      avancaRelogioEmXSegundos
    );

    // Também testamos se o valor de
    // `component.tempoDecorridoEmSegundos` está sendo
    // atualizado na tela. Para isto chamamos o
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
