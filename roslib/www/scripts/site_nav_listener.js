var redirectTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/web/redirect',
  messageType: 'std_msgs/String'
});

$(function () {
  $('#behaviorModal').modal({ show: false})
})

redirectTopic.subscribe(function(message) {
	console.log('Received redirect destination: ' + message.data);

    var site_keys = new Map([
     ['home', 'http://localhost:8001/'],
     ['behaviors', 'http://localhost:8001/new_page.html'],
     ['ros', 'http://localhost:8001/basic_ros.html'],
     ['yes_no', '#yes_no_modal'],
     ['object', '#object_modal'],
     ['location', '#location_modal']
    ]);

    if (message.data.length !== 0){
      if (site_keys.get(message.data).startsWith('#')){
        console.log("it is a function");
        showModal(site_keys.get(message.data));
      } else if (typeof site_keys.get(message.data) === 'string' && window.location != site_keys.get(message.data)){ //only switch sites, if not already there --> no constant refreshing
        window.location = site_keys.get(message.data);
        console.log("it is an url");
      }
    } else {
      console.log("staying on this site");
    }
	});

function showModal(id){

  if(id == '#object_modal'){
    fetchObjects(site_language)
      .then(data => {
      var ul = document.getElementById("list");
      data.forEach(function(entry){
        if (entry.translation != null){
        var li = document.createElement('li');
        li.innerHTML = entry.translation;
        document.getElementById('object-modal-dropdown').appendChild(li);
      } else {
          var li = document.createElement('li');
          li.innerHTML = entry.name;
          document.getElementById('object-modal-dropdown').appendChild(li);
        }
      });
    })
  } else if (id == '#location_modal'){
    fetchLocations(site_language)
      .then(data => {
      var ul = document.getElementById("list");
      data.forEach(function(entry){
        if (entry.translation != null){
        var li = document.createElement('li');
        li.innerHTML = entry.translation;
        document.getElementById('location-modal-dropdown').appendChild(li);
        } else {
          var li = document.createElement('li');
          li.innerHTML = entry.name;
          document.getElementById('location-modal-dropdown').appendChild(li);
        }
      });
    })
  }

  $(id).modal('show');
}
