let tg = window.Telegram.WebApp;
tg.ready()
document.addEventListener('DOMContentLoaded', (event) => {
  let coins = 0;
  let coinsPerClick = 1000;
  let currentRankIndex = 0;
  const coinDisplay = document.getElementById('coins');
  const clickBtn = document.getElementById('clickBtn');
  const rankDisplay = document.getElementById('rank');
  const progressBar = document.getElementById('level-to-up');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const restartBtn = document.getElementById('restartBtn');
  const coinsPerTapDisplay = document.getElementById('coins-for-tap')
  const coinsToUpDisplay = document.getElementById('coins-to-up')
  const userName = document.getElementById('user-name')
  tg.expand()

  const ranks = [
    { name: 'Bronze', points: 0 },
    { name: 'Silver', points: 5000 },
    { name: 'Gold', points: 25000 },
    { name: 'Diamond', points: 100000 },
    { name: 'Platinum', points: 1000000 },
    { name: 'Legend', points: 10000000 }
  ];

  function updateRank() {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (coins >= ranks[i].points && currentRankIndex < i) {
        currentRankIndex = i;
        rankDisplay.textContent = `League: ${ranks[i].name}`;
        break;
      }
    }
  }

  function updateProgressBar() {
    let currentRankPoints = ranks[currentRankIndex].points;
    let nextRankPoints = (currentRankIndex < ranks.length - 1) ? ranks[currentRankIndex + 1].points : currentRankPoints;

    if (currentRankIndex === ranks.length - 1) {
      progressBar.style.width = '100%';
    } else {
      const progress = (coins / nextRankPoints) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  function coinsPerTapDisplayUpdate() {
    coinsPerTapDisplay.textContent = `+${coinsPerClick}`;
  }

  function coinsToUpUpdate() {
    if (currentRankIndex === 0) {
      coinsToUpDisplay.textContent = '5K';
      progressBar.style.background = "#b57a23"
    } else if (currentRankIndex === 1) {
      coinsToUpDisplay.textContent = '25K';
      progressBar.style.background = "#bef4f1"
    } else if (currentRankIndex === 2) {
      coinsToUpDisplay.textContent = '100K';
      progressBar.style.background = "#FFDF32"
    } else if (currentRankIndex === 3) {
      coinsToUpDisplay.textContent = '1M';
      progressBar.style.background = "#32CCFF"
    } else if (currentRankIndex === 4) {
      coinsToUpDisplay.textContent = '10M';
      progressBar.style.background = "#bee4f4"
    } else if (currentRankIndex === 5) {
      coinsToUpDisplay.textContent = 'MAX';
      progressBar.style.background = "#FFCC66"
    }
  }

  function applyUpgrade(cost, increase) {
    if (coins >= cost) {
      coins -= cost;
      coinsPerClick += increase;
      coinDisplay.textContent = coins;
      updateProgressBar();
      coinsPerTapDisplayUpdate()
    }
  }

  clickBtn.addEventListener('click', () => {
    coins += coinsPerClick;
    coinDisplay.textContent = coins;
    updateRank();
    updateProgressBar();
    coinsToUpUpdate();
  });

  restartBtn.addEventListener('click', () => {
    if (coins > 0) {
      coins -= 1000;
      coinDisplay.textContent = coins;
      updateRank();
      updateProgressBar();
    }

  });

  upgradeBtn.addEventListener('click', () => {
    applyUpgrade(10, 1);
  });

  rankDisplay.textContent = `League: ${ranks[currentRankIndex].name}`
  updateProgressBar();
  coinsPerTapDisplayUpdate();
  coinsToUpUpdate();


  const toggleThemeBtn = document.createElement('button');
  toggleThemeBtn.textContent = 'Toggle Theme';
  toggleThemeBtn.style.marginTop = '20px';
  document.body.appendChild(toggleThemeBtn);

  toggleThemeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
  })
});
