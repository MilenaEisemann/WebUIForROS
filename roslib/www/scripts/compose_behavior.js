var numOfSteps = 0;
var currentArrows = [];

var newBehavior = {
  name: "",
  description: "",
  steps: []
};
var currentStepParams = new Map([]);

function saveNewBehavior(){
  $('#behavior_sequence').children('div > div').each(function(index, child) {
    var aStep = child.firstChild;
    console.log(index, aStep);
    console.log(aStep.firstChild);
    newBehavior.steps.push({behaviorName: "aStep", param: "aParam"});
    // check parameters + push to currentStepParams + empty currentStepParams
    // save in database
  });
  newBehavior.name = $('#new_behavior_name').val();
  newBehavior.description = $('#new_behavior_description').val();
  console.log(newBehavior);
}

function addBehaviorStep(){
  /*
  console.log("========================");
  console.log($("#behavior_sequence > div").length);
  console.log("========================");
  */
  numOfSteps = $("#behavior_sequence > div").length + 1;

  var allStepsContainer = document.getElementById("behavior_sequence");
  var row = document.createElement('div');
  row.className = 'row col-sm-12';

  var card = document.createElement('div');
  card.className = 'card';
  card.id = numOfSteps;
  var cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  var newStep = document.createElement('div');
  newStep.className = "step_title";
  newStep.innerHTML = "Step " + numOfSteps;

  fetchBehaviorNames().then(data => {
    //console.log("---------------------");
    //console.log(data);
    values = [];
    behaviorIds = [];
    var data = data;
    data.forEach(function(entry){
      if (typeof entry.languages[1] !== undefined && entry.languages[1] != null){
        values.push(entry.languages[1].translation);
        behaviorIds.push(entry.id);
      }
    });
    /*console.log("........");
    console.log(values);
    console.log(behaviorIds);*/

    var menuHtml = '<div class="dropdown" id=' + 'dropdown' + numOfSteps +'><button class="btn btn-dark dropdown-toggle" type="button" data-toggle="dropdown">'
    if (site_language == "en"){
      //menuHtml += '<span id="object-dropdown-text">' + polyglot_en.t("object-dropdown-text") + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
      menuHtml += '<span id="step-dropdown-text">' + 'choose behavior' + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
    } else {
      menuHtml += '<span id="stept-dropdown-text">' + 'Wähle Aufgabe' + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
    }
    for (i = 0; i < values.length; i++) {
      menuHtml += '<li class="dropdown-option">' + values[i] + '</li>';
    }
    menuHtml += '</ul></span>';
    var div = document.createElement("div");
    div.className = "dropdown_container";
    div.innerHTML = menuHtml;

    var string = '<i class="fa fa-2x fa-times clickable close-icon" id="close-icon" data-effect="fadeOut" aria-hidden="true"></i>';
    cardBody.innerHTML += string;
    //<span class="pull-right clickable close-icon" data-effect="fadeOut"><i class="fa fa-times"></i></span>
  //  cardBody.appendChild(span);
    cardBody.appendChild(newStep);
    cardBody.appendChild(div);
    card.appendChild(cardBody);
    row.appendChild(card);
    allStepsContainer.appendChild(row);

    //add on click to make close button remove card
    var closebtns =  document.getElementsByClassName("close-icon");
    var i = 0;
    for (i = 0; i < closebtns.length; i++) {
        closebtns[i].addEventListener("click", function() {
          this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode); //remove the row with card from parent container
          updateStepNumbers();
          updateDropdownIDs();
        });
    }

    var select = document.getElementById('dropdown'+numOfSteps);
      select.addEventListener('click', function(event){
      //console.log(event.target.innerText);
      if(values.indexOf(event.target.innerText) != -1) {//returned when not in array ot click on parent
        //alert(behaviorIds[values.indexOf(event.target.innerText)]);
        var div = document.createElement("div");
        div.innerHTML = event.target.innerText;
        select.parentNode.appendChild(div);
        //loadBehaviorInfo(behaviorIds[values.indexOf(event.target.innerText)], select.parentNode.parentNode);
        loadBehaviorInfo(behaviorIds[values.indexOf(event.target.innerText)], select.closest(".card").id);
        select.parentNode.removeChild(select);
      }
    })
    drawArrows();
})
}

function drawArrows(){
  for (var i = 0; i < currentArrows.length; i++){
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
  });
}

function updateStepNumbers(){
  numOfSteps = $("#behavior_sequence > div").length;
  console.log("numOfSteps" + numOfSteps);
  $('#behavior_sequence').children('div > div').each(function(index, child) {
    //console.log(index, child);
    child.firstChild.id = index + 1; //card gets updated index
    child.firstChild.querySelector(".step_title").innerHTML = "Step " + (index + 1); //update number in title of card
  });
  drawArrows(); //update arrows
}

