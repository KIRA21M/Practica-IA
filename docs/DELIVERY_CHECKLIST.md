# Checklist de entrega

## Estado de los entregables

| Entregable | Estado | Evidencia o ubicación |
|---|---|---|
| Motor tradicional | Completo | `src/engines/traditionalEngine.js` |
| Motor generativo real | Implementado | `src/engines/generativeEngine.js` |
| API `POST /api/analyze` | Completo | `src/http/server.js` |
| Validación y manejo de errores | Completo | `src/application/validateRequest.js`, `test/http.test.js` |
| Casos comparativos | Completo | `src/evaluation/referenceCases.js` |
| Comparación tradicional | Verificada | 10/10 casos, formato y clasificación correctos |
| Comparación generativa local | Completo | Ollama en CI con `gemma3:1b` y 10 casos |
| Clasificador ML local | Completo | `ml-service/`, 200 registros y endpoint `/predict` |
| README de ejecución | Completo | `README.md` |
| CI y auditoría | Completo | `.github/workflows/ci.yml` |

## Evidencia observada

La última ejecución publicada en `Practica-IA` confirmó los tests, la sintaxis y la auditoría. El motor tradicional procesó 10 casos con 100% de formato válido, 100% de categoría correcta y 100% de resultado conjunto correcto.

La comparación generativa local se ejecuta en CI con Ollama y no requiere API key ni saldo. La integración con Claude sigue disponible como proveedor cloud opcional.

Ejecución de referencia: [GitHub Actions](https://github.com/KIRA21M/Practica-IA/actions/runs/43329796651).

## Criterio de cierre

Para trabajar localmente sin costo, instala Ollama, ejecuta `ollama pull gemma3:4b` y deja activo `ollama serve`, como se documenta en `README.md`.

## Conclusión técnica

El MVP funcional usa el motor tradicional y el clasificador ML local sin costos de API. El microservicio entrenado con 200 registros alcanzó 100% de accuracy en su partición de prueba y clasificó correctamente el caso de seguridad. La generación con Ollama permite mantener respuestas contextuales sin depender de saldo externo; Claude queda como proveedor cloud opcional.
