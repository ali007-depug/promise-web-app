const promise = document.querySelector(".promise");
const input = document.querySelector("#input");
const submit = document.querySelector("#add");
const mainDiv = document.querySelector(".promisesCont");
const svgIcon = document.querySelector(".icon");
const removeAll = document.querySelector(".removeAll");
const aboutMe = document.querySelector(".aboutMe");
const settings = document.querySelector(".settings");
const gearHolder = document.querySelector(".gearIcon");
const gearIcon = document.querySelector(".gearIcon i");
const appThemes = document.querySelector(".settings .themes");
const themes = document.querySelectorAll("ul li");
const themeBox = document.querySelector("ul");


//register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./serviceWorker.js").then((res) => console.log(`service worker register`)).catch((err) => {
      console.log(`service worker is not registered:${err}`)
    })
  })
}
//empty array to store the promise
let arrOfPromises = [];
//check if there is theme in LS , if it's exist then call handelThemes()
if (localStorage.getItem("theme")) {
  handelThemes(JSON.parse(localStorage.getItem("theme")));
}
// if there is themeName in Ls then call the handelActive() 
if (localStorage.getItem("themeName")) {
  handelActive();
}

//check if there is data from local storage
// if there is data then assign the data to the arr Of promises
// then call showRemove() , which
if (localStorage.getItem("promise")) {
  arrOfPromises = JSON.parse(localStorage.getItem("promise"));
  showRemove();
}
// get the data form local storge
getDataFromLs();

//when click on "add" button
submit.addEventListener("click", (e) => {
  if (input.value !== "") {
    addPromiseToTheArr(input.value);
    addPromiseToPage();
  }
  input.value = "";
  // minpulate remove All button
  showRemove();
  mainDiv.style.display = "block";
});

//add the input value to the array of objects
function addPromiseToTheArr(inputValue) {
  const promise = {
    id: Date.now(),
    title: inputValue,
    checked: false,
  };
  arrOfPromises.push(promise);
  addPromiseToLocalStorge(arrOfPromises);
}
//add the promise to local storge
function addPromiseToLocalStorge(data) {
  localStorage.setItem("promise", JSON.stringify(data));
}
//when click on  promise div to remove the task or to toggle it as done
mainDiv.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("remove")) {
    removePWith(
      e.target.parentElement.parentElement.parentElement.getAttribute("p-id")
    );
    e.target.parentElement.parentElement.parentElement.remove();
  }
  if (
    e.target.parentElement.parentElement.classList.contains("promiseFromInput")
  ) {
    togglePromiseWith(
      e.target.parentElement.parentElement.getAttribute("p-id")
    );
    e.target.parentElement.parentElement.classList.toggle("done");
  }
});

// show the promise at the main Div
function addPromiseToPage() {
  mainDiv.innerHTML = "";
  arrOfPromises.forEach((promise) => {
    //create div with class ".promise" and contain the input.value and set att with the id
    let pName = document.createElement("div");
    pName.className = "promiseFromInput";
    pName.setAttribute("p-id", promise.id);
    //create pragraph to hold the input value
    let prg = document.createElement("p");
    let pCont = document.createTextNode(promise.title);
    prg.appendChild(pCont);
    pName.appendChild(prg);
    mainDiv.appendChild(pName);
    //create remove button
    let remove = document.createElement("span");
    remove.className = "remove";
    let icon = document.createElement("i");
    icon.className = "fa-solid fa-trash";
    icon.setAttribute("role", "button");
    remove.appendChild(icon);
    //create checkbox for done
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.setAttribute("role", "button");
    if (promise.checked == true) {
      checkbox.setAttribute("checked", "checked");
      pName.classList.add("done");
    }

    //create div to hold trash and checkbox
    let holder = document.createElement("div");
    holder.className = "holder";
    holder.appendChild(remove);
    holder.appendChild(checkbox);
    pName.appendChild(holder);
    //create custom checkbox
    let customCheckbox = document.createElement("span");
    customCheckbox.className = "checkmark";
    holder.appendChild(customCheckbox);

    //create date to show it when user add a promise
    let dateHolder = document.createElement("div");
    dateHolder.className = "date";
    let date = new Date(promise.id);
    date = date.toString();
    // the format would be like : 8-3-2023
    // the date output as : Thu Aug 03 2023 14:26
    let day = date.substring(8, 10); //03
    let month = date.substring(4, 7); // aug
    let year = date.substring(11, 15); // 2023
    let time = date.substring(16, 21); // 14:26
    dateHolder.appendChild(
      document.createTextNode(`${day}-${month}-${year}- ${time}`)
    );
    pName.appendChild(dateHolder);
  });
}