function updateDropdownIDs(){
  $('#behavior_sequence').children('div > div').each(function(index, child) {
    var cardbodyChildren = child.childNodes[0].childNodes[0].childNodes;
    cardbodyChildren.forEach(function(x) {
      if (x.className == "dropdown_container"){
        x.childNodes[0].id = "dropdown" + child.firstChild.id;
      }
    })
    var dropdown = child.firstChild;

    //update EventListener
    dropdown.addEventListener('click', function(event){
      if(values.indexOf(event.target.innerText) != -1) {t
        var div = document.createElement("div");
        div.innerHTML = event.target.innerText;
        select.parentNode.appendChild(div);
        loadBehaviorInfo(behaviorIds[values.indexOf(event.target.innerText)], select.closest(".card").id);
        select.parentNode.removeChild(select);
      }
    })
});
}

function loadBehaviorInfo(behaviorId, id){
  getBehaviorById(behaviorId).then(data => {
    var behavior = data[0];
    if(behavior.params.length > 0){ // if there are parameters
    //if (typeof behavior.params !== 'undefined'){
    console.log(data);
      behavior.params.forEach(function(param){
        var parameterRow = document.createElement('div');
        parameterRow.className = 'row col-sm-12';
        var card = document.createElement('div');
        card.className = 'card border-0';
        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        //show param name
        if (site_language == "en"){
          cardBody.innerHTML = param.translations[1].en;
        } else {
          cardBody.innerHTML = param.translations[0].de;
        }

        card.appendChild(cardBody);
        parameterRow.appendChild(card);

        if (param.param.type == "string" || param.param.type == "float"){
          var input = document.createElement("input");
          input.id = param.param.name;
          input.setAttribute('type', 'text');
          if (param.param.default != null){
            input.setAttribute('value', param.param.default);
          }
          parameterRow.appendChild(input);
        } else if (param.param.type == "location" || param.param.type == "object"){

          var values = [];

          if(param.param.type == "object"){
            fetchObjects(site_language)
              .then(data => {
                // here you can access the data
              values = [];
              console.log("received data for objects");
              console.log(data);
              var data = data;
              data.forEach(function(entry){
                if (entry.translation != null){
                  values.push(entry.translation);
                } /* else {
                  values.push(entry.name);
                } */

              });

              var menuHtml = '<div class="dropdown" id=' + param.param.name +'><button class="btn btn-dark dropdown-toggle" type="button" data-toggle="dropdown">'
              if (site_language == "en"){
                menuHtml += '<span id="object-dropdown-text">' + polyglot_en.t("object-dropdown-text") + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
              } else {
                menuHtml += '<span id="object-dropdown-text">' + polyglot_de.t("object-dropdown-text") + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
              }
              for (i = 0; i < values.length; i++) {
                menuHtml += '<li class="dropdown-option">' + values[i] + '</li>';
              }
              menuHtml += '</ul></span>';
              var div = document.createElement("div");
              div.innerHTML = menuHtml;
              parameterRow.appendChild(div);
              //attach onClick Listener to parent
              var select = document.getElementById(param.param.name);
                select.addEventListener('click', function(event){
                $('#object-dropdown-text').html(event.target.innerText);
              })
            });

          } else if (param.param.type == "location"){
            fetchLocations(site_language)
              .then(data => {
                values = [];
                // here you can access the data
                console.log("received data");
                console.log(data);
                var data = data;
                data.forEach(function(entry){
                  values.push(entry.name);
                });

                var menuHtml = '<div class="dropdown" id=' + param.param.name +'><button class="btn btn-dark dropdown-toggle" type="button" data-toggle="dropdown">';
                if (site_language == "en"){
                  menuHtml += '<span id="location-dropdown-text">' + polyglot_en.t("location-dropdown-text") + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
                } else {
                  menuHtml += '<span id="location-dropdown-text">' + polyglot_de.t("location-dropdown-text") + '</span><span class="caret"></span></button><ul class="dropdown-menu">';
                }
                for (i = 0; i < values.length; i++) {
                  menuHtml += '<li class="dropdown-option">' + values[i] + '</li>';
                }
                menuHtml += '</ul></span>';
                var div = document.createElement("div");
                div.innerHTML = menuHtml;
                parameterRow.appendChild(div);
                var select = document.getElementById(param.param.name);
                  select.addEventListener('click', function(event){
                  $('#location-dropdown-text').html(event.target.innerText);
                })
              });
            }
        }
        document.getElementById(id).firstChild.appendChild(parameterRow);
        drawArrows();
      })
    }
  })
}
