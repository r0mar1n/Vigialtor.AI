from flask import Flask, request, jsonify
import lightgbm as lgb
import joblib
from urllib.parse import urlparse

app = Flask(__name__)

# Load the model (ensure the model file path is correct)
model = joblib.load('models/lightgbm_phishing_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data['url']

    # Extract features from the URL
    features = extract_features(url)

    # Predict the probability
    probability = model.predict([features])[0]

    # Define a threshold for phishing detection
    threshold = 0.5

    # Classify based on threshold
    prediction = 1 if probability > threshold else 0

    # Prepare the response message
    result = "Phishing URL detected!" if prediction == 1 else "This is a safe URL."

    # Return the prediction, probability, and message
    return jsonify({
        'prediction': prediction,
        'probability': probability,
        'message': result
    })

def extract_features(url):
    # Your feature extraction logic goes here
    parsed_url = urlparse(url)
    domain = parsed_url.hostname if parsed_url.hostname else ''

    # Example feature extraction, include all other necessary features as per your model
    features = {
        'length_url': len(url),
        'length_hostname': len(domain),
        'ip': 0,  # Placeholder for IP check
        'nb_dots': url.count('.'),
        'nb_hyphens': url.count('-'),
        'nb_at': url.count('@'),
        'nb_qm': url.count('?'),
        'nb_and': url.count('&'),
        'nb_or': url.count('|'),
        'nb_eq': url.count('='),
        'nb_underscore': url.count('_'),
        'nb_tilde': url.count('~'),
        'nb_percent': url.count('%'),
        'nb_slash': url.count('/'),
        'nb_star': url.count('*'),
        'nb_colon': url.count(':'),
        'nb_comma': url.count(','),
        'nb_semicolumn': url.count(';'),
        'nb_dollar': url.count('$'),
        'nb_space': url.count(' '),
        'nb_www': domain.count('www.'),  # Count of 'www.' in the hostname
        'nb_com': url.count('.com'),
        'nb_dslash': url.count('//'),
        'http_in_path': 1 if 'http' in parsed_url.path else 0,
        'https_token': 1 if 'https' in parsed_url.path else 0,
        'ratio_digits_url': sum(c.isdigit() for c in url) / len(url) if url else 0,
        'ratio_digits_host': sum(c.isdigit() for c in domain) / len(domain) if domain else 0,
        'punycode': 0,  # Placeholder for Punycode check
        'port': parsed_url.port if parsed_url.port else 0,
        'tld_in_path': 1 if domain in parsed_url.path else 0,
        'tld_in_subdomain': 0,  # Placeholder for TLD in subdomain
        'abnormal_subdomain': 0,  # Placeholder for abnormal subdomain check
        'nb_subdomains': len(domain.split('.')) - 1,
        'prefix_suffix': 0,  # Placeholder for prefix/suffix check
        'random_domain': 0,  # Placeholder for random domain check
        'shortening_service': 0,  # Placeholder for shortening service check
        'path_extension': 0,  # Placeholder for path extension check
        'nb_redirection': 0,  # Placeholder for redirection check
        'nb_external_redirection': 0,  # Placeholder for external redirection check
        'length_words_raw': 0,  # Placeholder for length of words check
        'char_repeat': 0,  # Placeholder for character repeat check
        'shortest_words_raw': 0,  # Placeholder for shortest words check
        'shortest_word_host': 0,  # Placeholder for shortest word in host
        'shortest_word_path': 0,  # Placeholder for shortest word in path
        'longest_words_raw': 0,  # Placeholder for longest words check
        'longest_word_host': 0,  # Placeholder for longest word in host
        'longest_word_path': 0,  # Placeholder for longest word in path
        'avg_words_raw': 0,  # Placeholder for average words check
        'avg_word_host': 0,  # Placeholder for average word in host
        'avg_word_path': 0,  # Placeholder for average word in path
        'phish_hints': 0,  # Placeholder for phishing hints check
        'domain_in_brand': 0,  # Placeholder for domain in brand check
        'brand_in_subdomain': 0,  # Placeholder for brand in subdomain check
        'brand_in_path': 0,  # Placeholder for brand in path check
        'suspecious_tld': 0,  # Placeholder for suspicious TLD check
        'statistical_report': 0,  # Placeholder for statistical report check
        'nb_hyperlinks': 0,  # Placeholder for number of hyperlinks
        'ratio_intHyperlinks': 0,  # Placeholder for ratio of internal hyperlinks
        'ratio_extHyperlinks': 0,  # Placeholder for ratio of external hyperlinks
        'ratio_nullHyperlinks': 0,  # Placeholder for ratio of null hyperlinks
        'nb_extCSS': 0,  # Placeholder for number of external CSS
        'ratio_intRedirection': 0,  # Placeholder for ratio of internal redirection
        'ratio_extRedirection': 0,  # Placeholder for ratio of external redirection
        'ratio_intErrors': 0,  # Placeholder for ratio of internal errors
        'ratio_extErrors': 0,  # Placeholder for ratio of external errors
        'login_form': 0,  # Placeholder for login form check
        'external_favicon': 0,  # Placeholder for external favicon check
        'links_in_tags': 0,  # Placeholder for links in tags check
        'submit_email': 0,  # Placeholder for email submission check
        'ratio_intMedia': 0,  # Placeholder for ratio of internal media
        'ratio_extMedia': 0,  # Placeholder for ratio of external media
        'sfh': 0,  # Placeholder for server form handler check
        'iframe': 0,  # Placeholder for iframe check
        'popup_window': 0,  # Placeholder for popup window check
        'safe_anchor': 0,  # Placeholder for safe anchor check
        'onmouseover': 0,  # Placeholder for onmouseover check
        'right_clic': 0,  # Placeholder for right-click check
        'empty_title': 0,  # Placeholder for empty title check
        'domain_in_title': 0,  # Placeholder for domain in title check
        'domain_with_copyright': 0,  # Placeholder for copyright check
        'whois_registered_domain': 0,  # Placeholder for whois registration check
        'domain_registration_length': 100,  # Placeholder
        'domain_age': 100,  # Placeholder
        'web_traffic': 1000000,  # Placeholder
        'dns_record': 1,  # Placeholder
        'google_index': 1,  # Placeholder
        'page_rank': 5  # Placeholder
    }
    
    # Ensure the extracted features match the ones used during training
    return list(features.values())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)

