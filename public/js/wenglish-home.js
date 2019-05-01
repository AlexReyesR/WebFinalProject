const spanishKey = "c47cfc8c-fb4f-4f05-9a5c-8ca50a95ed45";
const learnerKey="a918126f-e9e9-4916-9b12-53cbcba2e97a";
const thesaurusKey = "a414d322-2ba5-458e-80a1-8fc3c994dedd";

$("#login-box-form").on("submit", event =>{
  event.preventDefault();
  let email = $("#login-form-inputemail").val();
  let pass = $("#login-form-inputpassword").val();

  //Check if there is an alert already created
  $("#login-box > .card-body > .alert").remove();

  if(email != "" && pass != "")
    loginRequest(email,pass);
  else unableToLogin();
});

$("#creat-user-form").on("submit", event => {
  event.preventDefault();
  let email = $("#create-user-inputemail").val();
  let password = $("#create-user-inputpassword").val();
  let passwordConfirm = $("#create-user-inputpasswordconfirm").val();

  //Check if there is an alert already created
  $("#create-user-box > .card-body > .alert").remove();

  if(email == "" || password == "")
    unableToCreate("empty");
  else if(password != passwordConfirm)
    unableToCreate("mismatch");
  else
    createUserRequest(email, password);
});

$("#create-topic-form").on("submit", event=> {
  event.preventDefault();
  let topicName = $("#create-topic-topicname").val();
  let topicWords = $("#create-topic-words").val();
  let wordsToAdd = stringToWordsArray(topicWords);
  console.log(wordsToAdd);
  $("#create-topic-err > .alert").remove();

  if(topicName == "")
    unableToCreateTopic("nombre");
  else if(topicWords == "")
    unableToCreateTopic("palabras");
  else if(wordsToAdd.length < 1)
    unableToCreateTopic("errorFormato");
  else
    createTopicRequest(topicName, wordsToAdd, sessionStorage.Username);

});

$(".translate-button").on("click", event => {
  let translationText = $("#translate-input").val();
  findTranslation(translationText, showTranslation);
});

$(".create-user").on("click", event => {
  $("#create-user-box").collapse("toggle");
});

$("#user-info-logout").on("click", event => {
  sessionStorage.UserLogged = false;
  sessionStorage.Username = null;
  $("#login-box").show();
  $("#user-info-box").hide();
});

function stringToWordsArray(string){
  let array = string.split(/[\s,]+/);
  if(string.search(';') < 0 || string.search('.') < 0 || string.search(':') < 0)
    return array;
  return [];
}

function findTranslation(wordToTranslate, callback){
  $.ajax({
    url : `https://www.dictionaryapi.com/api/v3/references/spanish/json/${wordToTranslate}?key=${spanishKey}`,
    method : "GET",
    dataType : "json",
    success : responseJson => callback(responseJson),
    error : err => console.log(err)
  });
}

function showTranslation(data) {
  $("#translation-result-text").html(`  <div class="font-weight-bold">
                                            Traducción(es):
                                          </div>`);

  data[0].shortdef.forEach(item => {
  $("#translation-result-text").append(`  <li>
                                              ${item}
                                            </li>`);
  })
  $("#translation-result").collapse("show");

  let firstDef = data[0].shortdef[0];
  firstDef = firstDef.split(" ");

  let translatedText;
  for (let i = 0; i < firstDef.length; i++) {
    if (firstDef[i] == ':') {
      translatedText = firstDef[i + 1];
      i = firstDef.length;
    }
  }

  if(!translatedText) {
    translatedText = firstDef[0];
  }

  translatedText = translatedText.replace( /[^a-zA-Z]/ , "");

  //console.log(translatedText);

  findDefinition(translatedText, showDefinition);
}

function findDefinition(englishWord, callback) {
  $.ajax({
    url : `https://www.dictionaryapi.com/api/v3/references/learners/json/${englishWord}?key=${learnerKey}`,
    method : "GET",
    dataType : "json",
    success : responseJson => callback(responseJson , englishWord),
    error : err => console.log(err)
  });
}

function showDefinition(data, englishWord) {
  let firstDef = data[0].shortdef[0];
  firstDef = firstDef.charAt(0).toUpperCase() + firstDef.slice(1) + ".";

  $("#translation-result-text").append(`  <div class = "font-weight-bold translationResultSection">
                                            Definición:
                                          </div>`);
  $("#translation-result-text").append(`  <li>
                                            ${firstDef}
                                          </li>`);

  //console.log("Learner definition:");
  //console.log(firstDef);

  findRelatedWords(englishWord, showRelatedWords);
}

function findRelatedWords(englishWord, callback) {
    $.ajax({
    url : `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${englishWord}?key=${thesaurusKey}`,
    method : "GET",
    dataType : "json",
    success : responseJson => callback(responseJson),
    error : err => console.log(err)
  });
}

