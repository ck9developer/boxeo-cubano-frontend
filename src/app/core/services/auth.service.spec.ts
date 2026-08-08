import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const loginResponse = {
    accessToken: 'signed-jwt-token',
    user: { id: 'user-1', username: 'admin', role: 'ADMIN' },
  };

  beforeEach(() => {
    localStorage.clear();
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('login() posts credentials, stores the session and marks the user as authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();

    service.login('admin', 'admin123').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'admin', password: 'admin123' });
    req.flush(loginResponse);

    expect(service.getToken()).toBe('signed-jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.user()).toEqual(loginResponse.user);
  });

  it('logout() clears the stored session and redirects to /login', () => {
    service.login('admin', 'admin123').subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(loginResponse);

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
