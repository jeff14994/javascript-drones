from djitellopy import tello
import KeyPressModule as kp
from time import sleep

kp.init()
me = tello.Tello()
me.connect()
# print(me.get_battery())
def getKeyboardInput():
    lr, fb, ud, yv = 0, 0, 0, 0
    speed = 50
    if kp.getKey("LEFT"): 
        lr = -speed
    elif kp.getKey("RIGHT"): 
        lr = speed

    if kp.getKey("UP"): 
        fb = speed
    elif kp.getKey("DOWN"): 
        fb = -speed

    if kp.getKey("w"):
        ud = speed
    elif kp.getKey("s"): 
        ud = -speed

    if kp.getKey("a"):
        yv = -speed
    elif kp.getKey("d"): 
        yv = speed

    if kp.getKey("q"): 
        me.land()
        sleep(3)

    if kp.getKey("e"): 
        me.takeoff()

    return [lr, fb, ud, yv]

if __name__ == '__main__':
    while True:
        print('Battery: ', me.get_battery(), ' %')
        vals = getKeyboardInput()

        me.send_rc_control(vals[0], vals[1], vals[2], vals[3])

        sleep(0.05)