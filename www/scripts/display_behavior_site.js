$(function () {
  $('#behaviorModal').modal({ show: false})

  /*$('#addBehaviorButton').on('click', function(event) {
    //event.preventDefault(); // To prevent following the link (optional)
    console.log("tst");
    //$('#behaviorModal').modal({ show: false});
    //startBehavior();
  });*/
})

function display_behavior(behavior){
  //use icon based on database string, else display hand as default icon
  if (behavior.icon != null){
    var icon = '<i class="fa fa-2x fa-' + behavior.icon + ' aria-hidden="true"></i>';
  } else {
    var icon = '<i class="fa fa-2x fa-' + 'hand-paper-o' + ' aria-hidden="true"></i>';
  }
  document.getElementById("behaviorName").innerHTML = icon;
  if(typeof behavior.languages !== 'undefined'){
    if (site_language == "en"){
      document.getElementById("behaviorName").innerHTML += behavior.languages[1].translation;
    } else {
      document.getElementById("behaviorName").innerHTML += behavior.languages[0].translation;
    }
  //  document.getElementById("behaviorName").innerHTML += behavior.ui_name.en;
  } else {
    document.getElementById("behaviorName").innerHTML += behavior.name;
  }
  while (document.getElementById("behavior_content").firstChild) {
    document.getElementById("behavior_content").removeChild(document.getElementById("behavior_content").firstChild);
  }
  while (document.getElementById("description_content").firstChild) {
    document.getElementById("description_content").innerHTML = "";
  }

  //add description of behavior
  if (typeof behavior.languages[1].description != 'undefined' && behavior.languages[1].description != ""){
    var description = document.createElement('div');
    description.className = "behavior_description";
    if (site_language == "en"){
      description.innerHTML = behavior.languages[1].description;
    } else {
      description.innerHTML = behavior.languages[0].description;
    }
    document.getElementById("description_content").appendChild(description);
  }

  if(behavior.params.length > 0){ // if there are parameters
  //if (typeof behavior.params !== 'undefined'){
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
              } /*else {
                values.push(entry.name);
              }*/

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
                values.push(entry.translation);
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
      document.getElementById("behavior_content").appendChild(parameterRow);
    }) //end for each behavior param
  }
  $('#behaviorModal').modal('show');
  /*
  var startButton = document.getElementById("start-button");
  var string = "startBehavior(" + behavior._key + ");";
  startButton.setAttribute("onclick", string);*/

  //add onclick fct to start chosen function
  document.getElementById('start-button').onclick = function(){ startBehavior(behavior); } ;
}
