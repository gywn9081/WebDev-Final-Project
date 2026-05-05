import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompareResult } from '../interfaces/models.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private readonly API_URL = `${environment.apiUrl}/compare`;

  constructor(private http: HttpClient) {}

  compareWithFriend(userId: string, friendId: string): Observable<CompareResult> {
    return this.http.get<CompareResult>(`${this.API_URL}/${userId}/${friendId}`);
  }
}
