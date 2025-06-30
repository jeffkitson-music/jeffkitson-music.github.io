
/*
*   ____  _               _               _                            _   ____
*  / ___|| |  __ _  _ __ (_) _ __    ___ | |_  ___    __ _  _ __    __| | |  _ \  _ __   __ _   __ _   ___   _ __   ___
* | |    | | / _` || '__|| || '_ \  / _ \| __|/ __|  / _` || '_ \  / _` | | | | || '__| / _` | / _` | / _ \ | '_ \ / __|
* | |___ | || (_| || |   | || | | ||  __/| |_ \__ \ | (_| || | | || (_| | | |_| || |   | (_| || (_| || (_) || | | |\__ \
*  \____||_| \__,_||_|   |_||_| |_| \___| \__||___/  \__,_||_| |_| \__,_| |____/ |_|    \__,_| \__, | \___/ |_| |_||___/
*                                                                                              |___/
*/

/*
* Created for ClarinetFest 2025 in Ft. Worth, Texas
* Concept by Jeffrey Kitson and Kristin Steelman
* Developed by Jeffrey Kitson and Gemini (Google AI)
* Contact: jkitson@cccneb.edu
* Website: https://github.com/jeffkitson-music/clarinets-and-dragons
*/


// GLOBAL
const progressBarBaseText = {
    "trials-progress": "Trials Progress",
    "player-health": "Player Health",
    "adventure-progress": "Adventure Progress"
};
let maxDice = null;

var scalesAndLongTones = null; // loaded later


// ===== DICE =====
function setMaxDice(valuesDict) {
    maxDice = valuesDict["diceType"];
}



