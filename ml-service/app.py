import os
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = Path(os.getenv("TICKETS_PATH", BASE_DIR / "tickets.csv"))


class PredictionRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)


def load_dataset():
    if not DATASET_PATH.exists():
        raise RuntimeError(f"No se encontró el dataset: {DATASET_PATH}")

    data = pd.read_csv(DATASET_PATH)
    required_columns = {"message", "category"}
    if not required_columns.issubset(data.columns):
        raise RuntimeError("tickets.csv debe contener las columnas message y category")
    data = data.dropna(subset=["message", "category"])
    if data["category"].nunique() < 2:
        raise RuntimeError("El dataset debe contener al menos dos categorías")
    return data


data = load_dataset()
X_train, X_test, y_train, y_test = train_test_split(
    data["message"],
    data["category"],
    test_size=0.2,
    stratify=data["category"],
    random_state=42,
)

model = Pipeline(
    [
        ("vectorizer", TfidfVectorizer(ngram_range=(1, 2))),
        ("classifier", LogisticRegression(max_iter=1000)),
    ]
)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
evaluation = classification_report(
    y_test,
    predictions,
    output_dict=True,
    zero_division=0,
)

app = FastAPI(title="AI Support ML Classifier", version="1.0.0")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "dataset": str(DATASET_PATH.name),
        "samples": len(data),
        "categories": sorted(data["category"].unique().tolist()),
    }


@app.get("/metrics")
def metrics():
    return evaluation


@app.post("/predict")
def predict(request: PredictionRequest):
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message no puede estar vacío")

    category = model.predict([message])[0]
    probabilities = model.predict_proba([message])[0]
    classes = model.named_steps["classifier"].classes_
    confidence = float(max(probabilities))

    return {
        "category": category,
        "confidence": round(confidence, 4),
        "model": "tfidf-logistic-regression",
    }
