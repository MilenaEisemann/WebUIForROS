//global variables
//date used for display of time of messages
var today = new Date();
var time;

//holds behavior-data from last message
var lastUsedBehaviors = [];
var receivedFirstMessage = false;
var lastUsedActions = 0;
var lastUsedCurrentIndex = -1;

// popovers Initialization
$(function () {
  $("[data-toggle=popover]").popover();
})

/**
* fct receives message from topic /robot_status
* displays battery robot_status
* displays buttons to pause/stop running behavior
* afterwards calls displayActionCards()
**/
function displayRobotInfo(m){
  //clear robot_info container
  while (document.getElementById("robot_info").firstChild) {
    document.getElementById("robot_info").removeChild(document.getElementById("robot_info").firstChild);
  }

  //var robotName = document.createElement("span");
  //robotName.innerHTML = m.robot_name + " - " + '<i class="fa fa-battery-half" aria-hidden="true"></i>';
  //document.getElementById("robot_info").appendChild(robotName);

  //display battery status
  var batteryStatus = document.createElement("span");
  batteryStatus.innerHTML = (m.batteryCapacity*100).toFixed(0) + "%";
  document.getElementById("robot_info").appendChild(batteryStatus);

  today = new Date();
  time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2);

  if(document.getElementById("running_task_name") == null) { //only append task_name if not already present
    var currently = document.createElement("span");
    currently.id = "running_task_name";
    document.getElementById("current_task").appendChild(currently);
  }
  getBehaviorById("BehaviorsNew/" + m.currentTask).then(data => {
    if (typeof data[0] !== 'undefined'){
      if (site_language == 'en'){
        $('#running_task_name').html(data[0].languages[1].translation.toUpperCase());
      } else {
        $('#running_task_name').html(data[0].languages[0].translation.toUpperCase());
      }
    } else {
      $('#running_task_name').html("Behavior Nr. " + m.nextTask);
    }
  });

  if(document.getElementById("pause_and_continue_button") == null) {
    var button = document.createElement("button");
    button.innerHTML = "pause";
    button.className = "btn btn-danger";
    button.id = "pause_and_continue_button";
    button.addEventListener('click', function(event){pauseContinueBehavior()});
    document.getElementById("current_task").appendChild(button);
  }

  if(document.getElementById("stop_behavior_button") == null) {
    var button2 = document.createElement("button");
    button2.innerHTML = "stop";
    button2.className = "btn btn-danger";
    button2.id = "stop_behavior_button";
    button2.addEventListener('click', function(event){stopBehavior()});

    document.getElementById("current_task").appendChild(button2);
  }

  if (!receivedFirstMessage || (lastUsedBehaviors[0].id != m.lastTask && lastUsedBehaviors[1].id != m.currentTask && lastUsedBehaviors[2].id != m.nextTask)){
    displayActionCards(m);
    receivedFirstMessage = true;
  } else if (lastUsedCurrentIndex != m.indexCurrent || lastUsedActions != m.allActions.length){
    //add onclick with new message as parameter
    document.getElementById("current_action_card").addEventListener("click", function() { showSteps(m); });
  }
}

