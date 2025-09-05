let isSet = false;
let word = true;
let ready = false;

// DOM
let dropdown_menu;
let btn_generate;
let current_difficulty;

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

    document.querySelector(".big").classList.remove("big")
}
document.addEventListener("DOMContentLoaded",e=>{
    // init variables used later from DOM
    btn_generate = document.querySelector("#generate");
    dropdown_menu = document.querySelector(".dropdown-options")
    current_difficulty = document.querySelector("button.dropbtn")

    // event listeners
    btn_generate.addEventListener("click",e=>{
        if (!current_difficulty.dataset.back || !ready) return;
        isSet = true
        let words = links[current_difficulty.dataset.back]

        setup()
        let word = words[Math.floor(Math.random() * words.length)];
    })

    // networking
    updateNetworking()
})