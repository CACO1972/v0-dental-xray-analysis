-- Añadir soporte para anotaciones manuales del radiólogo
-- Tabla para almacenar las anotaciones dibujadas por el radiólogo
CREATE TABLE IF NOT EXISTS radiologist_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES caries_analyses(id) ON DELETE CASCADE,
  radiologist_email TEXT NOT NULL,
  annotation_type TEXT NOT NULL CHECK (annotation_type IN ('missed_caries', 'false_positive')),
  coordinates JSONB NOT NULL, -- Array de puntos {x, y} que forman el trazo
  tooth_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por análisis
CREATE INDEX IF NOT EXISTS idx_annotations_analysis ON radiologist_annotations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_annotations_type ON radiologist_annotations(annotation_type);
