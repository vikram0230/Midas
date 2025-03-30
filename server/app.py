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
        

@app.route('/api/oracle/predict', methods=['POST'])
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
        
        
@app.route('/api/oracle/predict_params', methods=['POST'])
def predict_params():
    try:
        data = request.json
        print(data)
        # Validate required fields
        if not all(key in data for key in ['user_id', 'time_range', 'scenario']):
            return jsonify({
                'error': 'Missing required parameters. Please provide user_id, time_range, and scenario.'
            }), 400
        
        # Parse time range
        try:
            start_date, end_date = data['time_range'].split('_to_')
            dates = pd.date_range(start=start_date, end=end_date, freq='D')
        except (ValueError, KeyError):
            return jsonify({
                'error': 'Invalid time_range format. Expected format: {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}'
            }), 400
            
        print(dates)
            
        # Get predictions by category
        predictions_by_category = predictor.predict_by_category(dates)
        print(predictions_by_category)
        # Calculate base predictions (sum of all categories for each date)
        predictions_without_param = {}
        for date in dates:
            date_str = str(date.date())  # Convert to YYYY-MM-DD string format
            predictions_without_param[date_str] = float(sum(
                predictions.get(date, 0) 
                for predictions in predictions_by_category.values()
            ))

        # Start with modified predictions equal to base predictions
        predictions_with_param = predictions_without_param.copy()
        print(predictions_with_param)
        
        # Apply scenario modifications
        scenario = data['scenario']
        
        # Handle skip_expense
        if scenario.get('skip_expense', {}).get('active'):
            category = scenario['skip_expense']['category']
            if category in predictions_by_category:
                for date in dates:
                    date_str = str(date.date())
                    predictions_with_param[date_str] -= predictions_by_category[category].get(date, 0)
        
        # Handle new_expense
        if scenario.get('new_expense', {}).get('active'):
            category = scenario['new_expense']['category']
            percent = float(scenario['new_expense']['percent'])
            if category in predictions_by_category:
                for date in dates:
                    date_str = str(date.date())
                    predictions_with_param[date_str] += predictions_by_category[category].get(date, 0) * percent
        
        # Handle reduce_expense
        if scenario.get('reduce_expense', {}).get('active'):
            category = scenario['reduce_expense']['category']
            percent = float(scenario['reduce_expense']['percent'])
            if category in predictions_by_category:
                for date in dates:
                    date_str = str(date.date())
                    predictions_with_param[date_str] -= predictions_by_category[category].get(date, 0) * percent

        # Format response
        response = {
            'user_id': data['user_id'],
            'predictions_without_param': predictions_without_param,
            'predictions_with_param': predictions_with_param
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