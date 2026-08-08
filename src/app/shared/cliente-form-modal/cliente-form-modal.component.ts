import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente, CreateClienteDto, TipoCuota, TIPO_CUOTA_LABEL } from '../../core/models/cliente.model';
import { ClientesService } from '../../core/services/clientes.service';

@Component({
  selector: 'app-cliente-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form-modal.component.html',
})
export class ClienteFormModalComponent implements OnChanges {
  @Input() open = false;
  @Input() cliente: Cliente | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Cliente>();

  readonly tiposCuota: TipoCuota[] = ['TRES_DIAS', 'CUATRO_DIAS', 'TODOS_LOS_DIAS'];
  readonly tipoCuotaLabel = TIPO_CUOTA_LABEL;

  form: CreateClienteDto = this.emptyForm();
  saving = signal(false);
  errorMessage = signal('');

  constructor(private readonly clientesService: ClientesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.errorMessage.set('');
      this.form = this.cliente
        ? {
            nombre: this.cliente.nombre,
            telefono: this.cliente.telefono,
            email: this.cliente.email,
            tipoCuota: this.cliente.tipoCuota,
            observaciones: this.cliente.observaciones ?? '',
          }
        : this.emptyForm();
    }
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (!this.form.nombre || !this.form.telefono || !this.form.email || !this.form.tipoCuota) {
      this.errorMessage.set('Completa los campos obligatorios.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const request = this.cliente
      ? this.clientesService.update(this.cliente.id, this.form)
      : this.clientesService.create(this.form);

    request.subscribe({
      next: (cliente) => {
        this.saving.set(false);
        this.saved.emit(cliente);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('No se pudo guardar el cliente. Revisa los datos.');
      },
    });
  }

  private emptyForm(): CreateClienteDto {
    return { nombre: '', telefono: '', email: '', tipoCuota: 'TRES_DIAS', observaciones: '' };
  }
}
