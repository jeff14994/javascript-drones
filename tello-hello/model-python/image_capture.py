from djitellopy import tello

import cv2

me = tello.Tello()
me.connect()
print(me.get_battery())
me.streamon()

while True:
    print(me.get_battery())
    img = me.get_frame_read().frame
    img = cv2.resize(img, (720, 480))
    cv2.imshow("Image", img)
    cv2.waitKey(1)