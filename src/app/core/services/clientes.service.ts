import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Cliente,
  ClientesPage,
  CreateClienteDto,
  QueryClientes,
  UpdateClienteDto,
} from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private readonly http: HttpClient) {}

  findAll(query: QueryClientes) {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.tipoCuota) params = params.set('tipoCuota', query.tipoCuota);
    if (query.estado) params = params.set('estado', query.estado);
    if (query.page) params = params.set('page', query.page);
    if (query.perPage) params = params.set('perPage', query.perPage);

    return this.http.get<ClientesPage>(this.baseUrl, { params });
  }

  findOne(id: string) {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateClienteDto) {
    return this.http.post<Cliente>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateClienteDto) {
    return this.http.patch<Cliente>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
