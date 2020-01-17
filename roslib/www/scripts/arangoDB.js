/*$(function(){
  axios.get('http://127.0.0.1:8529/_db/knowledge-base/_api/document/Objects/81780')
  .then(function (response) {
    //resultElement.innerHTML = generateSuccessHTMLOutput(response);
    console.log(response.data);
  })
  .catch(function (error) {
    //resultElement.innerHTML = generateErrorHTMLOutput(error);
    console.log(error);
  });
})*/

var databaseURL = "http://127.0.0.1:8529/_db/knowledge-base/_api/";

$(function(){
  //getAllObjects();

  //getAllBehaviors();
  getAllBehaviors();

  //getObjects();
  //updateBehavior(79283, "updatedBehavior", "coffee");
  //addBehavior("testBehavior", "compass");
  //deleteBehavior(40693);
  //getBehavior(40693);
})

function getAllObjects(){
  axios.post(databaseURL + 'cursor', {
    "query": "FOR obj IN Objects return obj"
  })
  .then(function (response) {
    console.log("getting all objects", response.data.result);
  })
  .catch(function (error) {
    console.log(error);
  });
}

/*
getNameById (id) {
  return axios.get('/names/?ids=' + id)
      .then(response => {
        this.response = response.data
        return this.response[0].name
      })
  }*/

//gets string to show in UI in current language
function getRobotMessage(id, language){
  var query = `for m in Robotmessages
                filter m.name == "`+ id + `"
                  for l, e, p in 1..1 outbound m._id Relations
                    filter l.name == "` + language + `"
                      return p.edges[0].translation`
  return axios.post(databaseURL + 'cursor', {
    "query": query
  })
  .then(function (response) {
    console.log("fetch message", response.data.result[0]);
    return(response.data.result[0]);
  })
  .catch(function (error) {
    console.log(error);
  })
}


function fetchLocations(language){
  var query = `for o in Objects let list = (
    for j, e, p in 1..1 outbound o._id Relations prune  e.type == "is_at"
        filter IS_SAME_COLLECTION("Objects", j._id)
            filter e.type == "is_at" || e.type == "is_part_of"
                filter e.type != "is_a"
                    filter p.edges[0].type != "prob_is_at"
    return j)
    filter count(list) > 0
        for l2, e2, p2 in 1..1 outbound o._id Relations
            filter p2.edges[0].type == "has_property" && l2.name == "` + language + `"
                return {id: o._id, name: o.name, translation: e2.translation}`;
  return axios.post(databaseURL + 'cursor', {
    "query": query
    //"query": 'for o in Objects let list = (for j, e, p in 1..1 outbound o._id Relations prune  e.type == "is_at" filter IS_SAME_COLLECTION("Objects", j._id) filter e.type == "is_at" || e.type == "is_part_of" filter e.type != "is_a" filter p.edges[0].type != "prob_is_at" return j) filter count(list) > 0 return {id: o._id, name: o.name}'
    //"query": 'for o in Objects for l, e, p in 1..1 outbound o._id Relations let list = (for j, k, m in 1..1 outbound o._id Relations prune  k.type == "is_at" filter IS_SAME_COLLECTION("Objects", j._id) filter k.type == "is_at" || k.type == "is_part_of" filter k.type != "is_a" filter m.edges[0].type != "prob_is_at" return j)filter count(list) == 0 filter p.edges[0].type == "is_a" return {id: o._id, name: l.name, saystring: first(for t in @@c filter t.key == p.vertices[1]._id return t.saystring)}'
  })
  .then(function (response) {
    console.log("fetch locations", response.data.result);
    return(response.data.result);
  })
  .catch(function (error) {
    console.log(error);
  })
}


