var processingStepsFromMessage = false; //to avoid calling async/slower process of displaying steps multiple times

/**
* fct uses list of all actions in current task received through message on /robot_status
* checks for each action in db
* returns Promise that contains num of all valid Steps and num of all valid finishes stepsModal
* calls showProgress()
**/
function getStepsForProgress(message){
  return new Promise((resolve, reject) => {
    if(message.allActions.length > 0){
      var numOfFinishedSteps = 0;
      var numOfSteps = 0;
      message.allActions.forEach(function(action, i) {
        fetchAction(message.allActions[i], site_language) //wait until value for ros param received
          .then(value => {
            numOfSteps++;
            lastUsedActions = numOfSteps;

            if (i < message.indexCurrent){;
              numOfFinishedSteps++;
            }

            //gets executed when we went trough all steps and reached last one
            if(i == message.allActions.length - 1){
              resolve(showProgress(numOfFinishedSteps, numOfSteps));
            }
          });
        });
      } else {
        var numOfFinishedSteps = 0;
        var numOfSteps = -1;
        resolve(showProgress(numOfFinishedSteps, numOfSteps)); //value < 0 means invalid
      }
    });
}

/**
* fct displays a row with icon + action name for each step in the running behavior in a modal
* uses checkAction to display step only if we have valid translation of its name
* if step is already finished, colour of icon is changed depending on if action finished successfully or failed
**/
function showSteps(message){
  //clears container
  while (document.getElementById("allSteps").firstChild) {
    document.getElementById("allSteps").removeChild(document.getElementById("allSteps").firstChild);
  }

  message.allActions.forEach(function(action, i) {
    //console.log(message.allActions[i]);
    fetchAction(message.allActions[i], site_language) //wait until value for ros param received
      .then(value => {
        if(checkAction(value[0])){
          var cardColumn = document.createElement('div');
          cardColumn.className = 'col-sm-12 action-container';
          cardColumn.id = "action_" + i;
          
          //display of icon
          if (i < message.indexCurrent){
            if (message.actionResults[i] == "failed"){
              if (value[0].icon != null){
                var icon = '<i class="action_failed fa fa-2x fa-' + value[0].icon + ' aria-hidden="true"></i>';
              } else {
                var icon = '<i class="action_failed fa fa-2x fa-' + 'hand-paper-o' + '" aria-hidden="true"></i>';
              }
            } else {
              if (value[0].icon != null){
                var icon = '<i class="action_succeeded fa fa-2x fa-' + value[0].icon + ' aria-hidden="true"></i>';
              } else {
                var icon = '<i class="action_succeeded fa fa-2x fa-' + 'hand-paper-o' + '" aria-hidden="true"></i>';
              }
            }
          } else if (i == message.indexCurrent){
            if (value[0].icon != null){
              var icon = '<i class="running_action fa fa-2x fa-' + value[0].icon + '" aria-hidden="true"></i>';
            } else {
              var icon = '<i class="running_action fa fa-2x fa-' + 'hand-paper-o' + '" aria-hidden="true"></i>';
            }
          } else {
            if (value[0].icon != null){
              var icon = '<i class="future_action fa fa-2x fa-' + value[0].icon + '" aria-hidden="true"></i>';
            } else {
              var icon = '<i class="future_action fa fa-2x fa-' + 'hand-paper-o' + '" aria-hidden="true"></i>';
            }
          }
          cardColumn.innerHTML = icon;

          var step = document.createElement('span');
          step.className = "my-auto";
          step.innerHTML += value[0].translation;
          cardColumn.appendChild(step);
          document.getElementById("allSteps").appendChild(cardColumn);

          //if all steps done compute process
          if(i == message.allActions.length - 1){
            var numOfSteps = document.getElementById("allSteps").children.length;

            showProgress(numOfFinishedSteps, numOfSteps);
            processingStepsFromMessage = false;
          }
        }
      })

      //display behavior name as modal title
      getBehaviorById("BehaviorsNew/" + message.currentTask).then(data => {
        if (site_language == 'en'){
          $('#runningBehaviorName').html(data[0].languages[1].translation);
        } else {
          $('#runningBehaviorName').html(data[0].languages[0].translation);
        }
      })

      $('#stepsModal').modal({ show: true});
  });
}

/**
* fct checks if an action has a translation value, if so it returns true
**/
function checkAction(anAction){
  if (anAction.translation == null){
    return false;
  }
  return true;
}

/**
* fct returns value of how many steps of the behavior are already done as a float between 0 and 1
**/
function showProgress(numOfFinishedSteps, numOfSteps){
  var progress = numOfFinishedSteps / numOfSteps;
  console.log("task is finished around " +  progress);
  return progress;
}
