import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/models.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser!: User;

  // Profile form
  username = '';
  email = '';

  // Password form
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // UI state
  isUpdatingProfile = false;
  isDeletingAccount = false;
  isChangingPassword = false;
  profileMessage = '';
  profileMessageType: 'success' | 'error' = 'success';
  passwordMessage = '';
  passwordMessageType: 'success' | 'error' = 'success';
  showDeleteConfirm = false;
  deleteConfirmText = '';

  private readonly API = `${environment.apiUrl}/users`;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser!;
    this.username = this.currentUser.username;
    this.email = this.currentUser.email;
  }

  updateProfile(): void {
    if (!this.username.trim() || !this.email.trim()) {
      this.showProfileMsg('Username and email are required.', 'error');
      return;
    }

    this.isUpdatingProfile = true;
    this.http.put<{ token: string; user: User }>(
      `${this.API}/${this.currentUser._id}`,
      { username: this.username, email: this.email }
    ).subscribe({
      next: (res) => {
        // Re-store session with fresh token so navbar updates
        localStorage.setItem('syncschedule_token', res.token);
        localStorage.setItem('syncschedule_user', JSON.stringify(res.user));
        this.currentUser = res.user;
        (this.authService as any).currentUserSubject.next(res.user);
        this.isUpdatingProfile = false;
        this.showProfileMsg('Profile updated successfully.', 'success');
      },
      error: (err) => {
        this.isUpdatingProfile = false;
        this.showProfileMsg(err.error?.message || 'Failed to update profile.', 'error');
      },
    });
  }

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.showPasswordMsg('All password fields are required.', 'error');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.showPasswordMsg('New passwords do not match.', 'error');
      return;
    }
    if (this.newPassword.length < 6) {
      this.showPasswordMsg('New password must be at least 6 characters.', 'error');
      return;
    }

    this.isChangingPassword = true;
    this.http.put<{ token: string; user: User }>(
      `${this.API}/${this.currentUser._id}`,
      {
        username: this.currentUser.username,
        email: this.currentUser.email,
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      }
    ).subscribe({
      next: (res) => {
        localStorage.setItem('syncschedule_token', res.token);
        localStorage.setItem('syncschedule_user', JSON.stringify(res.user));
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isChangingPassword = false;
        this.showPasswordMsg('Password changed successfully.', 'success');
      },
      error: (err) => {
        this.isChangingPassword = false;
        this.showPasswordMsg(err.error?.message || 'Failed to change password.', 'error');
      },
    });
  }

  confirmDelete(): void {
    if (this.deleteConfirmText !== this.currentUser.username) {
      this.showProfileMsg(`Type your username "${this.currentUser.username}" to confirm.`, 'error');
      return;
    }

    this.isDeletingAccount = true;
    this.http.delete<{ message: string }>(`${this.API}/${this.currentUser._id}`).subscribe({
      next: () => {
        this.authService.logout();
      },
      error: (err) => {
        this.isDeletingAccount = false;
        this.showProfileMsg(err.error?.message || 'Failed to delete account.', 'error');
      },
    });
  }

  private showProfileMsg(text: string, type: 'success' | 'error'): void {
    this.profileMessage = text;
    this.profileMessageType = type;
    setTimeout(() => (this.profileMessage = ''), 4000);
  }

  private showPasswordMsg(text: string, type: 'success' | 'error'): void {
    this.passwordMessage = text;
    this.passwordMessageType = type;
    setTimeout(() => (this.passwordMessage = ''), 4000);
  }
}