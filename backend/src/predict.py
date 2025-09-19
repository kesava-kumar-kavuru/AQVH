'''import joblib
import numpy as np
import pandas as pd
import json
import pickle
from sklearn.preprocessing import MinMaxScaler

# --- Qiskit imports ---
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_algorithms.optimizers import COBYLA
from qiskit_machine_learning.algorithms.classifiers import VQC
try:
    from qiskit.primitives import StatevectorSampler as Sampler
except ImportError:
    from qiskit.primitives import Sampler

def load_svm_model(file_path='backend/models/svm_model.pkl'):
    """Loads a trained SVM model from a file."""
    return joblib.load(file_path)

def load_vqc_model(weights_path='backend/simulation/vqc_weights.npy', num_features=3):
    """Recreates the VQC model and loads its trained weights."""
    weights = np.load(weights_path)
    vqc = VQC(
        sampler=Sampler(),
        feature_map=ZZFeatureMap(feature_dimension=num_features, reps=2, entanglement='linear'),
        ansatz=RealAmplitudes(num_qubits=num_features, reps=3, entanglement='linear'),
        optimizer=COBYLA(maxiter=0),
        initial_point=weights
    )
    vqc.fit(np.zeros((2, num_features)), np.array([0, 1]))
    return vqc

def preprocess_new_data(new_data_df):
    """Loads preprocessing tools and transforms new data."""
    # Load the list of feature names that the model was trained on
    with open('backend/models/selected_features.json', 'r') as f:
        selected_features = json.load(f)
    print(f"✓ Loaded required features: {selected_features}")

    # Load the scaler
    scaler = joblib.load('backend/models/feature_scaler.pkl')
    print("✓ Loaded fitted scaler")

    # Select the required features from the new data
    data_selected = new_data_df[selected_features]

    # Scale the data using the loaded scaler
    data_scaled = scaler.transform(data_selected)
    
    return data_scaled

if __name__ == "__main__":
    # --- INPUT YOUR NEW DATA HERE ---
    # Data for 2010-01-06
    #new_data_values = [1, 0.932097, 39.6283, 0.740847, -0.383521, 56.3067, -55061.0]
    new_data_values = [1.0, 0.0020550059247607453, 52.877937823725325, 57.20710959575081, -7.2488712866690435, 25.42908076756068, 129977229900]
    #new_data_values = [1.0, 0.003433825908586364, 56.49364034290011, 57.40014046222859, -5.644672336153015, 22.0332509829656, 130615707800]
    #new_data_values = [0.0, 0.001309694445988385, 73.72829491317965, 76.95136881186409, 9.546461004641472, 24.03857125109803, 132329517900]

    # The original feature columns
    original_features = ['sma_crossover', 'price_sma_ratio', 'rsi', 'macd', 'macd_hist', 'adx', 'obv']

    # Create a DataFrame
    new_data_df = pd.DataFrame([new_data_values], columns=original_features)

    print("New data to predict:")
    print(new_data_df)

    # Preprocess the new data
    preprocessed_data = preprocess_new_data(new_data_df)

    # Load the trained models
    svm_model = load_svm_model()
    vqc_model = load_vqc_model()

    # Make predictions
    svm_prediction = svm_model.predict(preprocessed_data)
    vqc_prediction = vqc_model.predict(preprocessed_data)

    print(f"\nSVM Prediction: {svm_prediction}")
    print(f"VQC Prediction: {vqc_prediction}")'''


import joblib
import numpy as np
import pandas as pd
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_algorithms.optimizers import COBYLA
from qiskit_machine_learning.algorithms.classifiers import VQC
from qiskit.primitives import Sampler

# --- 1. Load the VQC Model (with local simulator) ---
def load_vqc_model(weights_path='backend/models/ibm_vqc_weights.npy', num_features=3):
    """Recreates the VQC model and loads its hardware-trained weights."""
    trained_weights = np.load(weights_path)
    feature_map = ZZFeatureMap(feature_dimension=num_features, reps=1, entanglement='linear')
    ansatz = RealAmplitudes(num_qubits=num_features, reps=1, entanglement='linear')

    # Recreate the model with a dummy optimizer and fit call to set the internal state
    vqc = VQC(
        sampler=Sampler(),
        feature_map=feature_map,
        ansatz=ansatz,
        optimizer=COBYLA(maxiter=0),
        initial_point=trained_weights
    )
    vqc.fit(np.zeros((2, num_features)), np.array([0, 1]))
    print("✓ VQC model recreated for local prediction.")
    return vqc

# --- Main execution block ---
if __name__ == "__main__":
    print("🚀 Starting Prediction Engine...")

    # --- 2. Define Your New Data and Feature Names ---
    # The original 7 features the data comes with
    original_features = ['sma_crossover', 'price_sma_ratio', 'rsi', 'macd', 'macd_hist', 'adx', 'obv']
    # Example data for prediction
    #new_data_values = [1, 0.932097, 39.6283, 0.740847, -0.383521, 56.3067, -55061.0]
    #new_data_values = [1.0, 0.0020550059247607453, 52.877937823725325, 57.20710959575081, -7.2488712866690435, 25.42908076756068, 129977229900]
    new_data_values = [1.0, 0.003433825908586364, 56.49364034290011, 57.40014046222859, -5.644672336153015, 22.0332509829656, 130615707800]
    #new_data_values = [1.0, 0.010705066171212743, 65.60805120927137, 64.7866547647427, 1.3934735730888832, 19.10870374477537, 131353865700]
    new_data_df = pd.DataFrame([new_data_values], columns=original_features)
    print("\nOriginal Input Data:")
    print(new_data_df)

    # --- 3. Manually Define the 3 Features the Model Was Trained On ---
    # ⚠️ IMPORTANT: Replace these with the actual 3 features your model used.
    # This is the most critical step to fix the dimension conflict.
    SELECTED_FEATURES = ['rsi', 'adx', 'obv'] # Example, replace with your actual features

    # --- 4. Preprocess the Data ---
    # Select the correct 3 features from the input data
    data_to_scale = new_data_df[SELECTED_FEATURES]
    print(f"\nData after selecting {len(SELECTED_FEATURES)} features:")
    print(data_to_scale)

    # Load the scaler that was fitted on 3 features
    scaler = joblib.load('backend/models/data_scaler_new.pkl')

    # Scale the 3-feature data
    preprocessed_data = scaler.transform(data_to_scale)

    # --- 5. Load Models and Predict ---
    # Note: SVM part is commented out as the model file wasn't provided.
    # svm_model = joblib.load('backend/models/svm_model.pkl')
    # svm_prediction = svm_model.predict(preprocessed_data)

    vqc_model = load_vqc_model()
    vqc_prediction = vqc_model.predict(preprocessed_data)

    # --- 6. Show Results ---
    print("\n" + "="*25)
    print("🔮 PREDICTION RESULTS 🔮")
    # print(f"SVM Prediction: {svm_prediction}")
    print(f"VQC Prediction (Local Sim): {vqc_prediction}")
    print("="*25)