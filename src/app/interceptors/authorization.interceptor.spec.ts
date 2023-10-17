import { TestBed } from '@angular/core/testing';

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpStatusCode,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthorizationInterceptor } from './authorization.interceptor';
import { StorageService } from './storage.service';

describe('AuthorizationInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let storageService: StorageService;

  // Este trecho é executado antes de cada teste unitário,
  // ou seja, antes de cada "it"
  beforeEach(() => {
    // Configurando o módulo de testes:
    TestBed.configureTestingModule({
      imports: [
        // Como vamos disparar requisições simuladas
        // ao longo deste arquivo de testes, precisamos
        // importar o módulo abaixo:
        HttpClientTestingModule,
      ],
      providers: [
        // Configurando o interceptor para
        // ser utilizado em todas as requisições:
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorizationInterceptor,
          multi: true,
        },
      ],
    });

    // Pegamos e guardamos alguns objetos para utilizar
    // ao longo dos testes:
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(
      HttpTestingController
    );
    storageService = TestBed.inject(StorageService);
  });

  it(`não deve injetar o header Authorization
      quando getJWT() retornar null`, (done) => {
    // Simulamos o retorno do método getJWT()
    // de modo que o método retorne null.
    const storageServiceGetJWTSpy = spyOn(
      storageService,
      'getJWT'
    ).and.returnValue(null);

    // Dispara uma requisição para a URL abaixo.
    // Lembre-se de que estamos utilizando o módulo
    // HttpClientTestingModule, então as requisições
    // são simuladas ("mockadas")
    const url = 'http://localhost';
    httpClient.get(url).subscribe({
      complete: () => {
        // Quando a requisição for respondida, esperamos
        // que o storageService.getJWT() seja chamado
        // uma única vez:
        expect(
          storageServiceGetJWTSpy
        ).toHaveBeenCalledTimes(1);

        // Finalizamos o teste chamando o done():
        done();
      },
    });

    // Esperamos que tenha sido disparada uma requisição
    // para http://localhost e...
    const req = httpTestingController.expectOne(url);

    // ...também esperamos que o header Authorization não tenha
    // sido injetado, já que o retorno do storageService.getJWT()
    // é null
    expect(
      req.request.headers.has('Authorization')
    ).toBeFalsy();

    // Envia a resposta simulada da requisição.
    // Assim o método dentro do .subscribe(...método...)
    // será executado
    req.flush(
      {},
      {
        status: HttpStatusCode.Ok,
        statusText: 'Ok',
      }
    );
  });

  it('deve injetar o JWT no header Authorization', (done) => {
    const jwtValue = '123';
    const storageServiceGetJWTSpy = spyOn(
      storageService,
      'getJWT'
    ).and.returnValue(jwtValue);

    // A URL utilizada no teste pode ser qualquer uma. O
    // motivo é que vamos criar uma resposta simulada para
    // este endereço utilizando o objeto httpTestingController
    const url = 'http://localhost';
    httpClient.get(url).subscribe({
      next: (response) => {
        // Esperamos que a resposta seja exatamente o corpo
        // que efetuamos o mock
        expect(response).toEqual(responseMock);
      },
      complete: () => {
        // Esperamos que o StorageService.getJWT seja chamado
        // uma única vez
        expect(
          storageServiceGetJWTSpy
        ).toHaveBeenCalledTimes(1);
        done();
      },
    });

    // Aqui criamos uma resposta "mockada" para 'http://localhost'
    const req = httpTestingController.expectOne(url);

    // Aqui disparamos a resposta "mockada". Essa resposta
    // chega no subscribe do httpClient.get
    const responseMock = { mensagem: 'ola' };
    req.flush(responseMock, {
      status: HttpStatusCode.Ok,
      statusText: 'Ok',
    });

    // Esperamos que o cabeçalho "Authorization" esteja presente
    // na requisição com o valor mockado que está na variável "jwtValue"
    expect(
      req.request.headers.has('Authorization')
    ).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(
      jwtValue
    );
  });
});
