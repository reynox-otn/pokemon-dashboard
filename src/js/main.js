// Import modules for data, evolution, favorites, and theme
import * as EVOLUTION from "./evolution.js";
import * as FAVORITES from "./favorites.js";
import * as API from "./api.js"
import * as THEME from "./theme.js";
import { initThemeToggle } from "./theme.js";



// DOM elements used throughout the dashboard
let number = document.getElementById('num');
let pokemon = document.getElementById('name');
let type = document.getElementById('Tp');
let type2= document.getElementById('Tp2');
let height = document.getElementById('Ht');
let weight = document.getElementById('Wt');
let ability = document.getElementById('Ab');
let hp = document.getElementById('Hp');
let attack = document.getElementById('At');
let defense = document.getElementById('Ds');
let Sattack = document.getElementById('Sat');
let Sdefense = document.getElementById('Sds');
let speed = document.getElementById('Sp');
let img = document.getElementById('img');
let suggestions = document.getElementById('suggestions')
let gift =document.getElementById('crying-pikachu')
const loading = document.getElementById('loading');
const container1 = document.getElementById('container1');
const container2 = document.getElementById('container2');
const crybtn = document.getElementById("crybtn");



// Type → gradient colors for UI backgrounds
const gradients = {
    fire: "linear-gradient(138deg, #FFA756 0%, #E25822 100%)",
    water: "linear-gradient(135deg, #7DB7FF 0%, #3F7AE0 100%)",
    grass: "linear-gradient(135deg, #9BE86F 0%, #4FAE3A 100%)",
    electric: "linear-gradient(180deg, #FFD54F 0%, #FBC02D 0%,#F9A825 100% /*#FFE45E 0%, #D4A800 100%*/)",
    psychic: "linear-gradient(135deg, #FF8DB3 0%, #E63E72 100%)",
    ghost: "linear-gradient(135deg, #8A76C8 0%, #56418F 100%)",
    dragon: "linear-gradient(135deg, #8C5CFF 0%, #4B1FD1 100%)",
    dark: "linear-gradient(135deg, #8A6E6E 0%, #4E3C3C 100%)",
    fairy: "linear-gradient(135deg, #FFC1D1 0%, #D96D9D 100%)",
    ice: "linear-gradient(135deg, #C8FFFF 0%, #72C9C9 100%)",
    fighting: "linear-gradient(135deg, #E2574E 0%, #8F1E1A 100%)",
    poison: "linear-gradient(135deg, #C46BC4 0%, #7A287A 100%)",
    bug: "linear-gradient(135deg, #C8DA44 0%, #7E8F18 100%)",
    rock: "linear-gradient(135deg, #D8C05E 0%, #8D7725 100%)",
    ground: "linear-gradient(135deg, #F1D98A 0%, #B48A34 100%)",
    steel: "linear-gradient(135deg, #D9D9EC 0%, #8F8FA8 100%)",
    flying: "linear-gradient(135deg, #C2B3FF 0%, #7B61D8 100%)",
    normal: "linear-gradient(180deg, #D6D6C0 0%, #8E8E74 100%)"
};


// Search Input + Button
const input = document.querySelector('#pkIpt');
const Search = document.querySelector('#schBtn');

// Clicking the search button fetch Pokémon data and evolution chain
Search.addEventListener('click',API.getPokemonData);

// Pressing Enter do the same behavior as clicking search
input.addEventListener('keypress', async(e) =>{
    if(e.key == 'Enter'){
         API.getPokemonData();
    }
})

// Also trigger the evolution chain when Enter is pressed,
// as long as the input is not empty and is valid. 
input.addEventListener('keypress', (e) =>{

    if(e.key == 'Enter'){
        let value = input.value.trim();
        if(!value)return;
        EVOLUTION.displayEvolutionChain(API.getImage);
    }
})

// Clicking the search button trigger the evolution chain as well.
Search.addEventListener('click', () =>{
    let value = input.value.trim();
    if(!value)return;
    EVOLUTION.displayEvolutionChain(API.getImage); 
})

// Live autocomplete for Pokémon names.
// Filters the global pokemonList based on the user's input,
// displays up to 5 matching names, and allows clicking a suggestion
// to auto-fill the input and trigger a full search + evolution chain.
input.addEventListener("input", () => {
    const text = input.value.toLowerCase();

    const matches = EVOLUTION.pokemonList.filter(name =>
        name.startsWith(text)
    );

    suggestions.innerHTML = "";

    matches.slice(0,5).forEach(name => {
    const item = document.createElement("div");
    item.textContent = name;

    suggestions.appendChild(item);
    
    item.addEventListener('mouseover',(e) =>{
        item.style.backgroundColor = 'grey';
    });

    item.addEventListener('mouseout',(e) =>{
        item.style.backgroundColor = '';
    });

    item.addEventListener("click", () => {
    input.value = name;

    API.getPokemonData();
    EVOLUTION.displayEvolutionChain(API.getImage);
    suggestions.innerHTML = "";
        });
    });
    
});


// Plays the selected Pokémon's cry audio.
// Fetches the Pokémon data, checks if a cry exists,
// resets the audio, and plays the latest cry file
crybtn.addEventListener("click", async () => {
    let name = input.value.trim().toLowerCase();

    if(!name)return;
    const cry = new Audio();

    let response = await API.fetchData(name);
    if(response == null){
            return;
        }
    let data= await response.json()
    cry.pause();
    if(!data.cries.latest){
        console.log(error,`pokemon ${data.name}, has no cry`)
    }
    cry.src = data.cries.latest;
    cry.currentTime = 0;
    cry.play();
})

// Hide all evolution layouts on initial load.
// These will be shown automatically depending on the Pokémon's evolution chain.
for(let i=1;i<4;i++){
    document.getElementById(`layout${i}`).style.display='none';
}

// Initial UI setup for default dashboard state.
// Sets placeholder Pokémon, hides types, shows default image,
// and hides loading/crying animations.
function initializeUI(){
    pokemon.textContent = 'Pokemon-Fetcher...';
    type.style.display = 'none';
    type2.style.display = 'none';
    img.src = './src/assets/images/pokemon5.png';
    img.style.borderRadius ='50%';
    img.style.marginTop ='70px';
    loading.style.display='none'
    gift.style.display='none'
    img.style.display='block'
}
initializeUI()

// Initialize theme toggle (light and dark mode)
initThemeToggle();


