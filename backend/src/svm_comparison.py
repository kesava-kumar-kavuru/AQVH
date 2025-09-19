from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def train_svm_poly(X_train, y_train, degree=3, random_seed=42):
    svm_poly = SVC(kernel='poly', degree=degree, random_state=random_seed, probability=True)
    svm_poly.fit(X_train, y_train)
    return svm_poly

def evaluate_svm(model, X_test, y_test):
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    return acc, prec, rec, f1, y_pred