//remove promise with id
function removePWith(promiseId) {
  arrOfPromises = arrOfPromises.filter((e) => {
    return e.id != promiseId;
  });
  addPromiseToLocalStorge(arrOfPromises);
  showRemove();
}
//toggle promis With Promise id
function togglePromiseWith(promiseId) {
  for (let i = 0; i < arrOfPromises.length; i++) {
    if (arrOfPromises[i].id == promiseId) {
      if (arrOfPromises[i].checked == false) {
        arrOfPromises[i].checked = true;
      } else {
        arrOfPromises[i].checked = false;
      }
    }
  }
  addPromiseToLocalStorge(arrOfPromises);
}

// get Data from local Storge
// important : till now i dont see reason to use this function while you can replace it with the line 9 & 10;
function getDataFromLs() {
  let data = localStorage.getItem("promise");
  if (data) {
    let parseData = JSON.parse(data);
    addPromiseToPage(parseData);
  }
}

// show and hide the input field and the add button when click on the svgIcon
svgIcon.onclick = function () {
  if (!promise.classList.contains("show")) {
    promise.classList.add("show");
  } else promise.classList.remove("show");
};

// show and hide remove based on the array of promises length
function showRemove() {
  if (arrOfPromises.length >= 2) {
    removeAll.classList.add("showRemove");
    removeAll.classList.add("rotate");
  } else {
    removeAll.classList.remove("showRemove");
  }
}
//when click on remove All button
removeAll.addEventListener("click", (e) => {
  //minpulate remove all
  e.target.classList.remove("showRemove");
  //create Overlay
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  //create popup to set yes or not to remove locacl storge
  let popup = document.createElement("div");
  popup.className = "popup";
  let span = document.createElement("span");
  span.className = "popupTitle";
  span.appendChild(document.createTextNode("Are You Sure?"));
  popup.appendChild(span);
  let yes = document.createElement("span");
  yes.className = "yes";
  yes.appendChild(document.createTextNode("Yes"));
  let no = document.createElement("span");
  no.className = "no";
  no.appendChild(document.createTextNode("No"));
  //create holder for yes and no
  let holderYandNo = document.createElement("div");
  holderYandNo.className = "holderYandNo";
  holderYandNo.appendChild(yes);
  holderYandNo.appendChild(no);
  popup.appendChild(holderYandNo);
  document.body.appendChild(popup);
  holderYandNo.addEventListener("click", (e) => {
    if (e.target.classList.contains("yes")) {
      localStorage.removeItem("promise");
      arrOfPromises = [];
      mainDiv.style.display = "none";
      popup.style.display = "none";
      overlay.style.display = "none";
    } else {
      if (e.target.classList.contains("no")) {
        popup.style.display = "none";
        overlay.style.display = "none";
        removeAll.classList.add("showRemove");
      }
    }
  });
});

// show year on about Me section
function showYearOnAboutSec() {
let aboutYear = document.createElement("span");
aboutYear.className = "year";
let date = new Date().getFullYear();
date = date.toString();
aboutYear.appendChild(document.createTextNode(date));
aboutMe.appendChild(aboutYear);
}
showYearOnAboutSec();

//add theme to local storge
function addThemeToLs(colorone, colortwo, threeColor, forColor) {
  const theme = {
    mainColor: colorone,
    secColro: colortwo,
    thrColor: threeColor,
    forColor: forColor,
  };
  localStorage.setItem("theme", JSON.stringify(theme));
}

