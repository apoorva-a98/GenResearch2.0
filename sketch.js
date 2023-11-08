import { initializeFirebase, printUsernamePath } from './firebaseAuth.js';
import { askForWords, generateAssumptions, generateQuestions, createInputBoxWithQuestion, requestWordsFromReplicate } from './QuestionsAssumptions.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

let dataBase;

fetch('firebaseConfig.json')
    .then(response => response.json())
    .then(data => {
        const firebaseData = initializeFirebase(data);
        // initializeFirebase(data);
        const {
                db,
            } = firebaseData;
            dataBase = db;
   })
   .catch(error => {
    console.error('Error loading Firebase configuration:', error);
});

let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder
const username = printUsernamePath();

// const textDiv = document.getElementById("resulting_text");
// const waitingDiv = document.getElementById("waiting_text");

init()

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
projectTitleButton.addEventListener('click', () => {
        projectFolder = projectTitleEntry.value
        // push(userInDB, projectTitleEntry.value);
        console.log(printUsernamePath);
        console.log(projectFolder)
        assumptionInDB = ref(dataBase, username + '/' + projectFolder + '/assumptions')
        questionInDB = ref(dataBase, username + '/' + projectFolder + '/questions')
        
});

//Preview Form
let formButton = document.createElement("button");
formButton.textContent = "Preview Form";
formButton.style.backgroundColor = "white";
formButton.style.color = "black"; 
formButton.style.borderStyle = "solid"; 
formButton.addEventListener('click', () => {
    window.open(`${location.href}/form.html`)
})
projectTitle.appendChild(formButton);


function init() {
    console.log("init");    
    let text_container = document.getElementById("text_container");
    let input_field = document.createElement("input");
    input_field.type = "text";
    input_field.id = "input_prompt";
    input_field.placeholder = "Enter an Assumption";
    input_field.size = 100;
        // Add buttons
        let submitButton = document.createElement("button");
        submitButton.textContent = "Generate Questions";
        submitButton.style.backgroundColor = "#1E1A26";
        submitButton.addEventListener("click", function () {
            askForWords(input_field.value);
            push(assumptionInDB, input_field.value); 
        });
    
        let clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.style.backgroundColor = "#593128";
        clearButton.addEventListener("click", function () {
            input_field.value = "";
        });
    
        text_container.prepend(submitButton);
        text_container.prepend(clearButton);
        text_container.prepend(input_field);

        // input_field.addEventListener("keyup", function (event) {
        //     if (event.key === "Enter") {
        //         askForWords(input_field.value);
        //         push(promptInDB, input_field.value);
        //     }
        // });
}