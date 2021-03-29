let words              = [];
let previousWords      = [];
let wordsInCurrentLine = 0;
let windowSizeIsEnough = true;

let unacceptedCharacters = [32, 27, 20, 16, 17, 18, 8, 46];

let startTime = 0;
let endTime   = 0;
let testIsRunning = false;
let testHasEnded  = false;

let allTypedWords = 0;
let failedWords   = 0;

let allTypedCharacters     = 0;
let correctTypedCharacters = 0;

let errormsg;
let errormsg_description;

function updateCanvas() {
    canvas = resizeCanvas(windowWidth, windowHeight);

    let scale = windowWidth / background_image.width;

    background(40, 132, 239);
    image(background_image, 0, windowHeight-background_image.height*scale, background_image.width*scale, background_image.height*scale);

    if (windowWidth >= 650 && windowHeight >= 350) {
        windowSizeIsEnough = true;
    } else {
        windowSizeIsEnough = false;
    }

    let errormsg_container = document.getElementById("errormsg-container");
    if (!windowSizeIsEnough) {
        removeChilds("errormsg-container");

        errormsg = createElement("h1", "Oops! Seems like your display is too small");
        errormsg.id("errormsg");
        errormsg.parent(errormsg_container);

        errormsg_description = createElement("pre", "Required display size   650x350\nCurrent display size     " + windowWidth + "x" + windowHeight);
        errormsg_description.id("errormsg-description");
        errormsg_description.parent(errormsg_container);

        errormsg_container.style.display = "block";
    } else {
        errormsg_container.style.display = "none";
    }
}

function createInputField() {
    input = createInput();
    input.id("input-field");
    input.parent("container");

    document.getElementById("input-field").addEventListener("keyup", event => {
        if (unacceptedCharacters.includes(event.keyCode) == false) {
            if (testIsRunning == false && testHasEnded == false) {
                console.log("test started");
                testIsRunning = true;
                startTime = performance.now();
            }
        }
        
        let inputField = document.getElementById("input-field");
        if (event.keyCode === 32) {
            let correctWord = document.getElementById("highlight").innerHTML;
            let playersWord = inputField.value.replaceAll(/\s/g, '');

            if (playersWord != "") {
                if (playersWord == correctWord)
                    previousWords.push([correctWord, "#4caf50"]);
                else {
                    previousWords.push([correctWord, "#e05b4d"]);
                    failedWords++;
                }

                allTypedWords++;
                words.shift();
            }
            inputField.value = "";
        } else {
            if (unacceptedCharacters.includes(event.keyCode) == false) {
                let inputField = document.getElementById("input-field");
                if (words[0]) {
                    if (words[0].substr(0, inputField.value.length) == inputField.value.replaceAll(/\s/g, ""))
                    correctTypedCharacters++;
                }

                allTypedCharacters++;
            }
        }
    });
}

function updateInputField() {
    if (windowSizeIsEnough) {
        let inputFieldWidth = width / 2;

        if (inputFieldWidth > 800)
            inputFieldWidth = 800

        input.style("display", "block");
        input.style("width", inputFieldWidth + "px");
    } else {
        input.style("display", "none");
    }
}

function createWordBox() {
    wordbox = createDiv();
    wordbox.id("wordbox");
    wordbox.parent("container");

    let wpm_info = createElement("pre", "WPM          0");
    wpm_info.id("wpm");
    wpm_info.parent("status");

    let accuracy_info = createElement("pre", "Accuracy  0%");
    accuracy_info.id("accuracy");
    accuracy_info.parent("status");

    for (let i = 0; i < 50; i++) {
        words.push(words_en[Math.floor(Math.random() * words_en.length)]);
    }
}

function updateWordBox() {
    if (windowSizeIsEnough) {
        let wordboxWidth = width - width / 5
        if (wordboxWidth > 1000)
            wordboxWidth = 1000;

        wordbox.style("display", "block");
        wordbox.style("width", wordboxWidth + "px");
        document.getElementById("status").style.display = "block";

        let wpm_info      = document.getElementById("wpm");
        let accuracy_info = document.getElementById("accuracy")
        if (testIsRunning) {
            let time = ((performance.now() - startTime) / 1000) / 60;
            wpm_info.innerHTML      = "WPM          " + getWPM(allTypedWords, failedWords, time);
            accuracy_info.innerHTML = "Accuracy  "    + getAccuracy(correctTypedCharacters, allTypedCharacters) + "%";
        }

        let wordbox_x = document.getElementById("wordbox").getBoundingClientRect().left;
        accuracy_info.style.left = wordbox_x + "px";
        wpm_info.style.left      = wordbox_x + "px";

        removeChilds("wordbox");
        showWords();
    } else {
        wordbox.style("display", "none");
        document.getElementById("status").style.display = "none";
    }
}

function removeChilds(parent) {
    let object = document.getElementById(parent);
    object.innerHTML = "";
}

function showWords() {
    if (words.length <= 0 && testIsRunning == true) {
        testIsRunning = false;
        testHasEnded  = true;
        endTime = performance.now()
    }

    if (previousWords.length >= wordsInCurrentLine)
        previousWords = []

    for (let i = 0; i < previousWords.length; i++) {
        let previousWord = createElement("p", previousWords[i][0]);
        previousWord.style("color", previousWords[i][1]);
        previousWord.parent(wordbox);
    }

    let highlightedWord = createElement("p", words[0])
    highlightedWord.id("highlight");
    highlightedWord.parent(wordbox);
    if (!words.length > 0) {
        highlightedWord.style("display", "none");
    } else {
        highlightedWord.style("display", "block");
    }

    let inputField   = document.getElementById("input-field");
    let correctWord  = document.getElementById("highlight").innerHTML;
    let playersWord  = inputField.value.replaceAll(/\s/g, "");
    let correctSoFar = true;

    for (let char = 0; char < playersWord.length; char++) {
        if (playersWord[char] != correctWord[char]) {
            correctSoFar = false;
        }
    }

    if (!correctSoFar) {
        highlightedWord.style("background-color", "#ff0000");
    } else {
        highlightedWord.style("background-color", "#dddddd");
    }

    for (let j = 1; j < words.length; j++) {
        let newWord = createElement("p", words[j]);
        newWord.parent(wordbox);
    }

    if (wordbox.child()[0]) {
        let currentLineY = wordbox.child()[0].getBoundingClientRect().top;
        for (let word = 0; word < wordbox.child().length; word++) {
            let wordY = wordbox.child()[word].getBoundingClientRect().top;
            if (wordY != currentLineY) {
                wordsInCurrentLine = word;
                break;
            }

            if (!wordbox.child()[word+1]) {
                wordsInCurrentLine = word+1;
                break;
            }
        }
    }
}

function getWPM(allTypedWords, uncorrectedWords, time) {
    let wpm = parseInt(((allTypedWords - uncorrectedWords) / time).toFixed(0));
    return wpm;
}

function getAccuracy(correctTypedCharacters, allTypedCharacters) {
    let accuracy = parseFloat(((correctTypedCharacters / allTypedCharacters)*100).toFixed(1));
    return accuracy;
}
