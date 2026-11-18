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
| Comparación generativa cloud | Opcional | Requiere `RUN_CLOUD_COMPARISON=true` y el secreto `API` |
| Clasificador ML local | Completo | `ml-service/`, 200 registros y endpoint `/predict` |
| README de ejecución | Completo | `README.md` |
| CI y auditoría | Completo | `.github/workflows/ci.yml` |

## Evidencia observada

La última ejecución publicada en `Practica-IA` confirmó los tests, la sintaxis y la auditoría. El motor tradicional procesó 10 casos con 100% de formato válido, 100% de categoría correcta y 100% de resultado conjunto correcto.

La comparación cloud mostró `generative.completed = 0` porque la cuenta de Anthropic no tenía crédito. El CI base ya no depende de ese servicio: valida Node y el microservicio ML. La integración generativa real sigue disponible con Claude u Ollama local.

Ejecución de referencia: [GitHub Actions](https://github.com/KIRA21M/Practica-IA/actions/runs/43329796651).

## Criterio de cierre

Para ejecutar la comparación cloud, configura `RUN_CLOUD_COMPARISON=true` como Repository variable y `API` como Repository secret. Para trabajar sin costo, instala Ollama y usa el modo generativo local documentado en `README.md`.

## Conclusión técnica

El MVP funcional usa el motor tradicional y el clasificador ML local sin costos de API. El microservicio entrenado con 200 registros alcanzó 100% de accuracy en su partición de prueba y clasificó correctamente el caso de seguridad. La generación con Ollama permite mantener respuestas contextuales sin depender de saldo externo; Claude queda como proveedor cloud opcional.
