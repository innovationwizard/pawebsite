-- 00014: Add CTA fields to FAQs and seed FAQ content from PDF

-- Add CTA columns
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS cta_text TEXT;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS cta_url TEXT;

-- Clear existing FAQ data to avoid duplicates
DELETE FROM faqs;
DELETE FROM faq_categories;

-- Insert categories
INSERT INTO faq_categories (id, name, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Sobre Puerta Abierta', 1),
  ('c0000001-0000-0000-0000-000000000002', 'Proceso para comprar apartamento en Guatemala', 2),
  ('c0000001-0000-0000-0000-000000000003', 'Financiamiento y FHA en Guatemala', 3),
  ('c0000001-0000-0000-0000-000000000004', 'Sobre los proyectos inmobiliarios', 4),
  ('c0000001-0000-0000-0000-000000000005', 'Inversión en bienes raíces Guatemala', 5),
  ('c0000001-0000-0000-0000-000000000006', 'Acompañamiento y confianza', 6),
  ('c0000001-0000-0000-0000-000000000007', 'Preguntas generales', 7);

-- Insert FAQs
-- Category 1: Sobre Puerta Abierta
INSERT INTO faqs (category_id, question, answer, cta_text, cta_url, is_published, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001',
   '¿Qué es Puerta Abierta y cómo funciona como inmobiliaria en Guatemala?',
   'Puerta Abierta es una inmobiliaria en Guatemala especializada en asesorarte para comprar apartamento o invertir en proyectos residenciales. Te acompañamos en todo el proceso, desde la elección del proyecto hasta la aprobación de tu crédito hipotecario.',
   'Habla con un asesor y encuentra tu apartamento ideal hoy.',
   '/cotizador',
   true, 1),

  ('c0000001-0000-0000-0000-000000000001',
   '¿Qué tipo de apartamentos y proyectos inmobiliarios ofrecen?',
   'Ofrecemos apartamentos en Guatemala ubicados en zonas estratégicas, ideales tanto para primera vivienda como para inversión. Trabajamos con proyectos modernos, con amenidades y alta plusvalía.',
   'Descubre los proyectos disponibles y elige el que mejor se adapte a ti.',
   '/proyectos',
   true, 2),

  ('c0000001-0000-0000-0000-000000000001',
   '¿La asesoría inmobiliaria tiene costo?',
   'No. En Puerta Abierta la asesoría es completamente gratuita. Nuestro objetivo es ayudarte a comprar tu apartamento en Guatemala de forma segura y sin complicaciones.',
   'Solicita asesoría gratis ahora.',
   '/cotizador',
   true, 3),

-- Category 2: Proceso para comprar apartamento en Guatemala
  ('c0000001-0000-0000-0000-000000000002',
   '¿Cómo comprar un apartamento en Guatemala con Puerta Abierta?',
   'El proceso es sencillo: te contactas con nosotros, analizamos tu perfil, te presentamos opciones y te acompañamos en todo el proceso de compra y financiamiento.',
   'Inicia tu proceso de compra hoy mismo.',
   '/cotizador',
   true, 4),

  ('c0000001-0000-0000-0000-000000000002',
   '¿Me ayudan con el crédito hipotecario en Guatemala?',
   'Sí. Te asesoramos en todo el proceso para obtener tu crédito hipotecario en Guatemala, incluyendo opciones con bancos y entidades como FHA.',
   'Recibe asesoría personalizada para tu crédito.',
   '/cotizador',
   true, 5),

  ('c0000001-0000-0000-0000-000000000002',
   '¿Qué necesito para aplicar a un crédito hipotecario?',
   'Generalmente necesitas ingresos comprobables, estabilidad laboral y buen historial crediticio. Nuestro equipo te guiará paso a paso para aumentar tus probabilidades de aprobación.',
   'Evalúa tu perfil crediticio con un asesor.',
   '/cotizador',
   true, 6),

  ('c0000001-0000-0000-0000-000000000002',
   '¿Puedo comprar si es mi primera vivienda?',
   'Sí. Muchos de nuestros proyectos aplican para primera vivienda en Guatemala, con beneficios como tasas preferenciales y cuotas accesibles.',
   'Conoce opciones ideales para tu primera vivienda.',
   '/proyectos',
   true, 7),

-- Category 3: Financiamiento y FHA en Guatemala
  ('c0000001-0000-0000-0000-000000000003',
   '¿Qué es el FHA en Guatemala y cómo funciona?',
   'El FHA (Instituto de Fomento de Hipotecas Aseguradas) respalda tu crédito hipotecario, facilitando el acceso a financiamiento con tasas más bajas y cuotas más cómodas.',
   'Descubre cómo aplicar con FHA hoy.',
   '/cotizador',
   true, 8),

  ('c0000001-0000-0000-0000-000000000003',
   '¿Qué es el programa Mi Primera Vivienda?',
   'Es un programa que permite acceder a tasas preferenciales (aproximadamente 5.5%) y mejores condiciones para comprar tu primera vivienda en Guatemala.',
   'Aplica al programa y paga menos por tu apartamento.',
   '/cotizador',
   true, 9),

  ('c0000001-0000-0000-0000-000000000003',
   '¿Cuánto debo dar de enganche para comprar un apartamento?',
   'El enganche varía según el proyecto, pero existen opciones accesibles y planes de pago flexibles.',
   'Consulta opciones de enganche según tu presupuesto.',
   '/cotizador',
   true, 10),

-- Category 4: Sobre los proyectos inmobiliarios
  ('c0000001-0000-0000-0000-000000000004',
   '¿Es seguro comprar apartamentos en construcción en Guatemala?',
   'Sí. Trabajamos con desarrolladores confiables y proyectos respaldados, lo que garantiza una inversión segura.',
   'Conoce proyectos en construcción con alta plusvalía.',
   '/proyectos',
   true, 11),

  ('c0000001-0000-0000-0000-000000000004',
   '¿Puedo visitar los apartamentos antes de comprar?',
   'Sí. Coordinamos visitas a proyectos inmobiliarios en Guatemala para que conozcas ubicación, avances y amenidades.',
   'Agenda tu visita hoy mismo.',
   '/cotizador',
   true, 12),

-- Category 5: Inversión en bienes raíces Guatemala
  ('c0000001-0000-0000-0000-000000000005',
   '¿Es buena inversión comprar un apartamento en Guatemala?',
   'Sí. Invertir en bienes raíces en Guatemala genera plusvalía y permite ingresos por alquiler, especialmente en zonas estratégicas.',
   'Descubre oportunidades de inversión inmobiliaria.',
   '/proyectos',
   true, 13),

  ('c0000001-0000-0000-0000-000000000005',
   '¿Puedo comprar un apartamento para alquilar o Airbnb?',
   'Sí. Muchos de nuestros proyectos son ideales para inversión en renta tradicional o Airbnb.',
   'Encuentra proyectos ideales para generar ingresos.',
   '/proyectos',
   true, 14),

-- Category 6: Acompañamiento y confianza
  ('c0000001-0000-0000-0000-000000000006',
   '¿Puerta Abierta me acompaña durante todo el proceso?',
   'Sí. Te acompañamos desde la búsqueda hasta la entrega de tu propiedad, brindándote asesoría clara y transparente.',
   'Recibe acompañamiento en cada paso.',
   '/cotizador',
   true, 15),

  ('c0000001-0000-0000-0000-000000000006',
   '¿Qué pasa después de comprar mi apartamento?',
   'Seguimos apoyándote hasta la entrega de tu propiedad y resolvemos cualquier duda adicional.',
   'Compra con respaldo y tranquilidad.',
   '/cotizador',
   true, 16),

-- Category 7: Preguntas generales
  ('c0000001-0000-0000-0000-000000000007',
   '¿Cuánto tiempo tarda comprar un apartamento en Guatemala?',
   'El proceso puede tomar desde semanas hasta algunos meses, dependiendo del crédito y el proyecto.',
   'Inicia hoy y avanza más rápido.',
   '/cotizador',
   true, 17),

  ('c0000001-0000-0000-0000-000000000007',
   '¿Puedo comprar si soy independiente?',
   'Sí, aunque el proceso puede requerir documentación adicional. Te ayudamos a prepararte para lograr la aprobación.',
   'Evalúa tu caso con un asesor experto.',
   '/cotizador',
   true, 18),

  ('c0000001-0000-0000-0000-000000000007',
   '¿Por qué elegir Puerta Abierta como inmobiliaria?',
   'Porque ofrecemos asesoría personalizada, proyectos de alta calidad y acompañamiento completo para que tomes una decisión inteligente.',
   'Contáctanos y encuentra tu próximo apartamento.',
   '/cotizador',
   true, 19);
