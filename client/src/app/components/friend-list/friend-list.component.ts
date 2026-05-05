import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FriendService } from '../../services/friend.service';
import { User } from '../../interfaces/models.interface';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit {
  currentUser!: User;
  friends: User[] = [];
  searchResults: User[] = [];
  searchQuery = '';
  isLoading = false;
  isSearching = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private friendService: FriendService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser!;
    this.loadFriends();
  }

  loadFriends(): void {
    this.isLoading = true;
    this.friendService.getFriends(this.currentUser._id).subscribe({
      next: (data) => {
        this.friends = data;
        this.isLoading = false;
      },
      error: () => {
        this.showMessage('Failed to load friends list.', 'error');
        this.isLoading = false;
      },
    });
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) return;
    this.isSearching = true;

    this.friendService.searchUsers(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results.filter((u) => u._id !== this.currentUser._id);
        this.isSearching = false;
      },
      error: () => {
        this.showMessage('Search failed. Please try again.', 'error');
        this.isSearching = false;
      },
    });
  }

  addFriend(friendId: string, username: string): void {
    this.friendService.addFriend(this.currentUser._id, friendId).subscribe({
      next: () => {
        this.showMessage(`${username} added as a friend.`, 'success');
        this.searchResults = [];
        this.searchQuery = '';
        this.loadFriends();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to add friend.', 'error');
      },
    });
  }

  removeFriend(friendId: string, username: string): void {
    if (!confirm(`Remove ${username} from your friends?`)) return;
    this.friendService.removeFriend(this.currentUser._id, friendId).subscribe({
      next: () => {
        this.showMessage(`${username} removed from friends.`, 'success');
        this.loadFriends();
      },
      error: () => {
        this.showMessage('Failed to remove friend.', 'error');
      },
    });
  }

  compareWithFriend(friendId: string): void {
    this.router.navigate(['/compare', friendId]);
  }

  isFriend(userId: string): boolean {
    return this.friends.some((f) => f._id === userId);
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3500);
  }
}
