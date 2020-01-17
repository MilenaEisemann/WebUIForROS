#! /usr/bin/env python
import rospy
from std_srvs.srv import Empty, EmptyResponse

def my_callback(request):
    print "Callback website_control has been called"
    return EmptyResponse() 

rospy.init_node('service_client')
my_service = rospy.Service('/website_control', Empty , my_callback)
rospy.spin()
