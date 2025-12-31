# ESTRATEGIA VIRAL GROWTH - ZERO CARIES
## De Herramienta Diagnóstica a Fenómeno Global Dental

**Objetivo:** Conseguir 10,000 dentistas activos en 6 meses
**Meta Viral:** 1 millón de análisis compartidos en 12 meses
**KPI Principal:** Viral Coefficient (K) > 1.5

---

## ANÁLISIS CRÍTICO: POR QUÉ NO ES VIRAL ACTUALMENTE

### Problemas Actuales que Impiden Viralidad ❌

1. **INVISIBLE SOCIALMENTE**
   - Sin botón prominente para compartir
   - Sin elemento "wow" compartible
   - Sin incentivo para que dentista muestre a colegas

2. **VALOR LIMITADO SIN REGISTRO**
   - Experiencia completa requiere subir imagen
   - Sin contenido educativo gratuito para atraer

3. **SIN LOOP DE CRECIMIENTO**
   - Paciente analiza → termina
   - No invita a otros
   - No genera contenido compartible

4. **FALTA ELEMENTO COMPETITIVO**
   - Dentistas no pueden compararse
   - Sin benchmarking profesional
   - Sin gamificación

5. **NO APROVECHA EDUCACIÓN DE PACIENTES**
   - Dentista no puede enviar informes branded
   - Sin material educativo compartible

---

## ESTRATEGIA VIRAL EN 3 FASES

### FASE 1: QUICK WINS VIRALES (Semana 1-2) 🚀

#### 1.1 "Before & After" Viral Generator

**Concepto:** Generar imágenes comparativas automáticas que dentistas QUIERAN compartir.

```typescript
// Componente: BeforeAfterGenerator
interface BeforeAfterCard {
  patientAge: number
  initialLesions: number
  afterTreatment: number
  monthsElapsed: number
  successRate: number
  treatmentType: "Curodont" | "Traditional"
}

function generateShareableCard(data: BeforeAfterCard) {
  return (
    <motion.div className="w-[1080px] h-[1080px] bg-gradient-viral">
      {/* Header con branding */}
      <div className="flex justify-between p-12">
        <ZeroCaresLogo size="large" />
        <div className="text-right">
          <div className="text-6xl font-black">93% ÉXITO</div>
          <div className="text-xl">Tratamiento sin dolor</div>
        </div>
      </div>

      {/* Comparación visual impactante */}
      <div className="grid grid-cols-2 gap-8 p-12">
        <div className="relative">
          <div className="absolute top-4 left-4 bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold">
            ANTES
          </div>
          <ToothVisualization3D 
            lesions={data.initialLesions}
            highlight="warning"
          />
          <div className="text-center mt-4 text-3xl font-bold text-red-600">
            {data.initialLesions} caries
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-4 left-4 bg-green-500 text-white px-6 py-3 rounded-full text-2xl font-bold">
            DESPUÉS
          </div>
          <ToothVisualization3D 
            lesions={data.afterTreatment}
            highlight="success"
          />
          <div className="text-center mt-4 text-3xl font-bold text-green-600">
            {data.afterTreatment} caries activas
          </div>
        </div>
      </div>

      {/* Stats impactantes */}
      <div className="bg-black text-white p-8 mx-12 rounded-2xl">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-black text-[#00D9FF]">
              {data.monthsElapsed}
            </div>
            <div className="text-xl mt-2">meses de tratamiento</div>
          </div>
          <div>
            <div className="text-5xl font-black text-[#00D9FF]">0</div>
            <div className="text-xl mt-2">inyecciones</div>
          </div>
          <div>
            <div className="text-5xl font-black text-[#00D9FF]">0</div>
            <div className="text-xl mt-2">dolor</div>
          </div>
        </div>
      </div>

      {/* CTA para dentistas */}
      <div className="text-center p-12">
        <div className="text-4xl font-bold mb-4">
          ¿Quieres resultados así con tus pacientes?
        </div>
        <div className="text-2xl text-muted-foreground">
          zerocaries.clinicamiro.cl
        </div>
        <QRCode value="https://zerocaries.clinicamiro.cl" size={120} />
      </div>

      {/* Footer branding */}
      <div className="absolute bottom-8 left-12 flex items-center gap-4">
        <Image src="/clinica-miro-logo.png" width={80} height={80} />
        <div>
          <div className="font-bold text-2xl">Clínica Miro</div>
          <div className="text-xl text-muted-foreground">Pioneros en detección IA</div>
        </div>
      </div>
    </motion.div>
  )
}
```

