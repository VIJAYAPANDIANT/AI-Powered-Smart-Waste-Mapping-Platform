from flask import Flask, request, jsonify
import os
import joblib
import numpy as np

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return jsonify({"success": True, "message": "AI Service is running successfully on Vercel!"})

# Load trained RandomForest model with a fallback mechanism
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'waste_model.pkl')
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("Trained RandomForest model successfully loaded.")
    except Exception as e:
        print(f"Error loading RandomForest model: {e}. Using calculation fallback.")
else:
    print("Model file not found. Falling back to analytical logic.")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json() or {}
        
        latitude = float(data.get('latitude', 37.7749))
        longitude = float(data.get('longitude', -122.4194))
        month = int(data.get('month', 6))
        population_density = float(data.get('population_density', 15000))
        complaint_count = float(data.get('complaint_count', 10))

        if model is not None:
            features = np.array([[latitude, longitude, month, population_density, complaint_count]])
            prediction = model.predict(features)[0]
        else:
            # Analytical mathematical approximation fallback
            prediction = (complaint_count * 0.08) + (population_density * 0.0001)

        # Categorize into Risk Levels: Low, Medium, High, Critical
        risk_level = "Low"
        if prediction >= 6.0:
            risk_level = "Critical"
        elif prediction >= 4.0:
            risk_level = "High"
        elif prediction >= 2.0:
            risk_level = "Medium"

        return jsonify({
            "success": True,
            "predicted_waste_volume_tons": round(float(prediction), 3),
            "predicted_risk_level": risk_level,
            "engine": "RandomForestRegressor" if model is not None else "Analytical Formula Fallback"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@app.route('/route-optimize', methods=['POST'])
def route_optimize():
    try:
        data = request.get_json() or {}
        points = data.get('points', []) # Expects list of [latitude, longitude]
        start_point = data.get('start', [37.7749, -122.4194]) # SF Center start

        if not points:
            return jsonify({"success": True, "optimized_route": [], "total_distance_km": 0, "fuel_saved_liters": 0})

        # Calculate distances using simple Euclidean distance (for microservice route optimization)
        def dist(p1, p2):
            return np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2) * 111.0 # 1 degree ~ 111km

        # Nearest neighbor shortest path route solver
        unvisited = list(points)
        current = start_point
        route = [start_point]
        total_distance = 0

        while unvisited:
            next_pt = min(unvisited, key=lambda x: dist(current, x))
            total_distance += dist(current, next_pt)
            route.append(next_pt)
            unvisited.remove(next_pt)
            current = next_pt

        # Estimate fuel savings (simulating optimized routing saving approx 25% compared to random route)
        unoptimized_distance = total_distance * 1.35
        # Assume consumption of 0.4 liters fuel per km for utility cleanup truck
        fuel_saved = (unoptimized_distance - total_distance) * 0.4

        return jsonify({
            "success": True,
            "optimized_route": route,
            "total_distance_km": round(total_distance, 2),
            "fuel_saved_liters": round(fuel_saved, 2),
            "estimated_completion_minutes": round(total_distance * 3.5, 1) # ~17km/h urban speed + loading delay
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@app.route('/hotspots', methods=['POST'])
def hotspots():
    try:
        data = request.get_json() or {}
        reports = data.get('reports', [])
        
        if not reports:
            return jsonify({"success": True, "hotspots": []})

        grid_counts = {}
        for r in reports:
            coords = r.get('location', {}).get('coordinates', [])
            if len(coords) == 2:
                lat = round(coords[1], 3)
                lng = round(coords[0], 3)
                key = f"{lat},{lng}"
                grid_counts[key] = grid_counts.get(key, 0) + 1

        hotspot_list = []
        for key, count in grid_counts.items():
            if count >= 2:
                lat, lng = map(float, key.split(','))
                
                # Predict risk levels for hotspots based on historical counts
                risk = "Low"
                if count >= 5:
                    risk = "Critical"
                elif count >= 3:
                    risk = "High"
                elif count >= 2:
                    risk = "Medium"

                hotspot_list.append({
                    "latitude": lat,
                    "longitude": lng,
                    "incident_density": count,
                    "risk_level": risk
                })

        hotspot_list.sort(key=lambda x: x['incident_density'], reverse=True)

        return jsonify({
            "success": True,
            "hotspots": hotspot_list,
            "total_clustered_hotspots": len(hotspot_list)
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.get_json() or {}
        waste_type = data.get('waste_type', 'Other')
        description = data.get('description', '').lower()

        priority = "Medium"
        reasons = []

        if "hazardous" in description or waste_type == "Hazardous":
            priority = "High"
            reasons.append("Toxic materials flagged")
        elif "blocked" in description or "blocking" in description:
            priority = "High"
            reasons.append("Public pathway blocked")
        elif "smell" in description or "odor" in description or waste_type == "Organic":
            priority = "Medium"
            reasons.append("Organic decomposition hazard")
        else:
            priority = "Low"
            reasons.append("Non-hazardous heap")

        return jsonify({
            "success": True,
            "classified_priority": priority,
            "audit_trail": reasons,
            "category_assigned": waste_type
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
