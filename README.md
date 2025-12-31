# CariesDetect - Sistema de Detección de Caries con IA

Sistema especializado en la detección de caries dental mediante análisis de imágenes con inteligencia artificial, enfocado en evaluar candidatura para tratamiento con Curodont.

## Características Principales

- **Detección de Caries**: Análisis automático de radiografías periapicales, bitewing, panorámicas y fotos intraorales
- **Evaluación Curodont**: Clasificación de lesiones como candidatas ideales, posibles o no candidatas para tratamiento Curodont
- **Sistema de Retroalimentación**: Panel para radiólogos con marcado visual directo sobre imágenes
- **Anotaciones Manuales**: Herramienta de dibujo para marcar caries no detectadas o falsos positivos
- **Base de Datos**: Almacenamiento de análisis, retroalimentación y métricas de entrenamiento

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **UI Components**: shadcn/ui con Radix UI
- **IA**: GPT-4o Vision (Vercel AI Gateway)
- **Base de Datos**: Supabase (PostgreSQL)
- **Imágenes**: Next/Image con optimización automática

## Configuración Inicial

### 1. Variables de Entorno

Las siguientes variables ya están configuradas en tu proyecto Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `XAI_API_KEY` (para Grok, opcional)

### 2. Crear Tablas en Supabase

**Ejecuta los scripts SQL en orden:**

#### Script 1: Tablas principales
```bash
# En la interfaz de v0, ve a la carpeta scripts/
# Ejecuta: 001_create_tables.sql
```

Este script crea:
- `caries_analyses`: Almacena análisis de imágenes
- `radiologist_feedback`: Retroalimentación de radiólogos
- `training_metrics`: Métricas para mejorar el modelo

#### Script 2: Anotaciones visuales
```bash
# Ejecuta: 002_add_annotations.sql
```

Este script crea:
- `radiologist_annotations`: Marcas dibujadas por radiólogos

### 3. Row Level Security (RLS)

Por defecto, las tablas NO tienen RLS activado para facilitar desarrollo. Para producción, debes:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE caries_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiologist_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiologist_annotations ENABLE ROW LEVEL SECURITY;

-- Permitir acceso público (ajustar según necesidades)
CREATE POLICY "Allow public read" ON caries_analyses FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON caries_analyses FOR INSERT TO public WITH CHECK (true);
```

## Uso del Sistema

### Para Pacientes

1. **Subir Imagen**: Arrastra o selecciona una radiografía o foto de tus dientes
2. **Analizar**: Haz clic en "Detectar Caries y Evaluar"
3. **Revisar Resultados**: 
   - Ve las caries detectadas
   - Verifica candidatura para Curodont
   - Haz clic en los marcadores para ver detalles
4. **Consultar con Dentista**: El análisis es preliminar, requiere confirmación profesional

### Para Radiólogos

1. **Revisar Análisis**: Después de ver los resultados, haz clic en "Mostrar Panel de Radiólogo"
2. **Validar Lesiones**: Marca cada caries como "Correcto" o "Falso Positivo"
3. **Marcar Visualmente**: Usa la herramienta de dibujo para:
   - Marcar caries NO detectadas (trazo rojo)
   - Marcar falsos positivos (trazo azul)
4. **Enviar Retroalimentación**: El sistema aprende de tus correcciones

## Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Análisis de imágenes con IA
│   │   └── feedback/route.ts     # Guardar retroalimentación
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── image-annotator.tsx       # Canvas de dibujo para anotaciones
│   ├── radiologist-feedback.tsx  # Panel de retroalimentación
│   ├── xray-uploader.tsx         # Subida y análisis de imágenes
│   └── ui/                       # Componentes de shadcn/ui
├── lib/
│   └── supabase/
│       ├── client.ts             # Cliente Supabase (browser)
│       └── server.ts             # Cliente Supabase (server)
└── scripts/
    ├── 001_create_tables.sql     # Esquema de base de datos
    └── 002_add_annotations.sql   # Tabla de anotaciones
```

## API Endpoints

### POST /api/analyze
Analiza una imagen dental y detecta caries.

**Request:**
```typescript
FormData {
  image: File
}
```

**Response:**
```typescript
{
  analysisId: string
  imageType: "Periapical" | "Bitewing" | "Panorámica" | "Intraoral"
  summary: string
  cariesDetected: number
  detailedAnalysis: Array<{
    tooth: string          // Numeración FDI
    surface: string
    depth: string
    severity: "low" | "medium" | "high"
    curodontCandidate: "IDEAL" | "POSIBLE" | "NO"
    reasoning: string
  }>
  curodontSummary: {
    eligible: number
    possiblyEligible: number
    notEligible: number
    overallRecommendation: string
  }
  markers: Array<{
    id: string
    x: number              // Posición en %
    y: number
    label: string
    toothNumber: string
    curodontEligible: boolean
    education: {...}       // Info educativa para paciente
  }>
}
```

### POST /api/feedback
Guarda retroalimentación de radiólogo.

**Request:**
```typescript
{
  analysisId: string
  radiologistName: string
  radiologistEmail: string
  feedbackType: "confirmation" | "correction" | "additional_findings"
  correctedData: {
    detailedAnalysis: Array<{
      ...analysis,
      wasCorrect: boolean
      wasMissed: boolean
    }>
  }
  annotations: Array<{
    id: string
    type: "missed_caries" | "false_positive"
    points: Array<{x: number, y: number}>
    color: string
  }>
  comments: string
  confidenceScore: 1 | 2 | 3 | 4 | 5
}
```

## Próximos Pasos

### Mejoras Técnicas
- [ ] Implementar sistema multi-modelo (GPT-4 + Claude + Gemini) para mayor precisión
- [ ] Añadir preprocesamiento de imágenes (Sharp.js, CLAHE)
- [ ] Dashboard de métricas para ver performance del modelo
- [ ] Exportar reportes en PDF

### Mejoras Clínicas
- [ ] Integrar con sistemas de gestión dental (DICOM)
- [ ] Añadir detección de restauraciones y filtraciones
- [ ] Soporte para CBCT (imágenes 3D)
- [ ] Validación clínica con dataset anotado

### Producción
- [ ] Configurar RLS en Supabase
- [ ] Añadir autenticación para radiólogos
- [ ] Rate limiting en APIs
- [ ] Monitoreo y alertas

## Soporte

Para problemas o preguntas:
1. Revisa que los scripts SQL se hayan ejecutado correctamente
2. Verifica las variables de entorno en la sección "Vars" de v0
3. Consulta los logs del navegador (F12) para errores de cliente
4. Revisa los logs de Supabase para errores de base de datos

## Licencia

Este es un proyecto educativo y de investigación. Para uso clínico, se requiere validación profesional.
