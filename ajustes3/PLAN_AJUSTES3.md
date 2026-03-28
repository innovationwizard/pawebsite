# Plan de Implementación — Ajustes 3

Fuente: `ajustes3/Modernización Sitio Web Puerta Abierta (1).pdf` + assets adjuntos + `INDEX_OF_INTENT.png`

---

## Cambio 1: Logos del cintillo más grandes

**Qué:** Aumentar el tamaño de los logos del ribbon/marquee debajo del video principal.

**Archivo:** `src/components/landing/project-logos-ribbon.tsx`

**Actualmente:** Los logos se renderizan a `h-10` (40px) mobile / `h-12` (48px) desktop, con dimensiones intrínsecas de 160×56px.

**Acción:** Subir a `h-14` (56px) mobile / `h-20` (80px) desktop. Ajustar padding vertical del contenedor si es necesario para mantener proporciones.

**Riesgo:** Bajo. Cambio CSS puro.

---

## Cambio 2: Banner secundario debajo de tarjetas de proyectos

**Qué:** Colocar la imagen "Portada de Facebook inmobiliaria real estate profesional moderno azul.png" como banner entre el `ProjectShowcaseSlider` y el `BrandHighlights`.

**Asset:** `ajustes3/Portada de Facebook inmobiliaria real estate profesional moderno azul.png`

**RESUELTO:** "Banner secundario" es el nombre del cliente para el TertiaryBanner existente. No es una sección nueva.

**Acción:**
1. Copiar la imagen a `public/images/banners/banner-secundario.png`.
2. Actualizar el `TertiaryBanner` para usar esta nueva imagen en lugar de la actual.
3. El banner debe ser full-width, responsive, con el botón "COTIZA AHORA" enlazando a la sección de contacto.

**Archivo modificado:** `src/components/landing/tertiary-banner.tsx` y/o actualizar la imagen vía admin/settings.

---

## Cambio 3: Título "Puerta Abierta en números" sobre stats

**Qué:** Agregar un heading arriba de la sección de hitos/estadísticas (BrandHighlights).

**Archivo:** `src/components/landing/brand-highlights.tsx`

**Acción:** Agregar un `<h2>` con texto "Puerta Abierta en números" centrado arriba del grid de stats. Usar tipografía consistente con el design system (`text-navy`, `font-bold`, tamaño `text-3xl md:text-4xl`).

**Riesgo:** Bajo. Adición de markup.

---

## Cambio 4: Imagen de equipo en "¿Por qué hacemos lo que hacemos?"

**Qué:** Colocar `Team 1.jpg` en la sección "Why" con esquinas redondeadas.

**Asset:** `ajustes3/Team 1.jpg`

**Acción:**
1. Copiar `Team 1.jpg` a `public/images/team/team-1.jpg`.
2. En `src/components/landing/why-how-section.tsx`, la sección "Why" ya tiene un layout de 2 columnas con un placeholder de imagen (aspect-ratio 4:3). Reemplazar ese placeholder con la imagen real usando `rounded-2xl` y `object-cover`.

**Riesgo:** Bajo. La estructura ya existe; solo se llena con la imagen real.

---

## Cambio 5: Cápsulas debajo de "Cómo lo hacemos"

**Qué:** Agregar 3 bloques de texto+imagen alternados debajo del diagrama de 5 pasos.

