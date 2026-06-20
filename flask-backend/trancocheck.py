from flask import Flask, request, jsonify
import pandas as pd
import tldextract

app = Flask(__name__)

# Load Tranco list once
tranco_file = r"models\top-1m.csv"  # Update with your file path
df = pd.read_csv(tranco_file, header=None, names=["Domain"], dtype=str)
tranco_domains = set(df["Domain"].str.strip().str.lower())

# Extract domain function
def extract_domain(url):
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}".lower() if extracted.suffix else extracted.domain.lower()

@app.route("/check_tranco", methods=["POST"])
def check_tranco():
    data = request.json
    url = data.get("url")
    domain = extract_domain(url)

    return jsonify({"safe": domain in tranco_domains})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)

