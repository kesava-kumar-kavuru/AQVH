import numpy as np
import time
import json
import joblib
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_algorithms.optimizers import COBYLA
try:
    from qiskit.primitives import StatevectorSampler as Sampler
except ImportError:
    from qiskit.primitives import Sampler
from qiskit_machine_learning.algorithms.classifiers import VQC

def prepare_data_for_vqc(X_train, y_train, X_test, y_test):
    """Selects top features, scales data, and saves the selector/scaler."""
    print("\nPreparing data for Quantum Classifier...")
    print("-" * 50)
    
    # Fit the feature selector
    selector = SelectKBest(score_func=f_classif, k=3)
    selector.fit(X_train, y_train)
    
    # Get the names of the top 3 features
    selected_features = list(X_train.columns[selector.get_support()])
    print(f"  ✓ Selected top 3 features: {selected_features}")

    # --- SAVE THE SELECTED FEATURE NAMES ---
    with open('backend/models/selected_features.json', 'w') as f:
        json.dump(selected_features, f)
    print("  ✓ Selected feature names saved to models/selected_features.json")

    # Transform the data to have only the selected features
    X_train_selected = X_train[selected_features]
    X_test_selected = X_test[selected_features]
    
    # Fit the scaler ONLY on the training data
    scaler = MinMaxScaler(feature_range=(0, np.pi))
    scaler.fit(X_train_selected)

    # --- SAVE THE FITTED SCALER ---
    joblib.dump(scaler, 'backend/models/feature_scaler.pkl')
    print("  ✓ Fitted scaler saved to models/feature_scaler.pkl")

    # Scale both training and test data
    X_train_scaled = scaler.transform(X_train_selected)
    X_test_scaled = scaler.transform(X_test_selected)
    
    # Take subsets for training/testing
    X_train_small = X_train_scaled[:300]
    y_train_small = y_train.iloc[:300].values
    X_test_small = X_test_scaled[:50]
    y_test_small = y_test.iloc[:50].values
    
    print(f"  Using deterministic subset: {len(X_train_small)} train, {len(X_test_small)} test samples")
    return X_train_small, y_train_small, X_test_small, y_test_small, selected_features

# The rest of the functions (train_vqc, evaluate_vqc, save_model_weights) remain the same.
def train_vqc(X_train, y_train, num_features):
    print("\nTraining Variational Quantum Classifier...")
    # (Implementation is the same as before)
    ansatz = RealAmplitudes(num_qubits=num_features, reps=3, entanglement='linear')
    vqc = VQC(
        sampler=Sampler(),
        feature_map=ZZFeatureMap(feature_dimension=num_features, reps=2, entanglement='linear'),
        ansatz=ansatz,
        optimizer=COBYLA(maxiter=100),
        initial_point=np.random.uniform(0, 2*np.pi, ansatz.num_parameters)
    )
    start_time = time.time()
    vqc.fit(X_train, y_train)
    training_time = time.time() - start_time
    print(f"✓ VQC training completed in {training_time:.2f} seconds!")
    return vqc, training_time

def evaluate_vqc(model, X_test, y_test, selected_features):
    print("\nEvaluating VQC...")
    # (Implementation is the same as before)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"  Accuracy:  {accuracy:.6f}")
    print(classification_report(y_test, y_pred))

def save_model_weights(model, file_path='backend/models/vqc_weights.npy'):
    """Saves the trained model's weights to a file."""
    np.save(file_path, model.weights)
    print(f"✓ VQC weights saved to {file_path}")


'''import numpy as np
import time
import json
import joblib
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_algorithms.optimizers import COBYLA
try:
    from qiskit.primitives import StatevectorSampler as Sampler
except ImportError:
    from qiskit.primitives import Sampler
from qiskit_machine_learning.algorithms.classifiers import VQC

def prepare_data_for_vqc(X_train, y_train, X_test, y_test):
    """Selects top features, scales data, and saves the selector/scaler."""
    print("\nPreparing data for Quantum Classifier...")
    print("-" * 50)
    
    # Fit the feature selector
    selector = SelectKBest(score_func=f_classif, k=3)
    selector.fit(X_train, y_train)
    
    # Get the names of the top 3 features
    selected_features = list(X_train.columns[selector.get_support()])
    print(f"  ✓ Selected top 3 features: {selected_features}")

    # --- SAVE THE SELECTED FEATURE NAMES ---
    with open('backend/models/selected_features.json', 'w') as f:
        json.dump(selected_features, f)
    print("  ✓ Selected feature names saved to models/selected_features.json")

    # Transform the data to have only the selected features
    X_train_selected = X_train[selected_features]
    X_test_selected = X_test[selected_features]
    
    # Fit the scaler ONLY on the training data
    scaler = MinMaxScaler(feature_range=(0, np.pi))
    scaler.fit(X_train_selected)

    # --- SAVE THE FITTED SCALER ---
    joblib.dump(scaler, 'backend/models/feature_scaler.pkl')
    print("  ✓ Fitted scaler saved to models/feature_scaler.pkl")

    # Scale both training and test data
    X_train_scaled = scaler.transform(X_train_selected)
    X_test_scaled = scaler.transform(X_test_selected)
    
    # Take subsets for training/testing
    X_train_small = X_train_scaled[:300]
    y_train_small = y_train.iloc[:300].values
    X_test_small = X_test_scaled[:50]
    y_test_small = y_test.iloc[:50].values
    
    print(f"  Using deterministic subset: {len(X_train_small)} train, {len(X_test_small)} test samples")
    return X_train_small, y_train_small, X_test_small, y_test_small, selected_features

# The rest of the functions (train_vqc, evaluate_vqc, save_model_weights) remain the same.
def train_vqc(X_train, y_train, num_features):
    print("\nTraining Variational Quantum Classifier...")
    # (Implementation is the same as before)
    ansatz = RealAmplitudes(num_qubits=num_features, reps=3, entanglement='linear')
    vqc = VQC(
        sampler=Sampler(),
        feature_map=ZZFeatureMap(feature_dimension=num_features, reps=2, entanglement='linear'),
        ansatz=ansatz,
        optimizer=COBYLA(maxiter=100),
        initial_point=np.random.uniform(0, 2*np.pi, ansatz.num_parameters)
    )
    start_time = time.time()
    vqc.fit(X_train, y_train)
    training_time = time.time() - start_time
    print(f"✓ VQC training completed in {training_time:.2f} seconds!")
    return vqc, training_time

def evaluate_vqc(model, X_test, y_test, selected_features):
    print("\nEvaluating VQC...")
    # (Implementation is the same as before)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"  Accuracy:  {accuracy:.6f}")
    print(classification_report(y_test, y_pred))

def save_model_weights(model, file_path='backend/models/vqc_weights.npy'):
    """Saves the trained model's weights to a file."""
    np.save(file_path, model.weights)
    print(f"✓ VQC weights saved to {file_path}")'''