**Assets:**
- Cápsula 1 imagen (derecha): `ajustes3/Sketch Boulevard 5.png`
- Cápsula 2 imagen (izquierda): `ajustes3/PA.png`
- Cápsula 3 imagen (derecha): **No se proporcionó imagen.** (Ver pregunta #2 abajo)

**Contenido exacto (del PDF):**

| Cápsula | Texto (lado) | Imagen (lado) | Texto |
|---------|-------------|---------------|-------|
| 1 | Izquierdo | Derecho | "Abrimos el camino y te acompañamos en cada paso. Nuestro enfoque combina asesoría personalizada, conocimiento del mercado y herramientas digitales para facilitar cada etapa del proceso." |
| 2 | Derecho | Izquierdo | "Desde el primer contacto hasta la entrega de tu propiedad, te acompañamos con un equipo experto que entiende tus necesidades y te guía hacia la mejor decisión." |
| 3 | Izquierdo | Derecho | "Trabajamos con opciones de financiamiento, programas como vivienda accesible y desarrollos con alto potencial de plusvalía." |

**Acción:**
1. Copiar imágenes a `public/images/capsulas/capsula-1.png` y `capsula-2.png`.
2. Extender `src/components/landing/why-how-section.tsx` (o crear componente hijo `HowCapsules`) con un layout alternado: grid de 2 columnas que invierte el orden texto/imagen en cada fila. Imágenes con `rounded-2xl`.
3. Scroll-reveal animations por cápsula.

**RESUELTO:** Cápsula 3 no tiene imagen proporcionada. Dejar espacio placeholder preparado para recibir imagen después.

---

## Cambio 6: Sección "Nuestros proyectos nos respaldan" (Insignias)

**Qué:** Nueva sección con insignias de proyectos entregados en dos filas tipo cintillo. Va **debajo** de la sección "Cómo lo hacemos" (después de las cápsulas).

**Assets:** 12 insignias en `ajustes3/Black and White Minimalist.../` (archivos 3.png a 14.png):

| Archivo | Proyecto | Estado | Color |
|---------|----------|--------|-------|
| 3.png | Edificio 7-47 | Entregado | Dorado |
| 4.png | Telia | Entregado | Dorado |
| 5.png | Casa 3 | Entregado | Dorado |
| 6.png | Santeli | Entregado | Dorado |
| 7.png | Natú | Entregado | Dorado |
| 8.png | Casa Elisa | Entregado | Dorado |
| 9.png | Colinas de Castilla | Entregado | Dorado |
| 10.png | Colinas de Castilla | Entregado | Dorado (duplicado?) |
| 11.png | Benestare | En Construcción | Celeste |
| 12.png | Boulevard 5 | Próximo a Entrega | Celeste |
| 13.png | Bosque Las Tapias | Fase de Preventa | Celeste |
| 14.png | Santa Elena | Fase de Preventa | Celeste |

**Contenido textual (exacto del PDF):**
- **Título:** "Nuestros proyectos nos respaldan"
- **Body:** "Ubicación, diseño y plusvalía en cada desarrollo. Trabajamos con algunos de los proyectos más relevantes del mercado inmobiliario en Guatemala, seleccionados por su calidad, propuesta de valor y potencial de crecimiento.\n\nDesde apartamentos modernos en la ciudad hasta desarrollos rodeados de naturaleza o proyectos premium, nuestro portafolio está diseñado para ofrecer opciones para cada perfil de cliente"

**Acción:**
1. Copiar las 12 insignias a `public/images/insignias/` con nombres descriptivos.
2. Crear componente `src/components/landing/project-badges.tsx`.
3. Layout: título + body centrados, seguido de dos filas de insignias (6 por fila en desktop). Usar marquee/scroll o grid estático según diseño.
4. Las insignias doradas son "entregados", las celestes son "activos". Mantener esta distinción visual.

**RESUELTO:** Usar solo un Colinas de Castilla (9.png). Descartar 10.png. Total: 11 insignias.

---

## Cambio 7: Sección de Testimoniales

**Qué:** Colocar apartado de "Testimoniales" debajo de "Cómo lo hacemos" y arriba de "Contáctanos". Reviews con estrellas, cajas redondeadas, animación hover.

**Estado actual:** Ya existe `TestimonialsSlider` en el landing que hace exactamente esto — cajas con rating de estrellas, auto-scroll, hover effects.

**Problema:** El PDF dice "Crea tu algunos reviews de parte de clientes de Puerta Abierta en donde se hable bien de la empresa."

**Aclaración del cliente:** Los testimonios son de clientes reales, encuestados en papel. El contenido textual de esas encuestas no fue proporcionado digitalmente.

**Estado:** El componente `TestimonialsSlider` ya existe con el diseño correcto (estrellas, cajas redondeadas, animaciones hover). El admin panel en `/admin/testimonios` permite gestionar testimonios.

**PENDIENTE:** Se necesitan los datos textuales de los testimonios reales (nombre del cliente, texto del review, rating en estrellas, y opcionalmente su rol/proyecto). Una vez proporcionados, se cargan vía admin panel o se hardcodean.

**Acción por ahora:** Dejar el componente existente funcional. No inventar contenido.

---

## Cambio 8: Sección "Abrimos las puertas a tecnología de otro nivel"

**Qué:** Nueva sección debajo de las insignias.

**Contenido exacto (del PDF):**
- **Título:** "Abrimos las puertas a tecnología de otro nivel"
- **Subtítulo:** "Innovación, datos e inteligencia artificial al servicio de mejores decisiones"
- **Body:** "En Puerta Abierta creemos que el futuro de los bienes raíces en Guatemala no solo se construye con proyectos, sino con inteligencia.\n\nPor eso integramos tecnología de punta e inteligencia artificial (IA) en nuestros procesos comerciales, análisis de mercado y estrategias de marketing, permitiéndonos anticiparnos a las tendencias y ofrecer soluciones más precisas a nuestros clientes."
- **Imágenes:** El PDF muestra screenshots de herramientas (S.MPLE, SERHANT) pero dice "Dejar espacio para imágenes" — implica que las imágenes se proporcionarán después.

**Acción:**
1. Crear componente `src/components/landing/tech-section.tsx`.
2. Layout: texto a la izquierda, placeholder de imagen a la derecha (o grid preparado para recibir imágenes).
3. Agregar al `page.tsx` en la posición correcta.

---

## Orden final de secciones en `page.tsx`

```
1.  HeroVideo
2.  ProjectLogosRibbon          ← logos más grandes (Cambio 1)
3.  ProjectShowcaseSlider
4.  TertiaryBanner               ← nueva imagen del banner (Cambio 2)
5.  BrandHighlights              ← con título nuevo (Cambio 3)
6.  WhyHowSection                ← con imagen de equipo (Cambio 4) + cápsulas (Cambio 5)
7.  ProjectBadges                ← NUEVA sección insignias (Cambio 6)
8.  TechSection                  ← NUEVA sección tecnología (Cambio 8)
9.  TestimonialsSlider           ← ya existente, pendiente datos reales (Cambio 7)
10. NewsCapsules
11. NewsletterForm (#contacto)
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `src/components/landing/project-badges.tsx` | Insignias de proyectos entregados |
| `src/components/landing/tech-section.tsx` | Sección de tecnología/IA |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/app/page.tsx` | Agregar nuevas secciones, reordenar layout |
| `src/components/landing/project-logos-ribbon.tsx` | Aumentar tamaño de logos |
| `src/components/landing/tertiary-banner.tsx` | Actualizar imagen del banner |
| `src/components/landing/brand-highlights.tsx` | Agregar título "Puerta Abierta en números" |
| `src/components/landing/why-how-section.tsx` | Agregar imagen de equipo + cápsulas |

## Assets a copiar a `public/`

| Origen | Destino |
|--------|---------|
| `ajustes3/Team 1.jpg` | `public/images/team/team-1.jpg` |
| `ajustes3/Portada de Facebook...png` | `public/images/banners/banner-secundario.png` |
| `ajustes3/Sketch Boulevard 5.png` | `public/images/capsulas/capsula-1.png` |
| `ajustes3/PA.png` | `public/images/capsulas/capsula-2.png` |
| `ajustes3/Black and White.../3.png` | `public/images/insignias/edificio-7-47.png` |
| `ajustes3/Black and White.../4.png` | `public/images/insignias/telia.png` |
| `ajustes3/Black and White.../5.png` | `public/images/insignias/casa-3.png` |
| `ajustes3/Black and White.../6.png` | `public/images/insignias/santeli.png` |
| `ajustes3/Black and White.../7.png` | `public/images/insignias/natu.png` |
| `ajustes3/Black and White.../8.png` | `public/images/insignias/casa-elisa.png` |
| `ajustes3/Black and White.../9.png` | `public/images/insignias/colinas-de-castilla.png` |
| ~~`ajustes3/Black and White.../10.png`~~ | ~~descartado (duplicado)~~ |
| `ajustes3/Black and White.../11.png` | `public/images/insignias/benestare.png` |
| `ajustes3/Black and White.../12.png` | `public/images/insignias/boulevard-5.png` |
| `ajustes3/Black and White.../13.png` | `public/images/insignias/bosque-las-tapias.png` |
| `ajustes3/Black and White.../14.png` | `public/images/insignias/santa-elena.png` |

---

## PREGUNTAS RESUELTAS

| # | Pregunta | Respuesta |
|---|----------|-----------|
| 1 | Banner Secundario vs TertiaryBanner | Son el mismo componente. Nomenclatura del cliente. Actualizar imagen del TertiaryBanner. |
| 2 | Imagen faltante para Cápsula 3 | Dejar espacio placeholder. |
| 3 | Insignia duplicada Colinas de Castilla | Usar solo una (9.png). |
| 4 | Testimoniales | Clientes reales encuestados en papel. Contenido textual pendiente de digitalizar. Componente ya existe; no inventar contenido. |
| 5 | Imágenes sección Tecnología | Texto + espacio reservado para imágenes futuras. |

## PENDIENTE ÚNICO PARA IMPLEMENTAR

- **Testimoniales:** Se necesitan los datos textuales de los testimonios reales (nombre, texto, rating, proyecto) para poblar la sección. El componente está listo.
