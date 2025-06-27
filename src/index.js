const statusEl = document.getElementById('status');
const listEl = document.getElementById('mario-list');
const refreshBtn = document.getElementById('refresh-btn');

const maxAttempts = 5;
let attempts = 0;
let highScore = 0;

document.addEventListener('DOMContentLoaded', () => {
  refreshBtn.addEventListener('click', startGame);
  startGame();
});

async function startGame() {
  resetGame(); // Clear previous state
  statusEl.classList.remove('error');
  statusEl.textContent = 'Loading Mario amiibos…';

  try {
    const amiibos = await fetchMarioAmiibos();
    renderAmiibos(amiibos.slice(0, maxAttempts));
    statusEl.textContent = `Attempts 0/${maxAttempts} — High Score: 0`;
  } catch (e) {
    statusEl.textContent = `Error: ${e.message}`;
    statusEl.classList.add('error');
  }
}

async function fetchMarioAmiibos() {
  const res = await fetch('https://www.amiiboapi.com/api/amiibo/?name=mario');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.amiibo;
}

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
      <p><strong>Release (NA):</strong> ${a.release.na || '--'}</p>
      <p class="score">Score: <span>0</span></p>
      <button class="earn">Earn Score</button>
    `;
    const btn = div.querySelector('.earn');
    const scoreSpan = div.querySelector('.score span');
    btn.addEventListener('click', () => handleScore(scoreSpan, btn));
    listEl.appendChild(div);
  });
}

function handleScore(scoreEl, btn) {
  if (attempts >= maxAttempts) return alert('🎮 Game Over!');

  const earned = Math.floor(Math.random() * 101);
  scoreEl.textContent = earned;
  btn.disabled = true;

  attempts++;
  const total = [...document.querySelectorAll('.score span')]
    .reduce((sum, el) => sum + +el.textContent, 0);
  highScore = Math.max(highScore, total);

  statusEl.textContent = `Attempts ${attempts}/${maxAttempts} — High Score: ${highScore}`;

  if (attempts === maxAttempts) {
    alert(`✅ Final Best Score: ${highScore}`);
    resetGameDisplay();
  }
}

function resetGameDisplay() {
  attempts = 0;
  highScore = 0;
  statusEl.textContent = 'Game reset — Play again!';
  document.querySelectorAll('.score span').forEach(el => el.textContent = '0');
  document.querySelectorAll('.earn').forEach(b => b.disabled = false);
}

