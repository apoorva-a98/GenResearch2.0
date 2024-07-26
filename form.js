import { getDatabase, ref, set, push, query, equalTo, orderByChild, onChildAdded, onChildChanged, onChildRemoved, onValue} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { initializeFirebase, printUsernamePath } from './firebaseAuth.js';
// import { printProjectFolderPath, printAssumptionInDB, printQuestionInDB } from './sketch.js';

let dataBase;
let username;
let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder

fetch('firebaseConfig.json')
    .then(response => response.json())
    .then(data => {
        const firebaseData = initializeFirebase(data);
        const {
            db,
        } = firebaseData;
        dataBase = db;  
        printUsernamePath((updatedUsername) => {
            username = updatedUsername;
            console.log(username);
        }); 
   })
   .catch(error => {
    console.error('Error loading Firebase configuration:', error);
});

//Project Name
let projectTitleFolder = document.getElementById("projectTitleFolder");
console.log(projectTitleFolder);
let projectTitleEntry = document.createElement("input");
projectTitleEntry.placeholder = "Enter a Project Name";
let projectTitleButton = document.createElement("button");
projectTitleButton.textContent = "Save";
projectTitleButton.style.backgroundColor = "white";
projectTitleButton.style.color = "black"; 
projectTitleButton.style.borderStyle = "solid"; 
console.log(projectTitleEntry);
projectTitleFolder.appendChild(projectTitleEntry);
projectTitleFolder.appendChild(projectTitleButton);
projectTitleButton.addEventListener('click', () => {
        projectFolder = projectTitleEntry.value
        console.log(projectFolder)
        console.log(username);
        assumptionInDB = ref(dataBase, username + '/' + projectFolder + '/assumptions')
        questionInDB = ref(dataBase, username + '/' + projectFolder + '/questions')
        console.log(assumptionInDB);
        onValue(assumptionInDB, (snapshot) => {
            const data = snapshot.val(); 
            console.log(data)
            init();
          });        
});

function init() {
    console.log("init");
    let assumptionField = document.createElement('div');
    assumptionField.style.position = "absolute";
    assumptionField.style.left = window.innerWidth - 50 + "px";
    assumptionField.style.top = 50 + "px";
    assumptionField.style.width = "50px";
    assumptionField.style.height = "20px";


    let textContainerDiv = document.createElement('div');
    textContainerDiv.id = "textContainerDiv";
    document.body.append(textContainerDiv);

    subscribeToPosts()
}

function subscribeToPosts() {

    onChildAdded(assumptionInDB, (data) => {
        console.log("added", data.key, data.val());
        addTextfield(data.key, data.val());
    });

    onChildAdded(questionInDB, (data) => {
        console.log("added", data.key, data.val());
        addTextfield(data.key, data.val());
    });

    onChildChanged(assumptionInDB, (data) => {
        const element = document.getElementById(data.key);
        element.innerHTML = data.val().username + ": " + data.val().text;
        console.log("changed", data.key, data.val(), element);
    });

    onChildRemoved(assumptionInDB, (data) => {
        console.log("removed", data.key, data.val());
    });

}

function addTextfield(key, data) {
    let changedDiv = document.getElementById(key);
    if (changedDiv) {
        changedDiv.innerHTML = data;
    } else {
        let div = document.createElement('input');
        div.id = key; //syncing the id with the key in the database
        div.setAttribute("contenteditable", true);
        div.value = data;
        textContainerDiv.append(div);
    }
}

