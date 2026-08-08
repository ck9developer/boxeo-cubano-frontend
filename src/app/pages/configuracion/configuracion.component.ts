import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GymConfig } from '../../core/models/configuracion.model';
import { ConfiguracionService } from '../../core/services/configuracion.service';

interface ConfigForm {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  timezone: string;
  cuotaTresDias: number;
  cuotaCuatroDias: number;
  cuotaTodosDias: number;
  diaVencimiento: number;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent implements OnInit {
  readonly dias = Array.from({ length: 31 }, (_, i) => i + 1);

  config = signal<GymConfig | null>(null);
  form: ConfigForm = this.emptyForm();
  loading = signal(true);

  savingInfo = signal(false);
  savedInfo = signal(false);
  savingCuotas = signal(false);
  savedCuotas = signal(false);

  constructor(private readonly configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.configuracionService.get().subscribe((cfg) => {
      this.config.set(cfg);
      this.form = {
        nombre: cfg.nombre,
        email: cfg.email,
        telefono: cfg.telefono,
        direccion: cfg.direccion,
        timezone: cfg.timezone,
        cuotaTresDias: Number(cfg.cuotaTresDias),
        cuotaCuatroDias: Number(cfg.cuotaCuatroDias),
        cuotaTodosDias: Number(cfg.cuotaTodosDias),
        diaVencimiento: cfg.diaVencimiento,
      };
      this.loading.set(false);
    });
  }

  guardarInfo() {
    this.savingInfo.set(true);
    this.savedInfo.set(false);
    this.configuracionService
      .update({
        nombre: this.form.nombre,
        email: this.form.email,
        telefono: this.form.telefono,
        direccion: this.form.direccion,
        timezone: this.form.timezone,
      })
      .subscribe({
        next: (cfg) => {
          this.config.set(cfg);
          this.savingInfo.set(false);
          this.savedInfo.set(true);
          setTimeout(() => this.savedInfo.set(false), 2000);
        },
        error: () => this.savingInfo.set(false),
      });
  }

  guardarCuotas() {
    this.savingCuotas.set(true);
    this.savedCuotas.set(false);
    this.configuracionService
      .update({
        cuotaTresDias: this.form.cuotaTresDias,
        cuotaCuatroDias: this.form.cuotaCuatroDias,
        cuotaTodosDias: this.form.cuotaTodosDias,
        diaVencimiento: this.form.diaVencimiento,
      })
      .subscribe({
        next: (cfg) => {
          this.config.set(cfg);
          this.savingCuotas.set(false);
          this.savedCuotas.set(true);
          setTimeout(() => this.savedCuotas.set(false), 2000);
        },
        error: () => this.savingCuotas.set(false),
      });
  }

  private emptyForm(): ConfigForm {
    return {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      timezone: '',
      cuotaTresDias: 0,
      cuotaCuatroDias: 0,
      cuotaTodosDias: 0,
      diaVencimiento: 5,
    };
  }
}
