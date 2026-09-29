
// DOM elements used for updating Pokémon info
const input = document.getElementById('pkIpt');
const pokemon = document.getElementById('name');
const number = document.getElementById('num');
const type = document.getElementById('Tp');
const type2 = document.getElementById('Tp2');
const height = document.getElementById('Ht');
const weight = document.getElementById('Wt');
const ability = document.getElementById('Ab');
const hp = document.getElementById('Hp');
const attack = document.getElementById('At');
const defense = document.getElementById('Ds');
const Sattack = document.getElementById('Sat');
const Sdefense = document.getElementById('Sds');
const speed = document.getElementById('Sp');
const img = document.getElementById('img');
const gift = document.getElementById('crying-pikachu');
const loading = document.getElementById('loading');
const container1 = document.getElementById('container1');
const container2 = document.getElementById('container2');

// gradient colors for UI backgrounds based on Type
const gradients = {
    fire: "linear-gradient(138deg, #FFA756 0%, #E25822 100%)",
    water: "linear-gradient(135deg, #7DB7FF 0%, #3F7AE0 100%)",
    grass: "linear-gradient(135deg, #9BE86F 0%, #4FAE3A 100%)",
    electric: "linear-gradient(180deg, #FFD54F 0%, #FBC02D 0%,#F9A825 100%)",
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


// Fetches Pokémon data from the API.
// Returns the response if found, or null if the Pokémon does not exist.
// Also updates the UI with a "not found" message when the pokemon does not exist.
export async function fetchData(name) {
    const url = "https://pokeapi.co/api/v2/pokemon/";
    try{
        let response = await fetch(`${url}${name}`);
        if(!response.ok ){
            pokemon.textContent = `pokemon ' ${name} ' not found.`
            return null;
        }
        return response;
    }
    catch(error){
        console.log(error );
    }
}


// Loads Pokémon data and updates the entire dashboard.
// Handles loading animation, stats, types, image fade, cry audio,
// background colors, and search history.
export async function getPokemonData(){
    if(!input.value.trim()) return;

    let name = input.value.trim();
    let data = ''

    try{
        // Show loading state
        pokemon.textContent = 'Loading...'
        img.style.display='none'
        loading.style.display='block'
        document.getElementById('crying-pikachu').style.display='none'
        container1.style.background = '#121416b2'

        // Fetch Pokémon data
        let response = await fetchData(name);

        // Handle "not found" case when the pokemon does not exist
        if(response == null){
            loading.style.display='none'
            gift.src = gift.src;
            gift.style.display='block';
            number.textContent = '';
            type.textContent = '';
            type2.textContent = '';
            height.textContent = '';
            weight.textContent = '';
            ability.textContent = ''; 
            hp.textContent = '';
            attack.textContent = '';
            defense.textContent = '';
            Sattack.textContent = '';
            Sdefense.textContent = '';
            speed.textContent = '';

            // Reset stats bars 
            for(let i = 0; i<6; i++){
            let t= 0;
            let bar = document.getElementById(`bar${i}`);
            bar.style.width= `${(t / 255) *100}%`;
                 }
            container2.style.visibility='hidden';
            return;
        }
        data = await response.json();
    }
    catch(error){
        console.log(error);
    }

    // Hide loading gift and show the pokemon image 
    loading.style.display='none';
    container2.style.visibility ='visible';
    img.style.display = 'block';
    
    // Format Pokémon ID
    let n = data.id
    if(String(n).length == 1){
        number.textContent = `#000${n}`;
    }
    else if(String(n).length == 2){
        number.textContent = `#00${n}`;
    }
    else if(String(n).length == 3){
        number.textContent = `#0${n}`;
    }
    else if(String(n).length == 4){
        number.textContent = `#${n}`;
    }
    else{
        number.textContent='';
    }

    img.style.borderRadius ='';
    img.style.marginTop ='90px';
    img.style.marginRight='';
    pokemon.style.marginLeft ='';
    pokemon.textContent = data.name;

    // Fade animation for image
    img.classList.add("chang-out");
    const image_fade_time = 750;
    await new Promise(resolv => setTimeout(resolv,image_fade_time));
    img.src = data.sprites.other['official-artwork'].front_default;
    img.classList.remove("chang-out");

    // Update basic info 
    height.textContent = `${data.height}-ft`;
    weight.textContent =  `${data.weight}-lbs`;
    ability.textContent= `${data.abilities[0].ability.name}`;

    // Update stats
    hp.textContent = data.stats[0].base_stat;
    attack.textContent = data.stats[1].base_stat;
    defense.textContent = data.stats[2].base_stat;
    Sattack.textContent = data.stats[3].base_stat;
    Sdefense.textContent = data.stats[4].base_stat;
    speed.textContent = data.stats[5].base_stat;

    // Update background colors based on the pokemon type.
    container1.style.background = gradients[data.types[0].type.name];
    container2.style.background = gradients[data.types[0].type.name];

    // Update stat bars
    for(let i = 0; i<6; i++){
        let t= data.stats[i].base_stat ;
        let bar = document.getElementById(`bar${i}`);
        bar.style.width= `${(t / 255) *100}%`;
        
    }

    // Update types
    type.style.display = 'block';
    type.textContent =   `${data.types[0].type.name}`;
    type2.textContent = '';

    // Play Pokémon cry
    const cry = new Audio();
    cry.pause();
    if(!data.cries.latest){
        console.log(error,`pokemon ${data.name}, has no cry`);
    }
    cry.src = data.cries.latest;
    cry.currentTime = 0;
    cry.play();

    // Update the search history.
    let historyList = JSON.parse(localStorage.getItem('history')) || [];
    if(historyList.length == 5){
        historyList.shift()
    }
    historyList.push(data.name)
    localStorage.setItem(
        'history',
        JSON.stringify(historyList)
    )
    document.dispatchEvent(new CustomEvent('historyUpdated'));

    try{
        let t = data.types[1].type.name;
        type2.textContent = `${data.types[1].type.name}`;
        type2.style.display = 'block';
    }
    catch(error){
        type2.style.display = 'none';
    }
}


// Fetches the official artwork image for a Pokémon.
// Returns the image URL or null if the Pokémon doesn't exist.
export async function getImage(POKEMON){
    try{
        let request =   await fetch(`https://pokeapi.co/api/v2/pokemon/${POKEMON}`);
        if(!request.ok){
            return null;
        }
        let result = await request.json();
        let fetchedPic = result.sprites.other['official-artwork'].front_default;
        return fetchedPic;
    }
    catch(error){
        console.log(error);
        return null;
    }
}



