var robotMessageTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/web/message',
  messageType: 'std_msgs/String'
});

$(function () {
  $('#behaviorModal').modal({ show: false})
})

robotMessageTopic.subscribe(function(message) {
  getRobotMessage(message.data, site_language)
    .then(data => {
      if(typeof data !== "undefined"){
        alert(data);
      } /*else {
        alert("undefined error string");
      }*/
  })
});
