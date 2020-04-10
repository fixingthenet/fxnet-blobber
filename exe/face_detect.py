#!/usr/bin/env python
import cv2 as cv
import numpy
import sys

imName=sys.argv[1] # "sample/fixtures/family.jpg"
cvNet = cv.dnn.readNetFromTensorflow('data/opencv_face_detector_uint8.pb',
                                     'data/opencv_face_detector.pbtxt')

boxColor = (256, 0, 0)
extraBox=0.00

img = cv.imread(imName)
height, width, channels = img.shape
resized = cv.resize(img, (300, 300))
blob = cv.dnn.blobFromImage(resized, 1.0, (300, 300), [104, 117, 123], swapRB=True)

cvNet.setInput(blob)
detections = cvNet.forward()
bboxes = []
for i in range(detections.shape[2]):
    confidence = detections[0, 0, i, 2]
    if confidence > 0.6:
      x1 = int((detections[0, 0, i, 3]-extraBox) * width)
      y1 = int((detections[0, 0, i, 4]-extraBox) * height)
      x2 = int((detections[0, 0, i, 5]+extraBox) * width)
      y2 = int((detections[0, 0, i, 6]+extraBox) * height)
#      print(x1,y1,x2,y2)
      cv.rectangle(img, (x1, y1), (x2, y2) , boxColor,2)

success, buffer = cv.imencode(".jpg",img)
buffer.tofile(sys.argv[2])

#cv.imwrite(sys.argv[2],img, 'jpeg')
