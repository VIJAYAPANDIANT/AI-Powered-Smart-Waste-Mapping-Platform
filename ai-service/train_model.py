import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def train_model():
    dataset_path = os.path.join(os.path.dirname(__file__), 'sample_dataset.csv')
    model_path = os.path.join(os.path.dirname(__file__), 'waste_model.pkl')

    print(f"Reading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)

    # Features and Target
    X = df[['latitude', 'longitude', 'month', 'population_density', 'complaint_count']]
    y = df['waste_volume']

    print("Initializing RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)

    print("Fitting model to data...")
    model.fit(X, y)

    print(f"Saving trained model to {model_path}...")
    joblib.dump(model, model_path)
    print("Model training successfully complete!")

if __name__ == '__main__':
    train_model()
    
# Provide dummy mock fallback in case python runtime lacks model