**Implementación:**
```tsx
// En resultados, agregar botón prominente
<Button 
  size="lg" 
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
  onClick={generateAndDownloadShareableCard}
>
  <Share2 className="mr-2" />
  Generar Imagen para Instagram
  <Badge className="ml-2 bg-white text-purple-600">NUEVO</Badge>
</Button>
```

**Por qué es viral:**
- Dentista quiere mostrar sus casos de éxito
- Formato Instagram-ready (1080x1080)
- Stats impactantes que generan curiosidad
- QR code directo a app
- Branding sutil pero presente

#### 1.2 "Caries Score" Competitivo

**Concepto:** Crear ranking global de clínicas por detección temprana.

```typescript
interface CariesDetectionScore {
  clinicName: string
  detectionsLast30Days: number
  averageDepth: number // Más bajo = mejor (detección temprana)
  curodontSuccessRate: number
  patientSatisfaction: number
  globalRanking: number
  countryRanking: number
  cityRanking: number
}

// Leaderboard público
function CariesLeaderboard() {
  return (
    <Card className="p-8">
      <h3 className="text-2xl font-bold mb-6">
        🏆 Top Clínicas en Detección Temprana
      </h3>
      
      <div className="space-y-4">
        {topClinics.map((clinic, index) => (
          <motion.div
            key={clinic.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black
                ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                ${index === 1 ? 'bg-gray-300 text-gray-800' : ''}
                ${index === 2 ? 'bg-orange-400 text-orange-900' : ''}
                ${index > 2 ? 'bg-blue-200 text-blue-900' : ''}
              `}>
                #{index + 1}
              </div>
              
              <div>
                <div className="font-bold text-lg">{clinic.name}</div>
                <div className="text-sm text-muted-foreground">
                  {clinic.city}, {clinic.country}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">
                {clinic.score}
              </div>
              <div className="text-xs text-muted-foreground">
                Early Detection Score
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Button className="w-full mt-6 bg-transparent" variant="outline">
        Ver Ranking Completo (2,847 clínicas)
      </Button>
    </Card>
  )
}
```

**Gamificación para dentistas:**
```typescript
// Badges desbloqueables
const ACHIEVEMENTS = {
  "early_bird": {
    name: "Detector Temprano",
    description: "10 caries E1 detectadas",
    icon: "🔬",
    shareText: "¡He detectado 10 caries en etapa reversible! #EarlyDetection"
  },
  "curodont_master": {
    name: "Maestro Curodont",
    description: "50 tratamientos exitosos sin taladro",
    icon: "🏆",
    shareText: "50 pacientes tratados sin dolor ni taladro. #CurodontExpert"
  },
  "prevention_hero": {
    name: "Héroe de la Prevención",
    description: "100 análisis realizados",
    icon: "⚡",
    shareText: "He ayudado a 100 pacientes a detectar caries temprano"
  }
}

