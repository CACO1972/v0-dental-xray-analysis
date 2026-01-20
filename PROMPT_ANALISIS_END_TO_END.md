# PROMPT: Análisis End-to-End y Optimización de Zero Caries

## Contexto del Proyecto

Zero Caries es una aplicación web de detección temprana de caries dental mediante inteligencia artificial, diseñada para determinar la elegibilidad de pacientes para tratamiento con Curodont (remineralización sin inyecciones ni fresado mecánico). La aplicación está construida con Next.js 16, utiliza OpenAI GPT-4o para análisis de imágenes, Supabase como base de datos, y está destinada a integrarse como widget en el sitio web de Clínica Miró (clinicamiro.cl).

---

## INSTRUCCIONES PARA EL ANÁLISIS

Actúa como un equipo multidisciplinario compuesto por:
- **Arquitecto de Software Senior** - Evaluación de arquitectura y patrones
- **Ingeniero de QA Senior** - Testing y detección de bugs
- **Especialista en UX/UI** - Experiencia de usuario y accesibilidad
- **Experto en Seguridad** - Vulnerabilidades y cumplimiento
- **Especialista en IA/ML** - Precisión y confiabilidad del modelo
- **DevOps Senior** - Performance, escalabilidad y deployment

Realiza un análisis EXHAUSTIVO end-to-end de la aplicación Zero Caries siguiendo la estructura detallada a continuación.

---

## FASE 1: ANÁLISIS DE ARQUITECTURA

### 1.1 Estructura del Proyecto
- [ ] Revisar organización de carpetas y archivos
- [ ] Evaluar separación de responsabilidades (componentes, hooks, utils, API)
- [ ] Verificar consistencia en nomenclatura de archivos y funciones
- [ ] Identificar código duplicado o redundante
- [ ] Evaluar modularidad y reutilización de componentes

### 1.2 Patrones de Diseño
- [ ] Verificar uso correcto de Server Components vs Client Components
- [ ] Evaluar manejo de estado (useState, useEffect, context, SWR)
- [ ] Revisar patrones de fetching de datos
- [ ] Analizar composición de componentes
- [ ] Verificar implementación de error boundaries

### 1.3 Dependencias
- [ ] Auditar package.json para dependencias innecesarias
- [ ] Verificar versiones actualizadas y seguras
- [ ] Identificar dependencias duplicadas o conflictivas
- [ ] Evaluar tamaño del bundle y oportunidades de tree-shaking

---

## FASE 2: ANÁLISIS DEL FLUJO DE DATOS

### 2.1 Flujo de Upload de Imágenes
```
Usuario selecciona imagen → Validación cliente → Preview → 
Envío a API → Procesamiento → Análisis IA → Respuesta → 
Visualización de resultados
```

Para cada etapa, evaluar:
- [ ] Manejo de errores
- [ ] Estados de loading
- [ ] Feedback al usuario
- [ ] Timeouts y reintentos
- [ ] Validaciones de entrada

### 2.2 Flujo de Análisis con IA
```
Imagen Base64 → API Route → OpenAI GPT-4o → 
Parse JSON → Validación Zod → Normalización → 
Enriquecimiento FDI → Guardado DB → Respuesta cliente
```

Evaluar:
- [ ] Robustez del prompt
- [ ] Manejo de respuestas inesperadas de la IA
- [ ] Fallbacks cuando la IA falla
- [ ] Consistencia en el formato de salida
- [ ] Precisión de la nomenclatura FDI

### 2.3 Flujo de Persistencia
```
Análisis completado → Supabase insert → 
Feedback del radiólogo → Update → Métricas de entrenamiento
```

Evaluar:
- [ ] Integridad de datos
- [ ] Manejo de errores de DB
- [ ] Consistencia entre análisis y feedback
- [ ] Políticas RLS de seguridad

---

## FASE 3: ANÁLISIS DE COMPONENTES CRÍTICOS

### 3.1 API Route: `/api/analyze-dual/route.ts`
Revisar línea por línea:
- [ ] Validación de entrada (archivos, tipos MIME, tamaños)
- [ ] Construcción del prompt para GPT-4o
- [ ] Parsing y validación de respuesta JSON
- [ ] Función `normalizeAIResponse` - cobertura de casos edge
- [ ] Función `combineAnalyses` - lógica de merge
- [ ] Cálculo de predicción de riesgo - fórmula correcta
- [ ] Guardado en Supabase - manejo de errores
- [ ] Response format - consistencia

### 3.2 Componente: `DualImageUploader`
- [ ] Manejo de estados (idle, uploading, analyzing, complete, error)
- [ ] Validación de archivos antes de upload
- [ ] Preview de imágenes
- [ ] Progress tracking
- [ ] Visualización de resultados
- [ ] Integración con CariesVisualization (overlays)
- [ ] Accesibilidad (ARIA, keyboard navigation)

