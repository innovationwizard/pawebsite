#!/bin/bash
# Seed construction progress with detailed sub-items for all projects
set -euo pipefail

PA_URL="https://cymyzcarmhgonqcbeygl.supabase.co"
PA_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2)

H=(
  -H "apikey: ${PA_KEY}"
  -H "Authorization: Bearer ${PA_KEY}"
  -H "Content-Type: application/json"
  -H "Prefer: return=representation"
)

# Project IDs
BOULEVARD5="7ef55ca0-9710-4115-a2e8-7a3482026f12"
BENESTARE="961477f2-d61c-4630-ab8d-2142c3a779e8"
BOSQUE="776813f7-22ff-4a7e-a278-2c16c7ca46de"
SANTA_ELENA="886a74d6-4c3d-4e81-8e52-42fe906b8e91"

echo "Clearing existing progress data..."
curl -s -X DELETE "${PA_URL}/rest/v1/progress_items?id=not.is.null" "${H[@]}" -o /dev/null
curl -s -X DELETE "${PA_URL}/rest/v1/construction_progress?id=not.is.null" "${H[@]}" -o /dev/null

echo "Creating progress entries..."

# Boulevard 5 - 89%
B5=$(curl -s -X POST "${PA_URL}/rest/v1/construction_progress" "${H[@]}" \
  -d "[{\"project_id\":\"${BOULEVARD5}\",\"title\":\"Avance General\",\"description\":\"Proyecto en etapa final de acabados e instalaciones.\",\"progress_percent\":89,\"entry_date\":\"2026-04-07\",\"is_published\":true}]" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "  Boulevard 5: $B5"

curl -s -X POST "${PA_URL}/rest/v1/progress_items" "${H[@]}" -o /dev/null \
  -d "[
    {\"progress_id\":\"${B5}\",\"label\":\"Soil nailing\",\"percent\":100,\"sort_order\":1},
    {\"progress_id\":\"${B5}\",\"label\":\"Instalación eléctrica\",\"percent\":100,\"sort_order\":2},
    {\"progress_id\":\"${B5}\",\"label\":\"Instalación de tuberías\",\"percent\":100,\"sort_order\":3},
    {\"progress_id\":\"${B5}\",\"label\":\"Instalación de fachadas\",\"percent\":80,\"sort_order\":4},
    {\"progress_id\":\"${B5}\",\"label\":\"Acabados interiores\",\"percent\":75,\"sort_order\":5},
    {\"progress_id\":\"${B5}\",\"label\":\"Áreas comunes\",\"percent\":60,\"sort_order\":6}
  ]"

# Benestare - 21%
BEN=$(curl -s -X POST "${PA_URL}/rest/v1/construction_progress" "${H[@]}" \
  -d "[{\"project_id\":\"${BENESTARE}\",\"title\":\"Avance General\",\"description\":\"Proyecto en etapa de cimentación y obra gris.\",\"progress_percent\":21,\"entry_date\":\"2026-04-07\",\"is_published\":true}]" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "  Benestare: $BEN"

curl -s -X POST "${PA_URL}/rest/v1/progress_items" "${H[@]}" -o /dev/null \
  -d "[
    {\"progress_id\":\"${BEN}\",\"label\":\"Soil nailing\",\"percent\":100,\"sort_order\":1},
    {\"progress_id\":\"${BEN}\",\"label\":\"Excavación y cimentación\",\"percent\":45,\"sort_order\":2},
    {\"progress_id\":\"${BEN}\",\"label\":\"Estructura\",\"percent\":10,\"sort_order\":3},
    {\"progress_id\":\"${BEN}\",\"label\":\"Instalación eléctrica\",\"percent\":0,\"sort_order\":4},
    {\"progress_id\":\"${BEN}\",\"label\":\"Instalación de tuberías\",\"percent\":0,\"sort_order\":5},
    {\"progress_id\":\"${BEN}\",\"label\":\"Acabados\",\"percent\":0,\"sort_order\":6}
  ]"

# Bosque Las Tapias - 55%
BLT=$(curl -s -X POST "${PA_URL}/rest/v1/construction_progress" "${H[@]}" \
  -d "[{\"project_id\":\"${BOSQUE}\",\"title\":\"Avance General\",\"description\":\"Proyecto en etapa de estructura y primeras instalaciones.\",\"progress_percent\":55,\"entry_date\":\"2026-04-07\",\"is_published\":true}]" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "  Bosque Las Tapias: $BLT"

curl -s -X POST "${PA_URL}/rest/v1/progress_items" "${H[@]}" -o /dev/null \
  -d "[
    {\"progress_id\":\"${BLT}\",\"label\":\"Soil nailing\",\"percent\":100,\"sort_order\":1},
    {\"progress_id\":\"${BLT}\",\"label\":\"Excavación y cimentación\",\"percent\":100,\"sort_order\":2},
    {\"progress_id\":\"${BLT}\",\"label\":\"Estructura\",\"percent\":70,\"sort_order\":3},
    {\"progress_id\":\"${BLT}\",\"label\":\"Instalación eléctrica\",\"percent\":35,\"sort_order\":4},
    {\"progress_id\":\"${BLT}\",\"label\":\"Instalación de tuberías\",\"percent\":30,\"sort_order\":5},
    {\"progress_id\":\"${BLT}\",\"label\":\"Acabados\",\"percent\":0,\"sort_order\":6}
  ]"

# Santa Elena - 30%
SE=$(curl -s -X POST "${PA_URL}/rest/v1/construction_progress" "${H[@]}" \
  -d "[{\"project_id\":\"${SANTA_ELENA}\",\"title\":\"Avance General\",\"description\":\"Proyecto en etapa de urbanización y obra civil.\",\"progress_percent\":30,\"entry_date\":\"2026-04-07\",\"is_published\":true}]" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "  Santa Elena: $SE"

curl -s -X POST "${PA_URL}/rest/v1/progress_items" "${H[@]}" -o /dev/null \
  -d "[
    {\"progress_id\":\"${SE}\",\"label\":\"Movimiento de tierras\",\"percent\":100,\"sort_order\":1},
    {\"progress_id\":\"${SE}\",\"label\":\"Urbanización\",\"percent\":50,\"sort_order\":2},
    {\"progress_id\":\"${SE}\",\"label\":\"Infraestructura vial\",\"percent\":25,\"sort_order\":3},
    {\"progress_id\":\"${SE}\",\"label\":\"Servicios (agua, drenaje, electricidad)\",\"percent\":15,\"sort_order\":4},
    {\"progress_id\":\"${SE}\",\"label\":\"Áreas verdes y comunes\",\"percent\":0,\"sort_order\":5}
  ]"

echo ""
echo "Done! Progress seeded for 4 projects with detailed sub-items."
