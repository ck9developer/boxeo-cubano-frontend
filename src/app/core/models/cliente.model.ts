export type TipoCuota = 'TRES_DIAS' | 'CUATRO_DIAS' | 'TODOS_LOS_DIAS';
export type EstadoPago = 'PAGADO' | 'PENDIENTE';
export type EstadoCliente = 'al_dia' | 'pendiente';

export const TIPO_CUOTA_LABEL: Record<TipoCuota, string> = {
  TRES_DIAS: '3 días/semana',
  CUATRO_DIAS: '4 días/semana',
  TODOS_LOS_DIAS: 'Todos los días',
};

export interface Pago {
  id: string;
  clienteId: string;
  fecha: string;
  concepto: string;
  importe: string;
  estado: EstadoPago;
  createdAt: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  tipoCuota: TipoCuota;
  fechaAlta: string;
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
  estado?: EstadoCliente;
  pagos?: Pago[];
}

export interface ClientesPage {
  data: Cliente[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface CreateClienteDto {
  nombre: string;
  telefono: string;
  email: string;
  tipoCuota: TipoCuota;
  observaciones?: string;
}

export type UpdateClienteDto = Partial<CreateClienteDto>;

export interface CreatePagoDto {
  concepto?: string;
  importe?: number;
  estado?: EstadoPago;
}

export interface QueryClientes {
  search?: string;
  tipoCuota?: TipoCuota;
  estado?: EstadoCliente;
  page?: number;
  perPage?: number;
}
