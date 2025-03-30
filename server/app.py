from flask import Flask, request, jsonify
from flask_cors import CORS
from anomaly_detector import detect_spending_anomalies

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow all origins, headers, methods, with credentials support

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

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
