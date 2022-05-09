import cv2
import numpy as np
from djitellopy import tello
import time
from threading import Thread

ESC = 27
keepRecording = True
me = tello.Tello()
me.connect()
print(me.get_battery())
me.streamon()
frame_read = me.get_frame_read()
# frame = me.get_frame_read().frame
#cap = cv2.VideoCapture(1)
def videoRecorder(frame_read, keepRecording):
    # create a VideoWrite object, recoring to ./video.avi
    # 创建一个VideoWrite对象，存储画面至./video.avi
    height, width, _ = frame_read.frame.shape
    video = cv2.VideoWriter('video.avi', cv2.VideoWriter_fourcc(*'XVID'), 30, (width, height))
    while keepRecording:
        video.write(frame_read.frame)
        time.sleep(1 / 30)
    video.release()
# Drone detects face then take off
def main():
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
            recorder = Thread(target=videoRecorder(frame_read, keepRecording))
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
main()