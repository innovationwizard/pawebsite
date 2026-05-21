-- 00020: Add Sacatepéquez departamento, Antigua Guatemala municipio,
-- zona 0, and assign Santa Elena
--
-- "zona 0" is the official address designation used in Antigua Guatemala
-- for the casco urbano / centro histórico. It appears on utility bills
-- (EEGSA), SAT records, and other government-issued documents. Antigua's
-- municipal addressing uses numbered zonas just like Guatemala City, but
-- the system is less widely documented in popular and tourism sources.
--
-- Idempotent: re-running produces the same final state.

INSERT INTO departamentos (name, slug, sort_order)
VALUES ('Sacatepéquez', 'sacatepequez', 2)
ON CONFLICT (name) DO NOTHING;

INSERT INTO municipios (departamento_id, name, slug, sort_order)
SELECT d.id, 'Antigua Guatemala', 'antigua-guatemala', 1
FROM departamentos d
WHERE d.slug = 'sacatepequez'
ON CONFLICT (departamento_id, slug) DO NOTHING;

INSERT INTO zonas (municipio_id, name, slug, sort_order)
SELECT m.id, 'zona 0', 'zona-0', 0
FROM municipios m
JOIN departamentos d ON m.departamento_id = d.id
WHERE d.slug = 'sacatepequez'
  AND m.slug = 'antigua-guatemala'
ON CONFLICT (municipio_id, slug) DO NOTHING;

UPDATE projects p
SET zona_id = z.id
FROM zonas z
JOIN municipios m    ON z.municipio_id = m.id    AND m.slug = 'antigua-guatemala'
JOIN departamentos d ON m.departamento_id = d.id AND d.slug = 'sacatepequez'
WHERE p.name = 'Santa Elena'
  AND z.slug = 'zona-0';
