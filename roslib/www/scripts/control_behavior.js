$(function () {
  $('#pause_modal').modal({ show: false})
})

var behavior_control_client = new ROSLIB.Service({
ros: ros,
    name: "/behavior_control",
    serviceType: "website_services.srv/BehaviorControlMsg"
})

/**
* fct to switch running behavior between paused and running
* uses text of button to identify current state --> calls service accordingly
* NOTE: this service is only a dummy at the moment
**/
function pauseContinueBehavior(){
  var button = document.getElementById("pause_and_continue_button");
  if (button.innerHTML == "pause"){
    var request = new ROSLIB.ServiceRequest({command: "pause"});

    behavior_control_client.callService(request, function(result){
      console.log("got the service result");
      $('#pause_modal').modal({ show: true})
      button.innerHTML = "continue";
    })

  } else {
    var request = new ROSLIB.ServiceRequest({command: "continue"});

    behavior_control_client.callService(request, function(result){
      console.log("got the service result");
      button.innerHTML = "pause";
    })
  }
}

/**
* fct to completly stop running behavior
* NOTE: this service is only a dummy at the moment
**/
function stopBehavior(){
  var request = new ROSLIB.ServiceRequest({command: "stop"});

  behavior_control_client.callService(request, function(result){
    console.log("got the service result");
  })
}
