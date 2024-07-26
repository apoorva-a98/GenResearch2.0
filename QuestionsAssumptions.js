import { printUsernamePath } from './firebaseAuth.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { printProjectFolderPath, printQuestionInDB } from "./sketch.js";

const replicateProxy = "https://replicate-api-proxy.glitch.me"
const textDiv = document.getElementById("resulting_text");
const waitingDiv = document.getElementById("waiting_text");

//waiting for response from input field
async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    waitingDiv.innerHTML = "Waiting for reply from Replicate...";

    const isQuestion = p_prompt.endsWith('?');
    if (isQuestion) {
        console.log("question:", p_prompt);
        let newAssumption = await generateAssumptions(p_prompt);
        console.log("newAssumption", newAssumption[0]);
        await generateQuestions(newAssumption[0]);
    } else {
        console.log("assumption:", p_prompt);
        await generateQuestions(p_prompt);
    }
}

async function generateAssumptions(p_prompt) {
    console.log("Entered generateAssumptions")
    let singleAssumption = [];
    let multipleAssumptions = [];

    const prompt = await requestWordsFromReplicate(p_prompt+ "Limit the answer to 50 words.");
    singleAssumption.push(prompt.output.join(""))
    console.log("singleAssumption", singleAssumption);

    const furtherPrompt = await requestWordsFromReplicate(singleAssumption + "Divide this into multiple sentences.");
    multipleAssumptions.push(furtherPrompt.output.join(""))
    console.log("multipleAssumptions", multipleAssumptions);

    // textDiv.innerHTML = multipleAssumptions;
    // waitingDiv.innerHTML = "Suggested Questions:";
    // changeToInputField();
    return multipleAssumptions;
}

async function generateQuestions(p_prompt) {
    console.log("Entered generateQuestions");
    const sentences = p_prompt.match(/[^.!]+[.!]+/g);
    let questions = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        sentences[i] = await requestWordsFromReplicate(sentence + " Convert this to a question. Limit to one sentence. Avoid first person language.");
        questions.push(sentences[i].output.join(""));  
    }
    console.log("multipleQuestions", questions);

    for (let i = 0; i < questions.length; i++) {
        console.log("question:", questions[i]);
        // let words_response = questions[i];
        // textDiv.innerHTML = words_response;
        // waitingDiv.innerHTML = "Suggested Questions:";
        // changeToInputField();
        createInputBoxWithQuestion(questions[i]);
        // Create new input box and buttons
    } 
    waitingDiv.innerHTML = "Suggested Questions:";
    // return questions;
}

function createInputBoxWithQuestion(question) {
    // Create a new div element to contain the textarea and buttons
    const containerDiv = document.createElement("div");
    containerDiv.id = question;
    // Create a new textarea element
    const textareaElement = document.createElement("textarea");
    textareaElement.value = question; // Set the content of the textarea
    textareaElement.style.overflow = "auto"; // Make the textarea resizable
    textareaElement.style.width = "75ch"; // maximum width
    textareaElement.style.minHeight = "40px"; // minimum height

    // Create three buttons
    const button1 = document.createElement("button");
    button1.textContent = "Generate Questions";
    button1.style.backgroundColor = "#1E1A26";
    button1.addEventListener('click', function() {
        askForWords(textareaElement.value);
        //add questions below the question generating
    })

    const button2 = document.createElement("button");
    button2.textContent = "Save to Form";
    button2.style.backgroundColor = "#5D84A6";
    button2.addEventListener('click', function() {
        // let projectFolder = printProjectFolderPath();
        // let questionInDB = ref(dataBase, username + '/' + projectFolder + '/questions');
        let questionInDB = printQuestionInDB();
        push(questionInDB, textareaElement.value);
        button2.textContent = "Saved";
    });

    const button3 = document.createElement("button");
    button3.textContent = "Delete";
    button3.style.backgroundColor = "#593128";
    button3.addEventListener('click', function() {
        containerDiv.remove();
    })

    // Create a line break element to put each textarea on a new line
    const lineBreak = document.createElement("br");

    // Append the textarea, buttons, and line break to the container
    containerDiv.appendChild(textareaElement);
    containerDiv.appendChild(button1);
    containerDiv.appendChild(button2);
    containerDiv.appendChild(button3);
    containerDiv.appendChild(lineBreak);
    containerDiv.appendChild(lineBreak);

    // Append the container to the textDiv
    textDiv.appendChild(containerDiv);
}



async function requestWordsFromReplicate(initialPrompt) {
    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            prompt: initialPrompt,
            max_tokens: 100,
            max_length: 100,
        },
    };
    // console.log("Asking for Words From Replicate via Proxy", data);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };

    const url = replicateProxy + "/create_n_get/";
    // console.log("words url", url, "words options", options);

    const words_response = await fetch(url, options);
    // console.log("words_response", words_response);
    return await words_response.json();
}

export { askForWords, generateAssumptions, generateQuestions, createInputBoxWithQuestion, requestWordsFromReplicate }