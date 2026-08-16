export type FeeType = 'TRES_DIAS' | 'CUATRO_DIAS' | 'TODOS_LOS_DIAS';
export type PaymentStatus = 'PAGADO' | 'PENDIENTE';
export type ClientStatus = 'al_dia' | 'por_vencer' | 'vencido';
export type MatriculaStatus = 'PAGADO' | 'PENDIENTE';

export const FEE_TYPE_LABEL: Record<FeeType, string> = {
  TRES_DIAS: '3 días/semana',
  CUATRO_DIAS: '4 días/semana',
  TODOS_LOS_DIAS: 'Todos los días',
};

export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  al_dia: 'Al día',
  por_vencer: 'Próximo a vencer',
  vencido: 'Vencido',
};

export const MATRICULA_LABEL: Record<MatriculaStatus, string> = {
  PAGADO: 'Pagada',
  PENDIENTE: 'No pagada',
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
  email: string | null;
  tipoCuota: FeeType;
  fechaAlta: string;
  matricula: MatriculaStatus;
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
  email?: string;
  tipoCuota: FeeType;
  fechaAlta?: string;
  matricula?: MatriculaStatus;
  observaciones?: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;

export interface CreatePaymentDto {
  concepto?: string;
  importe?: number;
  estado?: PaymentStatus;
  fecha?: string;
}

export type UpdatePaymentDto = Partial<CreatePaymentDto>;

export interface QueryClients {
  search?: string;
  tipoCuota?: FeeType;
  matricula?: MatriculaStatus;
  estado?: ClientStatus;
  page?: number;
  perPage?: number;
}

export interface ExpiringClient {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  tipoCuota: FeeType;
  fechaVencimiento: string;
  diasRestantes: number;
}

export interface OverdueClient {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  tipoCuota: FeeType;
  fechaVencimiento: string;
  diasVencido: number;
}

export interface ClientAlerts {
  proximosAVencer: ExpiringClient[];
  vencidos: OverdueClient[];
}
