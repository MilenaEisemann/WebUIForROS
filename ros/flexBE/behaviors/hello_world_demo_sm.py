#!/usr/bin/env python
# -*- coding: utf-8 -*-
###########################################################
#               WARNING: Generated code!                  #
#              **************************                 #
# Manual changes may get lost if file is generated again. #
# Only code inside the [MANUAL] tags will be kept.        #
###########################################################

from flexbe_core import Behavior, Autonomy, OperatableStateMachine, ConcurrencyContainer, PriorityContainer, Logger
from flexbe_states.wait_state import WaitState
from flexbe_states.log_state import LogState
from tiago_flexbe_states.drive_forward import TestPublisherState
from tiago_flexbe_states.website_dummy_trigger_modal import WebsiteDummyModalState as tiago_flexbe_states__WebsiteDummyModalState
from tiago_flexbe_states.website_dummy_1 import WebsiteDummyState1
# Additional imports can be added inside the following tags
# [MANUAL_IMPORT]

# [/MANUAL_IMPORT]


'''
Created on Tue Aug 27 2019
@author: Milena
'''
class HelloWorldDemoSM(Behavior):
	'''
	Behaviour to test
	'''


	def __init__(self):
		super(HelloWorldDemoSM, self).__init__()
		self.name = 'Hello World Demo'

		# parameters of this behavior
		self.add_parameter('waiting_time', 1)

		# references to used behaviors

		# Additional initialization code can be added inside the following tags
		# [MANUAL_INIT]

		# [/MANUAL_INIT]

		# Behavior comments:



	def create(self):
		test = "test"
		hello = "hello World!"
		# x:1142 y:435, x:1117 y:356
		_state_machine = OperatableStateMachine(outcomes=['finished', 'failed'])

		# Additional creation code can be added inside the following tags
		# [MANUAL_CREATE]

		# [/MANUAL_CREATE]


		with _state_machine:
			# x:104 y:43
			OperatableStateMachine.add('Initial_Wait',
										WaitState(wait_time=self.waiting_time),
										transitions={'done': 'Print_Greeting'},
										autonomy={'done': Autonomy.Off})

			# x:920 y:287
			OperatableStateMachine.add('Print_Bye',
										LogState(text="bye bye", severity=Logger.REPORT_HINT),
										transitions={'done': 'finished'},
										autonomy={'done': Autonomy.Off})

			# x:285 y:53
			OperatableStateMachine.add('Print_Greeting',
										LogState(text=hello, severity=Logger.REPORT_HINT),
										transitions={'done': 'state1'},
										autonomy={'done': Autonomy.Off})

			# x:785 y:217
			OperatableStateMachine.add('Initial_Wait_2',
										WaitState(wait_time=5),
										transitions={'done': 'Print_Bye'},
										autonomy={'done': Autonomy.Off})

			# x:667 y:123
			OperatableStateMachine.add('Log_test',
										LogState(text=test, severity=Logger.REPORT_HINT),
										transitions={'done': 'Initial_Wait_2'},
										autonomy={'done': Autonomy.Off})

			# x:446 y:78
			OperatableStateMachine.add('state1',
										TestPublisherState(),
										transitions={'done': 'Show_Current_State_Page'},
										autonomy={'done': Autonomy.Off})

			# x:601 y:339
			OperatableStateMachine.add('Show_Modal',
										tiago_flexbe_states__WebsiteDummyModalState(),
										transitions={'done': 'Log_test', 'failed': 'Show_Modal'},
										autonomy={'done': Autonomy.Off, 'failed': Autonomy.Off})

			# x:388 y:280
			OperatableStateMachine.add('Show_Current_State_Page',
										WebsiteDummyState1(),
										transitions={'done': 'Show_Modal', 'failed': 'Show_Current_State_Page'},
										autonomy={'done': Autonomy.Off, 'failed': Autonomy.Off})


		return _state_machine


	# Private functions can be added inside the following tags
	# [MANUAL_FUNC]

	# [/MANUAL_FUNC]
