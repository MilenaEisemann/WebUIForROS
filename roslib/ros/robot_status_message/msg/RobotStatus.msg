# General Info
#------------------------
string mode                   # robot operation status e.g. "idle", "taskInProgress", "error", "recovery"

string currentTask              # id e.g. "robocup_receptionist", can also be none
string currentBehaviorStatus    # e.g. "running", "stopped", "paused"

string lastTask
string lastTaskResult           # did the last behavior finish correctly? e.g. "failed", "succeeded" (empty string means success)
string nextTask

string[] allActions             # hold past, current and future actions of currently running behavior
int32 indexCurrent              # which action is currently running
string[] actionResults          # index should match those of past actions in allActions e.g. "failed", "succeeded"

# Additional admin info
#------------------------
float32 batteryCapacity         # e.g. 0.2 for 20% battery left
float32 batteryVoltage

bool listen