function showRelatedWords(data) {
  let firstSyns;
  if(data[0].meta) {
    firstSyns = data[0].meta.syns[0];
  }
  else {
    firstSyns = data;
  }

  $("#translation-result-text").append(`  <div class = "font-weight-bold translationResultSection">
                                            Palabras relacionadas:
                                          </div>`);

  firstSyns.forEach(item => {
    $("#translation-result-text").append(`  <li>
                                              ${item}
                                            </li>`);
  })
}

function replaceLogin(){
  $("#user-info-email").text(sessionStorage.Username);
  $("#login-box").hide();
  $("#create-user-box").hide();
  $("#user-info-box").show();
}

function loginUserFromJson(data) {
  //Save in session storage the user logged user email
  console.log("Loggin in.");
  sessionStorage.UserLogged = true;
  sessionStorage.Username = data.userLogged.email;
  replaceLogin();
}

function loginUserFromCreateUser(data){
  console.log("Loggin in.");
  sessionStorage.UserLogged = true;
  sessionStorage.Username = data.user.email;
  replaceLogin();
}

function unableToLogin(){
  let errorAtLogin = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Problema al autenticar!</strong> <br/> Por favor revisa usuario y contraseña.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
  $("#login-box > .card-body").prepend(errorAtLogin);
  console.log("Error at login.");
}

function unableToCreateTopic(string){
  let errorAtCreate = "";
  if(string == "nombre"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Revisa los campos!</strong> <br/> Por favor llena todos los campos.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  } else if(string =="palabras"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Revisa los campos!</strong> <br/> Por favor escribe al menos una palabra.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  } else if(string =="errorFormato"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Error de formato!</strong> <br/> Por favor separa las palabras con comas únicamente.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  } else if(string =="alreadycreated"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Nombre utilizado!</strong> <br/> Por favor selecciona otro nombre.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  } else if (string == "creado"){
    errorAtCreate = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Topic creado!</strong> <br/> Topic creado satisfactoriamente.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;
    $("#create-topic-form").trigger('reset');
  }

  $("#create-topic-err").append(errorAtCreate);
  console.log(errorAtCreate);
}

function unableToCreate(string){
  let errorAtCreate = "";
  if(string == "empty"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Revisa los campos!</strong> <br/> Por favor llena todos los campos.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  } else if(string =="mismatch"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Revisa tu contraseña!</strong> <br/> La contraseña no concuerda.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  } else if(string =="alreadycreated"){
    errorAtCreate = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Correo en uso!</strong> <br/> Por favor utiliza otras credenciales.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  }
  $("#create-user-box > .card-body").prepend(errorAtCreate);
  console.log("Error at creation of topic.");
}

function loginRequest(userEmail, userPassword) {
  let url = `//localhost:8081/wenglish/users/login-user/${userEmail}&${userPassword}`;
  let settings = {
    method : "GET",
    headers : {
      'Content-Type' : 'application/json'
    }
  }

  fetch(url, settings)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      unableToLogin();
      throw new Error(response.statusText);
    }
  })
  .then(responseJSON => {
    loginUserFromJson(responseJSON);
  });
}

function getTodayDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today2 = dd + '-' + mm + '-' + yyyy;
  console.log(today2);
  return today2;
}

function createUserRequest(userEmail, userPassword){
  let url = `//localhost:8081/wenglish/users/post-user/`;
  let userDate = getTodayDate();
  let settings = {
    method : "POST",
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({email : userEmail, password : userPassword, creationDate : userDate})
  };
  console.log(settings);
  fetch(url,settings)
  .then(response => {
    if(response.ok){
      return response.json();
    } else {
      unableToCreate("alreadycreated");
      throw new Error(response.statusText);
    }
  })
  .then(responseJSON => {
    //TODO: There should be a Successfully created user
    loginUserFromCreateUser(responseJSON);
  });
}

function createTopicRequest(userTopic, wordsToAdd, userEmail){
  let url = "//localhost:8080/wenglish/topics/post-topic/";
  let settings = {
    method : "POST",
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({name: userTopic, words:wordsToAdd, creatorEmail: userEmail})
  };
  console.log(settings);
  fetch(url,settings)
  .then(response => {
    if(response.ok){
      return response.json();
    } else {
      unableToCreateTopic("alreadycreated");
      throw new Error(response.statusText);
    }
  })
  .then(responseJSON => {
    unableToCreateTopic("creado");
  });
}

