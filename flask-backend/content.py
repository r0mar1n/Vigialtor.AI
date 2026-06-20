from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import tldextract
import re
import pandas as pd
import xgboost as xgb
import joblib
import numpy as np # Import numpy

app = Flask(__name__)

# Load trained XGBoost model
model = xgb.Booster()
model.load_model(r"models\xgboost_phishing_model.json")

# Define expected feature order
expected_features = [
    'NumSensitiveWords', 'PctExtHyperlinks', 'PctExtResourceUrls', 'ExtFavicon',
    'InsecureForms', 'RelativeFormAction', 'ExtFormAction', 'AbnormalFormAction',
    'PctNullSelfRedirectHyperlinks', 'FrequentDomainNameMismatch', 'FakeLinkInStatusBar',
    'RightClickDisabled', 'PopUpWindow', 'SubmitInfoToEmail', 'IframeOrFrame',
    'MissingTitle', 'ExtMetaScriptLinkRT', 'PctExtNullSelfRedirectHyperlinksRT'
]

def extract_features(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        html_content = response.text
    except requests.exceptions.RequestException:
        return None  # Return None if URL is unreachable

    soup = BeautifulSoup(html_content, 'html.parser')
    features = {}

    # Number of sensitive words in URL
    sensitive_words = ["bank", "secure", "account", "login", "update", "password", "verify"]
    features['NumSensitiveWords'] = sum(1 for word in sensitive_words if word in url.lower())

    # Percentage of external hyperlinks
    all_links = [a['href'] for a in soup.find_all('a', href=True)]
    external_links = [link for link in all_links if tldextract.extract(link).domain != tldextract.extract(url).domain]
    features['PctExtHyperlinks'] = len(external_links) / len(all_links) if all_links else 0

    # Percentage of external resource URLs (scripts, CSS, images)
    resources = [tag['src'] for tag in soup.find_all(['script', 'img', 'link']) if tag.has_attr('src')]
    ext_resources = [res for res in resources if tldextract.extract(res).domain != tldextract.extract(url).domain]
    features['PctExtResourceUrls'] = len(ext_resources) / len(resources) if resources else 0

    # External Favicon
    favicon = soup.find('link', rel=re.compile('icon', re.I))
    features['ExtFavicon'] = 1 if favicon and 'href' in favicon.attrs and tldextract.extract(favicon['href']).domain != tldextract.extract(url).domain else 0

    # Forms security
    forms = soup.find_all('form')
    features['InsecureForms'] = sum(1 for form in forms if not form.get('action', '').startswith('https'))
    features['RelativeFormAction'] = sum(1 for form in forms if form.get('action', '').startswith('/'))
    features['ExtFormAction'] = sum(1 for form in forms if tldextract.extract(form.get('action', '')).domain != tldextract.extract(url).domain)
    features['AbnormalFormAction'] = sum(1 for form in forms if not form.get('action'))

    # Null self-redirect hyperlinks
    features['PctNullSelfRedirectHyperlinks'] = sum(1 for a in soup.find_all('a', href=True) if a['href'] == "#") / len(all_links) if all_links else 0

    # Additional Features
    features['PopUpWindow'] = 1 if 'window.open' in html_content else 0
    features['SubmitInfoToEmail'] = 1 if 'mailto:' in html_content else 0
    features['IframeOrFrame'] = 1 if soup.find(['iframe', 'frame']) else 0
    features['MissingTitle'] = 1 if not soup.title or not soup.title.string.strip() else 0

    # 🔹 Missing Features (Default to 0)
    missing_features = [
        'FrequentDomainNameMismatch', 'FakeLinkInStatusBar', 'RightClickDisabled',
        'ExtMetaScriptLinkRT', 'PctExtNullSelfRedirectHyperlinksRT'
    ]
    for feature in missing_features:
        features[feature] = 0  # Assign default value (0)

    return features

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "Missing URL"}), 400

    # Extract features
    features = extract_features(url)

    if features is None:
        return jsonify({"error": "URL Unreachable"}), 400

    # Ensure feature order
    feature_df = pd.DataFrame([features], columns=expected_features)
    
    # Convert to XGBoost DMatrix
    dmatrix = xgb.DMatrix(feature_df)
    
    # Make prediction
    prediction = model.predict(dmatrix)[0]
    confidence = round(float(prediction), 2) # Convert prediction to standard float

    # Interpret result (Flipped Labels)
    result = "Legitimate" if prediction > 0.5 else "Phishing" #changed here.

    return jsonify({
        "url": url,
        "prediction": result,
        "confidence": confidence
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)

    