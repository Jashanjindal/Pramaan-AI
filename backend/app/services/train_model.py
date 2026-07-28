import os
import csv
import json
import joblib
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import RidgeClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score

def find_dataset_path():
    """
    Locates spam.csv in the workspace root or parent directories.
    """
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "spam.csv")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "spam.csv")),
        os.path.abspath("spam.csv"),
        os.path.abspath("../spam.csv"),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            return path
    raise FileNotFoundError("Could not find spam.csv in expected directory paths.")

def load_spam_dataset(dataset_path: str):
    """
    Parses spam.csv into lists of texts and binary labels (0=ham, 1=spam).
    """
    texts = []
    labels = []
    
    encodings = ['utf-8', 'latin-1', 'iso-8859-1']
    content_rows = []
    
    for encoding in encodings:
        try:
            with open(dataset_path, mode='r', encoding=encoding) as f:
                reader = csv.reader(f)
                header = next(reader, None)
                for row in reader:
                    if len(row) >= 2:
                        cat = row[0].strip().lower()
                        msg = row[1].strip()
                        if cat in ['ham', 'spam'] and msg:
                            content_rows.append((cat, msg))
            if content_rows:
                break
        except Exception:
            continue
            
    if not content_rows:
        raise ValueError(f"Failed to read valid rows from {dataset_path}")
        
    for cat, msg in content_rows:
        labels.append(1 if cat == 'spam' else 0)
        texts.append(msg)
        
    return texts, np.array(labels)

def train_and_save_model(dataset_path: str = None):
    if dataset_path is None:
        dataset_path = find_dataset_path()
        
    print(f"[RIDS ML Engine] Loading dataset from: {dataset_path}")
    texts, labels = load_spam_dataset(dataset_path)
    
    total_samples = len(labels)
    spam_count = int(np.sum(labels))
    ham_count = total_samples - spam_count
    
    print(f"[RIDS ML Engine] Dataset loaded successfully: {total_samples} samples ({ham_count} ham, {spam_count} spam)")
    
    # Train / Test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.20, random_state=42, stratify=labels
    )
    
    # Transformer TF-IDF Feature Extraction + Calibrated Ridge Classifier Pipeline
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=15000,
        sublinear_tf=True,
        stop_words='english'
    )
    
    base_ridge = RidgeClassifier(alpha=1.0)
    calibrated_ridge = CalibratedClassifierCV(estimator=base_ridge, cv=5, method='sigmoid')
    
    model_pipeline = Pipeline([
        ('tfidf', vectorizer),
        ('classifier', calibrated_ridge)
    ])
    
    print("[RIDS ML Engine] Training TF-IDF Transformer + Ridge Classifier model...")
    model_pipeline.fit(X_train, y_train)
    
    # Predict on test dataset
    y_pred = model_pipeline.predict(X_test)
    y_proba = model_pipeline.predict_proba(X_test)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_proba))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    print("=" * 60)
    print(" [RIDS ML Engine - Model Performance Metrics] ")
    print(f"  Accuracy:  {acc * 100:.2f}%")
    print(f"  Precision: {prec * 100:.2f}%")
    print(f"  Recall:    {rec * 100:.2f}%")
    print(f"  F1-Score:  {f1 * 100:.2f}%")
    print(f"  ROC-AUC:   {auc * 100:.2f}%")
    print(f"  Confusion Matrix: TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")
    print("=" * 60)
    
    # Save artifacts
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "spam_ridge_model.joblib")
    meta_path = os.path.join(models_dir, "model_metadata.json")
    
    joblib.dump(model_pipeline, model_path)
    print(f"[RIDS ML Engine] Saved model binary to: {model_path}")
    
    metadata = {
        "model_type": "TF-IDF Transformer + Calibrated Ridge Classifier",
        "dataset_name": "spam.csv",
        "total_samples": total_samples,
        "ham_samples": ham_count,
        "spam_samples": spam_count,
        "test_split_ratio": 0.20,
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": cm,
        "trained_at": datetime.now().isoformat()
    }
    
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
        
    print(f"[RIDS ML Engine] Saved model metadata to: {meta_path}")
    return metadata, model_pipeline

if __name__ == "__main__":
    train_and_save_model()
