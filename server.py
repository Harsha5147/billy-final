from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# NVIDIA API configuration
NVIDIA_API_ENDPOINT = 'https://api.nvidia.com/v1/chat'

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        api_key = data.get('apiKey')

        if not user_message or not api_key:
            return jsonify({'error': 'Missing message or API key'}), 400

        # Call NVIDIA API
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        nvidia_payload = {
            'messages': [{
                'role': 'user',
                'content': user_message
            }]
        }
        
        response = requests.post(
            NVIDIA_API_ENDPOINT, 
            headers=headers, 
            json=nvidia_payload
        )
        
        if response.status_code != 200:
            return jsonify({
                'error': f'NVIDIA API error: {response.text}'
            }), response.status_code

        return jsonify({'response': response.json().get('response', '')})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)