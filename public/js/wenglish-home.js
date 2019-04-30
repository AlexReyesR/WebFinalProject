$(".translate-button").on("click", event => {
  let translationText = $("#translate-input").val();
  $("#translation-result-text").html(translationText);
  $("#translation-result").collapse("toggle");
});

$(".create-user").on("click", event => {
  $("#create-user-box").collapse("toggle");
});

let usersDB = [
  {
    username : "admin",
    password : "Admin"
  },
  {
    username : "hdsalazar",
    password : "123456"
  }
];

function initializeUsers(){
  //Check in session storage if an user is already logged
  let isUserLogged = sessionStorage.UserLogged;
  if (typeof isUserLogged == 'undefined' || isUserLogged == null){
    //Create variable to let know the browser that anyuser is logged
    sessionStorage.UserLogged = false;
    console.log("Creating session storage variable for user logged.");
  } else {
    console.log("Session storage variable for user logged has alreade been created.");
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
  } else { //There is no user logged in
    console.log("There is no user logged in.");
  }
}

function login(user, password){
  let wasLoginPossible = false;
  usersDB.forEach(item => {
    if(item.username == user)
      if(item.password == password){
        console.log("Loggin in.");
        sessionStorage.UserLogged = true;
        sessionStorage.Username = user;
        wasLoginPossible = true;
      }
  });
  //No user found or password mismatch
  if(!wasLoginPossible){
    sessionStorage.UserLogged = false;
    sessionStorage.Username = null;
    console.log("Error in user or password");
  }
}

$("#login-box-form").on("submit", event =>{
  event.preventDefault();
  let user = $("#login-form-inputuser").val();
  let pass = $("#login-form-inputpassword").val();
  login(user,pass);
});

$(initializeUsers);
$(checkIfLogged);
