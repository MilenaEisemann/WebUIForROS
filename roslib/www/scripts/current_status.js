//global variables
  var lastActiveAction = -1;
  //date used for display of time of messages
  var today = new Date();
  var time;

  // popovers Initialization
  $(function () {
    $("[data-toggle=popover]").popover();
  })

function displayRobotInfo(m){
  //display robot information
  while (document.getElementById("robot_info").firstChild) {
    document.getElementById("robot_info").removeChild(document.getElementById("robot_info").firstChild);
  }

  //var robotName = document.createElement("span");
  //robotName.innerHTML = m.robot_name + " - " + '<i class="fa fa-battery-half" aria-hidden="true"></i>';
  //document.getElementById("robot_info").appendChild(robotName);
  var batteryStatus = document.createElement("span");
  batteryStatus.innerHTML = (m.batteryCapacity*100).toFixed(0) + "%";
  document.getElementById("robot_info").appendChild(batteryStatus);

  today = new Date();
  time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2);

  var currently = document.createElement("span");
  currently.id = "running_task_name";
  currently.innerHTML = " - " + m.currentTask;

  var button = document.createElement("button");
  button.innerHTML = "pause";
  button.className = "btn btn-danger";
  button.id = "pause_and_continue_button";
  button.addEventListener('click', function(event){pauseContinueBehavior()});
  //$("#behaviorPauseButton").click(function(){pauseBehavior()});

  document.getElementById("current_task").appendChild(currently);
  document.getElementById("running_task_name").appendChild(button);

  var button2 = document.createElement("button");
  button2.innerHTML = "stop";
  button2.className = "btn btn-danger";
  button2.id = "stop_behavior_button";
  button2.addEventListener('click', function(event){stopBehavior()});

  document.getElementById("running_task_name").appendChild(button2);

  if (m.current_action_index == window.lastActiveAction){ //window because it is global var
    //updateCards(m);
  } else {
    //displayActionCards(m);
    displayActionCardsNew(m);
    displayMessage(m);
  }

  window.lastActiveAction = m.current_action_index;
  //display actions from list
  /*while (document.getElementById("current_status").firstChild) {
    document.getElementById("current_status").removeChild(document.getElementById("current_status").firstChild);
  }
  var current_action = m.current_action_index;

  for (i = 0; i < m.action_list.length; i++){
    var anAction = document.createElement("p");
    anAction.innerHTML = m.action_list[i];
    if (i < current_action){ //change style of finished actions
      if (m.past_actions_result[i] == "success"){
        anAction.className += "finished_success";
      } else {
        anAction.className += "finished_failure";
      }
    } else if(i == current_action){ //change style of active action
      anAction.className += "current_action";
    }
    document.getElementById("current_status").appendChild(anAction)
  }

  //display message strings from robot
  var aMessage = document.createElement("div");
  aMessage.innerHTML = m.message;
  if(m.message_type == "err"){
    aMessage.className += "err_message";
  } else if (m.message_type == "warn"){
    aMessage.className += "warn_message";
  }
  document.getElementById("robot_messages").appendChild(aMessage);
  */
}

function displayMessage(m){
  var message = document.createElement("div");
  message.innerHTML = window.time + " - " + m.message;
  if(m.message_type == "err"){
    message.className += "err_message";
  } else if (m.message_type == "warn"){
    message.className += "warn_message";
  }
  document.getElementById("robot_messages").appendChild(message);
}

