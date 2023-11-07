onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user, "logged In");
    changePage("");
    let uid = user.uid;
    globaluid = uid;
  } else {
    console.log("No User");
    changePage("signout");
  }
});

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");
  //   console.log(hashTag + ' ' + pageID);

  changePage(pageID);
}

function changePage(pageID) {
  switch (pageID) {
    case "":
      $.get(`pages/logged/logged.html`, function (data) {
        console.log("data " + data);
        $("#app").html(data);
        getmealData();
      });
      break;
    case "stats":
      $.get(`pages/${pageID}/pageID.html`, function (data) {
        console.log("data " + data);
        $("#app").html(data);
        getstatsData();
      });
      break;
    case "signIn":
      $("#app").append(
        `<div class="newUser">
              <h2>Welcome to MacroTrack</h2>
              <p>
                A simple way to track your macros throughout the day. As easy as
                signing up and tracking your food!
              </p>
              <div class="signIn">
                <label for="fname">First Name:</label>
                <input type="text" id="fname" />
                <label for="lname">Last Name:</label>
                <input type="text" id="lname" />
                <label for="email">Email Address:</label>
                <input type="email" id="email" />
                <label for="pw">Password:</label>
                <input type="password" id="pw" />
                <input type="submit" value="Add User" id="addUser" />
              </div>
              <div class="loginBox">
                <label for="email">Email Address:</label>
                <input type="email" id="emailL" />
                <label for="pw">Password:</label>
                <input type="password" id="pwL" />
                <input type="submit" value="Log In" id="logIn" />
              </div>
            </div>`
      );
      var addUserBtn = document.getElementById("addUser");
      addUserBtn.addEventListener("click", addUserToDB);
      var logInBtn = document.getElementById("logIn");
      logInBtn.addEventListener("click", login);
      break;
    case "prev":
      $.get(`pages/${pageID}/pageID.html`, function (data) {
        console.log("data " + data);
        $("#app").html(data);
        getprevData();
      });

      break;
    default:
      $.get(`pages/${pageID}/pageID.html`, function (data) {
        console.log("data " + data);
        $("#app").html(data);
      });
      break;
  }
}

window.peaceOut = peaceOut;
// import { changeRoute } from "./model";
// model function for routing pages
var model = (function () {
  var _placeholder = function (pageID) {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      $("#app").html(data);
    });
  };
  return {
    placeholder: _placeholder,
  };
})();
// route function for changing pages with User passed over to check for auth
function route(user) {
  // we are relying on the user so check for user
  if (user != null) {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/", "");
    globaluid = user.uid;
    // if statement for routing to the home page if user is there
    if (pageID == "") {
      model.placeholder("logged");
      console.log("Grabbing: logged");
      getmealData();
    } else if (pageID == "stats") {
      // this is for other pages that the user would use
      model.placeholder(pageID);
      console.log("Grabbing: " + pageID);
      getstatsData();
    } else if (pageID == "prev") {
      model.placeholder(pageID);
      console.log("Grabbing: " + pageID);
      getprevData();
    }
  } else {
    console.log("sign in to access");
    // if no user display the create account and sign in page
    $("#app").append(
      `<div class="newUser">
          <h2>Welcome to MacroTrack</h2>
          <p>
            A simple way to track your macros throughout the day. As easy as
            signing up and tracking your food!
          </p>
          <div class="signIn">
            <label for="fname">First Name:</label>
            <input type="text" id="fname" />
            <label for="lname">Last Name:</label>
            <input type="text" id="lname" />
            <label for="email">Email Address:</label>
            <input type="email" id="email" />
            <label for="pw">Password:</label>
            <input type="password" id="pw" />
            <input type="submit" value="Add User" id="addUser" />
          </div>
          <div class="loginBox">
            <label for="email">Email Address:</label>
            <input type="email" id="emailL" />
            <label for="pw">Password:</label>
            <input type="password" id="pwL" />
            <input type="submit" value="Log In" id="logIn" />
          </div>
        </div>`
    );
    var addUserBtn = document.getElementById("addUser");
    addUserBtn.addEventListener("click", addUserToDB);
    var logInBtn = document.getElementById("logIn");
    logInBtn.addEventListener("click", login);
  }
}

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  //   console.log(hashTag + ' ' + pageID);

  if (pageID != "") {
    $.get(`pages/pageID/pageID.html`, function (data) {
      console.log("data " + data);
      $("#app").html(data);
    });
  } else {
    $.get(`pages/home/home.html`, function (data) {
      console.log("data " + data);
      $("#app").html(data);
    });
  }
}

function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
}

$(document).ready(function () {
  initURLListener();
});
