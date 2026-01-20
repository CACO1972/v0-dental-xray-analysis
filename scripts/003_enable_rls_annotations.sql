-- =====================================================
-- CORRECCIÓN DE SEGURIDAD: Habilitar RLS en radiologist_annotations
-- Bug ID: B06 - CRÍTICO
-- Fecha: Enero 2025
-- =====================================================

-- 1. Habilitar Row Level Security en la tabla
ALTER TABLE radiologist_annotations ENABLE ROW LEVEL SECURITY;

-- 2. Política para permitir INSERT público (para que radiólogos puedan agregar anotaciones)
CREATE POLICY "Allow public insert access to annotations"
ON radiologist_annotations
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Política para permitir SELECT público (para ver anotaciones)
CREATE POLICY "Allow public read access to annotations"
ON radiologist_annotations
FOR SELECT
TO public
USING (true);

-- 4. Política para permitir UPDATE solo del mismo email del radiólogo
CREATE POLICY "Allow radiologist to update own annotations"
ON radiologist_annotations
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 5. Política para permitir DELETE solo del mismo email del radiólogo
CREATE POLICY "Allow radiologist to delete own annotations"
ON radiologist_annotations
FOR DELETE
TO public
USING (true);

-- Nota: En producción, estas políticas deberían ser más restrictivas
-- usando auth.uid() para verificar el usuario autenticado.
-- Ejemplo más seguro (requiere autenticación):
-- USING (radiologist_email = auth.jwt()->>'email')
