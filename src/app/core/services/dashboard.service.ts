import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardSummary } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getSummary() {
    return this.http.get<DashboardSummary>(`${environment.apiUrl}/dashboard`);
  }
}
