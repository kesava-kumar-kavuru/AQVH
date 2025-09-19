from pre_processing import load_data, preprocess_for_ml
from classical_model import train_svm, evaluate_svm, save_model as save_svm
from quantum_model import prepare_data_for_vqc, train_vqc, evaluate_vqc, save_model_weights as save_vqc_weights

if __name__ == "__main__":
    data = load_data()
    X_train, X_test, y_train, y_test = preprocess_for_ml(data)

    X_train_small, y_train_small, X_test_small, y_test_small, selected_features = prepare_data_for_vqc(X_train, y_train, X_test, y_test)
    
    svm_model, _ = train_svm(X_train_small, y_train_small)
    evaluate_svm(svm_model, X_test_small, y_test_small)
    save_svm(svm_model)

    vqc_model, _ = train_vqc(X_train_small, y_train_small, num_features=X_train_small.shape[1])
    evaluate_vqc(vqc_model, X_test_small, y_test_small, selected_features)
    # Save the VQC model's weights
    save_vqc_weights(vqc_model)