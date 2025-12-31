# Zero Caries - Documentación Completa del Proyecto

## 🎯 Descripción General

**Zero Caries** es una mini-aplicación de detección de caries dental integrada en el sitio web de **Clínica MRO**, diseñada para ayudar a pacientes (desde los 3 años) a identificar si tienen caries tratables con **Curodont**, un tratamiento no invasivo de remineralización.

---

## 🏥 Objetivo Clínico

La aplicación se especializa en:

1. **Detección de caries tempranas** (E0, E1, E2, D1 superficial)
2. **Evaluación de candidatura para Curodont** (tratamiento sin taladro ni anestesia)
3. **Educación al paciente** con información clara y simple
4. **Retroalimentación para radiólogos** para mejorar el modelo de IA

---

## 📊 Información de Curodont

### ¿Qué es Curodont?

**Curodont Repair Fluoride Plus** es un tratamiento biomimético que remineraliza caries tempranas sin necesidad de taladro, anestesia ni dolor.

### Indicaciones Clínicas

✅ **Candidatos IDEALES:**
- Caries E0 (manchas blancas, desmineralización inicial)
- Caries E1 (afecta <50% del esmalte)
- Caries E2 (afecta >50% del esmalte pero no llega a dentina)
- Caries D1 superficial (dentina apenas afectada)
- Lesiones NO cavitadas

❌ **NO candidatos:**
- Caries D2-D3 (dentina profunda, cerca de pulpa)
- Cavidades abiertas visibles
- Caries con compromiso pulpar

### Dosificación

- **1 aplicador = 1 diente tratado**
- **Caja de 10 aplicadores = hasta 30 lesiones** (puede tratar múltiples lesiones pequeñas por diente)
- **Aplicación única** (puede repetirse a los 6 meses si es necesario)

### Costos en Chile (CLP)

| Concepto | Precio |
|----------|--------|
| **Caja de 10 aplicadores** | $180,000 - $220,000 CLP |
| **Costo por aplicador** | $18,000 - $22,000 CLP |
| **Precio a cobrar por lesión** | **$45,000 CLP** (recomendado) |
| **Tratamiento 1 diente (1-3 lesiones)** | **$45,000 - $90,000 CLP** |

**Comparación con obturación tradicional:**
- Obturación con resina: $60,000 - $120,000 CLP + anestesia + taladro
- Curodont: $45,000 CLP, sin dolor, sin taladro, preserva estructura dental

### Edades Permitidas

✅ **Desde los 3 años en adelante**
- Seguro para niños de todas las edades
- Ideal para niños con ansiedad dental o sensibilidad sensorial
- No requiere anestesia ni cooperación extrema

---

## 🎨 Especificaciones de Diseño

### Paleta de Colores

```css
/* Fondos */
--background: #FAFBFC (gris muy claro, casi blanco)
--card-background: #FFFFFF (blanco puro)

/* Acentos Azul Neón */
--neon-blue: #00D4FF (azul neón brillante)
--neon-blue-glow: rgba(0, 212, 255, 0.3) (resplandor)

/* Textos */
--text-primary: #000000 (negro)
--text-secondary: #4A5568 (gris oscuro)

/* Botones */
--button-bg: #000000 (negro)
--button-text: #FFFFFF (blanco)
--button-hover: #1A1A1A (negro más claro al hover)
```

### Logo "Zero Caries"

**Diseño estilográfico:**
- Ícono: Diente minimalista con el número "0" integrado en azul neón
- Tipografía: Bold moderna para "ZERO CARIES"
- Subtítulo: "by Clínica MRO" en tipografía ligera debajo

**Componente:** `components/zero-caries-logo.tsx`

### Componentes Visuales

1. **Widget Principal** (`app/widget/page.tsx`)
   - Versión embebible para sitio web de Clínica MRO
   - Tamaño ajustable via iframe
   - Sin navegación externa

2. **Dashboard de Análisis**
   - Contadores de lesiones por categoría
   - Visualización de imagen con overlays
   - Panel de información educativa

3. **Información de Precios** (`components/pricing-info.tsx`)
   - Tabla comparativa Curodont vs. Obturación
   - Calculadora de costos por número de lesiones
   - Información de edad mínima

---

## 🔧 Variables de Desarrollo

### Variables de Entorno Necesarias

```env
# IA para Análisis de Imágenes (REQUERIDO)
XAI_API_KEY=tu_clave_xai_grok

# Base de Datos Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio

# Configuración Opcional (valores por defecto ya definidos)
NEXT_PUBLIC_CLINIC_NAME=Clínica MRO
NEXT_PUBLIC_CURODONT_PRICE_CLP=45000
NEXT_PUBLIC_MIN_PATIENT_AGE=3
```

### Variables Clave en el Código

