const cryptoContainer = document.getElementById('crypto-container');
const comparisonContainer = document.getElementById('comparison-container');
const sortOptions = document.getElementById('sort-options');
const themeSwitch = document.getElementById('theme-switch');

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
let cryptoData = [];  // Stores fetched data
let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];

// Load preferences and initial data
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(localStorage.getItem('theme') || 'light');
  fetchData();
});

// Fetch data from CoinGecko API
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    cryptoData = await response.json();
    displayCryptos();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Display cryptocurrencies based on sorting
function displayCryptos() {
  cryptoContainer.innerHTML = '';
  const sortedData = sortData(cryptoData);
  
  sortedData.forEach(crypto => {
    const card = document.createElement('div');
    card.className = 'crypto-card';
    card.innerHTML = `
      <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
      <p>Price: $${crypto.current_price}</p>
      <button onclick="addToComparison('${crypto.id}', '${crypto.name}', ${crypto.current_price})">Compare</button>
    `;
    cryptoContainer.appendChild(card);
  });
}

// Sort data based on selected preference
function sortData(data) {
  const sortBy = sortOptions.value;
  return data.sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.current_price - a.current_price;
      case '24h_change':
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      default:
        return b.market_cap - a.market_cap;
    }
  });
}

// Handle theme change
themeSwitch.addEventListener('change', () => {
  const selectedTheme = themeSwitch.value;
  localStorage.setItem('theme', selectedTheme);
  applyTheme(selectedTheme);
});

function applyTheme(theme) {
  document.body.className = theme;
}

// Add cryptocurrency to comparison section
function addToComparison(id, name, price) {
  if (comparisonList.length >= 5) {
    alert('You can only compare up to 5 cryptocurrencies.');
    return;
  }
  
  if (!comparisonList.some(crypto => crypto.id === id)) {
    comparisonList.push({ id, name, price });
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
    updateComparison();
  }
}

// Update the comparison section
function updateComparison() {
  comparisonContainer.innerHTML = '';
  comparisonList.forEach(crypto => {
    const card = document.createElement('div');
    card.className = 'crypto-card';
    card.innerHTML = `
      <h3>${crypto.name}</h3>
      <p>Price: $${crypto.price}</p>
      <button onclick="removeFromComparison('${crypto.id}')">Remove</button>
    `;
    comparisonContainer.appendChild(card);
  });
}

// Remove cryptocurrency from comparison
function removeFromComparison(id) {
  comparisonList = comparisonList.filter(crypto => crypto.id !== id);
  localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
  updateComparison();
}

// Event listeners for sorting
sortOptions.addEventListener('change', displayCryptos);

// Initial load of comparison section
updateComparison();
