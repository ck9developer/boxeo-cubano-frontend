import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  alertsCount = signal(0);

  constructor(
    readonly authService: AuthService,
    private readonly clientsService: ClientsService,
  ) {}

  ngOnInit(): void {
    this.clientsService.getAlerts().subscribe((res) => {
      this.alertsCount.set(res.proximosAVencer.length + res.vencidos.length);
    });
  }

  close() {
    this.closed.emit();
  }

  logout() {
    this.authService.logout();
  }
}
