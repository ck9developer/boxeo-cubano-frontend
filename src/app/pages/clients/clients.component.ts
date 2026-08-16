import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import {
  Client,
  ClientStatus,
  FeeType,
  FEE_TYPE_LABEL,
  CLIENT_STATUS_LABEL,
  MatriculaStatus,
  MATRICULA_LABEL,
} from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/auth.model';
import { ClientFormModalComponent } from '../../shared/client-form-modal/client-form-modal.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientFormModalComponent, ConfirmDialogComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  readonly feeTypeLabel = FEE_TYPE_LABEL;
  readonly matriculaLabel = MATRICULA_LABEL;
  readonly statusLabel = CLIENT_STATUS_LABEL;

  clients = signal<Client[]>([]);
  summary = signal<DashboardSummary | null>(null);
  loading = signal(true);

  search = '';
  estado: ClientStatus | '' = '';
  tipoCuota: FeeType | '' = '';
  matricula: MatriculaStatus | '' = '';
  page = signal(1);
  perPage = 8;
  total = signal(0);
  totalPages = signal(1);
  pagesArray = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  modalOpen = signal(false);
  clientBeingEdited = signal<Client | null>(null);
  clientPendingDelete = signal<Client | null>(null);

  private readonly searchInput$ = new Subject<string>();

  constructor(
    private readonly clientsService: ClientsService,
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
    this.loadSummary();
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
    this.clientsService
      .findAll({
        search: this.search || undefined,
        estado: this.estado || undefined,
        tipoCuota: this.tipoCuota || undefined,
        matricula: this.matricula || undefined,
        page: this.page(),
        perPage: this.perPage,
      })
      .subscribe({
        next: (res) => {
          this.clients.set(res.data);
          this.total.set(res.meta.total);
          this.totalPages.set(res.meta.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  loadSummary() {
    this.dashboardService.getSummary().subscribe((res) => this.summary.set(res));
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.load();
  }

  viewClient(client: Client) {
    this.router.navigate(['/clients', client.id]);
  }

  openNew() {
    this.clientBeingEdited.set(null);
    this.modalOpen.set(true);
  }

  edit(client: Client, event: Event) {
    event.stopPropagation();
    this.clientBeingEdited.set(client);
    this.modalOpen.set(true);
  }

  remove(client: Client, event: Event) {
    event.stopPropagation();
    this.clientPendingDelete.set(client);
  }

  confirmRemove() {
    const client = this.clientPendingDelete();
    if (!client) return;

    this.clientsService.remove(client.id).subscribe(() => {
      this.clientPendingDelete.set(null);
      this.load();
      this.loadSummary();
      this.clientsService.refreshAlertsCount();
    });
  }

  cancelRemove() {
    this.clientPendingDelete.set(null);
  }

  onModalClosed() {
    this.modalOpen.set(false);
  }

  onSaved() {
    this.modalOpen.set(false);
    this.load();
    this.loadSummary();
    this.clientsService.refreshAlertsCount();
  }

  fromIndex() {
    return this.total() === 0 ? 0 : (this.page() - 1) * this.perPage + 1;
  }

  toIndex() {
    return Math.min(this.page() * this.perPage, this.total());
  }
}
