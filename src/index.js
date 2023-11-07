// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  getDoc,
  collection,
  collectionGroup,
  addDoc,
  getDocs,
  where,
  query,
  orderBy,
  doc,
  Query,
} from "firebase/firestore";

// config settings
const firebaseConfig = {
  apiKey: "AIzaSyA4jJ92xPemZNDaAyiJL5rNUtu-rtbpNUA",
  authDomain: "n423-data-aiden.firebaseapp.com",
  projectId: "n423-data-aiden",
  storageBucket: "n423-data-aiden.appspot.com",
  messagingSenderId: "163901931037",
  appId: "1:163901931037:web:8f285c27e2d4a46c5f10f4",
  measurementId: "G-NL28YPVMEZ",
};
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "noreply@n423-data-aiden.firebaseapp.com",
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: "com.example.ios",
  },
  android: {
    packageName: "com.example.android",
    installApp: true,
    minimumVersion: "12",
  },
  dynamicLinkDomain: "example.page.link",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const curUser = auth.currentUser;
const db = getFirestore(app);
const storage = getStorage(app);

// listeners
var mealBtn = document.getElementById("mealBtn");
mealBtn.addEventListener("click", addMeal);

// For date and uid
let date = new Date();
let month = date.getMonth();
let day = date.getDate();
let year = date.getFullYear();
let hr = date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();
var globaluid = null;

// auth state check
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user, "logged In");
    // route(user);
    changeRoute("");
    let uid = user.uid;
    globaluid = uid;
    document.getElementById("dayprev").style.display = "block";
    document.getElementById("today").style.display = "block";
    document.getElementById("stats").style.display = "block";
    document.getElementById("lo").style.display = "block";
    document.getElementById("mealBtn").style.display = "flex";
  } else {
    console.log("No User");
    // route(user);
    changePage("signIn");
    document.getElementById("dayprev").style.display = "none";
    document.getElementById("today").style.display = "none";
    document.getElementById("stats").style.display = "none";
    document.getElementById("lo").style.display = "none";
    document.getElementById("mealBtn").style.display = "none";
  }
});

// login function
async function login() {
  //   signInAnonymously(auth)
  //     .then(() => {
  //       console.log("Signed In.");
  //     })
  //     .catch((error) => {
  //       console.log("Error signing in, ", error.code);
  //     });
  let emL = document.getElementById("emailL").value.toLowerCase();
  let pwL = document.getElementById("pwL").value;
  signInWithEmailAndPassword(auth, emL, pwL)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.uid);

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
    });
}

// logout function
function logout() {
  signOut(auth)
    .then(() => {
      console.log("Signed Out.");
    })
    .catch((error) => {
      console.log("Error signing out, ", error.code);
    });
}

// adds user to db when they create an account
function addUserToDB() {
  let fn = document.getElementById("fname").value.toLowerCase();
  let ln = document.getElementById("lname").value.toLowerCase();
  let em = document.getElementById("email").value;
  let pw = document.getElementById("pw").value;

  let person = {
    firstName: fn,
    lastName: ln,
    email: em,
  };
  createUserWithEmailAndPassword(auth, em, pw)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log("user created with email&password");
      //   sendSignInLinkToEmail(auth, email, actionCodeSettings)
      //     .then(() => {
      //       // The link was successfully sent. Inform the user.
      //       // Save the email locally so you don't need to ask the user for it again
      //       // if they open the link on the same device.
      //       window.localStorage.setItem("emailForSignIn", email);
      //       // ...
      //     })
      //     .catch((error) => {
      //       const errorCode = error.code;
      //       const errorMessage = error.message;
      //       // ...
      //     });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error ", errorMessage + " " + errorCode);
      // ..
    });

  addData(person);
}
// awaits addUserToDB and uses the value of person to upload
async function addData(person) {
  try {
    const docRef = await addDoc(collection(db, "macroTrack"), person);
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pw").value = "";
    console.log("Doc id: ", docRef.id);
  } catch (e) {
    console.log(e);
  }
}

//   addMeal function that brings up the form for the user to input data
function addMeal() {
  $(".addMeal").append(`<label for="mName">Meal Name:</label>
    <input type="text" id="mName" />
    <div class="meal-form">
      <div class="left">
        <label for="calories">Calories:</label>
        <input type="number" id="cals" />
        <label for="protein">Protein:</label>
        <input type="number" id="pro" />
      </div>
      <div class="right">
        <label for="fats">Fats:</label>
        <input type="number" id="fats" />
        <label for="carbs">Carbs:</label>
        <input type="number" id="carbs" />
      </div>
    </div>
    <input type="submit" value="Add Meal" id="addMealBtn" />
    `);
  // Check if the meal form is already appended
  var addMealBtn = document.getElementById("addMealBtn");
  addMealBtn.addEventListener("click", addMealToDB);
}

