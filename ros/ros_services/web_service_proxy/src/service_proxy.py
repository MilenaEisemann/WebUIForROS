#! /usr/bin/env python
import rospy
from std_srvs.srv import SetBool, SetBoolResponse
from website_services.srv import WebServiceProxyMsg, WebServiceProxyMsgResponse
from std_msgs.msg import String
from website_feedback_message.msg import WebsiteFeedback

class WebServiceProxy(object):
    def __init__(self):
        rospy.init_node('web_service_proxy_node')
        print("initiating service_proxy node...")

        #rate for sleep
        self.rate = rospy.Rate(10)

        self.feedback = {'msg':'', 'data': ''}
        #self.website_feedback.data = ""
        #self.website_feedback.message = ""

        #advertise service
        self.service = rospy.Service('/web_service_proxy', WebServiceProxyMsg , self.service_callback)

        #topic to change displayed websites + input modals
        self.pub_website_redirect = rospy.Publisher('/web/redirect', String, queue_size=10)

        #only for testing until website publishes this
        #self.pub_website_feedback = rospy.Publisher('/web/feedback', WebsiteFeedback, queue_size=10)

        #topic to receive feedback from website
        self.sub_website_feedback = rospy.Subscriber('/web/feedback', WebsiteFeedback, self.feedback_callback)

    def service_callback(self, request):
        print "Callback web_service_proxy has been called"
        #self.pub_website_redirect.publish("behaviors")
        self.pub_website_redirect.publish(request.command)
        #self.testPub()

        #while(self.website_feedback.message == ""):
        while(self.feedback['msg'] == ""):
            pass
            #self.data = rospy.wait_for_message("/web/feedback", String)
        else:
            msg = self.feedback['msg']
            data = self.feedback['data']

            self.feedback['msg'] = ""
            self.feedback['data'] = ""

            return WebServiceProxyMsgResponse(
                success = True,
                #message = "website responded with: " + self.website_feedback.message,
                message = "website responded with: " + msg,
                data = data
                #data = self.website_feedback.data
            )

    def testPub(self):
        msg = "test";
        self.pub_website_feedback.publish(msg);

    def feedback_callback(self, message):
        print "received feedback from website"
        #self.website_feedback = msg
        self.feedback['msg'] = message.message
        self.feedback['data'] = message.data

    def run(self):
        server_proxy.rate.sleep()

if __name__ == '__main__':
    server_proxy = WebServiceProxy()

    while not rospy.is_shutdown():
        server_proxy.run()
        server_proxy.rate.sleep()
