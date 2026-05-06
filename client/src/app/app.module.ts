import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthComponent } from './components/auth/auth.component';
import { ScheduleDashboardComponent } from './components/schedule-dashboard/schedule-dashboard.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { CompareComponent } from './components/compare/compare.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ScheduleDashboardComponent,
    FriendListComponent,
    ProfileComponent,
    CompareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
