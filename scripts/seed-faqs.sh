#!/bin/bash
# Seed FAQ categories and questions from PDF content
# Run after adding cta_text/cta_url columns via SQL Editor

set -euo pipefail

SUPABASE_URL="https://cymyzcarmhgonqcbeygl.supabase.co"
SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2)

HEADERS=(
  -H "apikey: ${SERVICE_KEY}"
  -H "Authorization: Bearer ${SERVICE_KEY}"
  -H "Content-Type: application/json"
  -H "Prefer: return=representation"
)

echo "Clearing existing FAQs..."
curl -s -X DELETE "${SUPABASE_URL}/rest/v1/faqs?id=not.is.null" "${HEADERS[@]}" -o /dev/null
curl -s -X DELETE "${SUPABASE_URL}/rest/v1/faq_categories?id=not.is.null" "${HEADERS[@]}" -o /dev/null

echo "Inserting FAQ categories..."
CATS=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/faq_categories" "${HEADERS[@]}" \
  -d '[
    {"name":"Sobre Puerta Abierta","sort_order":1},
    {"name":"Proceso para comprar apartamento en Guatemala","sort_order":2},
    {"name":"Financiamiento y FHA en Guatemala","sort_order":3},
    {"name":"Sobre los proyectos inmobiliarios","sort_order":4},
    {"name":"Inversión en bienes raíces Guatemala","sort_order":5},
    {"name":"Acompañamiento y confianza","sort_order":6},
    {"name":"Preguntas generales","sort_order":7}
  ]')

echo "Categories created."

# Extract category IDs by sort_order
CAT1=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==1][0])")
CAT2=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==2][0])")
CAT3=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==3][0])")
CAT4=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==4][0])")
CAT5=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==5][0])")
CAT6=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==6][0])")
CAT7=$(echo "$CATS" | python3 -c "import sys,json; cats=json.load(sys.stdin); print([c['id'] for c in cats if c['sort_order']==7][0])")

echo "Inserting FAQs..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/faqs" "${HEADERS[@]}" -o /dev/null \
  -d "$(cat <<ENDJSON
