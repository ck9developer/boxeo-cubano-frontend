import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client, CreatePaymentDto, Payment, PaymentStatus, FEE_TYPE_LABEL } from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';
import { PaymentsService } from '../../core/services/payments.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
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
  deletingPaymentId = signal<string | null>(null);
  paymentPendingDelete = signal<Payment | null>(null);

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

  private lastPaidPayment() {
    const paid = (this.client()?.pagos ?? []).filter((p) => p.estado === 'PAGADO');
    if (paid.length === 0) return null;
    return paid.reduce((latest, p) => (new Date(p.fecha) > new Date(latest.fecha) ? p : latest));
  }

  private nextPaymentUnlockDate(): Date | null {
    const lastPaid = this.lastPaidPayment();
    if (!lastPaid) return null;
    const nextDue = new Date(lastPaid.fecha);
    nextDue.setMonth(nextDue.getMonth() + 1);
    nextDue.setDate(nextDue.getDate() - 6);
    return nextDue;
  }

  canRegisterPayment(): boolean {
    const unlockDate = this.nextPaymentUnlockDate();
    if (!unlockDate) return true;
    return new Date() >= unlockDate;
  }

  paymentUnlockMessage(): string {
    const unlockDate = this.nextPaymentUnlockDate();
    if (!unlockDate) return '';
    const formatted = unlockDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    return `Ya se registró el pago de este mes. Podrás registrar el siguiente a partir del ${formatted}.`;
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

  deletePayment(payment: Payment) {
    this.paymentPendingDelete.set(payment);
  }

  confirmDeletePayment() {
    const payment = this.paymentPendingDelete();
    if (!payment) return;

    this.deletingPaymentId.set(payment.id);
    this.paymentsService.remove(this.clientId, payment.id).subscribe({
      next: () => {
        this.deletingPaymentId.set(null);
        this.paymentPendingDelete.set(null);
        this.load();
      },
      error: () => {
        this.deletingPaymentId.set(null);
        this.paymentPendingDelete.set(null);
      },
    });
  }

  cancelDeletePayment() {
    this.paymentPendingDelete.set(null);
  }
}
