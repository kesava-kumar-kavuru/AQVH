import time
import joblib
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_score, recall_score, f1_score

def train_svm(X_train, y_train, random_seed=42):
    """Trains a classical SVM model."""
    print("\nTraining Classical SVM...")
    print("-" * 40)
    
    svm_poly = SVC(kernel='poly', degree=3, random_state=random_seed, probability=True)
    
    start_time = time.time()
    svm_poly.fit(X_train, y_train)
    training_time = time.time() - start_time
    
    print(f"✓ SVM (Poly) trained in {training_time:.4f} seconds")
    return svm_poly, training_time

def evaluate_svm(model, X_test, y_test):
    """Evaluates the trained SVM model."""
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    print(f"  Accuracy:  {accuracy:.6f}\n  Precision: {precision:.6f}\n  Recall:    {recall:.6f}\n  F1-Score:  {f1:.6f}")
    print("\nSVM (Poly) Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("\nSVM (Poly) Classification Report:\n", classification_report(y_test, y_pred))

def save_model(model, file_path='backend/models/svm_model.pkl'):
    """Saves the trained model to a file."""
    joblib.dump(model, file_path)
    print(f"✓ Model saved to {file_path}")