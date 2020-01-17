#!/usr/bin/env python
import rospy
from std_msgs.msg import String
from flexbe_core import EventState, Logger
from flexbe_core.proxy import ProxyPublisher, ProxySubscriberCached
from flexbe_core.proxy import ProxyServiceCaller
from robot_status_message.msg import RobotStatus
from website_services.srv import BehaviorControlMsg, BehaviorControlMsgResponse
from website_services.srv import WebServiceProxyMsg, WebServiceProxyMsgResponse

class WebsiteDummyModalState(EventState):
    '''
	State to demonstrate functionality of webUI. Constantely publishes to /robot_status and also calls the service_proxy to change the shown webpage to the current robot status

	<= failed 			    	If service_proxy does not answer with success
	<= done 				If service_proxy answers with success

	'''
    def __init__(self):
        super(WebsiteDummyModalState, self).__init__(outcomes=['done', 'failed'])
        #self.status_topic = '/web_service_proxy'
	self.status_topic = '/robot_status'
        self.website_service_proxy = '/web_service_proxy'
	self._wait_for_execution = True

        self.current_status_pub = ProxyPublisher({self.status_topic: RobotStatus})

	rospy.wait_for_service(self.website_service_proxy)
	self.client_website_proxy = rospy.ServiceProxy(self.website_service_proxy, WebServiceProxyMsg)

    def execute(self, userdata):
	self.current_status_pub.publish(self.status_topic, self.cmd_status)

        if self._response.success == True and (rospy.Time.now() - self._start_time).to_sec() > 10:
            Logger.loginfo("-------------------------")
	    Logger.loginfo("successfull service_proxy: " + str(self._response.success))
	    Logger.loginfo(self._response.message)
            Logger.loginfo("data:" + self._response.data)
            Logger.loginfo("-------------------------")
            return 'done'
        elif self._response.success == False:
            return 'failed'

    def on_enter(self, userdata):
        self._start_time = rospy.Time.now()
        Logger.loginfo("started website_dummy_state1!")

        self.cmd_status = RobotStatus()
	self.cmd_status.currentTask = '192863'
	self.cmd_status.currentBehaviorStatus = ''
	self.cmd_status.lastTask = '203056'
	self.cmd_status.lastTaskResult = ''
	self.cmd_status.nextTask = '216385'
	self.cmd_status.allActions = ['296881', '296898', '297511']
	self.cmd_status.indexCurrent = 2
	self.cmd_status.actionResults = ['', 'failed']
	self.cmd_status.batteryCapacity = 0.3
	self.cmd_status.batteryVoltage = 0.0
	self.cmd_status.listen = False

	service_call = WebServiceProxyMsg()
	service_call.command = "object"
	self._response = self.client_website_proxy.call(service_call.command)

    def on_exit(self, userdata):
        Logger.loginfo("exit started website_dummy_state1!")

    def on_start(self):
        Logger.loginfo("started website_dummy_state1 ready!")

    def on_stop(self):
	Logger.loginfo("started website_dummy_state1 STOPPED!")

    def scan_callback(self, data):
        self.data = data