/**
* foreach behavior received in the message m, display a card in a column
* lastTask, currentTask, nextTask can be filled with values or empty, if a value is empty, a placeholder column will be added
* behavior is identified by id which matches an id in the database --> uses fct getBehaviorById in arangoDB.js
* icon and behaviorname in current language get added to card
* if possible for current action, display progress bar
**/
function displayActionCards(m){
  while (document.getElementById("card_container").firstChild) {
    document.getElementById("card_container").removeChild(document.getElementById("card_container").firstChild);
  }

  lastUsedCurrentIndex = m.indexCurrent;

  //display past action
  //placeholder
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-12 col-md-12 col-lg-12 col-xl-1';
  document.getElementById("card_container").appendChild(cardColumn);

  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-12 col-md-12 col-lg-12 col-xl-2';

  //last action
  if(typeof m.lastTask != ''){
    var card = document.createElement('div');
    card.className = 'card h-75';
    card.id = "last_action_card";

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

    var title = document.createElement('h3');
    title.className = 'card-title';
    title.id = "behavior_last";
    cardBody.appendChild(title);
    card.appendChild(cardBody);

    getBehaviorById("BehaviorsNew/" + m.lastTask).then(data => {
      if (typeof data !== 'undefined' && typeof data[0] !== 'undefined'){
        lastUsedBehaviors[0] = {
          "id": m.lastTask,
          "translation": [data[0].languages[0].translation.toUpperCase(), data[0].languages[1].translation.toUpperCase()]
        }
      } else {
        lastUsedBehaviors[0] = m.lastTask;
        lastUsedBehaviors[0] = {
          "id": m.lastTask,
          "translation": ["Aufgabe " + m.lastTask, "Task " + m.lastTask]
        }
      }

      //display behavior name in card
      if (site_language == 'en'){
        $('#behavior_last').html(lastUsedBehaviors[0].translation[1]);
      } else {
        $('#behavior_last').html(lastUsedBehaviors[0].translation[0]);
      }
    })

    if (m.lastActionResult == "failure"){
      card.className += " border-danger";
    } else {
      card.className += " border-success";
    }

    cardColumn.appendChild(card);
    document.getElementById("card_container").appendChild(cardColumn);
  }

  //current action - bigger card
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-12 col-md-12 col-lg-12 col-xl-6';

  if(typeof m.currentTask != ''){
    var card = document.createElement('div');
    card.className = 'card h-75';
    card.id = "current_action_card";
    card.onclick = function() {showSteps(m)};

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

    var title = document.createElement('h3');
    title.id = "behavior_current";
    title.className = 'card-title';
    cardBody.appendChild(title);

    getBehaviorById("BehaviorsNew/" + m.currentTask).then(data => {
      if (typeof data[0] !== 'undefined'){
        lastUsedBehaviors[1] = {
          "id": m.currentTask,
          "translation": [data[0].languages[0].translation.toUpperCase(), data[0].languages[1].translation.toUpperCase()]
        }
      } else {
        lastUsedBehaviors[1] = m.currentTask;
        lastUsedBehaviors[1] = {
          "id": m.currentTask,
          "translation": ["Aufgabe " + m.currentTask, "Task " + m.currentTask]
        }
      }

      //display behavior name in card
      if (site_language == 'en'){
        $('#behavior_current').html(lastUsedBehaviors[1].translation[1]);
      } else {
        $('#behavior_current').html(lastUsedBehaviors[1].translation[0]);
      }

      //if there are only last and current task
      if(typeof m.nextTask == '' && typeof m.lastTask != ''){
        //arrow last to current action
        if(document.getElementById("last_action_card") != null && document.getElementById("current_action_card") != null){
          var line = new LeaderLine(document.getElementById("last_action_card"), document.getElementById("current_action_card"), {
            gradient: {
              startColor: 'rgba(125, 125, 125, 0.1)',
              endColor: 'rgba(125, 125, 125, 1)'
            },
            endPlugColor: 'rgba(125, 125, 125, 1)',
          });
          line.id = "arrow_last_to_current";
        }
      }

    })

    //add Progressbar
    getStepsForProgress(m).then(value => {
      if (value > 0){ //if valid value for progress
        document.getElementById("current_action_card").getElementsByClassName("card-body")[0].innerHTML += '<div class="progress"> <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style=" background-color: grey; width: ' + value * 100 + '%" aria-valuenow="' + value * 100 + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
      }
    });
    card.appendChild(cardBody);
    cardColumn.appendChild(card);
    document.getElementById("card_container").appendChild(cardColumn);
  }

  //last action
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-12 col-md-12 col-lg-12 col-xl-2';
  document.getElementById("card_container").appendChild(cardColumn);

  if(typeof m.nextAction != ''){
    var card = document.createElement('div');
    card.className = 'card h-75';
    card.id = "next_action_card";

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

    var title = document.createElement('h3');
    title.id = "behavior_next";
    title.className = 'card-title';
    cardBody.appendChild(title);

    getBehaviorById("BehaviorsNew/" + m.nextTask).then(data => {
      if (typeof data[0] !== 'undefined'){
        lastUsedBehaviors[2] = {
          "id": m.nextTask,
          "translation": [data[0].languages[0].translation.toUpperCase(), data[0].languages[1].translation.toUpperCase()]
        }
      } else {
        lastUsedBehaviors[2] = {
          "id": m.nextTask,
          "translation": ["Aufgabe " + m.nextTask, "Task " + m.nextTask]
        }
      }

      //display behavior name in card
      if (site_language == 'en'){
        $('#behavior_next').html(lastUsedBehaviors[2].translation[1]);
      } else {
        $('#behavior_next').html(lastUsedBehaviors[2].translation[0]);
      }

      //draw arrows after all cards have been added
      //arrow last to current action
      if(document.getElementById("last_action_card") != null && document.getElementById("current_action_card") != null){
        var line = new LeaderLine(document.getElementById("last_action_card"), document.getElementById("current_action_card"), {
          gradient: {
            startColor: 'rgba(125, 125, 125, 0.1)',
            endColor: 'rgba(125, 125, 125, 1)'
          },
          endPlugColor: 'rgba(125, 125, 125, 1)',
        });
        line.id = "arrow_last_to_current";
      }

      //arrow current to next action
      if(document.getElementById("current_action_card") != null && document.getElementById("next_action_card") != null){
        var line = new LeaderLine(document.getElementById("current_action_card"), document.getElementById("next_action_card"), {
          gradient: {
            startColor: 'rgba(125, 125, 125, 0.1)',
            endColor: 'rgba(125, 125, 125, 1)'
          },
          endPlugColor: 'rgba(125, 125, 125, 1)',
        });
        line.id = "arrow_current_to_next";
      }
    })
    title.className = 'card-title';
    cardBody.appendChild(title);

    card.appendChild(cardBody);
    cardColumn.appendChild(card);
    document.getElementById("card_container").appendChild(cardColumn);
  }

  //placeholder column
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-2';
  document.getElementById("card_container").appendChild(cardColumn);
}

