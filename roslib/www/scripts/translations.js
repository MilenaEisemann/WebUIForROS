var polyglot_en = new Polyglot({
  locale: 'en',
  phrases: {
    "message_count": "%{smart_count} message |||| %{smart_count} messages", //just for testing plurals in different languages
    "translation_test": "This is an english text",
    "choose_behavior": "What do you want me to do?",
    "emergency_stop": "Emergency Stop",
    "addBehaviorButton": "Create new behavior",
    "currently_doing_button": "Currently doing",
    "requested_modal_title": "Hey, I need your input",
    "requested_modal_title_object": "Hey, I need your input",
    "requested_modal_title_location": "Hey, ich brauche deinen Input",
    "input_yes": "ja",
    "input_yes": "yes",
    "input_no": "no",
    "location-dropdown-text": "choose a location",
    "object-dropdown-text": "choose an object",
    "cancel-button": "Cancel",
    "start-button": "Start behavior",
    "compose_behavior": "Please compose your new behavior",
    "cancelBehaviorButton": "Cancel",
    "saveBehaviorButton": "Save new behavior"
  }
});

var polyglot_de = new Polyglot({
  locale: 'de',
  phrases: {
    "message_count": "%{smart_count} nachricht |||| %{smart_count} nachrichten",
    "translation_test": "Das ist ein deutscher Text",
    "choose_behavior": "Was soll ich machen?",
    "emergency_stop": "Notaus",
    "addBehaviorButton": "Füge neue Aufgabe hinzu",
    "currently_doing_button": "Zur laufenden Aufgabe",
    "requested_modal_title": "Hey, ich brauche deinen Input",
    "requested_modal_title_object": "Hey, ich brauche deinen Input",
    "requested_modal_title_location": "Hey, ich brauche deinen Input",
    "input_yes": "ja",
    "input_no": "nein",
    "location-dropdown-text": "wähle einen Ort",
    "object-dropdown-text": "wähle ein Objekt",
    "cancel-button": "Abbruch",
    "start-button": "Starte Aufgabe",
    "compose_behavior": "Bitte stelle deine neue Aufgabe zusammen",
    "cancelBehaviorButton": "Abbruch",
    "saveBehaviorButton": "Aufgabe abspeichern"
  }
});

$(function(){
  //get current ROS-param?
  //console.log("here come all the ids");
  $(".static-translation").each(function() {
    //console.log(this.id);
    document.getElementById(this.id).innerHTML = polyglot_en.t(this.id);
  });

});


function displayLanguage(language){
  if (language == 'en'){
    console.log(polyglot_en.t('message_count', {smart_count: 2}));
    $(".static-translation").each(function() {
      //console.log(this.id);
      document.getElementById(this.id).innerHTML = polyglot_en.t(this.id);
    });
  } else {
    console.log(polyglot_de.t('message_count', {smart_count: 2}));
    $(".static-translation").each(function() {
    //  console.log(this.id);
      document.getElementById(this.id).innerHTML = polyglot_de.t(this.id);
    });
  }
}
