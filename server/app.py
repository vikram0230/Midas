import sys
sys.path.append('.')
from flask import Flask, request, jsonify
from flask_cors import CORS
from anomaly_detector import detect_spending_anomalies
import pandas as pd

# Import the feature_transformer module and add it to sys.modules
# This tells Python where to find it when unpickling
from ml import feature_transformer
sys.modules['feature_transformer'] = feature_transformer

# Now import ModelPipeline and load the model
from ml.model_pipeline import ModelPipeline

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow all origins, headers, methods, with credentials support

model_path = 'models/oracle_v1'
predictor = ModelPipeline.load(model_path)


@app.route('/api/anomalies', methods=['POST'])
def get_anomalies():
    try:
        data = request.json
        
        if not all(key in data for key in ['userId', 'startDate', 'endDate']):
            return jsonify({
                'error': 'Missing required parameters. Please provide userId, startDate, and endDate.'
            }), 400
        
        result = detect_spending_anomalies(
            user_id=data['userId'],
            start_date=data['startDate'],
            end_date=data['endDate']
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500
        

@app.route('/api/predict', methods=['GET'])
def predict_spending():
    try:
        data = request.json
        
        if not all(key in data for key in ['user_id', 'time_range']):
            return jsonify({
                'error': 'Missing required parameters. Please provide user_id and time_range.'
            }), 400
        
        # Parse time range (format: "2025-04-01_to_2025-04-30")
        try:
            start_date, end_date = data['time_range'].split('_to_')
            dates = pd.date_range(start=start_date, end=end_date, freq='D')
        except ValueError:
            return jsonify({
                'error': 'Invalid time_range format. Expected format: YYYY-MM-DD_to_YYYY-MM-DD'
            }), 400
            
        # Get predictions - returns a dictionary with dates as keys
        predictions = predictor.predict(dates)
        
        # Format response
        response = {
            'user_id': data['user_id'],
            'predictions': {
                str(date): float(amount) 
                for date, amount in predictions.items()
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)