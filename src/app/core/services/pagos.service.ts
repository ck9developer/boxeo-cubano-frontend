import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreatePagoDto, Pago } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class PagosService {
  constructor(private readonly http: HttpClient) {}

  findByCliente(clienteId: string) {
    return this.http.get<Pago[]>(`${environment.apiUrl}/clientes/${clienteId}/pagos`);
  }

  create(clienteId: string, dto: CreatePagoDto) {
    return this.http.post<Pago>(`${environment.apiUrl}/clientes/${clienteId}/pagos`, dto);
  }
}
