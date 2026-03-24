# Análisis técnico actualizado del proyecto `react-app`

**Fecha de actualización:** 24 de marzo de 2026

## 1) Estado actual del proyecto

### Stack y ejecución

- El proyecto está construido con **React 18 + TypeScript + Vite** y utiliza **Zustand** para estado global y **Vitest + Testing Library** para pruebas.
- Scripts disponibles:
  - `npm run dev`
  - `npm run build`
  - `npm run test`
  - `npm run lint`
- Dependencias clave actuales: `react-router-dom@6.28.0`, `zustand`, `vitest`, `@testing-library/*`.

### Arquitectura frontend actual

- Enrutado SPA centralizado en `src/Routes/AppRoutes.tsx` con rutas para Home, Registro, Productos, Detalle y Carrito.
- Modelo de dominio ya separado en `src/domain`:
  - `Product`
  - `CartItem`
  - `User`
- Datos de catálogo centralizados en `src/data/products.ts` (mock local).
- Capa de servicios frontend presente:
  - `products.service.ts` (lectura de catálogo desde mocks)
  - `cart.service.ts` (persistencia en `localStorage`)
- Estado global implementado con `useShopStore` (carrito y favoritos).
- Hooks de negocio:
  - `useProducts`
  - `useCart`
  - `usePageUXState` para estados UX (`loading`, `ready`, `error`).

### Nivel de madurez actual

**Fortalezas ya consolidadas**

- Separación razonable por capas frontend (UI / dominio / servicios / hooks / store).
- Tipado de entidades de negocio.
- Persistencia local del carrito.
- Cobertura inicial de tests en Home, Featured y Cart.

**Limitaciones actuales relevantes**

- Aún no existe backend real (API, DB, auth, órdenes, etc.).
- `productsService` consume datos mock, no API remota.
- Parte del flujo de compra depende de estado local.
- Hay errores actuales de build/test que reducen confiabilidad de CI:
  - `npm run build` falla por errores TypeScript y configuración (`vite.config.ts` incluye `test` sin `vitest/config`).
  - `npm run test` falla en 3 pruebas por timeouts/queries ambiguas.

---

## 2) ¿Se puede empezar con backend ahora?

## Sí, es posible y recomendable empezar ya.

El frontend ya cuenta con una base suficiente para definir contratos API (tipos + flujos + estado). No es necesario “esperar a terminar todo el front” para comenzar backend.

### Señales que habilitan iniciar backend

- Entidades principales ya identificadas (`Product`, `CartItem`, `User`).
- Flujos funcionales claros: catálogo, detalle, carrito.
- Capa de servicios ya existe y puede reemplazarse gradualmente por llamadas HTTP.

---

## 3) Plan de implementación de backend (propuesto)

## Fase A — Diseño funcional y contratos (1 semana)

1. Definir alcance MVP backend:
   - catálogo
   - autenticación
   - carrito por usuario
   - (opcional para MVP) checkout básico
2. Diseñar contrato API (OpenAPI/Swagger):
   - `GET /products`
   - `GET /products/:id`
   - `POST /auth/register`
   - `POST /auth/login`
   - `GET /cart`
   - `POST /cart/items`
   - `PATCH /cart/items/:id`
   - `DELETE /cart/items/:id`
3. Establecer respuestas estándar de error (400/401/403/404/500).

## Fase B — Base técnica backend (1 semana)

1. Crear repo/carpeta backend (Node + TypeScript).
2. Selección recomendada:
   - **Opción estructurada:** NestJS + PostgreSQL + Prisma.
   - **Opción ligera:** Fastify/Express + PostgreSQL + Prisma.
3. Configuración inicial:
   - ESLint + Prettier
   - variables de entorno
   - logger
   - migraciones
   - seeds de productos

## Fase C — Módulos backend MVP (2–3 semanas)

1. **Auth**
   - Registro/login
   - Hash de contraseñas
   - JWT access/refresh
2. **Products**
   - listado, detalle, filtros básicos
3. **Cart**
   - obtener carrito autenticado
   - agregar/eliminar/actualizar items
4. **(Opcional) Orders/Checkout**
   - crear orden desde carrito

## Fase D — Integración frontend ↔ backend (1–2 semanas)

1. Reemplazar mocks en `productsService` por fetch real.
2. Adaptar `cart.service` para persistencia remota por usuario autenticado.
3. Mantener fallback temporal en localStorage para sesión no autenticada (si negocio lo permite).
4. Añadir manejo uniforme de estados loading/error en hooks.

---

## 4) Mejoras prioritarias del proyecto (frontend + backend)

## Prioridad alta (inmediata)

- Corregir build TypeScript y configuración de Vitest en `vite.config.ts`.
- Estabilizar tests:
  - ajustar fake timers/act
  - eliminar queries ambiguas (`getByText` con múltiples coincidencias)
- Documentar contrato de datos frontend actual (DTOs) para alinear backend.

## Prioridad media (siguiente iteración)

- Introducir cliente HTTP central (`apiClient`) con interceptores de auth.
- Migrar servicios a llamadas reales (`products.service`, `cart.service`).
- Implementar manejo global de errores de API.
- Agregar estrategia de caché (React Query recomendado).

## Prioridad estratégica (escalabilidad)

- CI para frontend y backend (lint + test + build).
- Versionado de API (`/api/v1`).
- Observabilidad básica:
  - logs estructurados
  - trazabilidad por request-id
- Seguridad:
  - rate limiting
  - validación de payloads
  - políticas de CORS por entorno

---

## 5) Arquitectura objetivo recomendada

### Frontend

- `domain/` (tipos)
- `services/` (HTTP + mapping DTO → dominio)
- `hooks/` (lógica de consumo)
- `store/` (estado global)
- `components/pages` (UI)

### Backend

- `modules/auth`
- `modules/products`
- `modules/cart`
- `modules/orders` (siguiente fase)
- `shared` (middleware, errores, logger, config)
- `prisma` o `db/migrations`

### Base de datos (mínima)

- `users`
- `products`
- `cart_items`
- `orders` y `order_items` (fase 2)

---

## 6) Riesgos actuales y mitigaciones

1. **Riesgo:** divergencia entre contratos frontend y backend.
   - **Mitigación:** OpenAPI como fuente de verdad + tipos compartidos o generados.
2. **Riesgo:** deuda técnica de tests frágiles.
   - **Mitigación:** endurecer tests antes de integrar API crítica.
3. **Riesgo:** complejidad por migración brusca de localStorage a backend.
   - **Mitigación:** migración incremental por feature flags/capas de servicio.

---

## 7) Checklist de ejecución sugerido

### Semana 1

- [ ] Definir endpoints MVP y payloads.
- [ ] Crear backend base + DB + migraciones + seed de productos.

### Semana 2

- [ ] Implementar auth + products.
- [ ] Publicar documentación Swagger.

### Semana 3

- [ ] Implementar cart autenticado.
- [ ] Integrar frontend con products API.

### Semana 4

- [ ] Integrar frontend con cart API.
- [ ] Corregir deuda de tests/build + pipeline CI completo.

---

## Conclusión

El proyecto está en un punto adecuado para iniciar backend: ya existe un dominio definido, una estructura frontend ordenada y flujos funcionales claros. La siguiente evolución natural es formalizar el contrato API, implementar backend MVP (auth/products/cart) e integrar por fases, mientras se estabilizan build y tests para asegurar continuidad de entrega.
