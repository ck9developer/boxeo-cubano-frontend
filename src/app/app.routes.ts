import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ClienteDetalleComponent } from './pages/cliente-detalle/cliente-detalle.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: DashboardComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'clientes/:id', component: ClienteDetalleComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
