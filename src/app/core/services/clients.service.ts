import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Client,
  ClientAlerts,
  ClientsPage,
  CreateClientDto,
  QueryClients,
  UpdateClientDto,
} from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  private readonly alertsCountSignal = signal(0);
  readonly alertsCount = this.alertsCountSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  findAll(query: QueryClients) {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.tipoCuota) params = params.set('tipoCuota', query.tipoCuota);
    if (query.estado) params = params.set('estado', query.estado);
    if (query.page) params = params.set('page', query.page);
    if (query.perPage) params = params.set('perPage', query.perPage);

    return this.http.get<ClientsPage>(this.baseUrl, { params });
  }

  findOne(id: string) {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateClientDto) {
    return this.http.post<Client>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateClientDto) {
    return this.http.patch<Client>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAlerts(warningDays = 5) {
    const params = new HttpParams().set('diasAviso', warningDays);
    return this.http.get<ClientAlerts>(`${this.baseUrl}/alertas`, { params });
  }

  setAlertsCount(alerts: ClientAlerts) {
    this.alertsCountSignal.set(alerts.proximosAVencer.length + alerts.vencidos.length);
  }

  refreshAlertsCount() {
    this.getAlerts().subscribe((res) => this.setAlertsCount(res));
  }
}
