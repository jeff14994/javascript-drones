# 動態人臉檢測
import cv2
ESC = 27
face_cascade = cv2.CascadeClassifier('/Users/hungyuchuan/Desktop/近期代辦/資策會課程/10-opencv/opencv/data/haarcascades/haarcascade_frontalface_default.xml')
# face_cascade = cv2.CascadeClassifier('/opencv/data/lbpcascade_frontalface_opencv.xml')
cap = cv2.VideoCapture(1)
cv2.namedWindow('video', cv2.WINDOW_NORMAL)
while True:
    ret, frame = cap.read()
    frame = cv2.resize(frame, (320, 240))
    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 3)
    for(x, y, w, h) in faces:
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
    cv2.imshow('video', frame)
    if cv2.waitKey(1) == ESC:
        cv2.destroyAllWindows()
        cv2.waitKey(1)
        break