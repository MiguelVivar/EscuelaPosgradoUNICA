-- Migración para agregar campo 'codigo' a la tabla periodos_academicos
-- Ejecutar este script si la tabla ya existe sin el campo codigo

-- Agregar la columna codigo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'periodos_academicos' AND column_name = 'codigo'
    ) THEN
        ALTER TABLE periodos_academicos ADD COLUMN codigo VARCHAR(20);
    END IF;
END $$;

-- Actualizar registros existentes para generar códigos automáticamente
UPDATE periodos_academicos 
SET codigo = anio || '-' || semestre 
WHERE codigo IS NULL OR codigo = '';

-- Hacer la columna NOT NULL y UNIQUE después de llenar los datos
DO $$
BEGIN
    -- Hacer NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'periodos_academicos' AND column_name = 'codigo' AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE periodos_academicos ALTER COLUMN codigo SET NOT NULL;
    END IF;
    
    -- Agregar constraint UNIQUE si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'periodos_academicos' AND constraint_name = 'periodos_academicos_codigo_key'
    ) THEN
        ALTER TABLE periodos_academicos ADD CONSTRAINT periodos_academicos_codigo_key UNIQUE (codigo);
    END IF;
END $$;

-- Verificar los datos
SELECT id, codigo, nombre, anio, semestre, activo, habilitado 
FROM periodos_academicos 
ORDER BY fecha_creacion DESC;
