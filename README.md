# Boxeo Cubano CRM — Frontend

Frontend en Angular 18 (standalone components) + Tailwind CSS para el CRM del gimnasio Boxeo Cubano. Consume la API en [`../boxeo-cubano-api`](../boxeo-cubano-api).

## Stack

- Angular 18 (standalone components, signals, control flow `@if`/`@for`)
- Tailwind CSS
- RxJS + `HttpClient` con interceptor de JWT

## Estructura

```
src/app/
├── core/
│   ├── models/         interfaces que reflejan los DTOs de la API
│   ├── services/        auth, clientes, pagos, configuracion, dashboard
│   ├── interceptors/    añade el Bearer token, hace logout en 401
│   └── guards/          authGuard protege las rutas del shell
├── layout/
│   ├── sidebar/          navegación lateral
│   └── shell/            layout con sidebar + router-outlet
├── shared/
│   └── cliente-form-modal/  modal reutilizable (crear/editar cliente)
└── pages/
    ├── login/
    ├── dashboard/        "Inicio": resumen + clientes recientes
    ├── clientes/          listado, búsqueda, filtros, paginación
    ├── cliente-detalle/   ficha del cliente + historial de pagos + registrar pago
    └── configuracion/     datos del gimnasio y cuotas
```

## Puesta en marcha

Necesitas el backend corriendo en `http://localhost:3000` (ver README del backend).

```bash
npm install
npm start
```

La app queda disponible en `http://localhost:4200`. La URL de la API se configura en `src/environments/environment.ts`.

**Credenciales:** usuario `admin`, contraseña `admin123` (las del seed del backend).

## Notas

- Los tipos de cuota son `TRES_DIAS`, `CUATRO_DIAS`, `TODOS_LOS_DIAS` (3/4/todos los días por semana), no mensual/bonos.
- Al registrar un pago, si se dejan vacíos el importe y el concepto, se calculan automáticamente según el tipo de cuota del cliente y el precio configurado en `/configuracion`.
- La confirmación de borrado de cliente usa `window.confirm` nativo.