// addMealToDB function takes the values from the addmeal form
function addMealToDB() {
  let mn = document.getElementById("mName").value;
  let cal = document.getElementById("cals").value;
  let pr = document.getElementById("pro").value;
  let fa = document.getElementById("fats").value;
  let ca = document.getElementById("carbs").value;

  let meal = {
    date: month + "/" + day + "/" + year,
    mealName: mn,
    calories: cal,
    protein: pr,
    fats: fa,
    carbs: ca,
    time: hr + ":" + min + ":" + sec,
    uid: globaluid,
  };

  addMealData(meal);
}

// upload the meal to the doc after waiting if it can
async function addMealData(meal) {
  try {
    const docRef = await addDoc(collection(db, "Meals"), meal);
    document.getElementById("mName").value = "";
    document.getElementById("cals").value = "";
    document.getElementById("pro").value = "";
    document.getElementById("fats").value = "";
    document.getElementById("carbs").value = "";
    $(".addMeal").empty();
    location.reload();
    console.log("Doc id: ", docRef.id);
  } catch (e) {
    console.log(e);
  }
}

// retrieve the data the user has posted
async function getmealData() {
  let totalCalories = 0;
  let totalFats = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  const q = query(
    collection(db, "Meals"),
    where("date", "==", `${month}` + "/" + `${day}` + "/" + `${year}`),
    where("uid", "==", `${globaluid}`)
  );

  const querySnapshot = await getDocs(q);

  // Hide loading icon
  //   document.getElementById("loadingIcon").style.display = "none";
  let htmlStr = "";
  if (querySnapshot.docs.length > 0) {
    querySnapshot.forEach((doc) => {
      totalCalories += parseInt(doc.data().calories);
      totalFats += parseFloat(doc.data().fats);
      totalProtein += parseFloat(doc.data().protein);
      totalCarbs += parseFloat(doc.data().carbs);
      htmlStr += `
      <div class="meal">
    <div class="mealname">Name: <span style="text-transform: capitalize;">${
      doc.data().mealName
    }</span></div>
    <div class="meal-cont">
      <div class="cals">
        <p>Calories:</p>
        <p>${doc.data().calories}</p>
      </div>
      <div class="fats">
        <p>Fats:</p>
        <p>${doc.data().fats}g</p>
      </div>
      <div class="pro">
        <p>Protein:</p>
        <p>${doc.data().protein}g</p>
      </div>
      <div class="carbs">
        <p>Carbs:</p>
        <p>${doc.data().carbs}g</p>
      </div>
    </div>
  </div>
  `;
    });
  } else {
    console.log("No Meals Tracked Yet.");
    htmlStr = `<div class="noMeal">No meals Yet</div>`;
  }

  htmlStr += `<div class="dailytotal">
  <div class="total">
  <h4 class="dTotal">Daily Total</h4>
  <div class="dt-cont">
  <div class="dCals"><span style="font-weight:bold; padding-right:10px; color:white;">Calories: </span> ${totalCalories}</div>
  <div class="dFats"><span style="font-weight:bold; padding-right:10px; color:white;" >Fats: </span> ${totalFats}g</div>
  <div class="dPotein"><span style="font-weight:bold; padding-right:10px; color:white;">Protein: </span> ${totalProtein}g</div>
  <div class="dCarbs"><span style="font-weight:bold; padding-right:10px; color:white;">Carbs: </span> ${totalCarbs}g</div>
  </div>
  </div>
  </div>`;
  //   console.log(totalCalories + " Calories");
  //   console.log(totalFats + " Fats");
  //   console.log(totalProtein + " Protein");
  //   console.log(totalCarbs + " Carbs");
  document.getElementById("mealData").innerHTML = htmlStr;
}

