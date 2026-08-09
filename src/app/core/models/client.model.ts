export type FeeType = 'TRES_DIAS' | 'CUATRO_DIAS' | 'TODOS_LOS_DIAS';
export type PaymentStatus = 'PAGADO' | 'PENDIENTE';
export type ClientStatus = 'al_dia' | 'pendiente';

export const FEE_TYPE_LABEL: Record<FeeType, string> = {
  TRES_DIAS: '3 días/semana',
  CUATRO_DIAS: '4 días/semana',
  TODOS_LOS_DIAS: 'Todos los días',
};

export interface Payment {
  id: string;
  clienteId: string;
  fecha: string;
  concepto: string;
  importe: string;
  estado: PaymentStatus;
  createdAt: string;
}

export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  tipoCuota: FeeType;
  fechaAlta: string;
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
  estado?: ClientStatus;
  pagos?: Payment[];
}

export interface ClientsPage {
  data: Client[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface CreateClientDto {
  nombre: string;
  telefono: string;
  email: string;
  tipoCuota: FeeType;
  observaciones?: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;

export interface CreatePaymentDto {
  concepto?: string;
  importe?: number;
  estado?: PaymentStatus;
}

export interface QueryClients {
  search?: string;
  tipoCuota?: FeeType;
  estado?: ClientStatus;
  page?: number;
  perPage?: number;
}

export interface ExpiringClient {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  tipoCuota: FeeType;
  fechaVencimiento: string;
  diasRestantes: number;
}

export interface OverdueClient {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  tipoCuota: FeeType;
  fechaVencimiento: string;
  diasVencido: number;
}

export interface ClientAlerts {
  proximosAVencer: ExpiringClient[];
  vencidos: OverdueClient[];
}
