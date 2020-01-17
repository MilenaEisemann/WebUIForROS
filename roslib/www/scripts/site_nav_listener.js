var redirectTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/web/redirect',
  messageType: 'std_msgs/String'
});

var site_keys = new Map([
 //['home', 'http://localhost:8001/'],
 ['home', 'container_currently_doing'],
 ['behaviors', 'http://localhost:8001/new_page.html'],
 ['ros', 'http://localhost:8001/basic_ros.html'],
 ['yes_no', '#yes_no_modal'],
 ['object', '#object_modal'],
 ['location', '#location_modal']
]);

$(function () {
  $('#behaviorModal').modal({ show: false});
  $('#container_currently_doing').hide();
})

redirectTopic.subscribe(function(message) {
	console.log('Received redirect destination: ' + message.data);
    if (message.data.length !== 0){
      //check if available key was requested
      if(!site_keys.has(message.data)){
        return_feedback("error", "");
      } else {
        if (site_keys.get(message.data).startsWith('#')){
          console.log("it is a function");
          showModal(site_keys.get(message.data));
        } else if (typeof site_keys.get(message.data) === 'string' && window.location != site_keys.get(message.data)){ //only switch sites, if not already there --> no constant refreshing
          console.log("it is an url");
          $('#container_currently_doing').show();
          $('#container_db').hide();
          return_feedback("okay", "");
          //window.location = site_keys.get(message.data);
        }
      }
    } else {
      console.log("staying on this site");
    }
	});

function showModal(id){

  if(id == '#object_modal'){
    fetchObjects(site_language)
      .then(data => {

      while (document.getElementById("object-modal-dropdown").firstChild) {
        document.getElementById("object-modal-dropdown").removeChild(document.getElementById("object-modal-dropdown").firstChild);
      }

      data.forEach(function(entry){
        console.log(entry);
        var li = document.createElement('li');
        li.id = entry.id;
        li.className = "current_dropdown_option";
        if (entry.translation != null){
          li.innerHTML = entry.translation;
        } else {
          li.innerHTML = entry.name;
        }
        document.getElementById('object-modal-dropdown').appendChild(li);
        li.onclick = function(){
          $('#object-dropdown-text').html(entry.translation);
          var text = document.getElementById('object-dropdown-text');
          text.className = "static-translation";
          $('#object-dropdown-text').addClass("ref_to_" + entry.id);
        };

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

  //check if modal is shown successfully
  /*if (!($(id).data('bs.modal') || {})._isShown)
  {
    return_feedback("error");
  } else {
    return_feedback("okay");
  }*/
}

function sendModalData(id){
  if (id == "object_modal"){
    if($('#object-dropdown-text').text() != polyglot_en.t("object-dropdown-text") && $('#object-dropdown-text').text() != polyglot_de.t("object-dropdown-text")){
      var classList = $('#object-dropdown-text').attr('class').split(/\s+/);
      $.each(classList, function(index, item) {
          if (item.startsWith('ref_to_')) {
              var dataID = item.split('ref_to_')[1]
              console.log("I am sending the feedback");
              //return_feedback("okay", $('#object-dropdown-text').text());
              return_feedback("okay", dataID);
              var text = document.getElementById('object-dropdown-text');
              text.className = "static-translation";

              $('#object_modal').modal('hide');
              resetDropdown("object-dropdown-text");
          }
        })
    } else {
      alert("missing/invalid input for parameter");
    }
  }
}

function resetDropdown(id){
  var idWithHashtag = '#' + id;
  if (site_language == "en"){
    $(idWithHashtag).text(polyglot_en.t(id))
  } else {
    $(idWithHashtag).text(polyglot_de.t(id));
  }
}
