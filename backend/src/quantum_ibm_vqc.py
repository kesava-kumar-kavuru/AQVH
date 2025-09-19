"""
IBM Quantum VQC Model Integration Module
This module provides a function to train and evaluate a Variational Quantum Classifier (VQC) using IBM Quantum hardware via Qiskit Runtime.

Requirements:
- qiskit
- qiskit-ibm-runtime
- qiskit-machine-learning
- scikit-learn

Usage:
from quantum_ibm_vqc import train_ibm_vqc
accuracy, precision, recall, f1, backend_name = train_ibm_vqc(X_train, y_train, n_features=3, n_samples=20, maxiter=10)
"""
import numpy as np
from typing import Tuple

def train_ibm_vqc(X_train, y_train, n_features=3, n_samples=20, maxiter=10, ibm_token=None, ibm_instance=None):
    """
    Train and evaluate a VQC model on IBM Quantum hardware.
    Args:
        X_train: Training features (numpy array or pandas DataFrame)
        y_train: Training labels (numpy array or pandas Series)
        n_features: Number of features to select for quantum circuit
        n_samples: Number of samples to use for fast demo
        maxiter: Maximum optimizer iterations
        ibm_token: IBM Quantum API token (optional, if not already saved)
        ibm_instance: IBM Quantum instance string (optional)
    Returns:
        accuracy, precision, recall, f1, backend_name
    """
    # Imports
    from sklearn.preprocessing import MinMaxScaler
    from sklearn.feature_selection import SelectKBest, f_classif
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
    from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
    from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
    from qiskit_algorithms.optimizers import COBYLA
    from qiskit_machine_learning.algorithms.classifiers import VQC
    import time

    # Save IBM token if provided
    if ibm_token:
        QiskitRuntimeService.save_account(channel="ibm_quantum_platform", token=ibm_token, overwrite=True)
    # Connect to IBM Quantum
    service = QiskitRuntimeService(channel="ibm_quantum_platform", instance=ibm_instance) if ibm_instance else QiskitRuntimeService(channel="ibm_quantum_platform")
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=n_features)
    sampler = Sampler(backend)

    # Data selection and scaling
    selector = SelectKBest(score_func=f_classif, k=n_features)
    X_selected = selector.fit_transform(X_train, y_train)[:n_samples]
    y_selected = np.array(y_train)[:n_samples]
    if len(np.unique(y_selected)) > 2:
        y_selected = (y_selected == y_selected[0]).astype(int)
    scaler = MinMaxScaler(feature_range=(0, np.pi))
    X_quantum = scaler.fit_transform(X_selected)

    # Quantum circuit setup
    feature_map = ZZFeatureMap(feature_dimension=n_features, reps=1, entanglement='linear')
    ansatz = RealAmplitudes(num_qubits=n_features, reps=1, entanglement='linear')
    optimizer = COBYLA(maxiter=maxiter)
    pm = generate_preset_pass_manager(backend=backend, optimization_level=0)
    feature_map_hw = pm.run(feature_map)
    ansatz_hw = pm.run(ansatz)
    initial_params = np.random.uniform(0, 2*np.pi, ansatz_hw.num_parameters)

    # VQC training
    vqc = VQC(
        sampler=sampler,
        feature_map=feature_map_hw,
        ansatz=ansatz_hw,
        optimizer=optimizer,
        initial_point=initial_params
    )
    train_start = time.time()
    vqc.fit(X_quantum, y_selected)
    train_time = time.time() - train_start

    # Evaluation (use same data for demo)
    y_pred = vqc.predict(X_quantum[:min(10, len(X_quantum))])
    y_true = y_selected[:min(10, len(y_selected))]
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_true, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    backend_name = backend.name

    print(f"IBM Quantum VQC Results:")
    print(f"  Backend: {backend_name}")
    print(f"  Accuracy: {accuracy:.3f}")
    print(f"  Precision: {precision:.3f}")
    print(f"  Recall: {recall:.3f}")
    print(f"  F1 Score: {f1:.3f}")
    print(f"  Training time: {train_time:.1f}s")

    return accuracy, precision, recall, f1, backend_name
