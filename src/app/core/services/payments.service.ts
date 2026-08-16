import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreatePaymentDto, Payment, UpdatePaymentDto } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  constructor(private readonly http: HttpClient) {}

  findByClient(clientId: string) {
    return this.http.get<Payment[]>(`${environment.apiUrl}/clientes/${clientId}/pagos`);
  }

  create(clientId: string, dto: CreatePaymentDto) {
    return this.http.post<Payment>(`${environment.apiUrl}/clientes/${clientId}/pagos`, dto);
  }

  update(clientId: string, paymentId: string, dto: UpdatePaymentDto) {
    return this.http.patch<Payment>(`${environment.apiUrl}/clientes/${clientId}/pagos/${paymentId}`, dto);
  }

  remove(clientId: string, paymentId: string) {
    return this.http.delete<void>(`${environment.apiUrl}/clientes/${clientId}/pagos/${paymentId}`);
  }
}
