#!/usr/bin/env python
import rospy
from flexbe_core import EventState, Logger
from flexbe_core.proxy import ProxyPublisher, ProxySubscriberCached
from geometry_msgs.msg import Twist
from robot_status_message.msg import RobotStatus

class TestPublisherState(EventState):
    '''
	Driving state for a ground robot. This state allows the robot to drive forward a certain distance
    at a specified velocity/ speed.

	-- speed 	float 	Speed at which to drive the robot
    -- travel_dist float   How far to drive the robot before leaving this state
    -- obstacle_dist float Distance at which to determine blockage of robot path

	<= failed 			    If behavior is unable to ready on time
	<= done 				Example for a failure outcome.

	'''
    def __init__(self):
        super(TestPublisherState, self).__init__(outcomes=['done'])
        self.vel_topic = '/cmd_vel'
	self.status_topic = '/robot_status'

        #create publisher passing it the vel_topic_name and msg_type
        self.pub = ProxyPublisher({self.vel_topic: Twist})
	self.current_status_pub = ProxyPublisher({self.status_topic: RobotStatus})

    def execute(self, userdata):
	Logger.loginfo((rospy.Time.now() - self._start_time).to_sec())
        #drive
        self.pub.publish(self.vel_topic, self.cmd_pub)
	#current robot state
	self.current_status_pub.publish(self.status_topic, self.cmd_status)
	Logger.loginfo((rospy.Time.now() - self._start_time).to_sec())
	if (rospy.Time.now() - self._start_time).to_sec() > 10:
        	return 'done'


    def on_enter(self, userdata):
        Logger.loginfo("Drive FWD STARTED!")
	self._start_time = rospy.Time.now()
	
        #set robot speed here
        self.cmd_pub = Twist()
        self.cmd_pub.linear.x = 0.5
        self.cmd_pub.angular.z = 0.0

	self.cmd_status = RobotStatus()
	self.cmd_status.currentTask = '192863'
	self.cmd_status.currentBehaviorStatus = ''
	self.cmd_status.lastTask = '203056'
	self.cmd_status.lastTaskResult = ''
	self.cmd_status.nextTask = '216385'
	self.cmd_status.allActions = ['296881', '296898', '297511']
	self.cmd_status.indexCurrent = 1
	self.cmd_status.actionResults = ['']
	self.cmd_status.batteryCapacity = 0.3
	self.cmd_status.batteryVoltage = 0.0
	self.cmd_status.listen = False 


    def on_exit(self, userdata):
        self.cmd_pub.linear.x = 0.0
        self.pub.publish(self.vel_topic, self.cmd_pub)

	self.cmd_status = RobotStatus()
	self.cmd_status.currentTask = ''
	self.cmd_status.currentBehaviorStatus = ''
	self.cmd_status.lastTask = ''
	self.cmd_status.lastTaskResult = ''
	self.cmd_status.nextTask = ''
	self.cmd_status.allActions = []
	self.cmd_status.indexCurrent = -1
	self.cmd_status.actionResults = []
	self.cmd_status.batteryCapacity = 0.0
	self.cmd_status.batteryVoltage = 0.0
	self.cmd_status.listen = False 

        Logger.loginfo("Drive FWD ENDED!")

    def on_start(self):
        Logger.loginfo("Drive FWD READY!")

    def on_stop(self):
	Logger.loginfo("Drive FWD STOPPED!")

    def scan_callback(self, data):
        self.data = data
