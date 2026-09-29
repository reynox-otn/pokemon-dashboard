
import { getImage, getPokemonData } from "./api.js";
import { displayEvolutionChain } from "./evolution.js";

// Input element used for reading the Pokémon name
const input = document.getElementById('pkIpt');

// Favorite + random buttons
export let random = document.getElementById('randombtn');
export let favorite = document.getElementById('favoritebtn');

// List of the saved favorites from localStorage
export let favoriteList = JSON.parse(localStorage.getItem("favorites")) || [];

// Adds the current Pokémon to the favorites list.
// Prevents duplicates, limits the list to 5 items,
// saves the list in localStorage, and updates preview images.
favorite.addEventListener('click', async ()=>{
    let Fpk = input.value.trim();
    if(!Fpk)return;
    if(favoriteList.includes(Fpk))return;

    let pic = await getImage(Fpk);
    if(pic == null){
        console.log(`pokemon  ${Fpk} not found`);
        return;
    }

    // Keep only 5 favorites
    if(favoriteList.length == 5){
        favoriteList.shift();
    }
    favoriteList.push(Fpk);
    localStorage.setItem(
        'favorites',
        JSON.stringify(favoriteList)
    )

    // Update favorite preview images with fade animation
    for(let i = 0;i < favoriteList.length ; i++){
        let g = document.getElementById(`Fvi${i}`);
        g.classList.add('chang-out');
        g.src = await getImage(favoriteList[i]); 
        await new Promise(resolv => setTimeout(resolv,750));
        g.classList.remove("chang-out");   
}})

// loads saved favorites when the page loads.
// Updates preview images using the same fade animation.
export async function loadFavorites(){
   
    for(let i = 0; i < favoriteList.length; i++){

        let g = document.getElementById(`Fvi${i}`);
        g.classList.add('chang-out');
        g.src = await getImage(favoriteList[i]); 
        await new Promise(resolv => setTimeout(resolv,750));
        g.classList.remove("chang-out"); 
    }};


loadFavorites();

// Generates a random Pokémon ID.
// Sets the input value, loads the Pokémon,
// and displays its evolution chain.
random.addEventListener('click', () => {
    const randomNum = Math.floor(Math.random() * 1025) + 1;
    input.value = randomNum;

    getPokemonData();
    displayEvolutionChain(getImage);
})

// Search history list from localStorage
export let historyList = JSON.parse(localStorage.getItem("history")) || []

// History button + container
export let historybtn = document.getElementById('Hsbtn');
export let historySearch = document.getElementById('historySearch');

// Renders the search history list.
// Creates items that can be clicked and  reload the Pokémon when clicked.
// and display its evolution chain.
// Adds hover effects.
function renderHistory() {
    historyList = JSON.parse(localStorage.getItem("history")) || [];
    historySearch.innerHTML='';

    historyList.forEach(e =>{
        let item = document.createElement('div');
        item.textContent= e;
        item.style.zIndex= 6;
        historySearch.appendChild(item);

        item.addEventListener('mouseover',() =>{
        item.style.backgroundColor = 'grey';
    });

        item.addEventListener('mouseout',() =>{
        item.style.backgroundColor = '';
    });

        item.addEventListener("click", () => {
        input.value = e;
        getPokemonData();
        displayEvolutionChain(getImage);
        });
    });
}

// Shows or hides the search history list.
// Re-renders the list when opened.
historybtn.addEventListener('click',() =>{

    if (historySearch.style.display !== 'none' && historySearch.innerHTML !== '') {
        historySearch.style.display = 'none';
        return;
    }

    historySearch.style.display = 'flex';
    renderHistory();
})

// Updates the history list automatically
// whenever a new Pokémon is added to history.
document.addEventListener('historyUpdated', () => {
    if (historySearch.style.display !== 'none') {
        renderHistory();
    }
});

// Allows clicking any favorite  image
// to instantly load that Pokémon and show its evolution chain.
for(let i = 0;i<5;i++){
    let item = document.getElementById(`Fvi${i}`);

    item.addEventListener('click',()=>{
        input.value = favoriteList[i];
        getPokemonData();
        displayEvolutionChain(getImage);
    })
}
