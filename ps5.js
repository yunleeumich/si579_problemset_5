// GROUP BY FUNCTION
/**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 * 
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 * 
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */
 function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}


const initialWordInput = document.getElementById('word_input');
const savedElement = document.getElementById('saved_words');
const titleDescription = document.getElementById('output_description');
const textOutput = document.getElementById('word_output');
const showRhymesBtn = document.getElementById("show_rhymes");
const showSynonymsBtn = document.getElementById('show_synonyms')
let savedWords = []


// ADD TO SAVE LIST
function addSavedWords(word) {
    if (!savedWords.includes(word)) {
      savedWords.push(word);
    }
    savedElement.innerText = savedWords.join(', ');
  }


// HITS "ENTER", SHOW RHYMING WORDS
initialWordInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        showRhymesBtn.click();
    }
});


// ADD "S" OR NOT
function addS(num) {
    if (num === 1) {
      return "";
    } else {
      return "s";
    }
  }


// INITIAL
showRhymesBtn.addEventListener("click", function(event) {
    const newInitialWordInput = initialWordInput.value.trim().toLowerCase();

    // ADD A CONDITION TO MAKE SURE THE INPUT IS NOT EMPTY
    if (newInitialWordInput) {
        textOutput.textContent = newInitialWordInput;
        // savedElement.innerHTML = `<span>${newInitialWordInput}</span>`;
        savedElement.innerHTML = `<span>(none)</span>`;
        initialWordInput.value = "";
        initialWordInput.blur();

        // CHANGE THE TITLE
        titleDescription.innerHTML = `Words that rhyme with ${newInitialWordInput}: `;
    };
});


// CONNECTED TO DATAMUSE API
showRhymesBtn.addEventListener("click", rhymingWrodClick);

function rhymingWrodClick (event) {
    

    fetch("https://api.datamuse.com/words?rel_rhy=" + textOutput.textContent)
    .then(res => res.json())
    .then(data => {

        if (data.length == 0) {
            textOutput.innerHTML = '(no results)';
        } else {
            textOutput.innerHTML = '...loading';
            textOutput.innerHTML = '';
            datas = groupBy(data, "numSyllables");
            for (let group in datas) {
                // console.log(group);
                let groupTitle = document.createElement("h3");
                groupTitle.innerText = `${group} syllable${addS(Number(group))}:`;
                console.log(groupTitle);
                let rhymesOutput = document.createElement("ul");
                for (let ele of datas[group]) {
                    console.log(ele);
                    const li = document.createElement('li');
                    li.innerText = ele["word"];
                    const btn = document.createElement("button");
                    btn.innerHTML = '(save)';
                    li.appendChild(btn);
                    btn.addEventListener("click", function() {
                        addSavedWords(ele["word"]);
                    });
                    rhymesOutput.append(li);
                }
                textOutput.append(groupTitle);
                textOutput.append(rhymesOutput);
            }
        }
    })
    .catch(err => console.log(err));
}



// // Synonyms
showSynonymsBtn.addEventListener("click", function(event) {
    const newInitialWordInput = initialWordInput.value.trim().toLowerCase();

    // ADD A CONDITION TO MAKE SURE THE INPUT IS NOT EMPTY
    if (newInitialWordInput) {
        textOutput.textContent = newInitialWordInput;
        // savedElement.innerHTML = `<span>${newInitialWordInput}</span>`;
        initialWordInput.value = "";
        initialWordInput.blur();

        // CHANGE THE TITLE
        titleDescription.innerHTML = `Words with a meaning similar to ${newInitialWordInput}:`;
    };
});


// // CONNECTED TO DATAMUSE API
showSynonymsBtn.addEventListener("click", SynonymsWrodClick);

function SynonymsWrodClick (event) {

    fetch("https://api.datamuse.com/words?rel_syn=" + textOutput.textContent)
    .then(res => res.json())
    .then(data => {

        //console.log(data);
        if (data.length == 0) {
            textOutput.innerHTML = '(no results)';
        } else {
            textOutput.innerHTML = '...loading';
            textOutput.innerHTML = '';
            let rhymesOutput = document.createElement("ul");
            for (let ele in data) {
                console.log(data[ele]['word']);
                const li = document.createElement('li');
                li.innerText = data[ele]["word"];
                const btn = document.createElement("button");
                btn.innerHTML = '(save)';
                li.appendChild(btn);
                btn.addEventListener("click", function() {
                    addSavedWords(data[ele]["word"]);
                });
                rhymesOutput.append(li);
                li.append(btn);
            }
        
        textOutput.append(rhymesOutput);

        }
    })
    .catch(err => console.log(err));

    // LOADER
    textOutput.innerHTML = '...loading';
}