# 🔌 Instrucciones de Integración del Widget Zero Caries

## Para el Equipo de Desarrollo Web de Clínica MRO

---

## Opción 1: Iframe Completo (Recomendado)

### Ventajas
✅ Más fácil de implementar  
✅ Funciona en cualquier CMS (WordPress, Wix, etc.)  
✅ Aislamiento completo de estilos  

### Código

```html
<!-- Agregar en la página deseada -->
<div class="zero-caries-container">
  <iframe 
    src="https://tu-dominio.vercel.app/widget" 
    width="100%" 
    height="900px" 
    frameborder="0"
    loading="lazy"
    title="Zero Caries - Detección de Caries con IA"
    allow="camera; fullscreen"
  ></iframe>
</div>

<style>
  .zero-caries-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    .zero-caries-container iframe {
      height: 1200px; /* Más altura en móvil */
    }
  }
</style>
```

---

## Opción 2: Script Embebible (Avanzado)

### Ventajas
✅ Más integrado con el diseño del sitio  
✅ Puede adaptar estilos automáticamente  

### Código

```html
<!-- Agregar donde quieras que aparezca el widget -->
<div id="zero-caries-widget"></div>

<!-- Script al final del body -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://tu-dominio.vercel.app/api/widget-embed';
    script.async = true;
    document.body.appendChild(script);
  })();
</script>
```

---

## Opción 3: Botón Flotante

### Ventajas
✅ No ocupa espacio en la página  
✅ Siempre visible mientras el usuario navega  

### Código

```html
<!-- Agregar al final del body en todas las páginas -->
<script>
  window.ZeroCariesConfig = {
    style: 'floating-button',
    position: 'bottom-right', // o 'bottom-left'
    buttonColor: '#00D4FF', // Azul neón
    buttonText: '🦷 Detecta tus Caries'
  };
</script>
<script src="https://tu-dominio.vercel.app/api/widget-embed" async></script>
```

---

## Personalización

### Cambiar altura del iframe

```html
<iframe 
  src="https://tu-dominio.vercel.app/widget" 
  height="1000px"  <!-- Ajustar según necesidad -->
></iframe>
```

### Abrir en modal/popup

```html
<button onclick="openZeroCaries()">
  🦷 Analiza tu Radiografía
</button>

<script>
  function openZeroCaries() {
    // Crear modal
    var modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    modal.innerHTML = `
      <div style="width: 90%; max-width: 1200px; height: 90%; background: white; border-radius: 10px; position: relative;">
        <button onclick="this.closest('div').parentElement.remove()" 
                style="position: absolute; top: 10px; right: 10px; font-size: 24px; background: none; border: none; cursor: pointer;">
          ✕
        </button>
        <iframe src="https://tu-dominio.vercel.app/widget" 
                width="100%" 
                height="100%" 
                frameborder="0"
                style="border-radius: 10px;">
        </iframe>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
</script>
```

---

## Testing

### Checklist antes de lanzar

- [ ] Widget carga correctamente en desktop
- [ ] Widget carga correctamente en móvil
- [ ] Botón de subir imagen funciona
- [ ] Análisis de IA responde en <10 segundos
- [ ] Información de precios es correcta ($45,000 CLP)
- [ ] Logo "by Clínica MRO" es visible
- [ ] Enlace de contacto funciona
- [ ] No hay errores en consola del navegador

### URLs de prueba

- **Producción**: https://tu-dominio.vercel.app/widget
- **Preview**: https://tu-dominio-git-main.vercel.app/widget

---

## Soporte Técnico

**Problemas comunes:**

1. **Widget no carga**
   - Verificar que URL sea correcta
   - Verificar que no haya bloqueadores de contenido
   - Comprobar consola del navegador (F12)

2. **Análisis muy lento**
   - Verificar que XAI_API_KEY esté configurada
   - Comprobar límites de API en Vercel

3. **Estilos rotos**
   - Verificar que no haya conflictos de CSS
   - Usar iframe para aislamiento total

---

**Contacto para soporte**: equipo-dev@clinicamro.cl
