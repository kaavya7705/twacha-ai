from ultralytics import YOLO

# Load a model
model = YOLO("best.pt")  # pretrained YOLO11n model

# Run batched inference on a list of images
results = model(["hi.jpg"],show=True)

for result in results:
    boxes = result.boxes  # Boxes object for bounding box outputs
    
    masks = result.masks  # Masks object for segmentation masks outputs
    keypoints = result.keypoints  # Keypoints object for pose outputs
    probs = result.probs  # Probs object for classification outputs
    obb = result.obb  # Oriented boxes object for OBB outputs
    print(boxes, masks, keypoints, probs, obb)
    result.show()  # display to screen
    result.save(filename="result.jpg") 
