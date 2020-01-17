var current_behavior_params = new Map([
//key = param name, values = value for param
//e.g. ['waiting_time', 5],
]);

function startBehavior(behavior){
  console.log("starting Behavior " + behavior.key);
  //checkForAllParams(behavior);
  //if (typeof behavior.execution_specs !== 'undefined'){
  if (typeof behavior.specs !== 'undefined'){
    if (behavior.specs[0].start_type === "action"){
      console.log("we need to start an action");
      if(checkForAllParams(behavior)){
        startAction(behavior)
      } else {
        alert("could not start behavior");
      }
    }
  } else {
    console.log("there was an error when starting the behavior - no start_type defined");
  }
  //closing modal
  $('#behaviorModal').modal('hide');
}

function checkForAllParams(behavior){
  var missingValue = false;
  if(behavior.params.length > 0){ // if there are parameters
    behavior.params.forEach(function(param){
      console.log("checking parameter " + param.param.name);
      var inputToCheck = document.getElementById(param.param.name);
      console.log(inputToCheck);
      //check for input field
      if(param.param.type == "string" || param.param.type == "float"){
        if(inputToCheck.value !== "" && inputToCheck.value.trim().length !== 0){
          console.log(param.param.name + " = " + inputToCheck.value);
          current_behavior_params.set(param.param.name,inputToCheck.value); //add to map of all parameters + values
        } else {
          missingValue = true;
          alert("missing input for parameter " + param.param.name);
        }
      //check for dropdowns
      } else if (param.param.type == "location" || param.param.type == "object"){
        if(inputToCheck.firstChild.innerText != polyglot_en.t("object-dropdown-text") && inputToCheck.firstChild.innerText != polyglot_de.t("object-dropdown-text") && inputToCheck.firstChild.innerText != polyglot_en.t("location-dropdown-text") && inputToCheck.firstChild.innerText != polyglot_de.t("object-dropdown-text") ){
          console.log(param.param.name + " = " + inputToCheck.firstChild.innerText);
        } else {
          missingValue = true;
          alert("missing input for parameter " + param.param.name);
        }
      }
    })
  }
  return !missingValue; //if value is missing, return false
}

function startAction(behavior){
  //convert map into two arrays for values + keys
  var arg_values = Array.from(current_behavior_params.values());
  var arg_keys = Array.from(current_behavior_params.keys());

  var newActionClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : behavior.specs[0].server_name,
    actionName : behavior.specs[0].action_name
  });

  var newActionGoal = new ROSLIB.Goal({
   actionClient : newActionClient,
   goalMessage : {
     behavior_name : behavior.specs[0].behavior_name,
     //arg_keys: [behavior.params[0].param.name],
     //arg_values: [behavior.params[0].param.default.toString()]
     arg_keys: arg_keys,
     arg_values: arg_values
   }
  });

  newActionGoal.send();
  console.log("sending goal");
  console.log("----------------");
  console.log(newActionClient);
  console.log(newActionGoal);
  console.log("----------------");

  //clear map of all entries
  current_behavior_params = new Map([]);
}
