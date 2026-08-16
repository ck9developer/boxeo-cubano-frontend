# Williams Box Cuba CRM — Frontend

Frontend en Angular 18 (standalone components) + Tailwind CSS para el CRM del gimnasio Williams Box Cuba. Consume la API en [`../boxeo-cubano-api`](../boxeo-cubano-api).

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

## Despliegue (Vercel)

1. Despliega primero el backend (ver README de `boxeo-cubano-api`) y anota su URL pública.
2. Edita `src/environments/environment.prod.ts` y pon esa URL en `apiUrl`. Este archivo solo se usa en el build de producción (`fileReplacements` en `angular.json`); en local sigue funcionando `environment.ts` con `localhost:3000`.
3. En [vercel.com](https://vercel.com), importa este repo. El `vercel.json` incluido ya fija el comando de build (`npm run build`), la carpeta de salida (`dist/boxeo-cubano-frontend/browser`) y la regla de rewrite necesaria para que las rutas de Angular (`/clients`, `/alerts`, etc.) funcionen al recargar o compartir un enlace directo.
4. Cada `git push` a la rama conectada vuelve a desplegar automáticamente.

Netlify funciona igual: mismo comando de build y carpeta de salida, y una regla de redirect equivalente (`/* -> /index.html 200`) en vez del `rewrites` de `vercel.json`.