[
  {"category_id":"${CAT1}","question":"¿Qué es Puerta Abierta y cómo funciona como inmobiliaria en Guatemala?","answer":"Puerta Abierta es una inmobiliaria en Guatemala especializada en asesorarte para comprar apartamento o invertir en proyectos residenciales. Te acompañamos en todo el proceso, desde la elección del proyecto hasta la aprobación de tu crédito hipotecario.","cta_text":"Habla con un asesor y encuentra tu apartamento ideal hoy.","cta_url":"/cotizador","is_published":true,"sort_order":1},
  {"category_id":"${CAT1}","question":"¿Qué tipo de apartamentos y proyectos inmobiliarios ofrecen?","answer":"Ofrecemos apartamentos en Guatemala ubicados en zonas estratégicas, ideales tanto para primera vivienda como para inversión. Trabajamos con proyectos modernos, con amenidades y alta plusvalía.","cta_text":"Descubre los proyectos disponibles y elige el que mejor se adapte a ti.","cta_url":"/proyectos","is_published":true,"sort_order":2},
  {"category_id":"${CAT1}","question":"¿La asesoría inmobiliaria tiene costo?","answer":"No. En Puerta Abierta la asesoría es completamente gratuita. Nuestro objetivo es ayudarte a comprar tu apartamento en Guatemala de forma segura y sin complicaciones.","cta_text":"Solicita asesoría gratis ahora.","cta_url":"/cotizador","is_published":true,"sort_order":3},
  {"category_id":"${CAT2}","question":"¿Cómo comprar un apartamento en Guatemala con Puerta Abierta?","answer":"El proceso es sencillo: te contactas con nosotros, analizamos tu perfil, te presentamos opciones y te acompañamos en todo el proceso de compra y financiamiento.","cta_text":"Inicia tu proceso de compra hoy mismo.","cta_url":"/cotizador","is_published":true,"sort_order":4},
  {"category_id":"${CAT2}","question":"¿Me ayudan con el crédito hipotecario en Guatemala?","answer":"Sí. Te asesoramos en todo el proceso para obtener tu crédito hipotecario en Guatemala, incluyendo opciones con bancos y entidades como FHA.","cta_text":"Recibe asesoría personalizada para tu crédito.","cta_url":"/cotizador","is_published":true,"sort_order":5},
  {"category_id":"${CAT2}","question":"¿Qué necesito para aplicar a un crédito hipotecario?","answer":"Generalmente necesitas ingresos comprobables, estabilidad laboral y buen historial crediticio. Nuestro equipo te guiará paso a paso para aumentar tus probabilidades de aprobación.","cta_text":"Evalúa tu perfil crediticio con un asesor.","cta_url":"/cotizador","is_published":true,"sort_order":6},
  {"category_id":"${CAT2}","question":"¿Puedo comprar si es mi primera vivienda?","answer":"Sí. Muchos de nuestros proyectos aplican para primera vivienda en Guatemala, con beneficios como tasas preferenciales y cuotas accesibles.","cta_text":"Conoce opciones ideales para tu primera vivienda.","cta_url":"/proyectos","is_published":true,"sort_order":7},
  {"category_id":"${CAT3}","question":"¿Qué es el FHA en Guatemala y cómo funciona?","answer":"El FHA (Instituto de Fomento de Hipotecas Aseguradas) respalda tu crédito hipotecario, facilitando el acceso a financiamiento con tasas más bajas y cuotas más cómodas.","cta_text":"Descubre cómo aplicar con FHA hoy.","cta_url":"/cotizador","is_published":true,"sort_order":8},
  {"category_id":"${CAT3}","question":"¿Qué es el programa Mi Primera Vivienda?","answer":"Es un programa que permite acceder a tasas preferenciales (aproximadamente 5.5%) y mejores condiciones para comprar tu primera vivienda en Guatemala.","cta_text":"Aplica al programa y paga menos por tu apartamento.","cta_url":"/cotizador","is_published":true,"sort_order":9},
  {"category_id":"${CAT3}","question":"¿Cuánto debo dar de enganche para comprar un apartamento?","answer":"El enganche varía según el proyecto, pero existen opciones accesibles y planes de pago flexibles.","cta_text":"Consulta opciones de enganche según tu presupuesto.","cta_url":"/cotizador","is_published":true,"sort_order":10},
  {"category_id":"${CAT4}","question":"¿Es seguro comprar apartamentos en construcción en Guatemala?","answer":"Sí. Trabajamos con desarrolladores confiables y proyectos respaldados, lo que garantiza una inversión segura.","cta_text":"Conoce proyectos en construcción con alta plusvalía.","cta_url":"/proyectos","is_published":true,"sort_order":11},
  {"category_id":"${CAT4}","question":"¿Puedo visitar los apartamentos antes de comprar?","answer":"Sí. Coordinamos visitas a proyectos inmobiliarios en Guatemala para que conozcas ubicación, avances y amenidades.","cta_text":"Agenda tu visita hoy mismo.","cta_url":"/cotizador","is_published":true,"sort_order":12},
  {"category_id":"${CAT5}","question":"¿Es buena inversión comprar un apartamento en Guatemala?","answer":"Sí. Invertir en bienes raíces en Guatemala genera plusvalía y permite ingresos por alquiler, especialmente en zonas estratégicas.","cta_text":"Descubre oportunidades de inversión inmobiliaria.","cta_url":"/proyectos","is_published":true,"sort_order":13},
  {"category_id":"${CAT5}","question":"¿Puedo comprar un apartamento para alquilar o Airbnb?","answer":"Sí. Muchos de nuestros proyectos son ideales para inversión en renta tradicional o Airbnb.","cta_text":"Encuentra proyectos ideales para generar ingresos.","cta_url":"/proyectos","is_published":true,"sort_order":14},
  {"category_id":"${CAT6}","question":"¿Puerta Abierta me acompaña durante todo el proceso?","answer":"Sí. Te acompañamos desde la búsqueda hasta la entrega de tu propiedad, brindándote asesoría clara y transparente.","cta_text":"Recibe acompañamiento en cada paso.","cta_url":"/cotizador","is_published":true,"sort_order":15},
  {"category_id":"${CAT6}","question":"¿Qué pasa después de comprar mi apartamento?","answer":"Seguimos apoyándote hasta la entrega de tu propiedad y resolvemos cualquier duda adicional.","cta_text":"Compra con respaldo y tranquilidad.","cta_url":"/cotizador","is_published":true,"sort_order":16},
  {"category_id":"${CAT7}","question":"¿Cuánto tiempo tarda comprar un apartamento en Guatemala?","answer":"El proceso puede tomar desde semanas hasta algunos meses, dependiendo del crédito y el proyecto.","cta_text":"Inicia hoy y avanza más rápido.","cta_url":"/cotizador","is_published":true,"sort_order":17},
  {"category_id":"${CAT7}","question":"¿Puedo comprar si soy independiente?","answer":"Sí, aunque el proceso puede requerir documentación adicional. Te ayudamos a prepararte para lograr la aprobación.","cta_text":"Evalúa tu caso con un asesor experto.","cta_url":"/cotizador","is_published":true,"sort_order":18},
  {"category_id":"${CAT7}","question":"¿Por qué elegir Puerta Abierta como inmobiliaria?","answer":"Porque ofrecemos asesoría personalizada, proyectos de alta calidad y acompañamiento completo para que tomes una decisión inteligente.","cta_text":"Contáctanos y encuentra tu próximo apartamento.","cta_url":"/cotizador","is_published":true,"sort_order":19}
]
ENDJSON
)"

echo "Done! 19 FAQs seeded across 7 categories."
