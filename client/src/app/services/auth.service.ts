import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginForm, RegisterForm } from '../interfaces/models.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/users`;
  private readonly TOKEN_KEY = 'syncschedule_token';
  private readonly USER_KEY = 'syncschedule_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  register(form: RegisterForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, form).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  login(form: LoginForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, form).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }
}
