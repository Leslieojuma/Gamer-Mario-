async function fetchMarioAmiibos() {
  const res = await fetch('https://www.amiiboapi.com/api/amiibo/?name=mario');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).amiibo;
}

let attempts = 0;
let highScore = 0;
const maxAttempts = 5;

function renderAmiibos(amiibos) {
  const cnt = document.getElementById('mario-list');
  cnt.innerHTML = '';
  // Show only as many cards as maxAttempts
  amiibos.slice(0, maxAttempts).forEach(a => {
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
    cnt.appendChild(div);

    const btn = div.querySelector('.earn');
    const scoreEl = div.querySelector('.score span');
    btn.addEventListener('click', () => handleScore(scoreEl, btn));
  });
}

function handleScore(scoreEl, btn) {
  if (attempts >= maxAttempts) {
    alert('🎮 Game Over!');
    return;
  }

  // Assign a random score
  const earnedScore = Math.floor(Math.random() * 101); /* 0–100 :contentReference[oaicite:1]{index=1} */
  scoreEl.textContent = earnedScore;
  btn.disabled = true; // prevent re-click :contentReference[oaicite:2]{index=2}

  attempts++;

  const total = Array.from(document.querySelectorAll('.score span'))
    .reduce((sum, el) => sum + parseInt(el.textContent), 0);
  highScore = Math.max(highScore, total);

  document.getElementById('status').textContent =
    `Attempts ${attempts}/${maxAttempts} — High Score: ${highScore}`;

  if (attempts === maxAttempts) {
    alert(`✅ Final Best Score: ${highScore}`);
    resetGame();
  }
}
// Reset the game state when the score is reset
function resetGame() {
  attempts = 0;
  highScore = 0;
  document.getElementById('status').textContent = 'Game reset — Play again!';
  document.querySelectorAll('.score span').forEach(el => el.textContent = '0');
  document.querySelectorAll('.earn').forEach(b => b.disabled = false);
}

async function startGame() {
  const a = await fetchMarioAmiibos();
  renderAmiibos(a);
  document.getElementById('status').textContent =
    `Attempts 0/${maxAttempts} — High Score: 0`;
}

startGame();