function rollDice() {
    var roll = _rollDice();

    if (roll===true){
        symphonyOfSwiftness();
        return
    }
    if(roll===false){
        chromaticChaos();
        return
    }
    // Grammar!
    var rollArticle = null;
    var anNumbers = [8, 11, 18];
    if (anNumbers.includes(roll)) {
        rollArticle = "an";
    } else {
        rollArticle = "a";
    }
    // Alert
    Swal.fire({
        title: `You rolled ${rollArticle} ${roll}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Do Damage!",
        denyButtonText: `Player Health`,
        iconHtml: '<img src="https://media.tenor.com/WiTP5aZyPLUAAAAi/dice-roll-dice.gif" width=50px>', // was "success" // Credit: https://tenor.com/view/dice-roll-dice-roll-the-dice-cube-game-gif-6495545147822062773
        iconColor: "#8CC63E",
        confirmButtonColor: "#8CC63E" // #333333
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            //updateProgress("trials", -roll)
            var trialValue = document.getElementById("trials-progress").value;
            var trialMax = document.getElementById("trials-progress").max;
            //console.log("The trial value is: " + trialValue);
            updateProgressBar("trials-progress", (trialValue - roll), trialMax);

        } else if (result.isDenied) {
            //Swal.fire("Progress not changed!", "", "info");
            var playerValue = document.getElementById("player-health").value;
            var playerMax = document.getElementById("player-health").max;
            //console.log("The trial value is: " + playerValue);
            updateProgressBar("player-health", (playerValue - roll), playerMax);
        }
    });
}

function _rollDice() {
    var secretRoll = Math.floor(Math.random() * 100) + 1;
    console.log(`The secret roll was: ${secretRoll}`)
    if(secretRoll===1) {
        return false // CHROMATIC CHAOS!!!
    }
    else if (secretRoll===100){
        return true; // Symphony of Swiftness!
    }
    else {
        return Math.floor(Math.random() * maxDice) + 1;
    }
}

function chromaticChaos(){
    Swal.fire({
        title: `CHROMATIC CHAOS!`,
        text: "Chromatic Chaos has been unleashed! To untangle this musical mess, you must immediately play the Chromatic Scale!",
        background: "#8CC63E",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Success",
        denyButtonText: `Failure`,
        customClass: {
    popup: 'chromatic-chaos', // Applies the class to the main popup container
    backdrop: '.chromatic-chaos-backdrop', // Applies the class to the overlay behind the popup
    confirmButton: 'swal2-confirm.chromatic-chaos-confirm-button' // Applies to the confirm button
  }
    }).then((result) => {
        if (result.isConfirmed) {
            //updateProgress("trials", -roll)
            var trialValue = document.getElementById("trials-progress").value;
            var trialMax = document.getElementById("trials-progress").max;
            console.log("The trial max is: " + trialMax);
            updateProgressBar("trials-progress", trialValue - Math.round((20 / 100) * trialValue), trialMax); // Minus 20%

        } else if (result.isDenied) {
            //Swal.fire("Progress not changed!", "", "info");
            var playerValue = document.getElementById("player-health").value;
            var playerMax = document.getElementById("player-health").max;
            //console.log("The trial value is: " + playerValue);
            updateProgressBar("player-health", playerValue - Math.round((20 / 100) * playerValue), playerMax); // Minus 20%
        }
    });
}

function symphonyOfSwiftness(){
    Swal.fire({
      title: 'Symphony of Swiftness!',
      html: 'A brilliant, golden aura bursts from your clarinet! The trial shatters like glass! Victory!',
      confirmButtonText: 'Huzzah!',
      customClass: {
            popup: 'symphony-swiftness-popup',
            backdrop: 'symphony-swiftness-backdrop',
            confirmButton: 'symphony-swiftness-confirm-button',
            title: 'symphony-swiftness-title',        // This class targets the title
            htmlContainer: 'symphony-swiftness-content' // This class targets the main content
  }
    }).then((result) => {
      if (result.isConfirmed) {
          var trialMax = document.getElementById("trials-progress").max;
          updateProgressBar("trials-progress", -1, trialMax); // Kill shot!
      }
});
}



// ===== PROGRESS BARS =====

/**
 * Initializes the given progress bars with specified values from a dictionary,
 * setting their current value and making that value represent 100% of the bar's range.
 * This function expects specific progress bar IDs as keys in the dictionary:
 * "trials-progress", "player-health", and "adventure-progress".
 * @param {Object} valuesDict - A dictionary (object) containing the initial values.
 * Expected keys are "numTrials", "ptsPerTrial", and "playerStartingHealth".
 * These will be mapped to the HTML progress bar IDs.
 */
function initializeProgressBars(valuesDict) {
    valuesDict = checkProgressDefaults(valuesDict);
    //console.log("Initializing progress bars with:", valuesDict);

    // Map the input dictionary keys to the actual HTML progress bar IDs
    const progressBarMappings = {
        "ptsPerTrial": "trials-progress", // trials-progress
        "playerStartingHealth": "player-health",
        "numTrials": "adventure-progress", //adventure-progress
    };

    for (const key in valuesDict) {
        if (valuesDict.hasOwnProperty(key) && progressBarMappings[key]) {
            const value = parseInt(valuesDict[key]); // Ensure value is a number
            const progressBarId = progressBarMappings[key];
            const progressBar = document.getElementById(progressBarId);
            const progressBarLabel = document.getElementById(`${progressBarId}-label`);


            if (progressBar) {
                if (typeof value === 'number' && !isNaN(value)) {
                    progressBar.value = value;
                    progressBar.max = value; // Set max to value to make it 100% full
                    progressBarLabel.innerText = `${progressBarBaseText[progressBarId]} (${progressBar.value}/${progressBar.max})`;

                    //console.log(`Set ${progressBarId} to ${value}/${value}.`);
                } else {
                    //console.warn(`Invalid value for ${key} (${progressBarId}): ${valuesDict[key]}. Must be a number.`);
                }
            } else {
                //console.warn(`Progress bar with ID '${progressBarId}' (mapped from '${key}') not found in the DOM.`);
            }
        } else if (valuesDict.hasOwnProperty(key)) {
            //console.warn(`No mapping found for dictionary key: '${key}'. Progress bar not updated.`);
        }
    }
    //document.getElementById("progress-label").innerText = "Trials Progress (100/100)"
}

function advancedProgressBarAdjustment(valuesDict) {

    // Map the input dictionary keys to the actual HTML progress bar IDs
    const progressBarMappings = {
        "ptsPerTrial": "trials-progress", // trials-progress
        "playerStartingHealth": "player-health",
        "numTrials": "adventure-progress", //adventure-progress
    };

    for (const key in valuesDict) {
        if (valuesDict.hasOwnProperty(key) && progressBarMappings[key]) {
            const value = parseInt(valuesDict[key]); // Ensure value is a number
            const progressBarId = progressBarMappings[key];
            const progressBar = document.getElementById(progressBarId);
            const progressBarLabel = document.getElementById(`${progressBarId}-label`);

            if (progressBar) {
                if (typeof value === 'number' && !isNaN(value)) {
                    progressBar.value = value;
                    progressBarLabel.innerText = `${progressBarBaseText[progressBarId]} (${progressBar.value}/${progressBar.max})`;
                    if (progressBar.value / progressBar.max < 0.2) {
                        progressBar.style.setProperty('--progress-fill-color', "#D62728"); // Your new color
                        // progressBar.style.setProperty("background-color", "#D62728")
                        // progressBar.style.setProperty('--progress-fill-color', '#ff0000');
                        //progressBar.style.setProperty("progress::-webkit-progress-bar", "#D62728")
                    }

                }
            } else {
                //console.warn(`Progress bar with ID '${progressBarId}' (mapped from '${key}') not found in the DOM.`);
            }
        } else if (valuesDict.hasOwnProperty(key)) {
            //console.warn(`No mapping found for dictionary key: '${key}'. Progress bar not updated.`);
        }
    }
    //document.getElementById("progress-label").innerText = "Trials Progress (100/100)"
}

function checkProgressDefaults(valuesDict) {
    // Set Defaults if player doesn't enter them
    if (valuesDict["numTrials"] === "") {
        valuesDict["numTrials"] = 3;
    }
    if (valuesDict["ptsPerTrial"] === "") {
        valuesDict["ptsPerTrial"] = 20;
    }
    if (valuesDict["playerStartingHealth"] === "") {
        valuesDict["playerStartingHealth"] = 50;
    }
    return valuesDict;
}

/**
 * Updates a single progress bar's current value and optionally its maximum value.
 * @param {string} barId - The ID of the progress bar to update (e.g., 'player-health').
 * @param {number} newValue - The new current value for the progress bar.
 * @param {number} [maxValue] - Optional. The new maximum value for the progress bar.
 * If not provided, the existing max value will be used.
 */
function updateProgressBar(barId, newValue, maxValue) {
    const progressBar = document.getElementById(barId);
    const progressBarLabel = document.getElementById(`${barId}-label`);

    if (progressBar) {
        // Ensure newValue is a valid number
        if (typeof newValue === 'number' && !isNaN(newValue)) {
            progressBar.value = newValue;
            progressBarLabel.innerText = `${progressBarBaseText[barId]} (${progressBar.value}/${progressBar.max})`;
            //console.log("Percent: " + progressBar.value / progressBar.max);
            if (progressBar.value / progressBar.max < 0.2) {
                progressBar.style.setProperty('--progress-fill-color', "#D62728"); // Your new color
            }
            if (progressBar.value <= 0 && barId === "trials-progress") {
                const adventureBar = document.getElementById("adventure-progress");
                if (adventureBar.value > 1) {
                    updateProgressBar("adventure-progress", adventureBar.value - 1, adventureBar.max);
                } else {
                    adventureBar.value = 0;
                    adventureVictory();
                    return; // make sure to not pop trial victory
                }
                progressBar.value = progressBar.max;
                progressBarLabel.innerText = `${progressBarBaseText[barId]} (${progressBar.value}/${progressBar.max})`;
                progressBar.style.setProperty('--progress-fill-color', "#8CC63E"); // Your new color
                trialVictory();
            }
            if (progressBar.value <= 0 && barId === "player-health") {
                trialDefeat();
            }

           // console.log(`Updated ${barId} value to: ${newValue}`);
        } else {
           // console.warn(`Invalid newValue for ${barId}: ${newValue}. Must be a number.`);
        }

        // Update maxValue if provided and valid
        if (maxValue !== undefined) {
            if (typeof maxValue === 'number' && !isNaN(maxValue)) {
                progressBar.max = maxValue;
               // console.log(`Updated ${barId} max to: ${maxValue}`);
            } else {
               // console.warn(`Invalid maxValue for ${barId}: ${maxValue}. Must be a number.`);
            }
        }
    } else {
        //console.warn(`Progress bar with ID '${barId}' not found.`);
    }
}

// ===== MUSIC =====
async function loadMusicData(filePath) {
    // Placeholder
    setPlaceholderScale();
    // Get Scales and Long Tones
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            // Handle the loaded JSON data here
           // console.log(data);
            scalesAndLongTones = data;

            // Perform any necessary operations with the data
        })
        .catch(error => {
           // console.error('Error loading JSON data:', error);
        });
}

function setPlaceholderScale() {
    ABCJS.renderAbc("music", "X:1\nT:Bb Major (Ab Concert)\n_B,2 CD _EFGA|_B2 AG F_EDC|_B,8|]\n", {
        responsive: "resize",
        paddingtop: 2,
        format: {
            titlefont: "Josefin Sans 16", // Applying Josefin Sans to the music title
        }
    });
    return;
}


function randomScale() {
    // IMPORTANT: ADD RUNNING "ALREADY DONE"
    var includeScales = {
        "major": document.getElementById("major-scale-checkbox").checked,
        "naturalMinor": document.getElementById("natural-minor-scale-checkbox").checked,
        "harmonicMinor": document.getElementById("harmonic-minor-scale-checkbox").checked,
        "melodicMinor": document.getElementById("melodic-minor-scale-checkbox").checked
    };
    var yourScales = this.getScalesToInclude(includeScales);
    var n = getRandomNumberForScale(yourScales.length);
    var randomScale = yourScales[n];
    console.log(randomScale)
    if(randomScale===undefined){
        noScalesChosen()
        return
    }

    var notation = `X:1\nK: ${randomScale.key}\nT:${randomScale.name}\n${randomScale.notation}`;

    // final render

    ABCJS.renderAbc("music", notation, {
        responsive: "resize",
        paddingtop: 2,
        format: {
            titlefont: "Josefin Sans 16", // Applying Josefin Sans to the music title
        }
    });
}

function noScalesChosen(){
   Swal.fire({
            title: "No Scales Chosen",
            text: "Please choose a group of scales to continue",
            icon: "error",
            iconColor: "#8CC63E",
        });
}

function getRandomNumberForScale(len) {
    return Math.floor(Math.random() * len);
}

function getScalesToInclude(includeScales) {
    var includedScales = [];
    if (includeScales.major) {
        includedScales.push(...scalesAndLongTones.scales.major);
    }
    if (includeScales.naturalMinor) {
        includedScales.push(...scalesAndLongTones.scales.natural_minor);
    }
    if (includeScales.harmonicMinor) {
        includedScales.push(...scalesAndLongTones.scales.harmonic_minor);
    }
    if (includeScales.melodicMinor) {
        includedScales.push(...scalesAndLongTones.scales.melodic_minor);
    }
    return includedScales;
}


function randomLongTone() {
    //console.log("Generating long tone...");
    //var longTones = ["g,,", "^g,,", "_a,,", "a,,", "^a,,", "_b,,", "b,,", "^b,,", "c,"];
    const randomIndex = Math.floor(Math.random() * scalesAndLongTones.long_tones.length);
    var lt = scalesAndLongTones.long_tones[randomIndex];
    if (lt.includes("^") || lt.includes("_")) {
        var lts = lt.substring(1); // lt short, change to note? ltn?
    } else {
        var lts = lt;
    }
    var lt_abc = `X: 1\nT: Random Long Tone\n${lt}8-|${lts}8-|${lts}8-|${lts}8-|${lts}8-|${lts}8-|!fermata!${lts}8|]`;
    ABCJS.renderAbc("music", lt_abc, {
        responsive: "resize",
        format: {
            titlefont: "Josefin Sans 16",
        }
    });
}


// ===== INITIAL SET-UP =====

async function initialSetup() {
    loadMusicData("https://jeffkitson-music.github.io/cnd/scales_and_long_tones.json");
    
    if (checkURLForSavedGame()) {
        Swal.fire({
            title: "Welcome back!",
            text: "Continue your adventure!",
            icon: "success",
            iconColor: "#8CC63E",
        });
        return;
    }

    const {
        value: setupFormValues,
        isConfirmed,
        isDenied
    } = await Swal.fire({
        title: "New Game",
        titleFont: "Cinzel",
        html: `
            <label for="numTrials">Number of Trials (1-10):</label>
            <input type="number" id="numTrials" name="numTrials" min="1" max="10" placeholder="3"><br>
            <br>
            <label for="ptsPerTrial">Points per Trial (1-100):</label>
            <input type="number" id="ptsPerTrial" name="ptsPerTrial" min="1" max="100" placeholder="20"><br>
            <br>
            <label for="playerStartingHealth">Player Health (1-100):</label>
            <input type="number" id="playerStartingHealth" name="playerStartingHealth" min="1" max="100" placeholder="50"><br>
            <br>
            <label for="diceType">Choose your dice:</label>
            <select id="diceType" name="diceType">
                <option value=6>D6</option>
                <option value=12>D12</option>
                <option value=20>D20</option>
            </select>
        `,
        focusConfirm: false,
        confirmButtonText: "Play New Game!",
        showDenyButton: true,
        confirmButtonColor: "#8CC63E",
        denyButtonText: "Continue Previous",
        denyButtonColor: "#8CC63E",
        // preConfirm runs only when "Confirm" is clicked
        preConfirm: () => {
            return {
                "numTrials": document.getElementById("numTrials").value,
                "ptsPerTrial": document.getElementById("ptsPerTrial").value,
                "playerStartingHealth": document.getElementById("playerStartingHealth").value,
                "diceType": document.getElementById("diceType").value
            };
        }
    });

    
    const currentNumTrials = document.getElementById("numTrials").value;
    const currentPtsPerTrial = document.getElementById("ptsPerTrial").value;
    const currentPlayerStartingHealth = document.getElementById("playerStartingHealth").value;
    const currentDiceType = document.getElementById("diceType").value;

    const allFormValues = {
        "numTrials": currentNumTrials,
        "ptsPerTrial": currentPtsPerTrial,
        "playerStartingHealth": currentPlayerStartingHealth,
        "diceType": currentDiceType
    };

    if (isConfirmed) {
        setMaxDice(allFormValues);
        initializeProgressBars(allFormValues);
    } else if (isDenied) {
        setMaxDice(allFormValues);
        initializeProgressBars(allFormValues);
        showAdvancedSettings();
        // You can now use allFormValues for any logic needed when denied
    } else {
        // This block handles dismissals (e.g., clicking outside or pressing Escape)
    }
}

async function showAdvancedSettings() {
    const {
        value: setupFormValues,
        isConfirmed,
        isDenied
    } = await Swal.fire({
        title: "Advanced Settings",
        titleFont: "Cinzel",
        html: `
            <label for="numTrialsLeft">Number of Trials Left:</label>
            <input type="number" id="numTrialsLeft" name="numTrialsLeft" min="1" max="10" placeholder="3"><br>
            <br>
            <label for="trialPtsLeft">Points Left in this Trial:</label>
            <input type="number" id="trialPtsLeft" name="trialPtsLeft" min="1" max="100" placeholder="20"><br>
            <br>
            <label for="playerHealthLeft">Player Health Left:</label>
            <input type="number" id="playerHealthLeft" name="playerHealthLeft" min="1" max="100" placeholder="50"><br>
        `,
        focusConfirm: false,
        confirmButtonText: "Play!",
        confirmButtonColor: "#8CC63E",
        // preConfirm runs only when "Confirm" is clicked
        preConfirm: () => {
            return {
                "numTrialsLeft": document.getElementById("numTrialsLeft").value,
                "trialPtsLeft": document.getElementById("trialPtsLeft").value,
                "playerHealthLeft": document.getElementById("playerHealthLeft").value,
            };
        }
    });

    // After the Swal.fire() promise resolves, access the input values directly
    // These values will be available whether "Confirm", "Deny", or dismissal happened.
    const currentNumTrials = document.getElementById("numTrialsLeft").value;
    const currentPtsPerTrial = document.getElementById("trialPtsLeft").value;
    const currentPlayerStartingHealth = document.getElementById("playerHealthLeft").value;

    const advancedFormValues = {
        "numTrials": currentNumTrials,
        "ptsPerTrial": currentPtsPerTrial,
        "playerStartingHealth": currentPlayerStartingHealth,
    };

    if (isConfirmed) {
        advancedProgressBarAdjustment(advancedFormValues);
    }

}

function checkURLForSavedGame() {
    // Get the current URL's query string
    const queryString = window.location.search;

    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);

    var saved = urlParams.get('game');
    if (saved == null) { // game wasn't in the params
        return false;
    }

    var savedDecoded = decodeBase64UrlParamToObject(saved);

    if (savedDecoded !== false) {
        // Basic
        const allFormValues = {
            "numTrials": savedDecoded.na_max,
            "ptsPerTrial": savedDecoded.tp_max,
            "playerStartingHealth": savedDecoded.ph_max,
            "diceType": savedDecoded.d
        };

        const advancedFormValues = {
            "numTrials": savedDecoded.na_left, //currentNumTrials,
            "ptsPerTrial": savedDecoded.tp_left, // points left
            "playerStartingHealth": savedDecoded.ph_left //currentPlayerStartingHealth,
        };

        initializeProgressBars(allFormValues);
        advancedProgressBarAdjustment(advancedFormValues);
        return true;
    } else {
        return false;
    }
}

function saveGame() {
    const trialBar = document.getElementById("trials-progress");
    const healthBar = document.getElementById("player-health");
    const adventureBar = document.getElementById("adventure-progress");

    var savedGame = {
        "tp_left": trialBar.value,
        "tp_max": trialBar.max,
        "na_left": adventureBar.value,
        "na_max": adventureBar.max,
        "ph_left": healthBar.value,
        "ph_max": healthBar.max,
        "d": maxDice
    };

    var savedGameEncoded = encodeObjectToBase64UrlParam(savedGame);

    // You can then use this queryString to construct a full URL:
    //const baseUrl = "https://www.example.com/game.html";
    const baseUrl = window.location.origin + window.location.pathname;

    const fullUrl = `${baseUrl}?game=${savedGameEncoded}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl);
        Swal.fire({
            icon: "success",
            iconColor: "#8CC63E",
            title: "Saved!",
            text: "Copied to your clipboard! Save it in notes app, text yourself, etc.!"
        });
    } else {
        Swal.fire(fullUrl);
    }
    var savedGameArea = document.getElementById("saved-game-link")
    savedGameArea.innerText = fullUrl
    //savedGameArea.style.setProperty("")
    savedGameArea.classList.add("text-xs"); // Adds a Tailwind class for extra small text
}
async function initialSetupOLD() {
    const {
        value: setupFormValues,
        isConfirmed,
        isDenied
    } = await Swal.fire({
        title: "New Game",
        titleFont: "Cinzel",
        html: `
    <label for="numTrials">Number of Trials (1-10):</label>
    <input type="number" id="numTrials" name="numTrials" min="1" max="10" placeholder="3"><br>
    <br>
   <label for="ptsPerTrial">Points per Trial (1-100):</label>
    <input type="number" id="ptsPerTrial" name="ptsPerTrial" min="1" max="100" placeholder="20"><br>
  
    <br>
   <label for="playerStartingHealth">Player Health (1-100):</label>
    <input type="number" id="playerStartingHealth" name="playerStartingHealth" min="1" max="100" placeholder="50"><br>
    <br>
    <label for="diceType">Choose your dice:</label>
    <select id="diceType" name="diceType">
        <option value=6>D6</option>
        <option value=12>D12</option>
        <option value=20>D20</option>
    </select>
  `,
        focusConfirm: false,
        confirmButtonText: "Play!",
        confirmButtonColor: "#8CC63E",
        showDenyButton: true,
        denyButtonText: "Your mom!",
        preConfirm: () => {
            return {
                "numTrials": document.getElementById("numTrials").value,
                "ptsPerTrial": document.getElementById("ptsPerTrial").value,
                "playerStartingHealth": document.getElementById("playerStartingHealth").value,
                "diceType": document.getElementById("diceType").value
            };
        }
    });
    if (isConfirmed) { // was if(setupFormValues)
        //Swal.fire(JSON.stringify(setupFormValues));
        setMaxDice(setupFormValues);
        initializeProgressBars(setupFormValues);
    }
    if (isDenied) {
    }

}

