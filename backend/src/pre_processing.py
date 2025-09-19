import pandas as pd
import numpy as np
import os

def load_data(file_path='backend/data/dataset.csv'):
    """Loads the enriched dataset from the specified file path."""
    if os.path.exists(file_path):
        print(f"Loading enriched dataset from {file_path}...")
        data = pd.read_csv(file_path, index_col=0, parse_dates=True)
        print(f"✓ Loaded dataset with features and target: {data.shape}")
        return data
    else:
        raise FileNotFoundError(f"Dataset not found at {file_path}. Please run the full data pipeline first.")

def preprocess_for_ml(data):
    """Preprocesses the data for machine learning models."""
    print("\nPREPROCESSING DATA FOR MACHINE LEARNING")
    print("-" * 50)

    required_features = ['sma_crossover', 'price_sma_ratio', 'rsi', 'macd', 'macd_hist', 'adx', 'obv']
    for feature in required_features:
        if feature not in data.columns:
            data[feature] = 0
            print(f"  Warning: {feature} missing, filled with zeros")

    for col in required_features + ['target']:
        if col in data.columns:
            nan_count = data[col].isnull().sum()
            if nan_count > 0:
                fill_value = data[col].median() if col != 'target' else 0
                if pd.isna(fill_value):
                    fill_value = 0
                data[col] = data[col].fillna(fill_value)
                print(f"  Filled {nan_count} NaN values in {col}")
            inf_count = np.isinf(data[col]).sum()
            if inf_count > 0:
                data[col] = data[col].replace([np.inf, -np.inf], [data[col].quantile(0.99), data[col].quantile(0.01)])
                print(f"  Replaced {inf_count} infinite values in {col}")

    X = data[required_features].copy()
    y = data['target'].copy()

    split_ratio = 0.8
    split_index = int(len(X) * split_ratio)
    X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
    y_train, y_test = y.iloc[:split_index], y.iloc[split_index:]

    print(f"  Training samples: {len(X_train)}")
    print(f"  Test samples: {len(X_test)}")

    return X_train, X_test, y_train, y_test