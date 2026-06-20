import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

TRANCO_API = "http://127.0.0.1:5001/check_tranco"
URL_MODEL_API = "http://127.0.0.1:5002/predict"
CONTENT_MODEL_API = "http://127.0.0.1:5003/predict"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # Step 1: Check Tranco API
    try:
        tranco_response = requests.post(TRANCO_API, json={"url": url}).json()
        print(f"Tranco API Response: {tranco_response}")
        if tranco_response.get("safe", False):
            return jsonify({"url": url, "decision": "Legitimate"})
    except requests.RequestException as e:
        print(f"Tranco API Error: {e}")

    # Step 2: Check URL Model API
    try:
        url_model_response = requests.post(URL_MODEL_API, json={"url": url}).json()
        print(f"URL Model API Response: {url_model_response}")
        if url_model_response.get("prediction") == 1:  # If phishing, return immediately
            return jsonify({"url": url, "decision": "Phishing"})
    except requests.RequestException as e:
        print(f"URL Model API Error: {e}")

    # Step 3: Check Content Model API
    try:
        content_model_response = requests.post(CONTENT_MODEL_API, json={"url": url}).json()
        print(f"Content Model API Response: {content_model_response}")
        final_decision = "Phishing" if content_model_response.get("prediction") == "Phishing" else "Legitimate"
        return jsonify({"url": url, "decision": final_decision})
    except requests.RequestException as e:
        print(f"Content Model API Error: {e}")
        return jsonify({"error": "Failed to analyze URL"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
