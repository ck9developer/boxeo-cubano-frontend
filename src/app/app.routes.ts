import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { AlertsComponent } from './pages/alerts/alerts.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'configuration', component: ConfigurationComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
