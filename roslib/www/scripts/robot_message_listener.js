var robotMessageTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/web/message',
  messageType: 'std_msgs/String'
});

$(function () {
  $('#behaviorModal').modal({ show: false})
  $('#robot_message_alert').hide()
})

/**
* fct take message received on /robot/message, then gets message fitting the name in switch_listening_request
* modal with fitting message is displayed
* depending on message_type from db colour of modal is changed
**/
robotMessageTopic.subscribe(function(message) {
  getRobotMessage(message.data, site_language)
    .then(data => {
      if(typeof data !== "undefined"){
        while (document.getElementById("message").firstChild) {
          document.getElementById("message").removeChild(document.getElementById("message").firstChild);
        }

        var msg = document.createElement('div');
        msg.innerHTML = data;
        document.getElementById("message").appendChild(msg);

        $('#messageContent').attr('class','modal-content'); //reset class/display of modal to default

        //first letter of message name shows its type
        switch (message.data.charAt(0)) {
          case "W":
            $('#messageContent').addClass('typeWarning')
            break;
          case "E":
            $('#messageContent').addClass('typeError')
            break;
          default:
            break;
        }

        $('#messageModal').modal('show');
      }
  })
});
