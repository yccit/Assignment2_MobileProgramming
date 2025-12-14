// CONFIGURATION
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let appLogs = JSON.parse(localStorage.getItem('tailwind_app_logs')) || [];

// --- 1. CORE UI & LOGGING ---

// Toggle the Tailwind Offcanvas
function toggleMenu() {
    const menu = document.getElementById('offcanvas-menu');
    const overlay = document.getElementById('menu-overlay');
    
    // Toggle hidden/visible states
    if (overlay.classList.contains('hidden')) {
        // OPEN
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10); // Fade in
        menu.classList.remove('translate-x-full');
    } else {
        // CLOSE
        overlay.classList.add('opacity-0');
        menu.classList.add('translate-x-full');
        setTimeout(() => overlay.classList.add('hidden'), 300); // Wait for anim
    }
}

function logInteraction(api, action) {
    const entry = {
        id: Date.now(),
        api: api,
        action: action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    appLogs.unshift(entry);
    localStorage.setItem('tailwind_app_logs', JSON.stringify(appLogs));
}

function navTo(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    // Show target
    document.getElementById(sectionId).classList.remove('hidden');
    // Close menu
    toggleMenu();
    
    // Log it
    logInteraction('Navigation', `Visited ${sectionId}`);
    
    if (sectionId === 'logs') renderLogs();
}

// --- 2. APIs ---

// API 1: MEAL
async function fetchMeal() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        const meal = data.meals[0];

        const html = `
            <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700 animate-fade-in">
                <div class="relative h-48">
                    <img src="${meal.strMealThumb}" class="w-full h-full object-cover">
                    <div class="absolute bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent w-full p-4">
                        <h3 class="text-xl font-bold text-white">${meal.strMeal}</h3>
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex justify-between text-sm text-gray-400 mb-4">
                        <span class="bg-gray-700 px-2 py-1 rounded">${meal.strCategory}</span>
                        <span class="bg-gray-700 px-2 py-1 rounded">${meal.strArea}</span>
                    </div>
                    <a href="${meal.strYoutube}" target="_blank" class="block w-full text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-white transition">
                        Watch Recipe Video
                    </a>
                </div>
            </div>
        `;
        document.getElementById('meal-result').innerHTML = html;
        logInteraction('MealDB', 'Generated Meal');
    } catch(e) { alert('Error fetching meal'); }
}

// API 2: CRYPTO
async function fetchCrypto() {
    const amount = parseFloat(document.getElementById('btc-amount').value);
    if (!amount) return alert('Enter amount');

    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await res.json();
        const price = data.bitcoin.usd;
        const total = amount * price;

        // LOGIC REQUIREMENT: Change Card Color based on Value
        const card = document.getElementById('crypto-card');
        const isHighValue = total > 50000;
        
        // Reset classes then add logic
        card.className = `p-6 rounded-2xl border shadow-xl transition-all duration-500 ${isHighValue ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`;

        const html = `
            <div class="text-center">
                <p class="text-gray-400 text-sm">Total Portfolio Value</p>
                <h3 class="text-3xl font-bold text-white my-2">$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                <div class="inline-block px-3 py-1 rounded-full text-xs font-bold ${isHighValue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                    ${isHighValue ? 'HIGH VALUE ASSET' : 'ENTRY LEVEL'}
                </div>
            </div>
        `;
        document.getElementById('crypto-result').innerHTML = html;
        logInteraction('CoinGecko', `Calc: $${total.toFixed(0)}`);
    } catch(e) { alert('API Rate Limit'); }
}

// API 3: CHARACTER
async function fetchCharacter() {
    const id = Math.floor(Math.random() * 800) + 1;
    try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const char = await res.json();

        const html = `
            <div class="bg-gray-800 rounded-2xl p-4 flex gap-4 items-center border border-gray-700 shadow-lg">
                <img src="${char.image}" class="w-20 h-20 rounded-full border-2 border-blue-500">
                <div>
                    <h4 class="font-bold text-lg">${char.name}</h4>
                    <p class="text-sm text-gray-400">${char.species} • ${char.status}</p>
                </div>
            </div>
        `;
        document.getElementById('character-result').innerHTML = html;
        logInteraction('RickMortyAPI', `Scanned: ${char.name}`);
    } catch(e) { alert('Error'); }
}

// --- 3. LOG HISTORY ---
function renderLogs() {
    const tbody = document.getElementById('log-table-body');
    tbody.innerHTML = '';
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const subset = appLogs.slice(start, start + ITEMS_PER_PAGE);

    subset.forEach(log => {
        tbody.innerHTML += `
            <tr class="bg-gray-800/50 hover:bg-gray-800">
                <td class="px-4 py-3 font-mono text-xs text-blue-400">${log.api}</td>
                <td class="px-4 py-3">${log.action}</td>
                <td class="px-4 py-3 text-right text-gray-500 text-xs">${log.time}</td>
            </tr>
        `;
    });
    
    // Pagination Buttons
    const totalPages = Math.ceil(appLogs.length / ITEMS_PER_PAGE);
    const pageContainer = document.getElementById('pagination-controls');
    pageContainer.innerHTML = '';
    
    for(let i=1; i<=totalPages; i++) {
        pageContainer.innerHTML += `
            <button onclick="currentPage=${i}; renderLogs()" 
            class="px-3 py-1 rounded ${i===currentPage ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}">
            ${i}</button>
        `;
    }
}

function clearLogs() {
    appLogs = [];
    localStorage.removeItem('tailwind_app_logs');
    renderLogs();
}

// Init
document.addEventListener('DOMContentLoaded', () => navTo('home'));