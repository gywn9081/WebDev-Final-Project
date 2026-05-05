// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from './services/auth.service';
// import { User } from './interfaces/models.interface';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements OnInit {
//   currentUser$!: Observable<User | null>;

//   constructor(public authService: AuthService, private router: Router) {}

//   ngOnInit(): void {
//     this.currentUser$ = this.authService.currentUser$;
//   }

//   logout(): void {
//     this.authService.logout();
//   }
// }

import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/models.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  isDark = true;

  constructor(public authService: AuthService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
    const saved = localStorage.getItem('ss-theme');
    this.isDark = saved ? saved === 'dark' : true;
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('ss-theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    const attr = this.isDark ? 'dark' : 'light';
    this.renderer.setAttribute(document.documentElement, 'data-theme', attr);
  }

  logout(): void {
    this.authService.logout();
  }
}