**Datos del Paciente:**
```typescript
interface PatientData {
  age: number; // Edad mínima: 3 años
  imageType: 'periapical' | 'bitewing' | 'panoramic' | 'intraoral';
  concerns?: string; // Síntomas o preocupaciones
}
```

**Datos del Análisis:**
```typescript
interface CariesAnalysis {
  tooth: string; // Numeración FDI (11-48)
  location: string; // Ej: "Superficie oclusal"
  depth: 'E0' | 'E1' | 'E2' | 'D1' | 'D2' | 'D3';
  curodontCandidate: 'IDEAL' | 'POSIBLE' | 'NO';
  confidence: number; // 0-1
  coordinates: { x: number; y: number }; // Para overlay
}
```

**Datos del Tratamiento:**
```typescript
interface TreatmentRecommendation {
  totalLesions: number;
  idealCandidates: number;
  possibleCandidates: number;
  nonCandidates: number;
  estimatedCost: number; // En CLP
  needsConsultation: boolean;
}
```

**Configuración de Costos:**
```typescript
const CURODONT_CONFIG = {
  pricePerLesion: 45000, // CLP
  applicatorsPerBox: 10,
  maxLesionsPerBox: 30,
  minAge: 3,
  boxCost: 200000, // CLP (costo para la clínica)
};
```

---

## 📁 Estructura de Archivos

```
zero-caries/
├── app/
│   ├── page.tsx                    # Página principal
│   ├── widget/
│   │   └── page.tsx                # Widget embebible
│   ├── api/
│   │   ├── analyze/route.ts        # API de análisis de IA
│   │   ├── feedback/route.ts       # API de retroalimentación
│   │   └── widget-embed/route.ts   # Script de embed
│   ├── layout.tsx                  # Layout con logo y estilos
│   └── globals.css                 # Estilos globales (azul neón)
├── components/
│   ├── zero-caries-logo.tsx        # Logo estilográfico
│   ├── pricing-info.tsx            # Información de precios
│   ├── xray-uploader.tsx           # Componente de carga y análisis
│   ├── radiologist-feedback.tsx    # Panel de retroalimentación
│   └── image-annotator.tsx         # Herramienta de marcado
├── lib/
│   └── supabase/
│       ├── client.ts               # Cliente Supabase
│       └── server.ts               # Servidor Supabase
├── scripts/
│   ├── 001_create_tables.sql      # Tablas de base de datos
│   └── 002_add_annotations.sql    # Columnas de anotaciones
└── WIDGET_INSTRUCTIONS.md          # Instrucciones de integración
```

---

## 🚀 Integración en Web de Clínica MRO

### Opción 1: Iframe Simple

```html
<iframe 
  src="https://zero-caries.vercel.app/widget" 
  width="100%" 
  height="800px" 
  frameborder="0"
  title="Zero Caries - Detección de Caries"
></iframe>
```

### Opción 2: Script Embebible

```html
<div id="zero-caries-widget"></div>
<script src="https://zero-caries.vercel.app/api/widget-embed"></script>
```

### Opción 3: Botón Flotante

```html
<script>
  window.ZeroCaries = {
    style: 'floating-button',
    position: 'bottom-right'
  };
</script>
<script src="https://zero-caries.vercel.app/api/widget-embed"></script>
```

---

## 🧪 Flujo de Uso para Pacientes

1. **Paciente sube imagen**
   - Radiografía (periapical, bitewing, panorámica)
   - Foto intraoral del diente
   
2. **IA analiza la imagen**
   - Detecta caries presentes
   - Clasifica profundidad (E0-D3)
   - Evalúa candidatura Curodont

3. **Paciente recibe resultado**
   - Número de lesiones detectadas
   - Cuáles son tratables con Curodont
   - Costo estimado del tratamiento
   - Comparación con obturación tradicional

4. **Recomendación de acción**
   - Agendar cita si hay lesiones IDEALES
   - Consulta necesaria si hay lesiones POSIBLES
   - Tratamiento tradicional si NO son candidatos

---

## 👨‍⚕️ Flujo para Radiólogos

1. **Revisión de análisis automático**
   - Ver lesiones detectadas por IA
   - Nivel de confianza por hallazgo

2. **Validación y corrección**
   - ✅ Marcar lesiones correctas
   - ❌ Marcar falsos positivos
   - ➕ Dibujar lesiones no detectadas

3. **Retroalimentación almacenada**
   - Se guarda en base de datos
   - Se usa para entrenar el modelo
   - Métricas de precisión disponibles

---

## 📊 Base de Datos (Supabase)

