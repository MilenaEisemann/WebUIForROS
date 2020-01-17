var site_language; //will get set by rosparam at beginning

$(function (){
  //var el = document.getElementById('language_en');
  //el.onclick = changeLanguage("en");
  getStartLanguage() //wait until value for ros param received
    .then(value => {
      changeLanguage(site_language); //display default language from ros param
    })
})

function changeLanguage(language) {
  if (language == 'en'){
    changeCurrentLanguage('en');
    displayLanguage('en');
    //site_language = "en";
    document.getElementById('language-dropdown-text').innerHTML = "English";
  } else {
    displayLanguage('de');
    changeCurrentLanguage('de');
    //site_language = "de";
    document.getElementById('language-dropdown-text').innerHTML = "Deutsch";
  }

  getAllBehaviors(); //display behaviors with changed name again
}


$('#toggleRobotListening').on('click', function(event) {
  event.preventDefault();

  var switch_listening_mode_client = new ROSLIB.Service({
    ros: ros,
    name: "/switch_listeningmode",
    serviceType: "std_srvs.srv/SetBool"
  })

  /*
  switch_listening_mode_client.advertise(function(request, response){
    console.log("advertise");
  })*/

  /*var behaviourClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : '/flexbe/execute_behavior',
    actionName : 'flexbe_msgs/BehaviorExecutionAction'
  });*/
  /*listening_callback = function (request, response) {
    var twist = new ROSLIB.Message({

    });*/

  //switch_listening_mode_client.advertise(listening_callback);

  if($('#toggleRobotListening').hasClass("fa-microphone")){
    var switch_listening_request = new ROSLIB.ServiceRequest({
      data: false
    });
  } else {
    var switch_listening_request = new ROSLIB.ServiceRequest({
      data: true
    });
  }

  switch_listening_mode_client.callService(switch_listening_request, function(result){
    if($('#toggleRobotListening').hasClass("fa-microphone")){
      console.log(result.message);
        $('#toggleRobotListening').addClass('fa-microphone-slash').removeClass('fa-microphone');
    } else {
      console.log(result.message);
      $('#toggleRobotListening').addClass('fa-microphone').removeClass('fa-microphone-slash');
    }
  });

});