// ===== VICTORY, DEFEAT, AND CONFETTI =====
function trialVictory() {
    Swal.fire({
        title: "Trial Defeated!",
        text: `Congratulations!`,
        //title: ,
        icon: "success", // Credit: https://tenor.com/view/dice-roll-dice-roll-the-dice-cube-game-gif-6495545147822062773
        iconColor: "#8CC63E",
        confirmButtonColor: "#8CC63E", // #333333
        confirmButtonText: "Hooray!"
    });
    throwConfetti();
}

function trialDefeat() {
    Swal.fire({
        title: "Game Over",
        text: `Keep Practicing!!`,
        //title: ,
        icon: "error", // Credit: https://tenor.com/view/dice-roll-dice-roll-the-dice-cube-game-gif-6495545147822062773
        iconColor: "#D62728",
        confirmButtonColor: "#FBE475", //"#D62728", // #333333
        confirmButtonText: "Accept Defeat..."
    });
    //throwConfetti()
}

function adventureVictory() {
    Swal.fire({
        title: "Total Victory!",
        text: `You beat the adventure!!`,
        confirmButtonText: "Winning!",
        //title: ,
        icon: "success", // Credit: https://tenor.com/view/dice-roll-dice-roll-the-dice-cube-game-gif-6495545147822062773
        iconColor: "#8CC63E",
        confirmButtonColor: "#8CC63E" // #333333
    });
    confettiCannon();
}

