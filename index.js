let isSet = false;
let word;
let ready = false;
const voices = speechSynthesis.getVoices();

// DOM
let dropdown_menu;
let btn_generate;
let current_difficulty;
let btn_repeat;
let form;
let error;

// Other things
let difficulties;
let links;

// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/ also i love the font <3
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
// Chatgpt, couldnt find answer online
function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}
async function updateNetworking(){
    // fetch website
    let _fetch = await fetch("settings.json")
    let _data = await _fetch.text()
    _data = JSON.parse(_data)
    console.log(_data)

    // get difficulties && set them
    removeAllChildNodes(dropdown_menu) // reset difficulties

    difficulties = _data.difficulties
    let keys = Object.keys(difficulties)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]

        let difficulty = difficulties[key]
        let a = document.createElement("a")
        a.href = "#"
        a.innerText = key
        a.dataset.back = difficulty

        dropdown_menu.appendChild(a)
        
        a.addEventListener("click",e=>{
            current_difficulty.dataset.back = a.dataset.back
            current_difficulty.innerText = a.innerText
        })
    }

    // get links and set em
    links = _data["word-links"]
    console.log(links)
    let _links = {};
    keys = Object.keys(links)
    console.log(keys)
    for (let i = 0; i < keys.length; i++) {
        let link = links[keys[i]]
        let _fetch = await fetch(link)
        let _data = await _fetch.text();
        _data = _data.split(/\r?\n/);

        _links[keys[i]]=_data
    }
    ready = true
    links = _links
}
// i was so lazy that i just decided to hide invidual elements :shrug:
function setup(){
    let elements = document.querySelectorAll(".hidden")
    elements.forEach(e=>{
        e.classList.remove("hidden")
    })
    if (document.querySelector(".big")){
        document.querySelector(".big").classList.remove("big")
    }
}
function speak(word){
    if (!word) return;
    let utterance = new SpeechSynthesisUtterance(word)
        utterance.voice = voices.find(v => 
            v.name.includes("Google US English") || 
            v.name.includes("Microsoft") || 
            v.name.includes("Samantha") ||
            v.name.includes("Zira")
        );
    speechSynthesis.speak(utterance)
}
document.addEventListener("DOMContentLoaded",e=>{
    // init variables used later from DOM
    btn_generate = document.querySelector("#generate");
    dropdown_menu = document.querySelector(".dropdown-options")
    current_difficulty = document.querySelector("button.dropbtn")
    btn_repeat = document.querySelector("#repeat-sound")
    form = document.querySelector("#form")
    error = document.querySelector("#error")

    // event listeners
    btn_generate.addEventListener("click",e=>{
        if (!current_difficulty.dataset.back || !ready) return;
        isSet = true
        let words = links[current_difficulty.dataset.back]

        setup()
        word = words[Math.floor(Math.random() * words.length)];
        speak(word)
    })
    btn_repeat.addEventListener("click",e=>{
        speak(word)
    })
    form.addEventListener("submit",e=>{
        e.preventDefault()
        let _word = document.querySelector('#i_word').value
        document.querySelector('#i_word').value = ""
        let s1 = String(_word).toLowerCase()
        let s2 = String(word).toLowerCase()
        if (!s1) return
        console.log(s1,s2)
        if (s1 == s2 && word){
            var sound = new Audio("/assets/ding.mp3");
            sound.play()
            word = false;
            error.style.display = "hidden"
        } else{
            error.style.display = "block"
            error.innerText = `Incorrect: ${s1} / ${s2}`
        }
    })

    // networking
    updateNetworking()
})