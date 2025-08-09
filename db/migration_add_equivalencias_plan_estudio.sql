-- Tabla para equivalencias entre cursos de planes de estudio
CREATE TABLE IF NOT EXISTS equivalencias_plan_estudio (
    id SERIAL PRIMARY KEY,
    plan_origen_id BIGINT NOT NULL REFERENCES programas_estudio(id),
    plan_destino_id BIGINT NOT NULL REFERENCES programas_estudio(id),
    curso_origen_codigo VARCHAR(50) NOT NULL,
    curso_destino_codigo VARCHAR(50) NOT NULL,
    observaciones VARCHAR(500)
);
