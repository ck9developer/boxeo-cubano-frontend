import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardResumen } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getResumen() {
    return this.http.get<DashboardResumen>(`${environment.apiUrl}/dashboard`);
  }
}