function initializeUsers(){
  //Check in session storage if an user is already logged
  let isUserLogged = sessionStorage.UserLogged;
  if (typeof isUserLogged == 'undefined' || isUserLogged == null){
    //Create variable to let know the browser that anyuser is logged
    sessionStorage.UserLogged = false;
    sessionStorage.Username = null;
    console.log("Creating session storage variable for user logged.");
  } else {
    console.log("Session storage variable for user logged has already been created.");
  }
}

function checkIfLogged(){
  //Check in session storage if an user is already logged
  let isUserLogged = sessionStorage.UserLogged;
  let loggedUsername = isUserLogged ? sessionStorage.Username : null;
  //There is a user logged in
  if(isUserLogged == true || isUserLogged == "true"){
    console.log(isUserLogged);
    console.log(loggedUsername);
    replaceLogin();
  } else { //There is no user logged in
    console.log("There is no user logged in.");
  }
}

//For topics search
$(".search-topic-btn").on("click", event => {
  event.preventDefault();
  $("#translation-result").collapse("hide");
  let search_word = $("#search-input").val();
  searchTopics(search_word);
});

function searchTopics(search_word) {
  let url = `//localhost:8080/wenglish/topics/search-topics/${search_word}`;

  //console.log(`Search word: ${search_word}`);
  let settings = {
    method : "GET",
    headers : {
      'Content-Type' : 'application/json'
    }
  }

  fetch(url, settings)
    .then(response => {
      if (response.ok) {
        //console.log(`Response: ${response}`);
        return response.json();
      } else {
        if (response.statusText == "Not Found") {
          showNotFoundTopics();
        }
        throw new Error(response.statusText);
      }
    })
    .then(responseJSON => {
      showFoundTopics(responseJSON);
    });
}

function showNotFoundTopics() {
  $("#found-topics-list").html(`<div class="topic-info card mb-4 my-4">
                                  <div class="card-body">
                                    <h2 class="card-title">Tópico no encontrado</h2>
                                    <p class="card-text"> La búsqueda realizada no concuerda con ningún tópico existente. ¡Sé el primero en crearlo!</p>
                                  </div>
                                </div>`);
}

function showFoundTopics(data) {

  console.log(data.topics);
  let listed_words;
  for (let i = 0; i < data.topics.length; i++) {
    listed_words = "";
    for (let j = 0; j < data.topics[i].words.length; j++) {
      listed_words += ` <li> ${data.topics[i].words[j]} </li>`
    }

    if (i == 0) {
      $("#found-topics-list").html(` <div class="topic-info card mb-4 my-4">
                                      <div class="card-body">
                                        <h2 class="card-title">${data.topics[i].name}</h2>
                                        Palabras en este tópico:
                                        <ul class="card-text ">
                                          ${listed_words}
                                        </ul>
                                      </div>
                                      <div class="card-footer text-muted">
                                        Tópico creado por:
                                        <span class="topic-author-span"> ${data.topics[i].creatorEmail} </span>
                                      </div>
                                    </div>  `);
    }
    else {
      $("#found-topics-list").append(`  <div class="topic-info card mb-4 my-4"> 
                                          <div class="card-body">
                                            <h2 class="card-title">${data.topics[i].name}</h2>
                                            Palabras en este tópico:
                                            <ul class="card-text">
                                              ${listed_words}
                                            </ul>
                                          </div>
                                          <div class="card-footer text-muted">
                                            Tópico creado por:
                                            <span class="topic-author-span"> ${data.topics[i].creatorEmail} </span>
                                          </div>
                                        </div>`);
    }
  }
}

//Only for showing recent topics at first
function getAllTopics(){
  let url = "//localhost:8080/wenglish/topics/list-topics/";
  let settings = {
    method : "GET",
    headers : {
      'Content-Type' : 'application/json'
    }
  };
  fetch(url,settings)
  .then(response => {
    if(response.ok){
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  })
  .then(responseJSON => {
    showRecentTopics(responseJSON);
  });
}

function showRecentTopics(data) {
  //console.log(data.topics.length);
    let listed_words;
  for (let i = data.topics.length - 1; i > data.topics.length - 4; i--) {
    listed_words = "";
    for (let j = 0; j < data.topics[i].words.length; j++) {
      listed_words += ` <li> ${data.topics[i].words[j]} </li>`
    }

    $("#found-topics-list").append(`  <div class="topic-info card mb-4 my-4"> 
                                        <div class="card-body">
                                          <h2 class="card-title">${data.topics[i].name}</h2>
                                          Palabras en este tópico:
                                          <ul class="card-text">
                                            ${listed_words}
                                          </ul>
                                        </div>
                                        <div class="card-footer text-muted">
                                          Tópico creado por:
                                          <span class="topic-author-span"> ${data.topics[i].creatorEmail} </span>
                                        </div>
                                      </div>`);
  }
}

$(initializeUsers);
$(checkIfLogged);
$(getAllTopics);
