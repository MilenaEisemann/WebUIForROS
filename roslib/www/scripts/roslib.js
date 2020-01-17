//connection to ros
  var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
  });

  ros.on('connection', function() {
    document.getElementById("status").innerHTML = "Connected to";
  });

  ros.on('error', function(error) {
    document.getElementById("status").innerHTML = "Error";
  });

  ros.on('close', function() {
    document.getElementById("status").innerHTML = "Connection closed";
  });

  //ROS params
  //get all params
  ros.getParams(function(params) {
    console.log("received ROS params: " + params);
  });

  //example for one ROS param
  var websocketPort = new ROSLIB.Param({
    ros : ros,
    name : 'rosbridge_websocket/port'
  });

  websocketPort.get(function(value) {
    console.log('websocket port: ' + value);
  });

  var currLanguage = new ROSLIB.Param({
    ros : ros,
    name : 'language'
  });
  /*
  currLanguage.get(function(value) {
    console.log('Language is: ' + value);
    site_language = value;
    console.log(site_language);
    console.log("byeeeeeeeeeeeeee");
  });*/

  //example on how setting ros param would work
  //websocketPort.set(9091);
  //currLanguage.set('de');

  //service
  var website_control_client = new ROSLIB.Service({
      ros: ros,
      name: "/website_control",
      serviceType: "std_srvs.srv/Empty"
  })

  var request = new ROSLIB.ServiceRequest({});

  website_control_client.callService(request, function(result){
    console.log("got the service result");
  })

  //subscriber
  var txt_listener = new ROSLIB.Topic({
    ros : ros,
    //name : '/txt_msg',
    //messageType : 'std_msgs/String'
    name : '/cmd_vel',
    messageType : 'geometry_msgs/Twist'
  });

  txt_listener.subscribe(function(m) {
    document.getElementById("msg").innerHTML = "linear x = " + m.linear.x;
    //document.getElementById("msg").innerHTML = m.data;
  });

  //subscriber for current robot_status
  var status_listener = new ROSLIB.Topic({
    ros: ros,
    name: 'robot_status',
    messageType: 'robot_status_message/RobotStatus'
  });

  status_listener.subscribe(function(m) {
    displayRobotInfo(m);  //in current_status.js
  })

  //publish on button click
  $(function(){
    $('#btn').on('click', function(){
       move(1,0);
    });
  });

  cmd_vel_listener = new ROSLIB.Topic({
    ros : ros,
    name : "/cmd_vel",
    messageType : 'geometry_msgs/Twist'
  });

  move = function (linear, angular) {
    var twist = new ROSLIB.Message({
      linear: {
        x: linear,
        y: 0,
        z: 0
      },
      angular: {
        x: 0,
        y: 0,
        z: angular
      }
    });
    cmd_vel_listener.publish(twist);
  }

  //action for FlexBE
  var behaviourClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : '/flexbe/execute_behavior',
    actionName : 'flexbe_msgs/BehaviorExecutionAction'
  });

  var value = "5"; //waiting_time

  var goal = new ROSLIB.Goal({
   actionClient : behaviourClient,
   goalMessage : {
     behavior_name : "Hello World Demo",
     arg_keys: ["waiting_time"],
     arg_values: [value]
   }
  });

/*
  goal.on('feedback', function(feedback) {
    alert("got feedback");
    //console.log('Feedback: ' + feedback.current_state);
    document.getElementById("feedback").innerHTML = feedback.current_state;
  }); */

  goal.on('status', function(feedback) {
    if (feedback.status == 1) {
      console.log(feedback);
      document.getElementById("result").innerHTML = "Behavior running";
    }
    //console.log('Feedback: ' + feedback.current_state);
  });

  goal.on('result', function(result) {
    //alert("got a result");
    document.getElementById("result").innerHTML = result.outcome;
  });

  $(function(){
    $('#btnAction').on('click', function(){
      value = document.getElementById("waitingTime").value
      if (value == ""){
        value = "5";
      }

      //to use value of input field
      var goal2 = new ROSLIB.Goal({
       actionClient : behaviourClient,
       goalMessage : {
         behavior_name : "Hello World Demo",
         arg_keys: ["waiting_time"],
         arg_values: [value]
       }
     });
     goal2.on('result', function(result) {
       //alert("got a result");
       document.getElementById("result").innerHTML = result.outcome;
     });

     goal2.on('status', function(feedback) {
       if (feedback.status == 1) { //1 = running, 3 = finished
         //console.log(feedback);
         document.getElementById("feedback").innerHTML = "Behavior running with waiting time " + value;
       } else {
         document.getElementById("feedback").innerHTML = " ";
       }
     });

      goal2.send();
      //goal.send();
      console.log(goal);
    });
  });

function getStartLanguage(){
  return new Promise(function(resolve, reject){
    var currLanguage = new ROSLIB.Param({
      ros : ros,
      name : 'language'
    });

    currLanguage.get(function(value) {
      console.log(value);
      resolve(value);
    })
   });
}

function changeCurrentLanguage(aLaguage){
  var currLanguage = new ROSLIB.Param({
    ros : ros,
    name : 'language'
  });

  currLanguage.set(aLaguage);
  site_language = aLaguage;
}
