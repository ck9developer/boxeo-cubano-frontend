export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface DashboardResumen {
  clientesActivos: number;
  pagosPendientes: number;
  ingresosMes: string | number;
}