// Sistema de puntos
function calculateDentistScore(stats: DentistStats): number {
  return (
    stats.earlyDetections * 10 +      // Más puntos por detección temprana
    stats.curodontSuccess * 15 +      // Aún más por éxito en tratamiento
    stats.patientEducation * 5 +      // Compartir contenido educativo
    stats.referrals * 20               // Referir colegas
  )
}
```

**Por qué es viral:**
- Dentistas son competitivos por naturaleza
- Quieren demostrar expertise
- Leaderboard público genera FOMO
- Badges compartibles en redes sociales
- Incentiva uso constante de la app

#### 1.3 "Patient Education Kit" Branded

**Concepto:** Dentista puede generar PDF/video educativo con su branding para enviar a pacientes.

```tsx
function EducationalContentGenerator() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">
        Genera Material Educativo Branded
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Opción 1: Infografía */}
        <Card className="p-6">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-4 flex items-center justify-center">
            <FileText className="w-16 h-16 text-blue-600" />
          </div>
          <h4 className="font-bold mb-2">Infografía Educativa</h4>
          <p className="text-sm text-muted-foreground mb-4">
            PDF descargable explicando detección temprana
          </p>
          <Button className="w-full">
            Personalizar y Descargar
          </Button>
        </Card>

        {/* Opción 2: Video corto */}
        <Card className="p-6">
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
            <Video className="w-16 h-16 text-purple-600" />
          </div>
          <h4 className="font-bold mb-2">Video Explicativo (30s)</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Animación 3D de tratamiento Curodont
          </p>
          <Button className="w-full">
            Generar Video con mi Logo
          </Button>
        </Card>

        {/* Opción 3: Email template */}
        <Card className="p-6">
          <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-4 flex items-center justify-center">
            <Mail className="w-16 h-16 text-green-600" />
          </div>
          <h4 className="font-bold mb-2">Plantilla Email</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Email pre-escrito para enviar a pacientes
          </p>
          <Button className="w-full">
            Copiar Template
          </Button>
        </Card>

        {/* Opción 4: Post redes sociales */}
        <Card className="p-6">
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-4 flex items-center justify-center">
            <Instagram className="w-16 h-16 text-orange-600" />
          </div>
          <h4 className="font-bold mb-2">Post para Instagram</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Carrusel educativo listo para publicar
          </p>
          <Button className="w-full">
            Descargar 10 Imágenes
          </Button>
        </Card>
      </div>

      {/* Personalización */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-bold mb-4">Personalización</h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Logo de tu Clínica</label>
            <Input type="file" accept="image/*" />
          </div>
          <div>
            <label className="text-sm font-medium">Nombre de Clínica</label>
            <Input placeholder="Ej: Clínica Dental Sonrisas" />
          </div>
          <div>
            <label className="text-sm font-medium">Teléfono de Contacto</label>
            <Input placeholder="+56 9 1234 5678" />
          </div>
          <div>
            <label className="text-sm font-medium">Instagram Handle</label>
            <Input placeholder="@clinicasonrisas" />
          </div>
        </div>
      </Card>
    </div>
  )
}
```

**Por qué es viral:**
- Dentista comparte contenido que educasu pacientes
- Cada contenido tiene link a Zero Caries
- Pacientes comparten con amigos/familia
- Loop viral: Más contenido → Más tráfico → Más dentistas → Más contenido

---

### FASE 2: ELEMENTOS SOCIALES (Semana 3-6) 🤝

#### 2.1 "Community Cases" - Red Social de Casos Clínicos

**Concepto:** Dentistas comparten casos difíciles (anónimos) para segunda opinión.

```typescript
interface CommunityCase {
  id: string
  title: string
  description: string
  images: string[]
  author: {
    name: string
    specialty: string
    reputation: number
    badges: string[]
  }
  diagnosis: {
    preliminary: string
    confidence: number
  }
  seeking: "second_opinion" | "treatment_advice" | "discussion"
  replies: CaseReply[]
  upvotes: number
  views: number
  tags: string[]
}

