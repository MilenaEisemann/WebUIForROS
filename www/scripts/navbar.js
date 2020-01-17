var site_language; //will get set by rosparam at beginning

$(function (){
  getStartLanguage() //wait until value for ros param received
    .then(value => {
      changeLanguage(site_language); //display default language from ros param
    })
})

/**
* fct changes language of UI to the value of the language param (either "en" or "de")
* calls fct to change language ros param
* depending on which content is shown, a fct is called that updates the translation of values from the db
**/
function changeLanguage(language) {
  if (site_language != language){
    if (language == 'en'){
      changeCurrentLanguage('en');
      displayLanguage('en');
      document.getElementById('language-dropdown-text').innerHTML = "English";
    } else {
      displayLanguage('de');
      changeCurrentLanguage('de');
      document.getElementById('language-dropdown-text').innerHTML = "Deutsch";
    }

    if(window.location.href.indexOf("new_page") > -1){ //new_page is name of html file
      getAllBehaviors(); //display behaviors with changed name again
    } else if (window.location.href.indexOf("index") > -1 || location.href.split("/").slice(-1) == "#" || location.href.split("/").slice(-1) == ""){
      updateCards();
    }
  }
}

/**
* fct calls service to execute emergeny stop on button click
* shows alert for user what they have to do after an emergency stop
**/
function triggerEmergencyStop(){
  var emergency_stop_client = new ROSLIB.Service({
    ros: ros,
    name: "/trigger_emergency_stop",
    serviceType: "std_srvs.srv/Trigger"
  })

  var emergency_stop_request = new ROSLIB.ServiceRequest({});

  emergency_stop_client.callService(emergency_stop_request, function(result){
    if (site_language == 'en'){
      alert(polyglot_en.t("infoEmergencyStop"))
    } else {
      alert(polyglot_de.t("infoEmergencyStop"))
    }
  });
}

/**
* adds onClick for toggling switch_listening_mode
* uses icon to detect current mode and sent matching service goal (as information about listeningmode not published on a topic right now)
* NOTE: service currently only implemented as dummy
**/
$('#toggleRobotListening').on('click', function(event) {
  event.preventDefault();

  var switch_listening_mode_client = new ROSLIB.Service({
    ros: ros,
    name: "/switch_listeningmode",
    serviceType: "std_srvs.srv/SetBool"
  })

  if($('#toggleRobotListening').hasClass("fa-microphone")){
    var switch_listening_request = new ROSLIB.ServiceRequest({
      data: false
    });
  } else {
    var switch_listening_request = new ROSLIB.ServiceRequest({
      data: true
    });
  }

  //switch icons
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


/**
* adds onClick for toggling switch_speech_mode
* uses icon to detect current mode and sent matching service goal (as information about speechmode not published on a topic right now)
* NOTE: service currently only implemented as dummy
**/
$('#toggleRobotSpeech').on('click', function(event) {
  event.preventDefault();

  var switch_listening_mode_client = new ROSLIB.Service({
    ros: ros,
    name: "/switch_speechmode",
    serviceType: "std_srvs.srv/SetBool"
  })

  if($('#toggleRobotSpeech').hasClass("fa-volume-up")){
    var switch_listening_request = new ROSLIB.ServiceRequest({
      data: false
    });
  } else {
    var switch_listening_request = new ROSLIB.ServiceRequest({
      data: true
    });
  }

  //switch icons
  switch_listening_mode_client.callService(switch_listening_request, function(result){
    if($('#toggleRobotSpeech').hasClass("fa-volume-up")){
      console.log(result.message);
        $('#toggleRobotSpeech').addClass('fa-volume-off').removeClass('fa-volume-up');
    } else {
      console.log(result.message);
      $('#toggleRobotSpeech').addClass('fa-volume-up').removeClass('fa-volume-off');
    }
  });
});
