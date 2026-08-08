import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardSummary } from '../../core/models/auth.model';
import { Client, FEE_TYPE_LABEL } from '../../core/models/client.model';
import { AuthService } from '../../core/services/auth.service';
import { ClientsService } from '../../core/services/clients.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ClientFormModalComponent } from '../../shared/client-form-modal/client-form-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ClientFormModalComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly feeTypeLabel = FEE_TYPE_LABEL;

  summary = signal<DashboardSummary | null>(null);
  recentClients = signal<Client[]>([]);
  loading = signal(true);
  modalOpen = signal(false);

  constructor(
    readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
    private readonly clientsService: ClientsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.dashboardService.getSummary().subscribe((res) => this.summary.set(res));
    this.clientsService.findAll({ page: 1, perPage: 5 }).subscribe({
      next: (res) => {
        this.recentClients.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  viewClient(client: Client) {
    this.router.navigate(['/clients', client.id]);
  }

  openNew() {
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