function displayActionCardsNew(m){
  while (document.getElementById("card_container").firstChild) {
    document.getElementById("card_container").removeChild(document.getElementById("card_container").firstChild);
  }

  //display past action
  //placeholder
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-2';
  document.getElementById("card_container").appendChild(cardColumn);

  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-2';

  //last action
  if(typeof m.lastAction != ''){
    var card = document.createElement('div');
    card.className = 'card h-75';
    card.id = "last_action_card";

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

    var title = document.createElement('h3');
    title.innerText = m.lastAction.toUpperCase();
    title.className = 'card-title';
    cardBody.appendChild(title);

    card.appendChild(cardBody);

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
  cardColumn.className = 'col-sm-4';

  if(typeof m.currentAction != ''){
    var card = document.createElement('div');
    card.className = 'card h-75';
    card.id = "current_action_card";

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

    var title = document.createElement('h3');
    title.innerText = m.currentAction.toUpperCase();
    title.className = 'card-title';
    cardBody.appendChild(title);
    cardBody.innerHTML += '<div class="progress"> <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%; background-color: grey;"></div></div>'
    card.appendChild(cardBody);
    cardColumn.appendChild(card);
    document.getElementById("card_container").appendChild(cardColumn);
  }

  //last action
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-2';
  document.getElementById("card_container").appendChild(cardColumn);

  if(typeof m.nextAction != ''){
    var card = document.createElement('div');
    card.className = 'card h-75';
    card.id = "next_action_card";

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

    var title = document.createElement('h3');
    title.innerText = m.nextAction.toUpperCase();
    title.className = 'card-title';
    cardBody.appendChild(title);

    card.appendChild(cardBody);
    cardColumn.appendChild(card);
    document.getElementById("card_container").appendChild(cardColumn);
  }

  //placeholder
  var cardColumn = document.createElement('div');
  cardColumn.className = 'col-sm-2';
  document.getElementById("card_container").appendChild(cardColumn);

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
    line.id = "arrow_last_to_current";
  }
  //connection to message field - thicker line
  if(document.getElementById("current_action_card") != null){
    var line = new LeaderLine(document.getElementById("current_action_card"), document.getElementById("robot_messages"), {
      color: 'white',
      size: 8,
      startPlug: 'behind',
      endPlug: 'behind'
    });
    line.id = "arrow_messages_to_current_action";
  }
  /*
  for (i = m.current_action_index - 2; i < m.current_action_index + 3; i++){

    var cardColumn = document.createElement('div');
    cardColumn.className = 'col-sm-2';

    if (typeof m.action_list[i] !== 'undefined'){
      var card = document.createElement('div');
      card.className = 'card';

      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

      var title = document.createElement('h3');
      title.innerText = m.action_list[i].toUpperCase();
      title.className = 'card-title';
      cardBody.appendChild(title);

      if (i < m.current_action_index){ //change style of finished actions
        if (m.past_actions_result[i] == "failure"){
          card.className += " border-danger";
        } else {
          card.className += " border-success";
        }
      }

      if(i == m.current_action_index){ //change style of active action
        cardColumn.className = 'col-sm-4';
        //display message strings from robot
        var message = document.createElement("div");
        message.innerHTML = window.time + " - " + m.message;
        if(m.message_type == "err"){
          message.className += "err_message";
        } else if (m.message_type == "warn"){
          message.className += "warn_message";
        }
        //document.getElementById("robot_messages").appendChild(message); not working
        cardBody.innerHTML += '<div class="progress"> <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%; background-color: grey;"></div></div>'

        document.getElementById("robot_messages").appendChild(message);
      }

      card.appendChild(cardBody);
      card.id = "card" + i;

      cardColumn.appendChild(card);
      /*if(i == m.current_action_index){
        cardColumn.innerHTML += '<div class="vertical-line"></div>';
      }*/
  /*  }
    document.getElementById("card_container").appendChild(cardColumn);
  } */

}

function displayActionCards(m){
  while (document.getElementById("card_container").firstChild) {
    document.getElementById("card_container").removeChild(document.getElementById("card_container").firstChild);
  }

  for (i = m.current_action_index - 2; i < m.current_action_index + 3; i++){

    var cardColumn = document.createElement('div');
    cardColumn.className = 'col-sm-2';

    if (typeof m.action_list[i] !== 'undefined'){
      var card = document.createElement('div');
      card.className = 'card';

      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      cardBody.innerHTML += '<i class="fa fa-hand-paper-o fa-2x" aria-hidden="true"></i>';

      var title = document.createElement('h3');
      title.innerText = m.action_list[i].toUpperCase();
      title.className = 'card-title';
      cardBody.appendChild(title);

      if (i < m.current_action_index){ //change style of finished actions
        if (m.past_actions_result[i] == "failure"){
          card.className += " border-danger";
        } else {
          card.className += " border-success";
        }
      }

      if(i == m.current_action_index){ //change style of active action
        cardColumn.className = 'col-sm-4';
        //display message strings from robot
        var message = document.createElement("div");
        message.innerHTML = window.time + " - " + m.message;
        if(m.message_type == "err"){
          message.className += "err_message";
        } else if (m.message_type == "warn"){
          message.className += "warn_message";
        }
        //document.getElementById("robot_messages").appendChild(message); not working
        cardBody.innerHTML += '<div class="progress"> <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%; background-color: grey;"></div></div>'

        document.getElementById("robot_messages").appendChild(message);
      }

      card.appendChild(cardBody);
      card.id = "card" + i;

      cardColumn.appendChild(card);
      /*if(i == m.current_action_index){
        cardColumn.innerHTML += '<div class="vertical-line"></div>';
      }*/
    }
    document.getElementById("card_container").appendChild(cardColumn);
  }

}

function updateCards(m){
  console.log("update card " + m.current_action_index);
  console.log(document.getElementById("card" + m.current_action_index).firstElementChild);
  var message = document.createElement("div");
  message.innerHTML = window.time + " - " + m.message;;
  if(m.message_type == "err"){
    message.className += "err_message";
  } else if (m.message_type == "warn"){
    message.className += "warn_message";
  }
  document.getElementById("robot_messages").appendChild(message);
  //var currentCard = document.getElementById("card" + m.current_action_index).firstElementChild.appendChild(message);
}
