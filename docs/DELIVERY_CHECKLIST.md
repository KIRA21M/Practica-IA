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
| Comparación generativa | Pendiente de ejecución válida | Requiere el secreto `API` en `Practica-IA` |
| README de ejecución | Completo | `README.md` |
| CI y auditoría | Completo | `.github/workflows/ci.yml` |

## Evidencia observada

La última ejecución publicada en `Practica-IA` confirmó los tests, la sintaxis y la auditoría. El motor tradicional procesó 10 casos con 100% de formato válido, 100% de categoría correcta y 100% de resultado conjunto correcto.

La misma ejecución mostró `generative.completed = 0`: el workflow se marcó verde porque la comparación generativa se omitía cuando no encontraba la credencial. Esto ya fue corregido: el CI ahora falla explícitamente si `API` no está disponible y exige una ejecución real de Claude.

Ejecución de referencia: [GitHub Actions](https://github.com/KIRA21M/Practica-IA/actions/runs/43329796651).

## Criterio de cierre

Para cerrar la entrega, agregar `API` como Repository secret en `KIRA21M/Practica-IA` y volver a ejecutar el workflow. El artefacto `comparison-results` debe contener 10 casos con `status: completed` tanto en `traditional` como en `generative`.

## Conclusión técnica

La comparación final aún no puede determinar qué motor funciona mejor porque la evidencia generativa válida está pendiente. El motor tradicional ya es reproducible y alcanzó 100% en los 10 casos de referencia. La integración con Claude está implementada, pero el proyecto no debe presentar una conclusión comparativa hasta ejecutar los mismos casos con una credencial real y registrar sus resultados. El workflow ahora bloquea este estado incompleto para evitar una entrega falsamente aprobada.
