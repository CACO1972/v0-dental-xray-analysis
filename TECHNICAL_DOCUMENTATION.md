# Documentación Técnica: CariesDetect - Sistema de Detección de Caries

## 1. Fundamentos Clínicos

### 1.1 Tratamiento Curodont™

**Curodont™ Repair Fluoride Plus** es un sistema biomimético de remineralización guiada del esmalte indicado para:

- **Lesiones cariosas tempranas NO cavitadas** (White spot lesions)
- **Áreas de vigilancia** que no requieren restauración
- **Manchas blancas por descalcificación**
- **Lesiones activas no cavitadas**

#### Mecanismo de Acción
- Se difunde en la lesión para proporcionar fluoruro junto con calcio y fosfato de la saliva
- Ayuda a remineralizar y re-endurecer el esmalte afectado durante varias semanas
- Tecnología Monomer-Peptide 104 que regenera el esmalte formando nuevos cristales de hidroxiapatita

#### Criterios de Candidatura

| Profundidad de Caries | Clasificación | Candidato Curodont | Tratamiento Alternativo |
|------------------------|---------------|-------------------|------------------------|
| Sin desmineralización | E0 (Sano) | NO | Ninguno |
| Desmineralización visual | E1 | **SÍ - IDEAL** | Fluoruro convencional |
| Lesión en esmalte exterior (<50%) | E2 | **SÍ - IDEAL** | Sellante, monitoreo |
| Lesión en esmalte profundo (>50%) | D1 | **POSIBLE** | Sellante invasivo mínimo |
| Lesión en dentina superficial | D2 | NO | Obturación (resina) |
| Lesión en dentina moderada | D3 | NO | Obturación (resina/amalgama) |
| Lesión en dentina profunda | D4 | NO | Endodoncia + Corona |

### 1.2 Radiografía Periapical

**Características**:
- Imagen detallada de 1-3 dientes desde corona hasta raíz
- Incluye hueso alveolar circundante
- Mejor para: lesiones periapicales, fracturas radiculares, reabsorción
- **Limitación**: NO es la mejor para diagnóstico sistemático de caries interproximales

**Apariencia Radiográfica de Caries**:
- **Radiolucidez** (zonas oscuras) por desmineralización
- Se requiere **50% de pérdida de calcio/fósforo** para ser visible
- Puede haber retraso entre situación histológica real y apariencia radiográfica

**Clasificación por Profundidad**:

1. **Caries de Esmalte**
   - Forma triangular con base exterior y vértice hacia dentina
   - Dimensión corono-apical <1mm típicamente
   - Ubicación: gingival al área de contacto
   
   - **Incipiente**: <50% grosor del esmalte
   - **Moderada**: >50% grosor del esmalte, no alcanza unión amelodentinaria (UAD)

2. **Caries Dentinaria**
   - Radiolucidez globulosa mal definida
   - Triángulo invertido: base en UAD, vértice hacia pulpa
   - Expansión rápida al alcanzar UAD
   
   - **Avanzada**: Alcanza UAD, <50% distancia a pulpa
   - **Grave**: >50% distancia a pulpa, puede ser visible clínicamente

3. **Caries Oclusal**
   - NO visible hasta alcanzar UAD
   - Moderada: Línea radiolúcida bajo esmalte
   - Grave: Zona radiolúcida grande, visible clínicamente

### 1.3 Radiografía Bitewing (Aleta de Mordida)

**Características**:
- **MEJOR técnica para detección temprana de caries interproximales**
- Muestra coronas de dientes superiores e inferiores simultáneamente
- Ideal para: caries entre dientes, pérdida ósea inicial

**Ventajas**:
- Detecta caries interdentales antes de que sean visibles clínicamente
- Evalúa ajuste de restauraciones existentes
- Monitorea progresión de lesiones tempranas

**Indicaciones**:
- Pacientes con alto riesgo de caries
- Evaluación de restauraciones interproximales
- Seguimiento de lesiones no cavitadas

---

## 2. Recursos de Deep Learning Disponibles

### 2.1 Modelos de Código Abierto Investigados

#### ToothNet (YOLOX Multi-Task)
- **Repositorio**: https://github.com/MedcAILab/ToothNet
- **Framework**: PyTorch
- **Arquitectura**: YOLOX con cabezas desacopladas
- **Capacidades**: 
  - Detección de caries
  - Detección de sellantes
  - Multi-task learning simultáneo
- **Ventajas**: Anchor-free, más rápido que modelos individuales
- **Desventaja**: Requiere entrenamiento con dataset propio (7,447+ imágenes)

