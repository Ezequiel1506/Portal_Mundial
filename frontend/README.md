# Manual Técnico - Frontend (Interfaz de Usuario)

Este módulo es responsable de la presentación visual y la interactividad. Está construido con **Next.js (App Router)**, **React** y **Tailwind CSS**. 

El flujo de datos va siempre en una sola dirección: la página principal obtiene los datos de la API de Python y los "pasa hacia abajo" (props) a los componentes visuales.

## Archivo: `src/app/page.tsx` (El Orquestador)
Es el componente principal (Server Component). No tiene estado propio, su trabajo es armar la página antes de enviarla al navegador del usuario.

* **Funciones de Fetch (`getMatchCenterData`, `getGroupsData`, `getNewsData`)**:
  - Funciones asíncronas que se comunican con la API de Render usando el estándar `fetch`. Utilizan `{ cache: 'no-store' }` para asegurar que siempre traigan el dato más reciente sin guardar caché intermedia que estanque la predicción.
* **Componente `Home(props)`**:
  - Lee los parámetros de la URL (`searchParams.matchId`) para saber qué partido eligió el usuario.
  - Ejecuta las llamadas a la API en paralelo usando `Promise.all` para reducir drásticamente el tiempo de carga.
  - Tiene un bloque `try/catch` envolvente. Si la API de Python cae o falla, el `catch` intercepta el error y muestra una "Pantalla de Diagnóstico" roja con detalles del fallo, en lugar de colgar toda la web.

## Archivo: `src/components/MatchSelector.tsx` (El Controlador)
Es el único componente marcado con `"use client"` que afecta directamente la navegación.

* **Hooks utilizados**: Usa `useRouter` y `useSearchParams` de Next.js para manipular la URL sin recargar el navegador.
* **`handleSelect`**: Función que se dispara cuando el usuario cambia la opción del menú desplegable. Toma el ID del nuevo partido (ej. `w2026-12345`) y ejecuta un `router.push(/?matchId=...)`. Esto le avisa al `page.tsx` que debe volver a calcular todo con el nuevo ID.

## Componentes Visuales (Widgets)
Estos archivos son "tontos" (Dumb Components). No piden datos a internet ni tienen lógica compleja, simplemente reciben objetos JSON (Props) y los transforman en código HTML/Tailwind.

* **`PredictionWidget.tsx`**: Recibe las probabilidades (ej. 54%) y los marcadores del Top 3 calculados por Poisson. Usa Tailwind para dibujar la barra de progreso tricolor y las tarjetas de resultados.
* **`LineupWidget.tsx`**: Recibe las formaciones (ej. "4-3-3") y un array de jugadores (con interfaces TypeScript asegurando que tengan `name: string` y `number: number`). Mapea estos datos en formato de lista.
* **`GroupsWidget.tsx`**: Recibe el array gigantesco de los 8 grupos. Utiliza `.map()` dos veces: primero para iterar sobre cada grupo (dibujando la tabla), y luego sobre la lista de partidos de ese grupo (dibujando el fixture inferior).
* **`NewsWidget.tsx`**: Itera sobre las noticias y renderiza tarjetas informativas, diferenciando visualmente (con un tag) si una noticia tiene la bandera `is_featured: true`.