function CommunityCaseFeed() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Casos de la Comunidad</h2>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
          <Plus className="mr-2" />
          Compartir Caso
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["Todos", "E1/E2", "D1", "Diagnóstico Difícil", "Curodont", "Casos Resueltos"].map(tag => (
          <Badge 
            key={tag}
            variant="outline"
            className="cursor-pointer hover:bg-blue-50"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Feed de casos */}
      {communityCase.map(case => (
        <Card key={case.id} className="overflow-hidden hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={case.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{case.author.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{case.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {case.author.specialty} • {case.author.reputation} pts
                  </div>
                  <div className="flex gap-1 mt-1">
                    {case.author.badges.map(badge => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Badge variant={case.seeking === "second_opinion" ? "default" : "outline"}>
                {case.seeking === "second_opinion" ? "🔍 Segunda Opinión" : "💬 Discusión"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3">{case.title}</h3>
            <p className="text-gray-700 mb-4">{case.description}</p>

            {/* Imágenes del caso */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {case.images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={img || "/placeholder.svg"} alt={`Caso ${i+1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Análisis IA preliminar */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-bold">Análisis IA Preliminar</span>
                  <Badge variant="outline">{case.diagnosis.confidence}% confianza</Badge>
                </div>
                <p className="text-sm">{case.diagnosis.preliminary}</p>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                {case.upvotes} votos
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {case.replies.length} respuestas
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {case.views} vistas
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 p-4">
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1 bg-transparent">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Votar
              </Button>
              <Button className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Opinar
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
```

**Sistema de Reputación:**
```typescript
// Gamificación para incentivar participación
function calculateReputation(actions: UserAction[]): number {
  const points = {
    share_case: 10,
    helpful_reply: 5,
    case_solved: 20,
    upvote_received: 2,
    referred_colleague: 15,
    curodont_success_reported: 25
  }

  return actions.reduce((total, action) => {
    return total + (points[action.type] || 0)
  }, 0)
}

// Niveles desbloqueables
const REPUTATION_LEVELS = [
  { min: 0, name: "Principiante", perks: [] },
  { min: 100, name: "Colaborador", perks: ["badge", "highlighted_replies"] },
  { min: 500, name: "Experto", perks: ["verified_badge", "priority_support", "early_access"] },
  { min: 2000, name: "Maestro", perks: ["master_badge", "featured_profile", "conference_invite"] },
  { min: 5000, name: "Leyenda", perks: ["legend_badge", "advisor_role", "revenue_share"] }
]
```

**Por qué es viral:**
- Dentistas ADORAN discutir casos complejos
- Segunda opinión es valor real que buscan
- Sistema de reputación los incentiva a participar
- Cada caso compartido trae tráfico nuevo
- Network effects: Más dentistas → Más valor → Más dentistas

#### 2.2 "Referral Program" con Incentivos Reales

**Concepto:** Dentista invita colegas y gana beneficios concretos.

```tsx
function ReferralDashboard() {
  const [referralCode, setReferralCode] = useState("MIRO2024")
  const [referralStats, setReferralStats] = useState({
    invited: 23,
    joined: 12,
    active: 8,
    earnings: 240000 // CLP
  })

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Invita Colegas, Gana Recompensas
        </h2>
        <p className="text-xl text-muted-foreground">
          Por cada dentista que refiere, ganas créditos para análisis gratuitos
        </p>
      </div>

      {/* Tu código único */}
      <Card className="p-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white mb-8">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider mb-2">Tu Código de Referido</div>
          <div className="text-5xl font-black mb-6">{referralCode}</div>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => copyToClipboard(referralCode)}
            >
              <Copy className="mr-2" />
              Copiar Código
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => shareViaWhatsApp(referralCode)}
            >
              <Share2 className="mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-blue-600">{referralStats.invited}</div>
          <div className="text-sm text-muted-foreground mt-2">Invitados</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-green-600">{referralStats.joined}</div>
          <div className="text-sm text-muted-foreground mt-2">Se Unieron</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-purple-600">{referralStats.active}</div>
          <div className="text-sm text-muted-foreground mt-2">Activos</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-yellow-400 to-orange-400">
          <div className="text-4xl font-bold text-white">
            ${referralStats.earnings.toLocaleString()}
          </div>
          <div className="text-sm text-white mt-2">Ganado (CLP)</div>
        </Card>
      </div>

      {/* Programa de recompensas */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-6">Programa de Recompensas</h3>
        
        <div className="space-y-6">
          {[
            { refs: 1, reward: "10 análisis gratuitos", value: "15.000 CLP" },
            { refs: 5, reward: "50 análisis + Badge 'Embajador'", value: "75.000 CLP" },
            { refs: 10, reward: "Cuenta Premium 6 meses", value: "180.000 CLP" },
            { refs: 25, reward: "Cuenta Premium 1 año + Certificación", value: "500.000 CLP" },
            { refs: 50, reward: "Acceso de por vida + Revenue Share", value: "∞" }
          ].map((tier, i) => (
            <div 
              key={i}
              className={`flex items-center justify-between p-6 rounded-xl border-2 ${
                referralStats.joined >= tier.refs 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  referralStats.joined >= tier.refs 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {referralStats.joined >= tier.refs ? '✓' : tier.refs}
                </div>
                <div>
                  <div className="font-bold text-lg">{tier.reward}</div>
                  <div className="text-sm text-muted-foreground">
                    Al referir {tier.refs} colegas activos
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{tier.value}</div>
                <div className="text-xs text-muted-foreground">valor estimado</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Template de invitación */}
      <Card className="p-8 mt-8">
        <h3 className="text-xl font-bold mb-4">Template de Invitación</h3>
        <div className="bg-gray-100 p-6 rounded-lg mb-4">
          <p className="text-sm whitespace-pre-line">
            {`¡Hola colega! 👋

Te recomiendo Zero Caries, una herramienta de IA que uso para detectar caries tempranas.

✅ Análisis en 30 segundos
✅ Identifica candidatos para Curodont (sin taladro)
✅ 93% de precisión validada clínicamente

Usa mi código ${referralCode} para obtener 5 análisis gratis.

🔗 zerocaries.clinicamiro.cl

¿Te interesa?`}
          </p>
        </div>
        <Button className="w-full">
          <MessageSquare className="mr-2" />
          Enviar por WhatsApp
        </Button>
      </Card>
    </div>
  )
}
```

**Por qué es viral:**
- Incentivos reales (dinero/créditos)
- Fácil de compartir (código + template)
- Network effects profesionales
- Tracking transparente de recompensas

---

### FASE 3: ELEMENTOS DISRUPTIVOS (Mes 2-6) 💡

#### 3.1 "AI Second Opinion" - Live

**Concepto:** Durante consulta, dentista puede obtener segunda opinión de IA en tiempo real.

```typescript
// WebSocket para análisis en vivo
function LiveAnalysisSession() {
  const [isLive, setIsLive] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>([])

  return (
    <div className="grid grid-cols-2 gap-6 h-screen p-6">
      {/* Izquierda: Cámara intraoral en vivo */}
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl">Vista Intraoral en Vivo</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm">{isLive ? 'En Vivo' : 'Detenido'}</span>
            </div>
          </div>

          {/* Stream de cámara */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video ref={videoRef} className="w-full h-full object-cover" />
            
            {/* Overlay de detección en tiempo real */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {aiSuggestions.map((suggestion, i) => (
                <motion.circle
                  key={i}
                  cx={suggestion.x}
                  cy={suggestion.y}
                  r="20"
                  fill="none"
                  stroke={suggestion.severity === 'high' ? '#ef4444' : '#f59e0b'}
                  strokeWidth="3"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </svg>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => setIsLive(!isLive)}
              className="flex-1"
              variant={isLive ? "destructive" : "default"}
            >
              {isLive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isLive ? 'Pausar' : 'Iniciar'} Análisis
            </Button>
            <Button variant="outline">
              <Camera className="mr-2" />
              Capturar
            </Button>
          </div>
        </Card>

        {/* Historial de capturas */}
        <Card className="p-4">
          <h4 className="font-bold mb-3">Capturas de la Sesión</h4>
          <div className="grid grid-cols-4 gap-2">
            {captures.map((capture, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-blue-500">
                <Image src={capture.url || "/placeholder.svg"} alt={`Captura ${i+1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Derecha: Sugerencias de IA en tiempo real */}
      <div className="space-y-4 overflow-y-auto">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Asistente IA</h3>
              <p className="text-sm text-muted-foreground">Detectando en tiempo real...</p>
            </div>
          </div>

          {aiSuggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Esperando detecciones...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border-2 ${
                    suggestion.severity === 'high' 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-yellow-50 border-yellow-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        suggestion.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <span className="font-bold">{suggestion.tooth}</span>
                    </div>
                    <Badge variant={suggestion.severity === 'high' ? 'destructive' : 'warning'}>
                      {suggestion.classification}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{suggestion.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Ver Detalle
                    </Button>
                    <Button size="sm" className="flex-1">
                      Confirmar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Recomendaciones de tratamiento */}
        <Card className="p-4">
          <h4 className="font-bold mb-3">Recomendaciones</h4>
          <div className="space-y-2">
            {treatmentRecommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">{rec.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats de la sesión */}
        <Card className="p-4">
          <h4 className="font-bold mb-3">Estadísticas de Sesión</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{sessionStats.detections}</div>
              <div className="text-xs text-muted-foreground">Detecciones</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{sessionStats.curodontCandidates}</div>
              <div className="text-xs text-muted-foreground">Candidatos Curodont</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{sessionStats.captures}</div>
              <div className="text-xs text-muted-foreground">Capturas</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{formatTime(sessionStats.duration)}</div>
              <div className="text-xs text-muted-foreground">Duración</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
```

**Por qué es disruptivo:**
- Primera app dental con análisis en vivo
- Mejora precisión durante consulta
- Reduce tiempo de diagnóstico
- WOW factor para pacientes
- Dentista parece más tecnológico

#### 3.2 "Caries Predictor" - Machine Learning Avanzado

**Concepto:** Predecir qué dientes desarrollarán caries en 6-12 meses.

```typescript
interface CariesPredictionModel {
  patientHistory: {
    age: number
    previousCaries: number
    fluorideExposure: 'high' | 'medium' | 'low'
    oralHygiene: 'excellent' | 'good' | 'fair' | 'poor'
    sugarIntake: 'high' | 'medium' | 'low'
    lastDentalVisit: Date
  }
  currentAnalysis: {
    teeth: ToothAnalysis[]
    salivaPH: number
    plaqueIndex: number
  }
  predictions: ToothPrediction[]
}

interface ToothPrediction {
  tooth: string
  currentStatus: 'healthy' | 'E0' | 'E1' | 'E2' | 'D1'
  riskScore: number // 0-100
  predictedStatus6Months: string
  predictedStatus12Months: string
  preventionActions: PreventionAction[]
  confidence: number
}

function CariesPredictorDashboard() {
  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
          🔮 TECNOLOGÍA PREDICTIVA
        </Badge>
        <h2 className="text-4xl font-bold mb-4">
          Predicción de Riesgo de Caries
        </h2>
        <p className="text-xl text-muted-foreground">
          Algoritmo ML predice qué dientes desarrollarán caries en los próximos 6-12 meses
        </p>
      </div>

      {/* Mapa dental con predicciones */}
      <Card className="p-8 mb-8">
        <h3 className="text-2xl font-bold mb-6">Mapa de Riesgo Predictivo</h3>
        
        <div className="relative">
          {/* Diagrama dental con heat map */}
          <ToothDiagram 
            mode="prediction"
            predictions={predictions}
            showTimeline={true}
          />

          {/* Leyenda de colores */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { color: 'bg-green-500', label: 'Riesgo Bajo (0-30%)', count: 24 },
              { color: 'bg-yellow-500', label: 'Riesgo Medio (31-60%)', count: 6 },
              { color: 'bg-orange-500', label: 'Riesgo Alto (61-80%)', count: 2 },
              { color: 'bg-red-500', label: 'Riesgo Crítico (81-100%)', count: 0 }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${item.color}`} />
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.count} dientes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Timeline predictivo */}
      <Card className="p-8 mb-8">
        <h3 className="text-2xl font-bold mb-6">Timeline de Riesgo</h3>
        
        <div className="relative">
          {/* Línea de tiempo */}
          <div className="flex items-center justify-between mb-12">
            {['Hoy', '3 meses', '6 meses', '9 meses', '12 meses'].map((time, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className="text-sm font-medium mt-2">{time}</div>
              </div>
            ))}
          </div>

          {/* Eventos predichos */}
          <div className="space-y-4">
            {predictedEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{event.tooth} - {event.prediction}</div>
                  <div className="text-sm text-muted-foreground">{event.timeline}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">{event.probability}%</div>
                  <div className="text-xs text-muted-foreground">probabilidad</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Plan de prevención personalizado */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Plan de Prevención Personalizado</h3>
            <p className="text-muted-foreground">Acciones específicas para evitar las caries predichas</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {preventionActions.map((action, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{action.frequency}</Badge>
                    <Badge variant={action.priority === 'high' ? 'destructive' : 'secondary'}>
                      {action.priority === 'high' ? 'Urgente' : 'Recomendado'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button size="lg" className="w-full mt-8 bg-green-600 hover:bg-green-700">
          <Download className="mr-2" />
          Descargar Plan Completo (PDF)
        </Button>
      </Card>
    </div>
  )
}
```

**Por qué es disruptivo:**
- Nadie más tiene predicción de caries
- Cambia paradigma de reactivo a preventivo
- Alto valor para pacientes (prevenir > curar)
- Dentista se posiciona como innovador
- Medios de comunicación cubrirán la tecnología

---

## IMPLEMENTACIÓN DE ELEMENTOS VIRALES

Ahora voy a agregar los componentes más impactantes a la app actual:
