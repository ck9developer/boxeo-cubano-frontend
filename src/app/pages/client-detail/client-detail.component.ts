import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client, CreatePaymentDto, Payment, PaymentStatus, FEE_TYPE_LABEL } from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';
import { PaymentsService } from '../../core/services/payments.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ClientFormModalComponent } from '../../shared/client-form-modal/client-form-modal.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent, ClientFormModalComponent],
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent implements OnInit {
  readonly feeTypeLabel = FEE_TYPE_LABEL;

  client = signal<Client | null>(null);
  loading = signal(true);

  editModalOpen = signal(false);

  editingNotes = signal(false);
  notesDraft = '';
  savingNotes = signal(false);

  payingMatricula = signal(false);

  paymentModalOpen = signal(false);
  editingPayment = signal<Payment | null>(null);
  paymentConcept = '';
  paymentAmount: number | null = null;
  paymentStatus: '' | PaymentStatus = '';
  paymentDate = '';
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

  openEdit() {
    this.editModalOpen.set(true);
  }

  onEditClosed() {
    this.editModalOpen.set(false);
  }

  onEditSaved() {
    this.editModalOpen.set(false);
    this.load();
    this.clientsService.refreshAlertsCount();
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

  payMatricula() {
    if (this.client()?.matricula === 'PAGADO') return;

    this.payingMatricula.set(true);
    this.clientsService.update(this.clientId, { matricula: 'PAGADO' }).subscribe({
      next: () => {
        this.payingMatricula.set(false);
        this.load();
      },
      error: () => this.payingMatricula.set(false),
    });
  }

  openPaymentModal(payment?: Payment) {
    if (payment) {
      this.editingPayment.set(payment);
      this.paymentConcept = payment.concepto;
      this.paymentAmount = Number(payment.importe);
      this.paymentStatus = payment.estado;
      this.paymentDate = payment.fecha.slice(0, 10);
    } else {
      this.editingPayment.set(null);
      this.paymentConcept = '';
      this.paymentAmount = null;
      this.paymentStatus = '';
      this.paymentDate = this.todayDateInput();
    }
    this.paymentError.set('');
    this.paymentModalOpen.set(true);
  }

  closePaymentModal() {
    this.paymentModalOpen.set(false);
    this.editingPayment.set(null);
  }

  registerPayment() {
    this.registeringPayment.set(true);
    this.paymentError.set('');

    const dto: CreatePaymentDto = {};
    if (this.paymentConcept) dto.concepto = this.paymentConcept;
    if (this.paymentAmount !== null) dto.importe = this.paymentAmount;
    if (this.paymentStatus) dto.estado = this.paymentStatus;
    if (this.paymentDate) dto.fecha = this.paymentDate;

    const editing = this.editingPayment();
    const request = editing
      ? this.paymentsService.update(this.clientId, editing.id, dto)
      : this.paymentsService.create(this.clientId, dto);

    request.subscribe({
      next: () => {
        this.registeringPayment.set(false);
        this.paymentModalOpen.set(false);
        this.editingPayment.set(null);
        this.load();
        this.clientsService.refreshAlertsCount();
      },
      error: () => {
        this.registeringPayment.set(false);
        this.paymentError.set(editing ? 'No se pudo actualizar el pago.' : 'No se pudo registrar el pago.');
      },
    });
  }

  private todayDateInput(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
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
        this.clientsService.refreshAlertsCount();
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