function fetchObjects(language){
  var query = `for o in Objects
    for l, e, p in 1..1 outbound o._id Relations
        let list = (for j, k, m in 1..1 outbound o._id Relations
            prune  k.type == "is_at"
            filter IS_SAME_COLLECTION("Objects", j._id)
            filter k.type == "is_at" || k.type == "is_part_of"
            filter k.type != "is_a"
            filter m.edges[0].type != "prob_is_at"
            return j)
        filter count(list) == 0
        filter p.edges[0].type == "is_a"
        for l2, e2, p2 in 1..1 outbound l._id Relations
              filter p2.edges[0].type == "has_property" && l2.name == "` + language + `"
        return {id: o._id, name: l.name, translation: e2.translation}`;

  return axios.post(databaseURL + 'cursor', {
    "query": query
  //  "query": 'for o in Objects for l, e, p in 1..1 outbound o._id Relations filter p.edges[0].type == "is_a" return {id: o._id, name: l.name}'
    //"query": 'for o in Objects for l, e, p in 1..1 outbound o._id Relations filter p.edges[0].type == "is_a" return {id: o._id, name: l.name, saystring: first(for t in ' + language + ' filter t.key == p.vertices[1]._id return t.saystring)}'
  })
  .then(function (response) {
    console.log("fetch real objects", response.data.result);
    return(response.data.result);
  })
  .catch(function (error) {
    console.log(error);
  })
}

/*
for o in Objects
    for l, e, p in 1..1 outbound o._id Relations
        filter p.edges[0].type == "is_a"
            for l2, e2, p2 in 1..1 outbound l._id Relations
              filter p2.edges[0].type == "has_property" && l2.name == @c
                    return {id: o._id, name: l.name, translation: e2.translation}
*/

/*
function getAllBehaviors(){
  axios.post(databaseURL + 'cursor', {
    "query": "FOR behavior IN Behaviors return behavior"
  })
  .then(function (response) {
    console.log("getting all behaviors", response.data.result);
    displayBehaviors(response.data.result);
    return response.data.result;
  })
  .catch(function (error) {
    console.log(error);
  });
}*/