### 3.3 Validadores: `lib/validators.ts`
- [ ] Schema Zod completo y correcto
- [ ] Función `validateImageFile` - todos los casos
- [ ] Función `validatePatientAge` - rangos correctos
- [ ] Función `normalizeAIResponse` - mapeo de campos
- [ ] Función `assessImageQuality` - lógica de detección

### 3.4 Nomenclatura FDI: `lib/fdi-nomenclature.ts`
- [ ] Mapeo completo de 32 dientes permanentes
- [ ] Mapeo de 20 dientes temporales
- [ ] Funciones de conversión bidireccionales
- [ ] Nombres en español correctos
- [ ] Detección de cuadrante

---

## FASE 4: ANÁLISIS DE UI/UX

### 4.1 Diseño Visual
- [ ] Consistencia de colores (azul neón #00D9FF, negro, blanco)
- [ ] Tipografía legible y jerárquica
- [ ] Espaciado y alineación
- [ ] Contraste suficiente (WCAG AA)
- [ ] Responsive design (mobile, tablet, desktop)

### 4.2 Experiencia de Usuario
- [ ] Claridad del flujo principal
- [ ] Feedback visual durante esperas
- [ ] Mensajes de error comprensibles
- [ ] Acciones claras (CTAs)
- [ ] Navegación intuitiva

### 4.3 Accesibilidad
- [ ] Atributos ARIA correctos
- [ ] Navegación por teclado
- [ ] Textos alternativos en imágenes
- [ ] Focus visible
- [ ] Screen reader compatibility

### 4.4 Widget para Clínica Miró (`/widget`)
- [ ] Adaptación visual a colores corporativos (negro, dorado #D4A54A)
- [ ] Funcionalidad completa integrada
- [ ] Botones de agenda y WhatsApp funcionales
- [ ] Embebibilidad en iframe
- [ ] Responsividad dentro del iframe

---

## FASE 5: ANÁLISIS DE SEGURIDAD

### 5.1 Validación de Entrada
- [ ] Sanitización de archivos subidos
- [ ] Límites de tamaño de archivo
- [ ] Validación de tipos MIME
- [ ] Protección contra XSS en inputs
- [ ] Rate limiting en API routes

### 5.2 Autenticación y Autorización
- [ ] RLS policies en Supabase
- [ ] Protección de API routes
- [ ] Manejo seguro de tokens
- [ ] CORS configurado correctamente

### 5.3 Datos Sensibles
- [ ] No exposición de API keys en cliente
- [ ] Manejo de datos médicos (HIPAA considerations)
- [ ] Logs sin información sensible
- [ ] Encriptación en tránsito (HTTPS)

### 5.4 Cumplimiento Legal
- [ ] Disclaimer médico visible y claro
- [ ] Consentimiento del usuario
- [ ] Política de privacidad
- [ ] Términos de uso

---

## FASE 6: ANÁLISIS DE PERFORMANCE

### 6.1 Tiempo de Carga
- [ ] First Contentful Paint (FCP)
- [ ] Largest Contentful Paint (LCP)
- [ ] Time to Interactive (TTI)
- [ ] Bundle size analysis

### 6.2 Optimización de Imágenes
- [ ] Compresión antes de enviar a API
- [ ] Lazy loading de imágenes
- [ ] Formatos optimizados (WebP)
- [ ] Responsive images

### 6.3 API Performance
- [ ] Tiempo de respuesta de análisis IA
- [ ] Caching de respuestas
- [ ] Conexiones a DB optimizadas
- [ ] Manejo de timeouts

### 6.4 Escalabilidad
- [ ] Límites de concurrencia
- [ ] Manejo de picos de tráfico
- [ ] Serverless cold starts
- [ ] Edge deployment opportunities

---

## FASE 7: TESTING Y CALIDAD

### 7.1 Cobertura de Tests
- [ ] Unit tests para funciones críticas
- [ ] Integration tests para API routes
- [ ] E2E tests para flujos principales
- [ ] Visual regression tests

### 7.2 Casos Edge
- [ ] Imagen corrupta o inválida
- [ ] Respuesta vacía de IA
- [ ] Timeout de API
- [ ] DB no disponible
- [ ] Usuario cancela durante análisis
- [ ] Múltiples uploads simultáneos

### 7.3 Error Handling
- [ ] Mensajes de error user-friendly
- [ ] Logging de errores para debugging
- [ ] Recovery graceful
- [ ] Retry logic

---

## FASE 8: DOCUMENTACIÓN Y MANTENIBILIDAD

### 8.1 Código
- [ ] Comentarios en funciones complejas
- [ ] JSDoc para funciones públicas
- [ ] Tipos TypeScript correctos
- [ ] Naming conventions consistentes

### 8.2 Documentación Externa
- [ ] README actualizado
- [ ] Instrucciones de deployment
- [ ] Variables de entorno documentadas
- [ ] API documentation

### 8.3 Mantenibilidad
- [ ] Código fácil de entender
- [ ] Separación de concerns
- [ ] Configuración externalizada
- [ ] Feature flags para rollouts

---

## ENTREGABLES REQUERIDOS

### 1. Reporte de Bugs Críticos
```
| ID | Archivo | Línea | Descripción | Severidad | Fix Propuesto |
|----|---------|-------|-------------|-----------|---------------|
```

### 2. Lista de Inconsistencias
```
| Componente | Inconsistencia | Impacto | Solución |
|------------|----------------|---------|----------|
```

### 3. Oportunidades de Optimización
```
| Área | Mejora Propuesta | Beneficio Esperado | Esfuerzo |
|------|------------------|-------------------|----------|
```

### 4. Código Corregido
Para cada bug o mejora crítica, proporcionar:
- Archivo afectado
- Código actual (snippet)
- Código corregido (snippet completo)
- Explicación del cambio

### 5. Checklist de Implementación Priorizada
```
## CRÍTICO (Hacer inmediatamente)
- [ ] Item 1
- [ ] Item 2

## ALTO (Próxima iteración)
- [ ] Item 3
- [ ] Item 4

## MEDIO (Backlog)
- [ ] Item 5
- [ ] Item 6

## BAJO (Nice to have)
- [ ] Item 7
- [ ] Item 8
```

### 6. Métricas de Calidad Actuales vs Objetivo
```
| Métrica | Actual | Objetivo | Gap |
|---------|--------|----------|-----|
| Precisión IA | ?% | 95% | ? |
| Tiempo respuesta | ?s | <5s | ? |
| Errores/día | ? | <1% | ? |
| Accesibilidad | ?/100 | 90/100 | ? |
```

---

## FORMATO DE RESPUESTA

Estructura tu respuesta en secciones claras:

1. **RESUMEN EJECUTIVO** (1 párrafo)
2. **BUGS CRÍTICOS ENCONTRADOS** (lista priorizada)
3. **ANÁLISIS DETALLADO POR FASE** (siguiendo las 8 fases)
4. **CÓDIGO CORREGIDO** (snippets listos para implementar)
5. **RECOMENDACIONES DE MEJORA** (priorizadas)
6. **PLAN DE IMPLEMENTACIÓN** (timeline sugerido)
7. **CONCLUSIONES** (1 párrafo)

---

## ARCHIVOS CLAVE A ANALIZAR

```
app/
├── api/
│   └── analyze-dual/route.ts    # API principal de análisis
├── page.tsx                      # Página principal Zero Caries
├── widget/page.tsx               # Widget para Clínica Miró
├── globals.css                   # Estilos globales
└── layout.tsx                    # Layout principal

components/
├── dual-image-uploader.tsx       # Componente principal de upload
├── caries-visualization.tsx      # Overlays de caries detectadas
├── risk-prediction-card.tsx      # Predicción de riesgo
├── curodont-protocol-viewer.tsx  # Protocolo clínico
├── pricing-calculator.tsx        # Calculadora de precios
├── medical-disclaimer.tsx        # Disclaimer médico
├── animated-molar-scanner.tsx    # Animación del hero
└── zero-caries-logo.tsx          # Logo

lib/
├── validators.ts                 # Validadores y schemas
├── fdi-nomenclature.ts           # Nomenclatura dental FDI
└── supabase/
    ├── client.ts                 # Cliente Supabase
    └── server.ts                 # Server Supabase

scripts/
├── 001_create_tables.sql         # Schema de DB
└── 002_add_annotations.sql       # Tabla de anotaciones
```

---

## NOTAS IMPORTANTES

1. **Contexto Clínico**: Esta es una herramienta de APOYO diagnóstico, NO reemplaza al profesional dental
2. **Público Objetivo**: Pacientes y profesionales dentales en Chile
3. **Idioma**: Español (Chile)
4. **Moneda**: CLP (Peso chileno)
5. **Mensaje Clave**: "Sin inyecciones ni fresado mecánico"
6. **Integración**: Widget para clinicamiro.cl
7. **Cumplimiento**: Debe incluir disclaimers médicos apropiados

---

## EJECUTAR ANÁLISIS

Con toda esta información, procede a realizar el análisis end-to-end completo de la aplicación Zero Caries. Lee cada archivo mencionado, identifica problemas, propón soluciones concretas, y genera el código corregido listo para implementar.

Comienza ahora.
