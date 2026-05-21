-- 00019: Assign Guatemala City zonas to 4 existing projects
--
-- Sets projects.zona_id for Benestare, Bosque Las Tapias, Boulevard 5, and
-- Casa Elisa per their actual locations. Santa Elena's zona will be assigned
-- in a follow-up migration.
--
-- Lookup is constrained to municipio "Guatemala" within departamento
-- "Guatemala" so that, when other municipios with overlapping zona names
-- are added later, this migration still targets the intended row.
--
-- Idempotent: re-running produces the same final state.

UPDATE projects AS p
SET zona_id = z.id
FROM (VALUES
    ('Benestare',         'zona 6'),
    ('Bosque Las Tapias', 'zona 18'),
    ('Boulevard 5',       'zona 5'),
    ('Casa Elisa',        'zona 12')
) AS assignments(project_name, zona_name)
INNER JOIN zonas z         ON z.name = assignments.zona_name
INNER JOIN municipios m    ON z.municipio_id = m.id    AND m.slug = 'guatemala'
INNER JOIN departamentos d ON m.departamento_id = d.id AND d.slug = 'guatemala'
WHERE p.name = assignments.project_name;
