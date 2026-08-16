import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Client,
  CreateClientDto,
  FeeType,
  FEE_TYPE_LABEL,
  MatriculaStatus,
  MATRICULA_LABEL,
} from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-client-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form-modal.component.html',
})
export class ClientFormModalComponent implements OnChanges {
  @Input() open = false;
  @Input() client: Client | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Client>();

  readonly feeTypes: FeeType[] = ['TRES_DIAS', 'CUATRO_DIAS', 'TODOS_LOS_DIAS'];
  readonly feeTypeLabel = FEE_TYPE_LABEL;
  readonly matriculaStatuses: MatriculaStatus[] = ['PAGADO', 'PENDIENTE'];
  readonly matriculaLabel = MATRICULA_LABEL;

  form: CreateClientDto = this.emptyForm();
  saving = signal(false);
  errorMessage = signal('');

  constructor(private readonly clientsService: ClientsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.errorMessage.set('');
      this.form = this.client
        ? {
            nombre: this.client.nombre,
            telefono: this.client.telefono,
            email: this.client.email ?? '',
            tipoCuota: this.client.tipoCuota,
            fechaAlta: this.client.fechaAlta.slice(0, 10),
            matricula: this.client.matricula,
            observaciones: this.client.observaciones ?? '',
          }
        : this.emptyForm();
    }
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (!this.form.nombre || !this.form.telefono || !this.form.tipoCuota) {
      this.errorMessage.set('Completa los campos obligatorios.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const request = this.client
      ? this.clientsService.update(this.client.id, this.form)
      : this.clientsService.create(this.form);

    request.subscribe({
      next: (client) => {
        this.saving.set(false);
        this.saved.emit(client);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('No se pudo guardar el cliente. Revisa los datos.');
      },
    });
  }

  private emptyForm(): CreateClientDto {
    return {
      nombre: '',
      telefono: '',
      email: '',
      tipoCuota: 'TRES_DIAS',
      fechaAlta: this.todayDateInput(),
      matricula: 'PENDIENTE',
      observaciones: '',
    };
  }

  private todayDateInput(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
}
