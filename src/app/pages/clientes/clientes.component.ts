import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import {
  Cliente,
  EstadoCliente,
  TipoCuota,
  TIPO_CUOTA_LABEL,
} from '../../core/models/cliente.model';
import { ClientesService } from '../../core/services/clientes.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResumen } from '../../core/models/auth.model';
import { ClienteFormModalComponent } from '../../shared/cliente-form-modal/cliente-form-modal.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteFormModalComponent],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  readonly tipoCuotaLabel = TIPO_CUOTA_LABEL;

  clientes = signal<Cliente[]>([]);
  resumen = signal<DashboardResumen | null>(null);
  loading = signal(true);

  search = '';
  estado: EstadoCliente | '' = '';
  tipoCuota: TipoCuota | '' = '';
  page = signal(1);
  perPage = 8;
  total = signal(0);
  totalPages = signal(1);
  pagesArray = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  modalOpen = signal(false);
  clienteEnEdicion = signal<Cliente | null>(null);

  private readonly searchInput$ = new Subject<string>();

  constructor(
    private readonly clientesService: ClientesService,
    private readonly dashboardService: DashboardService,
    private readonly router: Router,
  ) {
    this.searchInput$.pipe(debounceTime(350)).subscribe(() => {
      this.page.set(1);
      this.load();
    });
  }

  ngOnInit(): void {
    this.load();
    this.loadResumen();
  }

  onSearchChange() {
    this.searchInput$.next(this.search);
  }

  onFilterChange() {
    this.page.set(1);
    this.load();
  }

  load() {
    this.loading.set(true);
    this.clientesService
      .findAll({
        search: this.search || undefined,
        estado: this.estado || undefined,
        tipoCuota: this.tipoCuota || undefined,
        page: this.page(),
        perPage: this.perPage,
      })
      .subscribe({
        next: (res) => {
          this.clientes.set(res.data);
          this.total.set(res.meta.total);
          this.totalPages.set(res.meta.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  loadResumen() {
    this.dashboardService.getResumen().subscribe((res) => this.resumen.set(res));
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.load();
  }

  verCliente(cliente: Cliente) {
    this.router.navigate(['/clientes', cliente.id]);
  }

  abrirNuevo() {
    this.clienteEnEdicion.set(null);
    this.modalOpen.set(true);
  }

  editar(cliente: Cliente, event: Event) {
    event.stopPropagation();
    this.clienteEnEdicion.set(cliente);
    this.modalOpen.set(true);
  }

  eliminar(cliente: Cliente, event: Event) {
    event.stopPropagation();
    if (!confirm(`¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`)) return;

    this.clientesService.remove(cliente.id).subscribe(() => {
      this.load();
      this.loadResumen();
    });
  }

  onModalClosed() {
    this.modalOpen.set(false);
  }

  onSaved() {
    this.modalOpen.set(false);
    this.load();
    this.loadResumen();
  }

  fromIndex() {
    return this.total() === 0 ? 0 : (this.page() - 1) * this.perPage + 1;
  }

  toIndex() {
    return Math.min(this.page() * this.perPage, this.total());
  }
}
