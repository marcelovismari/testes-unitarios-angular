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

import { HandleErrorInterceptor } from './handle-error.interceptor';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HandleErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HandleErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(
      HttpTestingController
    );
  });

  it('deve tratar erros 4xx', (done) => {
    const url = 'http://localhost';
    httpClient.get(url).subscribe({
      error: (responseError) => {
        // Esperamos que o interceptor formate a mensagem
        // de erro como abaixo:
        const expectedMessage =
          `Backend returned code ${HttpStatusCode.BadRequest}`;

        expect(responseError).toEqual(expectedMessage);
        done();
      },
    });

    const req = httpTestingController.expectOne(url);

    // Simulamos uma resposta para a requisição
    // ao endereço http://localhost com o status
    // 400 (bad request):
    req.flush(
      {},
      {
        status: HttpStatusCode.BadRequest,
        statusText: 'Erro na validação',
      }
    );
  });

  it('deve tratar erros no lado do cliente', (done) => {
    const mockError = new ProgressEvent('error');

    const url = 'http://localhost';
    httpClient.get(url).subscribe({
      error: (responseError) => {
        // Esperamos que o interceptor formate a
        // mensagem de erro e inclua o seguinte
        // trecho no retorno:
        const expectedMessage = `An error occurred: `;
        expect(responseError).toContain(expectedMessage);
        done();
      },
    });

    const req = httpTestingController.expectOne(url);

    // Simulamos um erro local, ou seja, um erro no lado
    // do cliente. Neste caso a requisição nem chega no
    // servidor:
    req.error(mockError);
  });
});
