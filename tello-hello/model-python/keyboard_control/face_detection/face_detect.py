import cv2
import numpy as np
from djitellopy import tello
import time
from threading import Thread

from scipy.misc import face
ESC = 27
keepRecording = True

me = tello.Tello()
me.connect()
print(me.get_battery())
me.streamon()
frame_read = me.get_frame_read()
# frame = me.get_frame_read().frame
# me.takeoff()
# me.send_rc_control(0, 0, 25, 0)
# time.sleep(2.2)
w, h = 360, 240
fbRange = [6200, 6800]
pid = [0.4, 0.4, 0]
pError = 0
def findFace(img):
    faceCascade = cv2.CascadeClassifier("./haarcascades/haarcascade_frontalface_default.xml")
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(imgGray, 1.2, 8)
    myFaceListC = []
    myFaceListArea = []
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cx = x + w // 2
        cy = y + h // 2
        area = w * h
        cv2.circle(img, (cx, cy), 5, (0, 255, 0), cv2.FILLED)
        myFaceListC.append([cx, cy])
        myFaceListArea.append(area)
    if len(myFaceListArea) != 0:
        i = myFaceListArea.index(max(myFaceListArea))
        return img, [myFaceListC[i], myFaceListArea[i]]
    else:
        return img, [[0, 0], 0]

def trackFace(info, w, pid, pError):
    area = info[1]
    x, y = info[0]
    fb = 0
    error = x - w // 2
    speed = pid[0] * error + pid[1] * (error - pError)
    speed = int(np.clip(speed, -100, 100))
    if area > fbRange[0] and area < fbRange[1]:
        fb = 0
    elif area > fbRange[1]:
        fb = -20
    elif area < fbRange[0] and area != 0:
        fb = 20
    if x == 0:
        speed = 0
        error = 0
    #print(speed, fb)
    me.send_rc_control(0, fb, 0, speed)
    return error
# define the countdown func.
def countdown(t):
    while t:
        time.sleep(1)
        t -= 1 
    print('Fire in the hole!!')
    return 0
#cap = cv2.VideoCapture(1)

# Resources: https://github.com/damiafuentes/DJITelloPy/blob/master/examples/record-video.py
def videoRecorder():
    # create a VideoWrite object, recoring to ./video.avi
    # 创建一个VideoWrite对象，存储画面至./video.avi
    height, width, _ = frame_read.frame.shape
    video = cv2.VideoWriter('video.avi', cv2.VideoWriter_fourcc(*'XVID'), 30, (width, height))

    while keepRecording:
        video.write(frame_read.frame)
        time.sleep(1 / 30)

    video.release()

# Drone detects face then take off
# def main():
while True:
    frame = cv2.resize(frame_read.frame, (320, 240))
    frame = cv2.flip(frame_read.frame, 1)
    gray = cv2.cvtColor(frame_read.frame, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier("./haarcascades/haarcascade_frontalface_default.xml")
    faces = faceCascade.detectMultiScale(gray, 1.1, 3)
    for(x, y, w, h) in faces:
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
    # print(faces)
    if len(faces) != 0:
        print("Found a face")
        recorder = Thread(target=videoRecorder)
        recorder.start()
        me.takeoff()
        time.sleep(1)
        # me.move_up(1)
        me.move_down(20)
        time.sleep(1)
        me.rotate_counter_clockwise(360)
        # fly up 2.5 com
        # me.send_rc_control(0, 0, 15, 0)
        # Record 10 seconds
        me.land()
        keepRecording = False
        recorder.join()
    cv2.imshow('video', frame)
    if cv2.waitKey(1) == ESC:
        cv2.destroyAllWindows()
        cv2.waitKey(1)
        # me.land()
        break
# main()