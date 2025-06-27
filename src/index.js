// calling the fetch API to get Mario amiibo data
// and display it in a simple game format
const statusEl = document.getElementById('status');
const listEl   = document.getElementById('mario-list');
const refreshBtn = document.getElementById('refresh-btn');

const maxAttempts = 5;
let attempts = 0;
let highScore = 0;

// The DOM elements exist before running code
document.addEventListener('DOMContentLoaded', () => {
  
  startGame();
  

});
//Event listener (Refresh button)
async function startGame() {
  resetGameDisplay(); // Clear UI state
  statusEl.classList.remove('error');
  statusEl.textContent = 'Loading Mario amiibos…';
    refreshBtn.addEventListener('click', () => { startGame(); });

  try {
    const amiibos = await fetchMarioAmiibos();
    renderAmiibos(amiibos.slice(0, maxAttempts)); // Limit to max attempts
    statusEl.textContent = `Attempts 0/${maxAttempts} — High Score: 0`;
  } catch (e) {
    statusEl.textContent = `Error: ${e.message}`;
    statusEl.classList.add('error');
  }
}
// Event listener (Add form)
async function fetchMarioAmiibos() {
  const res = await fetch('https://www.amiiboapi.com/api/amiibo/?name=mario');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.amiibo;
}
// Function to handle form submission and add new amiibo
function renderAmiibos(amiibos) {
  listEl.innerHTML = '';
  amiibos.forEach(a => {
    const div = document.createElement('div');
    div.className = 'amiibo';
    div.innerHTML = `
      <img src="${a.image}" alt="${a.name}">
      <h3>${a.name}</h3>
      <p><strong>Series:</strong> ${a.amiiboSeries}</p>
      <p><strong>Type:</strong> ${a.type}</p>
      <p><strong>Release (NA):</strong> ${a.release.na ?? '--'}</p>
      <p class="score">Score: <span>0</span></p>
      <button class="earn">Earn Score</button>
    `;
    // Add event listener to the "Earn Score" button
    const btn = div.querySelector('.earn');
    const scoreSpan = div.querySelector('.score span');
    btn.addEventListener('click', () => handleScore(scoreSpan, btn));
    // Add event listener to the "Load Mario" button
   
    listEl.appendChild(div);
  });
}
// This function handles the score earning logic
// It updates the score, disables the button, and tracks attempts
// It also calculates the high score and resets the game when max attempts are reached
function handleScore(scoreEl, btn) {
  if (attempts >= maxAttempts) {
    alert('🎮 Game Over!');
    return;
  }

  const earned = Math.floor(Math.random() * 101);
  scoreEl.textContent = earned;
  btn.disabled = true;

  attempts++;
  const total = Array.from(document.querySelectorAll('.score span'))
    .reduce((sum, el) => sum + +el.textContent, 0);
  highScore = Math.max(highScore, total);

  statusEl.textContent = `Attempts ${attempts}/${maxAttempts} — High Score: ${highScore}`;

  if (attempts === maxAttempts) {
    alert(`✅ Final Best Score: ${highScore}`);
    resetGameDisplay();
  }
}
// Function to reset the game display
function resetGameDisplay() {
  attempts = 0;
  highScore = 0;
  statusEl.textContent = 'Game reset — Play again!';
  document.querySelectorAll('.score span').forEach(el => el.textContent = '0');
  document.querySelectorAll('.earn').forEach(b => b.disabled = false);
}