//handel Themes
themes.forEach((theme) => {
  //handle class active
  theme.addEventListener("click", (e) => {
    themes.forEach((theme) => {
      theme.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
  });
  //change root value when click
  theme.addEventListener("click", (e) => {
    if (e.target.classList.contains("themeOne")) {
      document.documentElement.style.setProperty("--main-color", "#ececec");
      document.documentElement.style.setProperty("--sec-color", "#9fd3c7");
      document.documentElement.style.setProperty("--thr-color", "#385170");
      document.documentElement.style.setProperty("--for-color", "#142d4c");
      addThemeToLs(
        document.documentElement.style.getPropertyValue("--main-color"),
        document.documentElement.style.getPropertyValue("--sec-color"),
        document.documentElement.style.getPropertyValue("--thr-color"),
        document.documentElement.style.getPropertyValue("--for-color")
      );
      setDatAtrrTols(e.currentTarget.dataset.themename);
      // handelThemes(JSON.parse(localStorage.getItem("theme")));
    }
    if (e.target.classList.contains("themeTwo")) {
      document.documentElement.style.setProperty("--main-color", "#c4bbf0");
      document.documentElement.style.setProperty("--sec-color", "#927fbf");
      document.documentElement.style.setProperty("--thr-color", "#4f3b78");
      document.documentElement.style.setProperty("--for-color", "#363b4e");
      // handelThemes(JSON.parse(localStorage.getItem("theme")));
      addThemeToLs(
        document.documentElement.style.getPropertyValue("--main-color"),
        document.documentElement.style.getPropertyValue("--sec-color"),
        document.documentElement.style.getPropertyValue("--thr-color"),
        document.documentElement.style.getPropertyValue("--for-color")
      );
      setDatAtrrTols(e.currentTarget.dataset.themename);
    }
    if (e.target.classList.contains("themeThree")) {
      document.documentElement.style.setProperty("--main-color", "#fdf3f3");
      document.documentElement.style.setProperty("--sec-color", "#f8e7e7");
      document.documentElement.style.setProperty("--thr-color", "#a070a1");
      document.documentElement.style.setProperty("--for-color", "#724060");
      addThemeToLs(
        document.documentElement.style.getPropertyValue("--main-color"),
        document.documentElement.style.getPropertyValue("--sec-color"),
        document.documentElement.style.getPropertyValue("--thr-color"),
        document.documentElement.style.getPropertyValue("--for-color")
      );
      setDatAtrrTols(e.currentTarget.dataset.themename);
    }
    if (e.target.classList.contains("themeFour")) {
      document.documentElement.style.setProperty("--main-color", "#f2f2f2");
      document.documentElement.style.setProperty("--sec-color", "#ebd5d5");
      document.documentElement.style.setProperty("--thr-color", "#ea8a8a");
      document.documentElement.style.setProperty("--for-color", "#685454");
      addThemeToLs(
        document.documentElement.style.getPropertyValue("--main-color"),
        document.documentElement.style.getPropertyValue("--sec-color"),
        document.documentElement.style.getPropertyValue("--thr-color"),
        document.documentElement.style.getPropertyValue("--for-color")
      );
      setDatAtrrTols(e.currentTarget.dataset.themename);
    }
    if (e.target.classList.contains("themeFive")) {
      document.documentElement.style.setProperty("--main-color", "#a3f7bf");
      document.documentElement.style.setProperty("--sec-color", "#393e46");
      document.documentElement.style.setProperty("--thr-color", "#222831");
      document.documentElement.style.setProperty("--for-color", "#29a19c");
      addThemeToLs(
        document.documentElement.style.getPropertyValue("--main-color"),
        document.documentElement.style.getPropertyValue("--sec-color"),
        document.documentElement.style.getPropertyValue("--thr-color"),
        document.documentElement.style.getPropertyValue("--for-color")
      );
      setDatAtrrTols(e.currentTarget.dataset.themename);
    }

    //handle class active
  });
});
//handel gear icon
gearIcon.onclick = function () {
  this.classList.toggle("fa-spin");
  settings.classList.toggle("showSettings");
  gearHolder.classList.toggle("show");
};

//handel themes
function handelThemes(theme) {
  //change root values
  document.documentElement.style.setProperty("--main-color", theme.mainColor);
  document.documentElement.style.setProperty("--sec-color", theme.secColro);
  document.documentElement.style.setProperty("--thr-color", theme.thrColor);
  document.documentElement.style.setProperty("--for-color", theme.forColor);
}
//get theme form local storge
function getThemeFromls() {
  if (true) {
    JSON.parse(localStorage.getItem("theme"));
  }
}

// set themeName to local storge
function setDatAtrrTols(data) {
  localStorage.setItem("themeName", data);
}
// handel class active 
function handelActive() {
  themes.forEach((th) => {
    th.classList.remove("active");
    if (th.dataset.themename === localStorage.getItem("themeName")) {
      th.classList.add("active");
    }
  });
}
