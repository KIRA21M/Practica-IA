# ML Support Classifier

Microservicio Python para clasificar tickets mediante TF-IDF y regresión logística.

## Ejecutar

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Para ejecutar exactamente el entrenamiento solicitado y mostrar el reporte:

```powershell
python train.py
```

El script también imprime la matriz de confusión y calcula el score aproximado para `Encontré datos de otros clientes`.

## Endpoints

- `GET /health`: estado, dataset y categorías cargadas.
- `GET /metrics`: reporte de clasificación sobre el conjunto de prueba.
- `POST /predict`: clasifica un mensaje.

```powershell
Invoke-RestMethod -Method Post http://localhost:8000/predict `
  -ContentType 'application/json' `
  -Body '{"message":"Alguien entró a mi cuenta sin autorización"}'
```

Respuesta esperada:

```json
{
  "category": "SECURITY",
  "confidence": 0.72,
  "model": "tfidf-logistic-regression"
}
```

El dataset se puede reemplazar con `TICKETS_PATH`, siempre que conserve las columnas `message` y `category`.
