# AI Support Engine

Base funcional del reto: un endpoint común para analizar solicitudes mediante un motor tradicional por reglas o un motor generativo conectado a un proveedor real.

## Integrantes

- Samuel Jonathan Trujillo Bolaños — 3523110007
- Kevin Omar Sixto Lázaro — 3523110482
- Armando Valerio Salmeron — 3522110726
- Jesús Emanuel Vega Medina — 3523110340

## Estructura

```text
src/
  domain/                 Contrato y valores permitidos
  application/            Validación y caso de uso
  engines/                Motor traditional y motor generative
  http/                   Servidor HTTP y endpoint
test/                     Pruebas unitarias mínimas
src/evaluation/           Casos de referencia y comparación de motores
ml-service/               Microservicio Python de clasificación TF-IDF + Logistic Regression
```

## Ejecución

Requiere Node.js 20 o superior.

```bash
npm install
Copy-Item .env.example .env
npm test
npm run compare
npm start
```

El modo `traditional` funciona sin credenciales. Para `generative`, puedes usar Ollama local sin API key o Anthropic configurando `ANTHROPIC_API_KEY`; no se simulan respuestas generativas.

### Proveedor generativo gratuito con Ollama

Instala Ollama, descarga un modelo y deja el servidor local activo:

```powershell
ollama pull gemma3:4b
ollama serve
```

El `.env.example` ya usa `AI_PROVIDER=ollama`, `OLLAMA_MODEL=gemma3:4b` y `OLLAMA_BASE_URL=http://127.0.0.1:11434/v1`. Después ejecuta `npm start` y usa el modo `generative`. Ollama procesa las solicitudes localmente, por lo que no requiere saldo ni API key.

## Configuración segura de la API key

La clave nunca debe escribirse en el código, en `README.md` ni en un commit. El MVP usa Claude por defecto mediante la API de Anthropic.

Para ejecución local con Anthropic:

```powershell
Copy-Item .env.example .env
notepad .env
```

Completa únicamente en tu máquina:

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=tu_clave_real
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

Para ejecución en GitHub Actions, este repositorio usa el secreto existente `API` en `Settings > Secrets and variables > Actions`. El workflow lo asigna internamente a `ANTHROPIC_API_KEY`, ejecuta la comparación generativa con Claude y publica el resultado como artefacto sin guardarlo en el repositorio.

## Endpoint

`POST /api/analyze`

```json
{
  "message": "No puedo iniciar sesión",
  "mode": "traditional"
}
```

La respuesta mantiene siempre este contrato: `category`, `priority`, `response`, `requiresHumanReview` y `mode`. Las categorías válidas son `ACCESS`, `BUG`, `FEATURE` y `SECURITY`; las prioridades son `LOW`, `MEDIUM`, `HIGH` y `CRITICAL`.

Ejemplo con PowerShell:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/analyze `
  -ContentType 'application/json' `
  -Body '{"message":"Detecté una vulnerabilidad","mode":"traditional"}'
```

Las solicitudes de seguridad siempre se devuelven con `requiresHumanReview: true`. El motor generativo usa salida JSON, valida el contrato y convierte errores del proveedor en respuestas HTTP controladas.

## Primera evaluación MVP

`npm run compare` ejecuta 10 casos de referencia contra el motor tradicional. Si `ANTHROPIC_API_KEY` está configurada, ejecuta los mismos casos contra Claude y calcula formato válido, exactitud de categoría y exactitud conjunta de categoría y prioridad. Sin credencial, el bloque generativo se marca como omitido sin simular resultados.

La comparación generativa cloud de GitHub Actions es opcional y se activa con la variable de repositorio `RUN_CLOUD_COMPARISON=true`. El CI base valida Node y el microservicio ML sin depender de saldo externo. La checklist de entregables y la evidencia registrada se encuentran en [`docs/DELIVERY_CHECKLIST.md`](docs/DELIVERY_CHECKLIST.md).

## Microservicio de clasificación ML

El proyecto también incluye [`ml-service/`](ml-service/), un microservicio Python que conserva el pipeline solicitado: `TfidfVectorizer(ngram_range=(1, 2))` y `LogisticRegression(max_iter=1000)`. Su documentación de instalación, ejecución y endpoints está en [`ml-service/README.md`](ml-service/README.md).
