#! /usr/bin/env python
import rospy
from website_services.srv import BehaviorControlMsg, BehaviorControlMsgResponse
from std_srvs.srv import SetBool, SetBoolResponse

def my_callback(request):
    #change robot listing mode depening on request.data (true or false)
    print "Callback switch_listeningmodel has been called"
    if request.command == "pause":
        print request
        return BehaviorControlMsgResponse(
            success = True,
            message = "behavior is now " + request.command + "d"
        )
    elif request.command == "stop":
        print request
        return BehaviorControlMsgResponse(
            success = True,
            message = "behavior is now " + request.command + "ped"
        )
    elif request.command == "continue":
        print request
        return BehaviorControlMsgResponse(
            success = True,
            message = "behavior is now " + request.command + "d"
        )
    else:
        print "request.command did not match one of the three options (stop, pause, continue)"
        return BehaviorControlMsgResponse(
            success = False,
            message = "request.command did not match one of the three options (stop, pause, continue)"
        )


rospy.init_node('behavior_control_node')
#my_service = rospy.Service('/behavior_control', SetBool , my_callback)
my_service = rospy.Service('/behavior_control', BehaviorControlMsg , my_callback)
rospy.spin()
