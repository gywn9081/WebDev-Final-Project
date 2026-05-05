import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/models.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  private readonly FRIENDS_URL = `${environment.apiUrl}/friends`;
  private readonly USERS_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getFriends(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.FRIENDS_URL}/${userId}`);
  }

  searchUsers(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.USERS_URL}/search?username=${username}`);
  }

  addFriend(userId: string, friendId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.FRIENDS_URL}/${userId}/add/${friendId}`,
      {}
    );
  }

  removeFriend(userId: string, friendId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.FRIENDS_URL}/${userId}/remove/${friendId}`
    );
  }
}