### Tabla: `caries_analyses`
```sql
CREATE TABLE caries_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  image_type TEXT CHECK (image_type IN ('periapical', 'bitewing', 'panoramic', 'intraoral')),
  analysis_result JSONB, -- Resultado completo de la IA
  patient_age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Tabla: `radiologist_feedback`
```sql
CREATE TABLE radiologist_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES caries_analyses(id),
  radiologist_id TEXT,
  feedback JSONB, -- Validaciones y correcciones
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Tabla: `radiologist_annotations`
```sql
CREATE TABLE radiologist_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES caries_analyses(id),
  annotation_type TEXT CHECK (annotation_type IN ('missed_caries', 'false_positive')),
  coordinates JSONB, -- Array de puntos dibujados
  tooth_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Tabla: `training_metrics`
```sql
CREATE TABLE training_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES caries_analyses(id),
  ai_detections INTEGER,
  confirmed_detections INTEGER,
  false_positives INTEGER,
  missed_lesions INTEGER,
  accuracy DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## 🎓 Información Educativa para Pacientes

### ¿Por qué elegir Curodont?

✅ **Sin dolor**: No requiere anestesia  
✅ **Sin taladro**: Preserva estructura dental natural  
✅ **Rápido**: Aplicación en 8-10 minutos  
✅ **Seguro**: Apto desde los 3 años  
✅ **Efectivo**: Remineraliza y detiene progresión de caries  

### ¿Cuándo NO funciona Curodont?

❌ Caries profundas que llegaron a la pulpa  
❌ Cavidades grandes visibles  
❌ Dolor intenso o infección presente  
❌ Dientes con tratamiento de conducto previo  

### Comparación Visual

| Aspecto | Curodont | Obturación Tradicional |
|---------|----------|------------------------|
| **Dolor** | ❌ Sin dolor | ⚠️ Anestesia necesaria |
| **Taladro** | ❌ No | ✅ Sí |
| **Tiempo** | 10 minutos | 45-60 minutos |
| **Estructura dental** | 🌟 Preservada 100% | ⚠️ Se remueve tejido |
| **Costo** | $45,000 CLP | $60,000-120,000 CLP |
| **Edad mínima** | 3 años | 4-5 años |

---

## 🔐 Aspectos Éticos y Legales

### Avisos Obligatorios

```typescript
// Siempre mostrar en resultados:
const DISCLAIMER = `
⚠️ IMPORTANTE:
- Este análisis es una HERRAMIENTA DE APOYO, no un diagnóstico definitivo.
- Siempre requiere confirmación por un dentista certificado.
- Las recomendaciones son orientativas, no prescriptivas.
- La decisión final de tratamiento debe ser tomada por un profesional.
`;
```

### Privacidad

- ❌ No almacenamos imágenes de pacientes (se procesan y descartan)
- ✅ Solo guardamos análisis anonimizados para entrenamiento
- ✅ Cumplimiento con Ley de Protección de Datos Personales (Chile)

---

## 📈 Métricas de Éxito

### KPIs para Clínica MRO

1. **Adopción**: Número de pacientes que usan Zero Caries
2. **Conversión**: % de análisis que resultan en citas agendadas
3. **Precisión**: % de coincidencia entre IA y diagnóstico del dentista
4. **Satisfacción**: Rating de pacientes después de usar la app

### Objetivos

- **Precisión de IA**: >90% en detección de caries E0-D1
- **Conversión a citas**: >40% de los análisis positivos
- **Reducción de no-shows**: 20% menos (pacientes más informados)
- **Upselling de Curodont**: 30% de caries tempranas tratadas con Curodont

---

## 🛠️ Próximas Mejoras

### Fase 1 (Completada) ✅
- ✅ Detección básica de caries con IA
- ✅ Evaluación de candidatura Curodont
- ✅ Widget embebible
- ✅ Retroalimentación de radiólogos
- ✅ Información de precios

### Fase 2 (Próxima)
- [ ] Integración con modelos especializados (ToothNet, YOLOv8)
- [ ] Sistema de citas online directo desde Zero Caries
- [ ] Historial de análisis por paciente
- [ ] Notificaciones por email/WhatsApp
- [ ] Dashboard de métricas para administrador

### Fase 3 (Futuro)
- [ ] App móvil nativa iOS/Android
- [ ] Comparación de análisis en el tiempo (seguimiento)
- [ ] Integración con sistemas de gestión dental (Exact, Softdent)
- [ ] Certificación médica (ISP Chile)

---

## 📞 Soporte y Contacto

**Para integración técnica:**  
Contactar a equipo de desarrollo de Clínica MRO

**Para dudas clínicas sobre Curodont:**  
Contactar a radiólogo o director clínico

**Para soporte de pacientes:**  
Incluir enlace de contacto en widget

---

## 📝 Licencia y Uso

**Zero Caries** es propiedad exclusiva de **Clínica MRO**.  
Uso autorizado únicamente en sitio web oficial y materiales de marketing de la clínica.

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Desarrollado por**: v0 by Vercel para Clínica MRO
