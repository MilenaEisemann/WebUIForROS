#! /usr/bin/env python
import rospy
from std_srvs.srv import Trigger, TriggerResponse

def callback(request):
    print "service triggered"
    return TriggerResponse(
        success=True,
        message="Robot successfully shut down"
    )

rospy.init_node('service_client_emergency_stop')
my_service = rospy.Service('/trigger_emergency_stop', Trigger , callback)
rospy.spin()
