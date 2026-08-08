import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GymConfig, UpdateConfigurationDto } from '../models/configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private readonly baseUrl = `${environment.apiUrl}/configuracion`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<GymConfig>(this.baseUrl);
  }

  update(dto: UpdateConfigurationDto) {
    return this.http.patch<GymConfig>(this.baseUrl, dto);
  }
}
