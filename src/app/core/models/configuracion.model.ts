export interface GymConfig {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  timezone: string;
  cuotaTresDias: string;
  cuotaCuatroDias: string;
  cuotaTodosDias: string;
  diaVencimiento: number;
  updatedAt: string;
}

export interface UpdateConfiguracionDto {
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  timezone?: string;
  cuotaTresDias?: number;
  cuotaCuatroDias?: number;
  cuotaTodosDias?: number;
  diaVencimiento?: number;
}
