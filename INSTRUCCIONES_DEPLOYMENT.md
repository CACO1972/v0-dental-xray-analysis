# Instrucciones de Deployment - Zero Caries

## Pre-requisitos

### Variables de Entorno Requeridas

```env
# IA - Model de Vision
XAI_API_KEY=tu_clave_xai              # Para Grok
# O alternativamente:
OPENAI_API_KEY=tu_clave_openai        # Para GPT-4o Vision (recomendado)

# Database - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio

# App Config
NEXT_PUBLIC_SITE_URL=https://zerocaries.clinicamiro.cl
```

### Base de Datos Setup

1. Ejecutar script de creación de tablas:
```bash
# En Supabase SQL Editor
npm run db:setup
# O manualmente ejecutar: scripts/001_create_tables.sql
```

2. Verificar que las tablas existen:
- `caries_analyses`
- `radiologist_feedback`
- `training_metrics`

3. Verificar que RLS (Row Level Security) está activo

## Deployment en Vercel

### Paso 1: Conectar Repositorio
```bash
vercel link
```

### Paso 2: Configurar Variables de Entorno
En Vercel Dashboard → Settings → Environment Variables, añadir todas las variables listadas arriba.

### Paso 3: Configurar Integraciones
1. **Supabase Integration**: Connect desde Vercel Marketplace
2. **Blob Storage**: Opcional para futuro almacenamiento de imágenes

### Paso 4: Deploy
```bash
vercel --prod
```

## Verificación Post-Deployment

### Checklist de Funcionalidad
- [ ] Página principal carga correctamente
- [ ] Upload de RX funciona
- [ ] Upload de foto intraoral funciona
- [ ] Análisis con IA responde en <60s
- [ ] Resultados se muestran correctamente
- [ ] Disclaimer médico es visible
- [ ] Tooltips educativos funcionan
- [ ] Tracker de progreso se actualiza
- [ ] Errores se manejan gracefully
- [ ] Base de datos guarda análisis

### Test de Validación
Subir estos casos de prueba:

1. ✅ **RX válida**: Debe analizar correctamente
2. ✅ **Foto intraoral válida**: Debe analizar con limitaciones advertidas
3. ❌ **Foto de gato**: Debe rechazar con error claro
4. ❌ **Archivo muy grande (>10MB)**: Debe rechazar antes de enviar
5. ❌ **PDF o documento**: Debe rechazar tipo de archivo

### Monitoring
Configurar alertas para:
- Errores 500 > 5% de requests
- Timeout > 10% de análisis
- Tasa de rechazo de imágenes > 30%

## Troubleshooting

### Error: "Model not found"
**Solución:** Verifica que `XAI_API_KEY` o `OPENAI_API_KEY` está configurada correctamente

### Error: "null value in column image_url"
**Solución:** Ejecuta migración de DB actualizada que acepta nullable o valores por defecto

### Error: "Timeout en análisis"
**Solución:** 
1. Verifica conexión con API de IA
2. Reduce tamaño máximo de imagen permitido
3. Aumenta timeout si network es lento

### Analytics No Funciona
**Solución:** Verifica que `@vercel/analytics` está en dependencies y importado en layout.tsx

## Mantenimiento

### Actualización de Modelo
Para cambiar modelo de IA:
```typescript
// app/api/analyze-dual/route.ts
const visionModel = "openai/gpt-4o"  // Cambiar aquí
```

### Backup de Base de Datos
Supabase hace backup automático, pero para backup manual:
```bash
pg_dump -h xxx.supabase.co -U postgres > backup.sql
```

### Logs y Debugging
Ver logs en tiempo real:
```bash
vercel logs --follow
```

Filtrar por errores:
```bash
vercel logs --follow | grep ERROR
