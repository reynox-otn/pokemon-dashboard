// Initializes the theme toggle switch.
// Listens for changes to the checkbox and switches
// between light mode and dark mode.
// Updates CSS variables, body classes, and text colors
// to match the selected theme.
export function initThemeToggle() {
const toggle = document.getElementById("themetgle");
if (!toggle) return;

toggle.addEventListener("change", () => {

    // Dark mode settings
    if(toggle.checked){
        document.documentElement.style.setProperty('--scroll-start', 'var(--scroll-dark-start)');
        document.documentElement.style.setProperty('--scroll-end', 'var(--scroll-dark-end)');
        document.body.classList.add('dark');
        document.body.classList.remove("light");
        document.getElementById('suggestions').style.color='snow';
        document.getElementById('pkIpt').style.color='snow';
        document.getElementById('Hsbtn').style.color='snow';
        document.getElementById('historySearch').style.color='white';
        document.getElementById('randombtn').style.color='snow';
    }

    // Light mode settings
    else{
        document.documentElement.style.setProperty('--scroll-start', 'var(--scroll-light-start)');
        document.documentElement.style.setProperty('--scroll-end', 'var(--scroll-light-end)');
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        document.getElementById('suggestions').style.color='black';
        document.getElementById('pkIpt').style.color='black';
        document.getElementById('Hsbtn').style.color='black';
        document.getElementById('historySearch').style.color='black';
        document.getElementById('randombtn').style.color='black';
}});
}