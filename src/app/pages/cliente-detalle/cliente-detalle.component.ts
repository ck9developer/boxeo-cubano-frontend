import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cliente, CreatePagoDto, EstadoPago, TIPO_CUOTA_LABEL } from '../../core/models/cliente.model';
import { ClientesService } from '../../core/services/clientes.service';
import { PagosService } from '../../core/services/pagos.service';

@Component({
  selector: 'app-cliente-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cliente-detalle.component.html',
})
export class ClienteDetalleComponent implements OnInit {
  readonly tipoCuotaLabel = TIPO_CUOTA_LABEL;

  cliente = signal<Cliente | null>(null);
  loading = signal(true);

  editandoObservaciones = signal(false);
  observacionesDraft = '';
  guardandoObservaciones = signal(false);

  pagoModalOpen = signal(false);
  pagoConcepto = '';
  pagoImporte: number | null = null;
  pagoEstado: '' | EstadoPago = '';
  registrandoPago = signal(false);
  pagoError = signal('');

  private clienteId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly clientesService: ClientesService,
    private readonly pagosService: PagosService,
  ) {}

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load() {
    this.loading.set(true);
    this.clientesService.findOne(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente.set(cliente);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/clientes');
      },
    });
  }

  volver() {
    this.router.navigateByUrl('/clientes');
  }

  iniciarEdicionObservaciones() {
    this.observacionesDraft = this.cliente()?.observaciones ?? '';
    this.editandoObservaciones.set(true);
  }

  cancelarEdicionObservaciones() {
    this.editandoObservaciones.set(false);
  }

  guardarObservaciones() {
    this.guardandoObservaciones.set(true);
    this.clientesService
      .update(this.clienteId, { observaciones: this.observacionesDraft })
      .subscribe({
        next: () => {
          this.guardandoObservaciones.set(false);
          this.editandoObservaciones.set(false);
          this.load();
        },
        error: () => this.guardandoObservaciones.set(false),
      });
  }

  abrirModalPago() {
    this.pagoConcepto = '';
    this.pagoImporte = null;
    this.pagoEstado = '';
    this.pagoError.set('');
    this.pagoModalOpen.set(true);
  }

  cerrarModalPago() {
    this.pagoModalOpen.set(false);
  }

  registrarPago() {
    this.registrandoPago.set(true);
    this.pagoError.set('');

    const dto: CreatePagoDto = {};
    if (this.pagoConcepto) dto.concepto = this.pagoConcepto;
    if (this.pagoImporte !== null) dto.importe = this.pagoImporte;
    if (this.pagoEstado) dto.estado = this.pagoEstado;

    this.pagosService.create(this.clienteId, dto).subscribe({
      next: () => {
        this.registrandoPago.set(false);
        this.pagoModalOpen.set(false);
        this.load();
      },
      error: () => {
        this.registrandoPago.set(false);
        this.pagoError.set('No se pudo registrar el pago.');
      },
    });
  }
}
