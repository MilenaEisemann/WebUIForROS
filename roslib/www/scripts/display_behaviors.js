function displayBehaviors(data){
  //deleting all content in wrapper
  while (document.getElementById("behavior_wrapper").firstChild) {
    document.getElementById("behavior_wrapper").removeChild(document.getElementById("behavior_wrapper").firstChild);
  }

  data.forEach(function(entry){
    if (entry.show){ //some entries might only be shown in db/for admin
      var cardColumn = document.createElement('div');
      cardColumn.className = 'col-sm-12 col-md-4';

      var card = document.createElement('div');
      card.className = 'card behavior-card';
      card.id = entry.id;
      card.onclick = function() {display_behavior(entry)};

      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      //use icon based on database string, else display hand as default icon
      if (entry.icon != null){
        var string = '<i class="fa fa-2x fa-' + entry.icon + ' aria-hidden="true"></i>';
      } else {
        var string = '<i class="fa fa-2x fa-' + 'hand-paper-o' + ' aria-hidden="true"></i>';
      }
      cardBody.innerHTML += string;

      var title = document.createElement('h3');
      //display ui_name in suitable language if possible
      if (typeof entry.languages !== undefined && entry.languages.length > 0){
        if(site_language == "en"){ //site_language defined in navbar.js
          title.innerText = entry.languages[1].translation.toUpperCase();
        } else {
          title.innerText = entry.languages[0].translation.toUpperCase();
        }
      } else { //fallback to behaviorname from system
        console.log("no ui_name");
        title.innerText = entry.name.toUpperCase();
      }

      title.className = 'card-title';
      cardBody.appendChild(title);
      card.appendChild(cardBody);
      cardColumn.appendChild(card);
      document.getElementById("behavior_wrapper").appendChild(cardColumn);
    }
  })
}
