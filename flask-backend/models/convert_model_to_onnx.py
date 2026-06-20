import onnxmltools
import lightgbm as lgb

# Load the LightGBM model
model = lgb.Booster(model_file='lightgbm_phishing_model.txt')  # Path to your model file

# Convert the LightGBM model to ONNX
onnx_model = onnxmltools.convert_lightgbm(model, name='LightGBM Phishing Model')

# Save the ONNX model
with open('lightgbm_phishing_model.onnx', 'wb') as f:
    f.write(onnx_model.SerializeToString())

print("Model successfully converted to ONNX and saved as lightgbm_phishing_model.onnx")