//retrieve the previous days data
async function getprevData() {
  let prevtotalCalories = 0;
  let prevtotalFats = 0;
  let prevtotalProtein = 0;
  let prevtotalCarbs = 0;
  let prev = day - 1;
  const q = query(
    collection(db, "Meals"),
    where("date", "==", `${month}` + "/" + `${prev}` + "/" + `${year}`),
    where("uid", "==", `${globaluid}`)
  );

  const querySnapshot = await getDocs(q);
  let htmlStr = "";
  if (querySnapshot.docs.length > 0) {
    querySnapshot.forEach((doc) => {
      prevtotalCalories += parseInt(doc.data().calories);
      prevtotalFats += parseFloat(doc.data().fats);
      prevtotalProtein += parseFloat(doc.data().protein);
      prevtotalCarbs += parseFloat(doc.data().carbs);
      htmlStr += `
        <div class="meal">
      <h4>Name: ${doc.data().mealName}</h4>
      <div class="meal-cont">
        <div class="cals">
          <p>Calories: </p>
          <p>${doc.data().calories}</p>
        </div>
        <div class="fats">
        <p>Fats:</p>
        <p>${doc.data().fats}g</p>
      </div>
      <div class="pro">
        <p>Protein:</p>
        <p>${doc.data().protein}g</p>
      </div>
      <div class="carbs">
        <p>Carbs:</p>
        <p>${doc.data().carbs}g</p>
      </div>
      </div>
    </div>`;
    });
  } else {
    console.log("No Meals Tracked Yet.");
    htmlStr = `<div class="noMeal">No meals Yet</div>`;
  }
  htmlStr += `<div class="dailytotal">
  <div class="total">
  <h4 class="dTotal">Daily Total</h4>
  <div class="dt-cont">
  <div class="dCals"><span style="font-weight:bold; padding-right:10px; color:white;">Calories: </span> ${prevtotalCalories}</div>
  <div class="dFats"><span style="font-weight:bold; padding-right:10px; color:white;" >Fats: </span> ${prevtotalFats}g</div>
  <div class="dPotein"><span style="font-weight:bold; padding-right:10px; color:white;">Protein: </span> ${prevtotalProtein}g</div>
  <div class="dCarbs"><span style="font-weight:bold; padding-right:10px; color:white;">Carbs: </span> ${prevtotalCarbs}g</div>
  </div>
  </div>
  </div>`;

  document.getElementById("mealData").innerHTML = htmlStr;
}
//get the stats data
async function getstatsData() {
  const q = query(collection(db, "Stats"), where("uid", "==", `${globaluid}`));

  const querySnapshot = await getDocs(q);
  let htmlStr = "";
  if (querySnapshot.docs.length > 0) {
    querySnapshot.forEach((doc) => {
      htmlStr += `
        <div class="stats">
      <div class="stats-cont">
        <div class="weight">
          <p>Weight:</p>
          <p>${doc.data().weight} lb.</p>
        </div>
        <div class="height">
          <p>Height:</p>
          <p>${doc.data().feet} ft.  ${doc.data().inches} in.</p>
        </div>
        
      </div>
      <div class="dc"><span>Date Created: </span>${doc.data().date}</div>
    </div>`;
    });
    getstatsForm();
  } else {
    console.log("No Stats Tracked Yet.");
    getstatsForm();
  }

  document.getElementById("mealData").innerHTML = htmlStr;
}
//display stats form
function getstatsForm() {
  $(".addMeal").append(`<label for="mName">Add Stats:</label>
    <div class="stats-form">
      <div class="statf-cont">
      <label for="calories">Height:</label>
        <div class="height-cont">
        <div class="left-h">
        <label for="feet">Feet:</label>
        <input type="number" id="height" />
        </div>
        <div class="right-h">
        <label for="inches">Inches:</label>
        <input type="number" id="height2" />
        </div>
        
        </div>
        
        <label for="protein">Weight:</label>
        <input type="number" id="weight" />
      </div>
      
    </div>
    <input type="submit" value="Add Stats" id="addstatsBtn" />
    `);
  // Check if the meal form is already appended
  var addstatsBtn = document.getElementById("addstatsBtn");
  addstatsBtn.addEventListener("click", addstatsToDB);
}
// add stats to form
function addstatsToDB() {
  let height = document.getElementById("height").value;
  let height2 = document.getElementById("height2").value;
  let weight = document.getElementById("weight").value;

  let stats = {
    date: month + "/" + day + "/" + year,
    feet: height,
    inches: height2,
    weight: weight,
    uid: globaluid,
  };

  addstatsData(stats);
}
// adding the stats to the database
async function addstatsData(stats) {
  try {
    const docRef = await addDoc(collection(db, "Stats"), stats);
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";
    $(".addMeal").empty();
    location.reload();
    console.log("Doc id: ", docRef.id);
  } catch (e) {
    console.log(e);
  }
}

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
      $.get(`pages/${pageID}/${pageID}.html`, function (data) {
        console.log("data " + data);
        $("#app").html(data);
        getstatsData();
      });
      break;
    case "signIn":
      $("#app").empty();
      $("#app").append(
        `<h2>Welcome to MacroTrack</h2>
        <p>
          A simple way to track your macros throughout the day. As easy as
          signing up and tracking your food!
        </p>
        <div class="newUser">
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
      $.get(`pages/${pageID}/${pageID}.html`, function (data) {
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

function initListeners() {
  $(window).on("hashchange", changeRoute);

  $("#lo").on("click", (e) => {
    //call logout function
    logout();
    // setTimeout(() => {
    //   location.reload();
    // }, 1.0 * 50);
  });

  //   $("#dayprev").on("click", (e) => {
  //     setTimeout(() => {
  //       location.reload();
  //     }, 1.0 * 50);
  //   });

  //   $("#today").on("click", (e) => {
  //     setTimeout(() => {
  //       location.reload();
  //     }, 1.0 * 50);
  //   });
  //   $("#stats").on("click", (e) => {
  //     setTimeout(() => {
  //       location.reload();
  //     }, 1.0 * 50);
  //   });
}

$(document).ready(function () {
  initListeners();
});
