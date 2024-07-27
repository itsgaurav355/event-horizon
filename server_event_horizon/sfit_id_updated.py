import sys
from ultralytics import YOLO
import cv2
from PIL import Image
import easyocr
import numpy as np
import json

# Create a reader to do OCR.
reader = easyocr.Reader(['en'])  # pass in the language you want to detect

# Load a pretrained YOLOv8n model
model = YOLO("sfit_id.pt")

# Run inference on the source
results = model(source=[sys.argv[1]], conf=0.5)

# Load the image using OpenCV
image = cv2.imread(sys.argv[1])

# Create a list to store the extracted text
extracted_text = []
labels = results[0].names

for result in results:
    boxes = result.boxes.cpu().numpy()
    xyxys = boxes.data

    for xyxy in xyxys:
        roi = image[int(xyxy[1]):int(xyxy[3]), int(xyxy[0]):int(xyxy[2])]

        if int(xyxy[5]) == 4:
            roi = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
            # Define the size of the border to remove
            border_size = 10  # adjust this value as needed
            # Crop the image to remove the border
            roi_np = roi[border_size:-border_size, border_size:-border_size]
            roi_pil = Image.fromarray(roi_np)
            roi_pil.save('profile-pic.jpg')

        else:
            roi_pil = Image.fromarray(roi)
            # Convert PIL Image to numpy array
            roi_np = np.array(roi_pil)
            # Use EasyOCR to extract text
            result = reader.readtext(roi_np)

            for detection in result:
                text = detection[1]
                print(json.dumps({labels[int(xyxy[5])]: text.upper()}))
