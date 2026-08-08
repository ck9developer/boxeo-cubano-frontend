import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client, CreatePaymentDto, PaymentStatus, FEE_TYPE_LABEL } from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent implements OnInit {
  readonly feeTypeLabel = FEE_TYPE_LABEL;

  client = signal<Client | null>(null);
  loading = signal(true);

  editingNotes = signal(false);
  notesDraft = '';
  savingNotes = signal(false);

  paymentModalOpen = signal(false);
  paymentConcept = '';
  paymentAmount: number | null = null;
  paymentStatus: '' | PaymentStatus = '';
  registeringPayment = signal(false);
  paymentError = signal('');

  private clientId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly clientsService: ClientsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load() {
    this.loading.set(true);
    this.clientsService.findOne(this.clientId).subscribe({
      next: (client) => {
        this.client.set(client);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/clients');
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/clients');
  }

  startEditingNotes() {
    this.notesDraft = this.client()?.observaciones ?? '';
    this.editingNotes.set(true);
  }

  cancelEditingNotes() {
    this.editingNotes.set(false);
  }

  saveNotes() {
    this.savingNotes.set(true);
    this.clientsService
      .update(this.clientId, { observaciones: this.notesDraft })
      .subscribe({
        next: () => {
          this.savingNotes.set(false);
          this.editingNotes.set(false);
          this.load();
        },
        error: () => this.savingNotes.set(false),
      });
  }

  openPaymentModal() {
    this.paymentConcept = '';
    this.paymentAmount = null;
    this.paymentStatus = '';
    this.paymentError.set('');
    this.paymentModalOpen.set(true);
  }

  closePaymentModal() {
    this.paymentModalOpen.set(false);
  }

  registerPayment() {
    this.registeringPayment.set(true);
    this.paymentError.set('');

    const dto: CreatePaymentDto = {};
    if (this.paymentConcept) dto.concepto = this.paymentConcept;
    if (this.paymentAmount !== null) dto.importe = this.paymentAmount;
    if (this.paymentStatus) dto.estado = this.paymentStatus;

    this.paymentsService.create(this.clientId, dto).subscribe({
      next: () => {
        this.registeringPayment.set(false);
        this.paymentModalOpen.set(false);
        this.load();
      },
      error: () => {
        this.registeringPayment.set(false);
        this.paymentError.set('No se pudo registrar el pago.');
      },
    });
  }
}
