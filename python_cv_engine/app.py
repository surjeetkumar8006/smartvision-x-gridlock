import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import easyocr
import base64

app = Flask(__name__)
CORS(app)

# Initialize models
try:
    print("Loading YOLOv8 model...")
    # Load a pretrained YOLOv8n model
    model = YOLO('yolov8n.pt') 
    print("Loading EasyOCR...")
    reader = easyocr.Reader(['en'], gpu=False)
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")

def determine_violation(boxes, class_names):
    """
    A simplified logic to determine violation type based on detected objects.
    In a real scenario, this would use a custom trained YOLO model for specific violations.
    """
    detected_classes = [class_names[int(box.cls)] for box in boxes]
    
    if 'car' in detected_classes or 'truck' in detected_classes or 'bus' in detected_classes:
        return "Speeding / Unauthorized Vehicle"
    elif 'motorcycle' in detected_classes:
        if detected_classes.count('person') > 2:
            return "Triple Riding"
        else:
            return "Helmet Non-compliance"
    
    return "Unknown Violation"

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    file = request.files['image']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    try:
        # Run YOLOv8 inference
        results = model(img)
        result = results[0]
        
        # Read plates using EasyOCR (on the whole image for simplicity, usually crop to vehicle)
        plate_text = "UNKNOWN"
        ocr_results = reader.readtext(img)
        
        # Filter OCR results that look like a license plate (alphanumeric, length > 4)
        for (bbox, text, prob) in ocr_results:
            clean_text = ''.join(e for e in text if e.isalnum())
            if len(clean_text) >= 4 and prob > 0.3:
                plate_text = clean_text.upper()
                break
                
        # Draw bounding boxes and determine violation
        annotated_img = result.plot()
        
        violation_type = "No Violation Detected"
        confidence = 0.0
        
        if len(result.boxes) > 0:
            violation_type = determine_violation(result.boxes, result.names)
            confidence = float(result.boxes[0].conf[0])
            
        # Encode annotated image to base64
        _, buffer = cv2.imencode('.jpg', annotated_img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            "success": True,
            "plate_number": plate_text,
            "violation_type": violation_type,
            "confidence": confidence,
            "annotated_image": f"data:image/jpeg;base64,{img_base64}"
        })
        
    except Exception as e:
        print(f"Processing error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
