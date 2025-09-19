import yfinance as yf
import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

# --- Import feature engineering functions from prepare_dataset.ipynb ---
# For simplicity, we redefine the functions here. In production, consider moving them to a shared module.
def safe_series_operation(data):
    if isinstance(data, pd.Series):
        return data, True
    elif isinstance(data, pd.DataFrame):
        if data.shape[1] == 1:
            return data.iloc[:, 0], True
        else:
            return data.iloc[:, 0], True
    elif isinstance(data, np.ndarray):
        if data.ndim == 1:
            return pd.Series(data), True
        elif data.ndim == 2 and data.shape[1] == 1:
            return pd.Series(data.flatten()), True
        else:
            return pd.Series(data.flatten()), True
    else:
        return pd.Series(data), True

def safe_calculate_sma(data, window):
    series, success = safe_series_operation(data)
    if success and len(series) > window:
        return series.rolling(window=window, min_periods=1).mean(), True
    else:
        return pd.Series(index=data.index if hasattr(data, 'index') else range(len(data))), False

def safe_calculate_rsi(data, window=14):
    series, success = safe_series_operation(data)
    if not success or len(series) < window * 2:
        return pd.Series(index=data.index if hasattr(data, 'index') else range(len(data))), False
    delta = series.diff()
    gain = delta.where(delta > 0, 0).rolling(window=window, min_periods=1).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window, min_periods=1).mean()
    loss_safe = loss.replace(0, 0.000001)
    rs = gain / loss_safe
    rsi = 100 - (100 / (1 + rs))
    rsi = rsi.fillna(50).replace([np.inf, -np.inf], 50)
    return rsi, True

def safe_calculate_macd(data, fast=12, slow=26, signal=9):
    series, success = safe_series_operation(data)
    if not success or len(series) < slow * 2:
        empty_series = pd.Series(index=data.index if hasattr(data, 'index') else range(len(data)))
        return empty_series, empty_series, empty_series, False
    exp1 = series.ewm(span=fast, adjust=False).mean()
    exp2 = series.ewm(span=slow, adjust=False).mean()
    macd_line = exp1 - exp2
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    macd_line = macd_line.fillna(0)
    signal_line = signal_line.fillna(0)
    histogram = histogram.fillna(0)
    return macd_line, signal_line, histogram, True

def safe_calculate_adx(high, low, close, window=14):
    high_series, high_ok = safe_series_operation(high)
    low_series, low_ok = safe_series_operation(low)
    close_series, close_ok = safe_series_operation(close)
    if not (high_ok and low_ok and close_ok) or len(close_series) < window * 3:
        empty_series = pd.Series(index=close.index if hasattr(close, 'index') else range(len(close)))
        return empty_series, empty_series, empty_series, False
    tr1 = high_series - low_series
    tr2 = abs(high_series - close_series.shift(1))
    tr3 = abs(low_series - close_series.shift(1))
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1, skipna=True)
    high_diff = high_series.diff()
    low_diff = low_series.shift(1) - low_series
    dm_plus = pd.Series(np.where((high_diff > low_diff) & (high_diff > 0), high_diff, 0), index=high_series.index)
    dm_minus = pd.Series(np.where((low_diff > high_diff) & (low_diff > 0), low_diff, 0), index=low_series.index)
    atr = tr.rolling(window=window, min_periods=1).mean()
    atr_safe = atr.replace(0, 0.000001)
    di_plus = 100 * (dm_plus.rolling(window=window, min_periods=1).mean() / atr_safe)
    di_minus = 100 * (dm_minus.rolling(window=window, min_periods=1).mean() / atr_safe)
    di_sum = di_plus + di_minus
    di_sum_safe = di_sum.replace(0, 0.000001)
    dx = 100 * abs(di_plus - di_minus) / di_sum_safe
    adx = dx.rolling(window=window, min_periods=1).mean()
    adx = adx.fillna(25).replace([np.inf, -np.inf], 25)
    di_plus = di_plus.fillna(25).replace([np.inf, -np.inf], 25)
    di_minus = di_minus.fillna(25).replace([np.inf, -np.inf], 25)
    return adx, di_plus, di_minus, True

def safe_calculate_obv(close, volume):
    close_series, close_ok = safe_series_operation(close)
    volume_series, volume_ok = safe_series_operation(volume)
    if not (close_ok and volume_ok) or len(close_series) < 2:
        return pd.Series(index=close.index if hasattr(close, 'index') else range(len(close))), False
    price_change = close_series.diff()
    obv_change = pd.Series(np.where(price_change > 0, volume_series,
                                   np.where(price_change < 0, -volume_series, 0)),
                          index=close_series.index)
    obv = obv_change.cumsum()
    obv = obv.fillna(0)
    return obv, True

def collect_ftse100_data(symbol='^FTSE', days=30, save_path='ftse100_raw.csv'):
    end = datetime.today()
    start = end - timedelta(days=days+5)  # +5 to ensure 30 trading days
    df = yf.download(symbol, start=start.strftime('%Y-%m-%d'), end=end.strftime('%Y-%m-%d'))
    df = df.tail(days)
    df.to_csv(save_path)
    return df

def prepare_features(df, save_path='ftse100_prepared.csv'):
    # Calculate features
    sma_50, _ = safe_calculate_sma(df['Close'], 50)
    sma_200, _ = safe_calculate_sma(df['Close'], 200)
    df['sma_50'] = sma_50
    df['sma_200'] = sma_200
    df['sma_crossover'] = df['sma_50'] - df['sma_200']
    df['sma_crossover'] = df['sma_crossover'].fillna(0)
    # Ensure sma_200_safe is a Series, not a DataFrame
    sma_200_safe = df['sma_200']
    if isinstance(sma_200_safe, pd.DataFrame):
        sma_200_safe = sma_200_safe.iloc[:, 0]
    sma_200_safe = sma_200_safe.replace(0, np.nan)
    df['price_sma_ratio'] = df['Close'] / sma_200_safe
    df['price_sma_ratio'] = df['price_sma_ratio'].fillna(1.0)
    rsi, _ = safe_calculate_rsi(df['Close'])
    df['rsi'] = rsi
    macd, _, macd_hist, _ = safe_calculate_macd(df['Close'])
    df['macd'] = macd
    df['macd_hist'] = macd_hist
    adx, _, _, _ = safe_calculate_adx(df['High'], df['Low'], df['Close'])
    df['adx'] = adx
    obv, _ = safe_calculate_obv(df['Close'], df['Volume'])
    df['obv'] = obv
    features = ['sma_crossover', 'price_sma_ratio', 'rsi', 'macd', 'macd_hist', 'adx', 'obv']
    for col in features:
        if col in df.columns:
            df[col] = df[col].fillna(0)
    df[features].to_csv(save_path, index=False)
    return df[features]

def main():
    # 1. Collect FTSE100 data
    raw_path = os.path.join(os.path.dirname(__file__), 'ftse100_raw.csv')
    prepared_path = os.path.join(os.path.dirname(__file__), 'ftse100_prepared.csv')
    df = collect_ftse100_data(save_path=raw_path)
    print(f"Raw FTSE100 data saved to {raw_path}")
    # 2. Prepare features
    features_df = prepare_features(df, save_path=prepared_path)
    print(f"Prepared features saved to {prepared_path}")
    # 3. Predict using predict.py
    import subprocess
    result = subprocess.run(['python', '../src/predict.py', prepared_path], capture_output=True, text=True)
    print(result.stdout)

if __name__ == "__main__":
    main()