function throwConfetti() {
    //https://confetti.js.org/more.html
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ["8CC63E", "FBE475", "B3B3B3", "333333"],
    };

    confetti({
        ...defaults,
        particleCount: 50,
        scalar: 2,
    });

    confetti({
        ...defaults,
        particleCount: 25,
        scalar: 3,
    });

    confetti({
        ...defaults,
        particleCount: 10,
        scalar: 4,
    });
}

function confettiCannon() {
    const end = Date.now() + 15 * 1000;

    const colors = ["8CC63E", "FBE475", "B3B3B3", "333333"];
    const duration = 15 * 1000,
        animationEnd = Date.now() + duration,
        defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0
        };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                colors: colors,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2
                },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                colors: colors,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2
                },
            })
        );
    }, 250);


    /*
    (function frame() {
      confetti({
        particleCount: 2,
        angle: -30,
        spread: 55,
        origin: { x: 0, y: .01},
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 30,
        spread: 55,
        origin: { x: 0, y: 1},
        colors: colors,
      });
    confetti({
        particleCount: 2,
        angle: 330,
        spread: 55,
        origin: { x: 1, y: 0},
        colors: colors,
      });

     confetti({
        particleCount: 2,
        angle: 30,
        spread: 55,
        origin: { x: 0.1, y: 0},
        colors: colors,
      });


      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

     */
}


