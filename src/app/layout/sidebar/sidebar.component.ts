import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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

  constructor(
    readonly authService: AuthService,
    readonly clientsService: ClientsService,
  ) {}

  ngOnInit(): void {
    this.clientsService.refreshAlertsCount();
  }

  close() {
    this.closed.emit();
  }

  logout() {
    this.authService.logout();
  }
}
