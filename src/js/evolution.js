// Input element used for reading the Pokémon name
const input = document.getElementById('pkIpt');

// Fetches the evolution chain for a Pokémon.
// Returns an array with up to three evolutions stages:
// [baseForm, firstEvolution, secondEvolution].
// If a stage doesn't exist, "none" is used instead.
// Uses try/catch blocks to handle Pokémon with abnormal chains.
export async function getSpeciesName(name){
    let list = [];

    try{
    let request = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);
    if(!request.ok){
        document.getElementById('container2').style.visibility= 'hidden ';
        console.log(`pokemon ' ${name} ' not found.`);
        return
    }
    let result = await request.json();
    let evolutionChainUrl = result.evolution_chain.url;
    
    let chain = await fetch(`${evolutionChainUrl}`);
    let current = await chain.json();
    
    let baseForm =  '' ;
    let firstEvo =  '' ;
    let secondEvo = '' ;
    
    // Base form
    try{
        baseForm = current.chain.species.name;
        list.push(baseForm);
    }
    catch(error){
        baseForm = 'none';
        list.push(baseForm);
    }
    
    // First evolution
    try{
        firstEvo = current.chain.evolves_to[0].species.name;
        list.push(firstEvo);
    }
    catch(error){
        firstEvo = 'none';
        list.push(firstEvo);
    }
    
    // Second evolution
    try{
        secondEvo = current.chain.evolves_to[0].evolves_to[0].species.name;
        list.push(secondEvo);
    }
    catch(error){
        secondEvo = 'none';
        list.push(secondEvo);
    }

    return list

    }
   
    catch(error){
        console.log(error);
    }
}

// Global Pokémon name list used for autocomplete suggestion
export let pokemonList = [];

// Loads all Pokémon names from the API.
// Stores them in pokemonList for fast autocomplete matching.
 export async function loadPokemonList() {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000"
    );

    const data = await response.json();
    pokemonList = data.results.map(p => p.name);
}

loadPokemonList();

// Displays the evolution chain for the selected Pokémon.
// Uses the callback (getImage) to fetch the official artwork for each stage.
// Supports 1-stage, 2-stage, and full 3-stage evolution chains.
// Also applies a fade animation to all evolution image.
export async function displayEvolutionChain(callback) {

    const layout1 = document.getElementById("layout1");
    const layout2 = document.getElementById("layout2");
    const layout3 = document.getElementById("layout3");

    // Fade animation for all evolution images
    let images=document.querySelectorAll('.chainimage');
    let imagesList = Array.from(images);
    imagesList.forEach(async (e) => {
        e.classList.add('chang-out');
        await new Promise(resolv => setTimeout(resolv,750));
        e.classList.remove("chang-out");
    })

    // Get the evolution names
    const request = await getSpeciesName(input.value.trim());

    const firstPK = request[0];
    const secondPK = request[1];
    const thirdPK = request[2];

    // Hide all layouts before showing the right one
    [layout1, layout2, layout3].forEach(layout => layout.style.display = "none");

    document.getElementById("container2Name").style.display = 'none';
    
    // 1-stage evolution (no evolutions)
    if (secondPK === "none") {
        layout1.style.display = "block";

        document.getElementById("L1-Ev0").textContent = firstPK;
        document.getElementById("L1-img1").src = await callback(firstPK);

        return;
    }

    // 2-stage evolution
    if (thirdPK === "none") {
        layout2.style.display = "block";

        document.getElementById("L2-Ev0").textContent = firstPK;
        document.getElementById("L2-Ev1").textContent = secondPK;

        document.getElementById("L2-img1").src = await callback(firstPK);
        document.getElementById("L2-img2").src = await callback(secondPK);

        return;
    }

    // Full 3-stage evolution
    layout3.style.display = "block";

    document.getElementById("L3-Ev0").textContent = firstPK;
    document.getElementById("L3-Ev1").textContent = secondPK;
    document.getElementById("L3-Ev2").textContent = secondPK;
    document.getElementById("L3-Ev3").textContent = thirdPK;

    const secondImg = await callback(secondPK);

    document.getElementById("L3-img1").src = await callback(firstPK)
    document.getElementById("L3-img2").src = secondImg;
    document.getElementById("L3-img3").src = secondImg;
    document.getElementById("L3-img4").src =
        await callback(thirdPK);
}