// ===== BASE64 for SECURITY
// Function to encode an object to a Base64 URL-safe string
function encodeObjectToBase64UrlParam(obj) {
    // 1. Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // 2. Encode the JSON string to a UTF-8 Uint8Array
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(jsonString);

    // 3. Convert the Uint8Array to a "binary string"
    const binaryString = String.fromCharCode(...utf8Bytes);

    // 4. Base64 encode the binary string
    const base64Encoded = btoa(binaryString);

    // 5. Make it URL-safe (replace + with -, / with _, and remove trailing =)
    // This is optional but good practice for URL parameters
    const urlSafeBase64 = base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return urlSafeBase64;
}


// Function to decode a Base64 URL-safe string back to an object
function decodeBase64UrlParamToObject(urlSafeBase64) {
    if (!urlSafeBase64) {
        return false; // Or an empty object, depending on desired behavior
    }

    // 1. Convert back from URL-safe to standard Base64 (add padding if missing)
    let standardBase64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (standardBase64.length % 4) { // Add padding `=` characters
        standardBase64 += '=';
    }

    // 2. Base64 decode the string to a "binary string"
    const decodedBinaryString = atob(standardBase64);

    // 3. Convert the binary string to a Uint8Array
    const utf8Bytes = Uint8Array.from(decodedBinaryString, char => char.charCodeAt(0));

    // 4. Decode the Uint8Array to a UTF-8 string (JSON string)
    const decoder = new TextDecoder('utf-8');
    const jsonString = decoder.decode(utf8Bytes);

    // 5. Parse the JSON string back into an object
    try {
        const decodedObject = JSON.parse(jsonString);
        return decodedObject;
    } catch (e) {
        Swal.fire({
            icon: "error",
            iconColor: "red",
            title: "Saved game data not readable!",
            text: "Launching new game..."
        });

        //console.error("Error parsing decoded JSON:", e);
        return false; // Or throw an error, handle as appropriate
    }
}

// ===== LOAD FUNCTIONS  =====
//loadMusicData("https://jeffkitson-music.github.io/cnd/scales_and_long_tones.json");
//initialSetup(); // wait for DOM instead