#### DentalScan Pro
- **Repositorio**: https://github.com/ahsanaliSWE/DentalScanpro
- **Framework**: Flutter + TensorFlow Lite
- **Modelos evaluados**:
  - MobileNetV2 (ligero, mobile-first)
  - ResNet50 (preciso pero lento)
  - EfficientDet D1
  - **YOLOv8** (MEJOR performance)
- **Dataset**: Roboflow public dataset (7,447 imágenes anotadas)
- **Ventaja**: Ya tiene implementación móvil completa
- **Desventaja**: Modelos .tflite no fácilmente integrables a web

#### SegmentAnyTooth
- **Repositorio**: https://github.com/thangngoc89/SegmentAnyTooth
- **Framework**: PyTorch + Segment Anything Model (SAM)
- **Capacidades**:
  - Segmentación de dientes individuales
  - Numeración FDI automática
  - Funciona con fotos intraorales
- **Licencia**: MIT para código, No-comercial para pesos
- **Uso**: Ideal para pre-procesamiento (identificar dientes antes de detectar caries)

### 2.2 Estrategia de Integración Propuesta

**Opción 1: Modelos de Visión Comerciales (Implementado Actualmente)**
```
Imagen → GPT-4o Vision → Análisis de caries
```

**Ventajas**:
- Sin infraestructura de ML propia
- Sin costos de entrenamiento
- Actualizaciones automáticas del modelo

**Desventajas**:
- Menor especialización
- Costo por request
- Dependencia de API externa

**Opción 2: Modelo Especializado (Futuro)**
```
Imagen → SegmentAnyTooth (FDI) → YOLOv8-Dental → Clasificación profundidad
```

**Ventajas**:
- Mayor precisión en caries específicas
- Control total del modelo
- Costo fijo (hosting)

**Desventajas**:
- Requiere servidor con GPU ($200+/mes)
- Mantenimiento del modelo
- Necesita dataset de entrenamiento

---

## 3. Mejoras al Prompt de IA Actual

Basado en la investigación, el prompt debe:

1. **Ser más específico sobre características radiográficas**
   - Buscar radiolucidez (zonas oscuras)
   - Diferenciar triángulos de esmalte vs dentina
   - Medir extensión desde UAD

2. **Clasificar según profundidad real**
   - E1: Desmineralización visible (blanco opaco)
   - E2: <50% esmalte
   - D1: >50% esmalte + UAD
   - D2: <50% distancia a pulpa
   - D3: >50% distancia a pulpa

3. **Diferenciar tipos de imagen**
   - Periapical: Mejor para caries oclusales y radiculares
   - Bitewing: Mejor para caries interproximales
   - Intraoral: Solo manchas blancas (E1) son detectables

4. **Reconocer limitaciones**
   - En RX se necesita 50% desmineralización para ser visible
   - Lesiones tempranas pueden no ser visibles radiográficamente
   - Fotos intraorales solo detectan estadios E1-E2

---

## 4. Próximos Pasos

### Corto Plazo (1-2 semanas)
- [ ] Mejorar prompt con criterios radiográficos específicos
- [ ] Añadir detección de tipo de imagen (periapical vs bitewing vs intraoral)
- [ ] Implementar clasificación E0-D3 precisa

### Mediano Plazo (1-3 meses)
- [ ] Integrar SegmentAnyTooth para numeración FDI automática
- [ ] Crear dataset de validación con radiólogos
- [ ] Medir precision/recall real vs diagnóstico profesional

### Largo Plazo (6+ meses)
- [ ] Evaluar despliegue de YOLOv8 especializado
- [ ] Obtener aprobación de comité ético para investigación
- [ ] Publicar estudio de precisión diagnóstica

---

## 5. Métricas de Éxito

| Métrica | Objetivo | Actual | Gap |
|---------|----------|--------|-----|
| Sensibilidad (detectar caries reales) | >90% | ~75%* | -15% |
| Especificidad (evitar falsos positivos) | >85% | ~80%* | -5% |
| Precisión en profundidad (E1/E2/D1) | >80% | ~60%* | -20% |
| Acuerdo con radiólogo (Kappa) | >0.80 | ~0.65* | -0.15 |

*Estimaciones basadas en feedback inicial, requiere validación formal

---

## 6. Referencias

1. Nguyen, K. D., et al. (2025). SegmentAnyTooth: An open-source deep learning framework. *Journal of Dental Sciences*.
2. ToothNet: YOLOX Multi-Task Learning for Caries Detection. MedcAILab, 2023.
3. DentalScan Pro: AI-Powered Cavity Detection. INMIC 2024.
4. Curodont™ Repair Fluoride Plus. Vvardis Professional.
5. La radiografía periapical para el diagnóstico de caries. Propdental.
6. Radiología de las caries. Patología Oral, Universidad Mayor.
```

```ts file="" isHidden
