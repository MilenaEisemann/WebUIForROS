$(function () {
  $('#stop_modal').modal({ show: false})
})

var behavior_control_client = new ROSLIB.Service({
ros: ros,
    name: "/behavior_control",
    serviceType: "website_services.srv/BehaviorControlMsg"
})

function pauseContinueBehavior(){
  var button = document.getElementById("pause_and_continue_button");
  if (button.innerHTML == "pause"){
    var request = new ROSLIB.ServiceRequest({command: "pause"});

    behavior_control_client.callService(request, function(result){
      console.log("got the service result");
      $('#stop_modal').modal({ show: true})
    })

    button.innerHTML = "continue";
  } else {
    var request = new ROSLIB.ServiceRequest({command: "continue"});

    behavior_control_client.callService(request, function(result){
      console.log("got the service result");
    })

    button.innerHTML = "pause";
  }
}

function stopBehavior(){
  var request = new ROSLIB.ServiceRequest({command: "stop"});

  behavior_control_client.callService(request, function(result){
    console.log("got the service result");
  })
}
