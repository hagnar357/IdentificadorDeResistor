from ultralytics import YOLO
from flask import Flask, request, jsonify
import cv2
import base64
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/classe", methods=["POST"])
def classe():
    req = request.json
    img_str = req['image']
    #decode the image
    jpg_original = base64.b64decode(img_str)
    jpg_as_np = np.frombuffer(jpg_original, dtype=np.uint8)
    img = cv2.imdecode(jpg_as_np, flags=1)

    results = model(img)

    json = {'objects':[]}

    for r in results:
        for boxe in r.boxes:
            obj = {}
            obj['xywh'] = boxe.xywh.tolist()[0]
            obj['cls'] = labels[boxe.cls.item()]
            obj['conf'] = boxe.conf.item()
            json['objects'].append(obj)

    response = jsonify(json)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response, 201

if __name__ == "__main__":
    model = YOLO('YOLO/best.pt')

    labels = model.names
    app.run(debug=True)
