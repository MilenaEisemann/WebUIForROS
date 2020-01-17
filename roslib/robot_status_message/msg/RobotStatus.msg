# General Info
#------------------------
string mode             # robot operation status e.g. idle, taskInProgress, error, recovery

string currentTask      # id e.g. robocup_receptionist, can also be none
float32 taskCompletion  # percentage how much of task is done, don't display if no value present
string lastAction       # id, can also be none
string lastActionResult # to delete
string currentAction
string currentActionStatus
string nextAction


string message_type     # to delete
string message          # to delete

bool listen

# Additional admin info
#------------------------
float32 batteryCapacity # e.g. 0.2 for 20% battery left
float32 batteryVoltage