function fetchBehaviorNames(){
  var query = ` for b in BehaviorsNew
        LET icon = First(
            for l, e, p in 1..1 outbound b._id Relations
                filter p.edges[0].type == "has_property" && p.vertices[1].name == "Icon"
                    return p.edges[0].name
        )
        LET languages = (
            for l, e, p in 1..1 outbound b._id Relations
                filter p.edges[0].type == "has_property"
                    filter p.edges[0].translation != null
                        SORT p.vertices[1].name ASC //sort so edge to de always first in array
                            return {translation: p.edges[0].translation, description: p.edges[0].description}
        )
        LET params = (
            for l, e, p in 1..1 outbound b._id Relations
                for a, d, edge in 1..1 outbound l._id Relations
                    filter a.name == "Parameter"
                    RETURN {
                        param: edge.vertices[0],
                        translations: (
                            for l2, e2, p2 in 1..1 outbound edge.vertices[0]._id Relations
                                filter p2.vertices[1].name != "Parameter"
                                    SORT p2.vertices[1].name ASC
                                        return {[p2.vertices[1].name]: p2.edges[0].translation}
                        )
                    }
        )
        LET specs = (
             for l, e, p in 1..1 outbound b._id Relations
                filter l.name == "BehaviorSpecs"
                return e
        )
        return {id: b._id, name: b.name, show: b.showInUI, icon: icon, languages: languages, params: params, specs: specs}`;

  return axios.post(databaseURL + 'cursor', {
  //  "query": 'for o in Objects for l, e, p in 1..1 outbound o._id Relations filter p.edges[0].type == "is_a" return {id: o._id, name: l.name}'
    "query": query
  })
  .then(function (response) {
    console.log("fetch object names", response.data.result);
    return(response.data.result);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function getBehaviorById(id){
  var query = `for b in BehaviorsNew
    filter b._id == "` + id + `"
        LET icon = First(
            for l, e, p in 1..1 outbound b._id Relations
                filter p.edges[0].type == "has_property" && p.vertices[1].name == "Icon"
                    return p.edges[0].name
        )
        LET languages = (
            for l, e, p in 1..1 outbound b._id Relations
                filter p.edges[0].type == "has_property"
                    filter p.edges[0].translation != null
                        SORT p.vertices[1].name ASC //sort so edge to de always first in array
                            return {translation: p.edges[0].translation, description: p.edges[0].description}
        )
        LET params = (
            for l, e, p in 1..1 outbound b._id Relations
                for a, d, edge in 1..1 outbound l._id Relations
                    filter a.name == "Parameter"
                    RETURN {
                        param: edge.vertices[0],
                        translations: (
                            for l2, e2, p2 in 1..1 outbound edge.vertices[0]._id Relations
                                filter p2.vertices[1].name != "Parameter"
                                    SORT p2.vertices[1].name ASC
                                        return {[p2.vertices[1].name]: p2.edges[0].translation}
                        )
                    }
        )
        LET specs = (
             for l, e, p in 1..1 outbound b._id Relations
                filter l.name == "BehaviorSpecs"
                return e
        )
        return {id: b._id, name: b.name, show: b.showInUI, icon: icon, languages: languages, params: params, specs: specs}`;

  return axios.post(databaseURL + 'cursor', {
  //  "query": 'for o in Objects for l, e, p in 1..1 outbound o._id Relations filter p.edges[0].type == "is_a" return {id: o._id, name: l.name}'
    "query": query
  })
  .then(function (response) {
    console.log("???????????????", response.data.result);
    return(response.data.result);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function getAllBehaviors(){
  var query = ` for b in BehaviorsNew
        LET icon = First(
            for l, e, p in 1..1 outbound b._id Relations
                filter p.edges[0].type == "has_property" && p.vertices[1].name == "Icon"
                    return p.edges[0].name
        )
        LET languages = (
            for l, e, p in 1..1 outbound b._id Relations
                filter p.edges[0].type == "has_property"
                    filter p.edges[0].translation != null
                        SORT p.vertices[1].name ASC //sort so edge to de always first in array
                            return {translation: p.edges[0].translation, description: p.edges[0].description}
        )
        LET params = (
            for l, e, p in 1..1 outbound b._id Relations
                for a, d, edge in 1..1 outbound l._id Relations
                    filter a.name == "Parameter"
                    RETURN {
                        param: edge.vertices[0],
                        translations: (
                            for l2, e2, p2 in 1..1 outbound edge.vertices[0]._id Relations
                                filter p2.vertices[1].name != "Parameter"
                                    SORT p2.vertices[1].name ASC
                                        return {[p2.vertices[1].name]: p2.edges[0].translation}
                        )
                    }
        )
        LET specs = (
             for l, e, p in 1..1 outbound b._id Relations
                filter l.name == "BehaviorSpecs"
                return e
        )
        return {id: b._id, name: b.name, show: b.showInUI, icon: icon, languages: languages, params: params, specs: specs}`;
  axios.post(databaseURL + 'cursor', {
    "query": query
  })
  .then(function (response) {
    console.log("getting all behaviors", response.data.result);
    displayBehaviors(response.data.result);
    return response.data.result;
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getBehavior(document_key){
  axios.get(databaseURL + 'document/Behaviors/' + document_key.toString())
  .then(function (response) {
    console.log("get one behavior", response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function addBehavior(name, icon){
  axios.post(databaseURL + 'document/Behaviors', {
    "name": name,
    "icon": icon
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

/*
function update(){
  var options = {
    method: 'patch',
    url: databaseURL + 'document/Behaviors',
    data: {
      name: "test",
      icon: "compass"
    }
  }
}
*/
/*
function update2(){
  'UPDATE "PhilCarpenter" WITH {
    status: "active",
    location: "Beijing"
} IN users'

}*/

function deleteBehavior(document_key){
  axios.get(databaseURL + 'document/Behaviors/' + document_key.toString())
  .then(function (response) {
    console.log("get one behavior", response.data);
    axios.delete(databaseURL + 'document/Behaviors/' + document_key.toString())
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  })
  .catch(function (error) {
    console.log("document is not in db - ", error);
  });
}

function updateBehavior(document_key, name, icon){
  axios.patch(databaseURL + '/document/Behaviors/' + document_key, {
    //"query": "FOR b IN Behaviors FILTER name=='testBehavior' UPDATE b WITH {name: 'name'}"
    "name" : name,
    "icon" : icon
  }).then(function (response) {
    console.log(response);
    getAllBehaviors();
  })
  .catch(function (error) {
    console.log(error);
  });
}

  /*axios.delete('http://127.0.0.1:8529/_db/knowledge-base/_api/document/Behaviors/' + document_key.toString())
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });*/
