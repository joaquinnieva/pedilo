# 📦 Pedilo

Aplicación web colaborativa en tiempo real para coordinar pedidos grupales de comida, gestionar el menú disponible, llevar el control de pagos y sortear quién realiza el pedido.

## Funcionalidades

- **Menús en tiempo real:** Crear, editar, eliminar y resetear opciones de menú con modal de confirmación.
- **Pedidos colaborativos:**
  - Crear, editar y clonar pedidos de otros participantes.
  - Posibilidad de cargar un menú manual directamente desde el modal de pedido (se guarda automáticamente en **Menús**).
  - Check **`Pagado`** en cada tarjeta y contador **`Pagados: X/Y`** + **`Subtotal`** en tiempo real.
  - Reseteo total con modal de confirmación.
- **Banner de difusión:** Muestra en la página principal el mensaje de difusión configurado en Firestore con soporte de expansión para textos largos.
- **Ruleta moderna y regla anti-resorteo:**
  - Ruleta en canvas HiDPI con luces LED, puntero animado, confeti y ganador persistido en tiempo real.
  - La tarjeta del ganador se destaca en dorado con animación.
  - En la sesión de la persona ganadora se abre un modal de victoria con reproducción de trompetas (`/sounds/trompetitas_ganadoras.wav`) y acceso directo a **PEDILO**.
  - Una vez realizado un sorteo, la ruleta queda bloqueada hasta que se agregue un nuevo pedido o se reseteen los pedidos.
- **Temas / Skins:** Selector de 6 paletas de colores persistido en `localStorage`.
- **Exportación a WhatsApp:** Resumen agrupado por menú/aclaraciones con costo de envío, botón rápido de copiado y envío directo por `wa.me`.

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 + Radix UI Themes
- Firebase Firestore (`react-firebase-hooks`)
- GSAP + `canvas-confetti` + Lucide Icons
- Biome (lint y formato)

## Comandos

```bash
npm install
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Typecheck (tsc) + build de producción (vite build)
npm run lint     # Lint y formato con Biome
```