/**
* change UI name of all behaviors on language change
**/
function updateCards(){
  if (site_language == 'en'){
    $('#running_task_name').html(lastUsedBehaviors[1].translation[1]);
    $('#behavior_last').html(lastUsedBehaviors[0].translation[1]);
    $('#behavior_current').html(lastUsedBehaviors[1].translation[1]);
    $('#behavior_next').html(lastUsedBehaviors[2].translation[1]);
  } else {
    $('#running_task_name').html(lastUsedBehaviors[1].translation[0]);
    $('#behavior_last').html(lastUsedBehaviors[0].translation[0]);
    $('#behavior_current').html(lastUsedBehaviors[1].translation[0]);
    $('#behavior_next').html(lastUsedBehaviors[2].translation[0]);
  }
}

//maybe do this by id?
function drawActionArrows(){
  /*for (var i = 0; i < currentArrows.length; i++){
    currentArrows[i].remove();
  }
  currentArrows = [];

  numOfSteps = $("#behavior_sequence > div").length; //update to make sure it's correct value

  $('#behavior_sequence').children('div').each(function(index, child) {
    var aStep = child.childNodes[0]
    if (aStep.id > 1){
      var line = new LeaderLine(document.getElementById(aStep.id - 1), document.getElementById(aStep.id), {
        gradient: {
          startColor: 'rgba(125, 125, 125, 0.1)',
          endColor: 'rgba(125, 125, 125, 1)'
        },
        endPlugColor: 'rgba(125, 125, 125, 1)',
      });
      currentArrows.push(line);
    }
  });*/

}
