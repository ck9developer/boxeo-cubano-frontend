import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardResumen } from '../../core/models/auth.model';
import { Cliente, TIPO_CUOTA_LABEL } from '../../core/models/cliente.model';
import { AuthService } from '../../core/services/auth.service';
import { ClientesService } from '../../core/services/clientes.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ClienteFormModalComponent } from '../../shared/cliente-form-modal/cliente-form-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ClienteFormModalComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly tipoCuotaLabel = TIPO_CUOTA_LABEL;

  resumen = signal<DashboardResumen | null>(null);
  clientesRecientes = signal<Cliente[]>([]);
  loading = signal(true);
  modalOpen = signal(false);

  constructor(
    readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
    private readonly clientesService: ClientesService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.dashboardService.getResumen().subscribe((res) => this.resumen.set(res));
    this.clientesService.findAll({ page: 1, perPage: 5 }).subscribe({
      next: (res) => {
        this.clientesRecientes.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  verCliente(cliente: Cliente) {
    this.router.navigate(['/clientes', cliente.id]);
  }

  abrirNuevo() {
    this.modalOpen.set(true);
  }

  onModalClosed() {
    this.modalOpen.set(false);
  }

  onSaved() {
    this.modalOpen.set(false);
    this.load();
  }
}
