# 🦷 Zero Caries - Instrucciones de Integración para clinicamiro.cl

## Método 1: iFrame Embebido (Recomendado)

Agrega este código en cualquier página de clinicamiro.cl donde quieras mostrar el widget:

```html
<!-- Widget Zero Caries -->
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <iframe 
    src="https://tu-dominio-v0.vercel.app/widget" 
    width="100%" 
    height="1400px" 
    frameborder="0"
    allow="camera; clipboard-write"
    title="Zero Caries - Análisis de Caries con IA"
    loading="lazy"
  ></iframe>
</div>
```

## Método 2: Modal/Popup

Agrega un botón en clinicamiro.cl que abra el widget en modal:

```html
<!-- Botón para abrir widget -->
<button onclick="openZeroCariesWidget()" class="btn-zerocaries">
  🦷 Analizar Caries con IA
</button>

<!-- Modal container -->
<div id="zerocaries-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999;">
  <div style="position:relative; width:100%; height:100%; max-width:1400px; margin:0 auto; padding:20px;">
    <button onclick="closeZeroCariesWidget()" style="position:absolute; top:30px; right:30px; background:#D4A54A; color:black; border:none; padding:10px 20px; border-radius:50px; cursor:pointer; font-weight:bold; z-index:10000;">
      ✕ Cerrar
    </button>
    <iframe 
      src="https://tu-dominio-v0.vercel.app/widget" 
      width="100%" 
      height="100%" 
      frameborder="0"
      allow="camera; clipboard-write"
    ></iframe>
  </div>
</div>

<script>
function openZeroCariesWidget() {
  document.getElementById('zerocaries-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeZeroCariesWidget() {
  document.getElementById('zerocaries-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}
</script>
```

## Método 3: Botón Flotante (Landing Page)

Widget flotante en esquina inferior derecha:

```html
<!-- Botón flotante -->
<div style="position:fixed; bottom:20px; right:20px; z-index:9999;">
  <button onclick="openZeroCariesWidget()" 
          style="background: linear-gradient(135deg, #D4A54A 0%, #C49540 100%); 
                 color: black; 
                 border: none; 
                 padding: 16px 24px; 
                 border-radius: 50px; 
                 font-weight: bold; 
                 cursor: pointer; 
                 box-shadow: 0 4px 20px rgba(212, 165, 74, 0.4);
                 display: flex;
                 align-items: center;
                 gap: 8px;
                 font-size: 16px;">
    🦷 Detecta Caries con IA
  </button>
</div>

<!-- Incluir el código del modal del Método 2 -->
```

## Configuración Personalizada

### Colores Corporativos Detectados de Clínica Miró:
- **Negro**: #000000 (fondo principal)
- **Dorado**: #D4A54A (acentos, botones CTA)
- **Blanco**: #FFFFFF (texto principal)
- **Azul Neón**: #00D9FF (marca Zero Caries)

### Enlaces Integrados en el Widget:
- **Agenda**: https://ff.healthatom.io/TA6eA1
- **WhatsApp**: +56 9 7415 7966
- **Mensaje predefinido**: "Hola, me gustaría saber más sobre Zero Caries y el tratamiento sin inyecciones"

## Características del Widget

✅ **Completamente Responsivo** - Funciona en mobile, tablet y desktop  
✅ **Branding Clínica Miró** - Colores y estética integrados  
✅ **Botones de Contacto** - Agenda y WhatsApp prominentes  
✅ **Análisis con IA** - OpenAI GPT-4o para detección de caries  
✅ **Sin Inyecciones ni Fresado** - Mensaje enfatizado  
✅ **Resultados en 30s** - Análisis rápido y preciso  
✅ **Base de Datos** - Resultados guardados en Supabase  

## Seguridad y Privacidad

- ✅ Disclaimer médico visible
- ✅ Datos encriptados en tránsito (HTTPS)
- ✅ Cumple con normativas de salud chilenas
- ✅ Almacenamiento seguro en Supabase

## Soporte Técnico

Para modificaciones o soporte técnico, contacta al equipo de desarrollo de Zero Caries.

**URL del Widget**: `https://tu-dominio-v0.vercel.app/widget`

---

*Desarrollado con ❤️ por el equipo de Zero Caries para Clínica Miró*
