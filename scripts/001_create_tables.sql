-- Tabla para almacenar análisis de imágenes
CREATE TABLE IF NOT EXISTS caries_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL, -- 'periapical', 'bitewing', 'panoramic', 'intraoral'
  ai_analysis JSONB NOT NULL, -- Resultado completo del análisis de IA
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id TEXT, -- Opcional, para vincular con paciente
  status TEXT DEFAULT 'pending_review' -- 'pending_review', 'reviewed', 'approved', 'corrected'
);

-- Tabla para retroalimentación de radiólogos
CREATE TABLE IF NOT EXISTS radiologist_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES caries_analyses(id) ON DELETE CASCADE,
  radiologist_name TEXT,
  radiologist_email TEXT,
  feedback_type TEXT NOT NULL, -- 'correction', 'confirmation', 'additional_findings'
  corrected_data JSONB, -- Datos corregidos por el radiólogo
  comments TEXT,
  confidence_score INTEGER, -- 1-5, qué tan confiable considera el radiólogo el análisis de IA
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para métricas de entrenamiento
CREATE TABLE IF NOT EXISTS training_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES caries_analyses(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'false_positive', 'false_negative', 'true_positive', 'accuracy'
  tooth_number TEXT,
  lesion_type TEXT,
  ai_detected BOOLEAN,
  radiologist_confirmed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON caries_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON caries_analyses(status);
CREATE INDEX IF NOT EXISTS idx_feedback_analysis_id ON radiologist_feedback(analysis_id);
CREATE INDEX IF NOT EXISTS idx_metrics_analysis_id ON training_metrics(analysis_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE caries_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiologist_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Por ahora permitir acceso público para desarrollo
-- En producción, restringir por auth.uid()
CREATE POLICY "Allow public read access to analyses" ON caries_analyses FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to analyses" ON caries_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to analyses" ON caries_analyses FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to feedback" ON radiologist_feedback FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to feedback" ON radiologist_feedback FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to metrics" ON training_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to metrics" ON training_metrics FOR INSERT WITH CHECK (true);
