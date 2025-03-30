from flask import Flask, request, jsonify
from flask_cors import CORS
from anomaly_detector import detect_spending_anomalies
import pandas as pd
from ml.model_pipeline import ModelPipeline
# from ml.model_inference import predict_future_amounts


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
            
        # predictor = predict_future_amounts(dates, model_path)
        
        # Get predictions
        predictions = predictor.predict(dates)
        
        # Convert DataFrame to dictionary format
        predictions_dict = predictions.set_index('datetime')['amount'].to_dict()
        
        # Format response
        response = {
            'user_id': data['user_id'],
            'predictions': {
                str(date): float(amount) 
                for date, amount in predictions_dict.items()
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
