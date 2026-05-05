import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule, ScheduleForm } from '../interfaces/models.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly API_URL = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  getSchedulesByUser(userId: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.API_URL}/${userId}`);
  }

  getScheduleById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.API_URL}/entry/${id}`);
  }

  createSchedule(userId: string, form: ScheduleForm): Observable<Schedule> {
    const payload = { ...form, userId };
    return this.http.post<Schedule>(this.API_URL, payload);
  }

  updateSchedule(id: string, form: ScheduleForm): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.API_URL}/${id}`, form);
  }

  deleteSchedule(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
