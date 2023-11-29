import { initializeFirebase, printUsernamePath } from "./firebaseAuth.js";
import {
  askForWords,
  generateAssumptions,
  generateQuestions,
  createInputBoxWithQuestion,
  requestWordsFromReplicate,
} from "./QuestionsAssumptions.js";
import {
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

let dataBase;

fetch("firebaseConfig.json")
  .then((response) => response.json())
  .then((data) => {
    const firebaseData = initializeFirebase(data);
    // initializeFirebase(data);
    const { db } = firebaseData;
    dataBase = db;
  })
  .catch((error) => {
    console.error("Error loading Firebase configuration:", error);
  });

let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder
const username = printUsernamePath();

// const textDiv = document.getElementById("resulting_text");
// const waitingDiv = document.getElementById("waiting_text");

init();

//Project Name
let projectTitle = document.getElementById("projectTitle");
let projectTitleEntry = document.createElement("input");
projectTitleEntry.placeholder = "Enter a Project Name";
let projectTitleButton = document.createElement("button");
projectTitleButton.textContent = "Save";
projectTitleButton.style.backgroundColor = "white";
projectTitleButton.style.color = "black";
projectTitleButton.style.borderStyle = "solid";
projectTitle.appendChild(projectTitleEntry);
projectTitle.appendChild(projectTitleButton);
projectTitleButton.addEventListener("click", () => {
  projectFolder = projectTitleEntry.value;
  // push(userInDB, projectTitleEntry.value);
  console.log(printUsernamePath);
  console.log(projectFolder);
  assumptionInDB = ref(
    dataBase,
    username + "/" + projectFolder + "/assumptions"
  );
  questionInDB = ref(dataBase, username + "/" + projectFolder + "/questions");
});

function printProjectFolderPath() {
  return projectFolder;
}

export { printProjectFolderPath };

//Preview Form
let formButton = document.createElement("button");
formButton.textContent = "Preview Form";
formButton.style.backgroundColor = "white";
formButton.style.color = "black";
formButton.style.borderStyle = "solid";
formButton.addEventListener("click", () => {
  window.open(`${location.href}/form.html`);
});
projectTitle.appendChild(formButton);

function createQuestionBox(parentEl) {
  let text_container = document.createElement("div");
  let input_field = document.createElement("input");
  input_field.type = "text";
  input_field.id = "input_prompt";
  input_field.placeholder = "Enter an Assumption";
  input_field.size = 100;
  // Add buttons

  // Generate Questions
  let submitButton = document.createElement("button");
  submitButton.textContent = "Generate Questions";
  submitButton.style.backgroundColor = "#1E1A26";
  submitButton.addEventListener("click", function () {
    askForWords(input_field.value);
    push(assumptionInDB, input_field.value);
  });

  // Clear
  let clearButton = document.createElement("button");
  clearButton.textContent = "Clear";
  clearButton.style.backgroundColor = "#593128";
  clearButton.addEventListener("click", function () {
    input_field.value = "";
  });

  // Delete
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.backgroundColor = "#593128";
  deleteButton.addEventListener("click", function () {
    // text_container.remove();
    //how to delete new assumption?
  });

  // Add Assumption
  let addButton = document.createElement("button");
  addButton.textContent = "Add Assumption";
  addButton.style.backgroundColor = "#1E1A26";
  addButton.addEventListener("click", function (e) {
    let clickedBoxEl = e.target.parentNode;
    // console.log('Parent Node: ', clickedBoxEl)
    clickedBoxEl.appendChild(deleteButton);
    createQuestionBox(clickedBoxEl);
  });

  text_container.append(input_field);
  text_container.append(submitButton);
  text_container.append(clearButton);
  text_container.append(addButton);
  text_container.classList.add("child_container");
  console.log("Parent El: ", parentEl);
  parentEl.appendChild(text_container);
}

function init() {
  console.log("init");
  // create first question box
  let text_container = document.getElementById("text_container");
  createQuestionBox(text_container);

  //   // input_field.addEventListener("keyup", function (event) {
  //   //     if (event.key === "Enter") {
  //   //         askForWords(input_field.value);
  //   //         push(promptInDB, input_field.value);
  //   //     }
  //   // });
}
