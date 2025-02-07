from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from ultralytics import YOLO
import requests
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = YOLO("best.pt")  # Load the YOLO model
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload():
    try:
        image = request.files.get("image")
        image_url = request.form.get("imageURL")
        
        if image:
            image_path = os.path.join(UPLOAD_FOLDER, image.filename)
            image.save(image_path)
        elif image_url:
            response = requests.get(image_url)
            if response.status_code != 200:
                return jsonify({"error": "Failed to fetch image from URL"}), 400
            image = Image.open(BytesIO(response.content))
            image_path = os.path.join(UPLOAD_FOLDER, "downloaded.jpg")
            image.save(image_path)
        else:
            return jsonify({"error": "No image provided"}), 400

        # Run YOLO inference
        results = model(image_path)

        for result in results:
            print("Boxes:", result.boxes)
            print("Masks:", result.masks)
            print("Keypoints:", result.keypoints)
            print("Probs:", result.probs)
            print("OBB:", result.obb)
            result.save(filename="result.jpg")
        
        return jsonify({"message": "Image processed successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
