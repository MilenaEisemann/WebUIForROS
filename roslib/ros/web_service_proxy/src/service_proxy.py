#! /usr/bin/env python
import rospy
from std_srvs.srv import SetBool, SetBoolResponse

def my_callback(request):
    print "Callback web_service_proxy has been called"
    return SetBoolResponse(
        success= True,
        message="website responded, desired action executed without problem"
    )

rospy.init_node('web_service_proxy_node')
my_service = rospy.Service('/web_service_proxy', SetBool , my_callback)
rospy.spin()
