/**
* uses Polyglot.js for translation of static UI elements (translations for data from db is stored there)
* polyglot_en holds all transaltions for the english site, while polyglot_de holds all transaltions for the german site

* HOW TO ADD NEW TRANSLATIONS:
* the html element that should be translated needs to have the class "static-translation" + any id
* id is used as key in phrases --> value is the actual string that will be displayed (remember to add to both the english and german polyglot)
**/

var polyglot_en = new Polyglot({
  locale: 'en',
  phrases: {
    "message_count": "%{smart_count} message |||| %{smart_count} messages", //just for testing plurals in different languages
    "translation_test": "This is an english text",
    "choose_behavior": "What do you want me to do?",
    "emergency_stop": "Emergency Stop",
    "infoEmergencyStop": "Emergency stop performed, please restart the whole robot system to correctly use the Web UI again after solving the problem.",
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
    "saveBehaviorButton": "Save new behavior",
  }
});

var polyglot_de = new Polyglot({
  locale: 'de',
  phrases: {
    "message_count": "%{smart_count} nachricht |||| %{smart_count} nachrichten",
    "translation_test": "Das ist ein deutscher Text",
    "choose_behavior": "Was soll ich machen?",
    "emergency_stop": "Notaus",
    "infoEmergencyStop": "Notaus ausgelöst, bitte starte den gesamten Roboter neu, nachdem das Problem gelöst wurde um diese Web UI wieder korrekt verwenden zu können.",
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
  $(".static-translation").each(function() {
    document.getElementById(this.id).innerHTML = polyglot_en.t(this.id);
  });
});

/**
* fct changes text for each element with class "static-translation", to the value from polyglot in language from param ("en" or "de")
**/
function displayLanguage(language){
  if (language == 'en'){
    console.log(polyglot_en.t('message_count', {smart_count: 2}));
    $(".static-translation").each(function() {
      document.getElementById(this.id).innerHTML = polyglot_en.t(this.id);
    });
  } else {
    console.log(polyglot_de.t('message_count', {smart_count: 2}));
    $(".static-translation").each(function() {
      document.getElementById(this.id).innerHTML = polyglot_de.t(this.id);
    });
  }
}
