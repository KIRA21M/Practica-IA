# AI Support Engine

Base funcional del reto: un endpoint común para analizar solicitudes mediante un motor tradicional por reglas o un motor generativo conectado a un proveedor real.

## Estructura

```text
src/
  domain/                 Contrato y valores permitidos
  application/            Validación y caso de uso
  engines/                Motor traditional y motor generative
  http/                   Servidor HTTP y endpoint
test/                     Pruebas unitarias mínimas
src/evaluation/           Casos de referencia y comparación de motores
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

El modo `traditional` funciona sin credenciales. Para `generative`, configura `ANTHROPIC_API_KEY` en `.env`; no se simulan respuestas generativas.

## Configuración segura de la API key

La clave nunca debe escribirse en el código, en `README.md` ni en un commit. El MVP usa Claude por defecto mediante la API de Anthropic.

Para ejecución local:

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
