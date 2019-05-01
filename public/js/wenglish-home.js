const spanishKey = "c47cfc8c-fb4f-4f05-9a5c-8ca50a95ed45";
const learnerKey="a918126f-e9e9-4916-9b12-53cbcba2e97a";
const thesaurusKey = "a414d322-2ba5-458e-80a1-8fc3c994dedd";

function showTranslation(data) {
  $("#translation-result-text").html(data[0].shortdef);
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
  
  console.log(translatedText);
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

let usersDB;

function replaceLogin(){
  $("#user-info-email").text(sessionStorage.Username);
  $("#login-box").hide();
  $("#user-info-box").show();
}

function loginUserFromJson(data) {
  //Save in session storage the user logged user email
  console.log("Loggin in.");
  sessionStorage.UserLogged = true;
  sessionStorage.Username = data.userLogged.email;
  replaceLogin();
}

function unableToLogin(){
  console.log("Error in email or password");
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

function initializeUsers(){
  //Check in session storage if an user is already logged
  let isUserLogged = sessionStorage.UserLogged;
  if (typeof isUserLogged == 'undefined' || isUserLogged == null){
    //Create variable to let know the browser that anyuser is logged
    sessionStorage.UserLogged = false;
    console.log("Creating session storage variable for user logged.");
    sendGetUsers();
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

$("#login-box-form").on("submit", event =>{
  event.preventDefault();
  let email = $("#login-form-inputemail").val();
  let pass = $("#login-form-inputpassword").val();
  loginRequest(email,pass);
});

$(initializeUsers);
$(checkIfLogged);
