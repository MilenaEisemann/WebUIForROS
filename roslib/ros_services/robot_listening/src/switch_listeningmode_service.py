#! /usr/bin/env python
import rospy
from std_srvs.srv import SetBool, SetBoolResponse

def my_callback(request):
    #change robot listing mode depening on request.data (true or false)
    print "Callback switch_listeningmodel has been called"
    return SetBoolResponse(
        success= True,
        message="switched robotlistening to " + str(request.data)
    )

rospy.init_node('service_client_listeningmode')
my_service = rospy.Service('/switch_listeningmode', SetBool , my_callback)
rospy.spin()
