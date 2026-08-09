import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientAlerts } from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './alerts.component.html',
})
export class AlertsComponent implements OnInit {
  alerts = signal<ClientAlerts | null>(null);
  loading = signal(true);

  constructor(private readonly clientsService: ClientsService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.clientsService.getAlerts().subscribe({
      next: (res) => {
        this.alerts.set(res);
        this.clientsService.setAlertsCount(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
