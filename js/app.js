document.addEventListener('DOMContentLoaded', (event) => {
  let coins = parseInt(localStorage.getItem('coins'));
  if (isNaN(coins)) {
    coins = 0;
  }
  let coinsPerClick = 1000;
  let currentRankIndex = 0;
  const coinDisplay = document.getElementById('coins');
  const homeBtn = document.getElementById('home-btn');
  const mineBtn = document.getElementById('mine-btn');
  const settingsBtn = document.getElementById('settings-btn');


  const ranks = [
    { name: 'Bronze', points: 0 },
    { name: 'Silver', points: 5000 },
    { name: 'Gold', points: 25000 },
    { name: 'Diamond', points: 100000 },
    { name: 'Platinum', points: 1000000 },
    { name: 'Legend', points: 10000000 }
  ];

  function saveData() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('currentRankIndex', currentRankIndex);
    localStorage.setItem('coinsPerClick', coinsPerClick);
  }
  function loadData() {
    coins = parseInt(localStorage.getItem('coins') || 0);
    if (isNaN(coins)) {
      coins = 0;
    }
    currentRankIndex = parseInt(localStorage.getItem('currentRankIndex') || 0);
    coinsPerClick = parseInt(localStorage.getItem('coinsPerClick') || 1000);
  }

  function updateRank() {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (coins >= ranks[i].points && currentRankIndex < i) {
        currentRankIndex = i;
        document.getElementById('rank').textContent = `League: ${ranks[i].name}`;
        break;
      }
    }
  }

  function updateProgressBar() {
    let currentRankPoints = ranks[currentRankIndex].points;
    let nextRankPoints = (currentRankIndex < ranks.length - 1) ? ranks[currentRankIndex + 1].points : currentRankPoints;

    const progressBar = document.getElementById('level-to-up');
    if (currentRankIndex === ranks.length - 1) {
      progressBar.style.width = '100%';
    } else {
      const progress = (coins / nextRankPoints) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  function loadPage(page) {
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${page}-btn`).classList.add('active');

    fetch(`${page}.html`)
      .then(response => response.text())
      .then(data => {
        document.querySelector('.content').innerHTML = data;
        if (page === 'settings') {
          setupSettingsPage();
        } else if (page === 'home') {
          setupHomePage();
        } else if (page === 'mine') {
          setupMinePage();
        }
      });
  }

  function setupSettingsPage() {
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    toggleThemeBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function setupMinePage() {
    const coinsPerTapDisplay = document.getElementById('coins-for-tap');
    if (!coinsPerTapDisplay) {
      console.error('Element with id "coins-for-tap" not found');
      return;
    }
    const coinDisplay = document.getElementById('coins');
    const coinsToUpDisplay = document.getElementById('coins-to-up');
    const earnDisplay = document.getElementById('earn-at-hour');
    const restartBtn = document.getElementById('restartBtn');
    const upgradeBtn = document.getElementById('upgradeBtn');
    loadData();
    updateCoinDisplay();
    coinDisplay.addEventListener('load', () => {
      coinDisplay.textContent = coins;
    });


    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (coins > 0) {
          coins -= 1000;
          coinDisplay.textContent = coins;
          updateCoinDisplay();
        } else {
          console.log('zero balance');
        }
        saveData();
      });
    }


    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        applyUpgrade(10, 1);
      });
    }



    function coinsPerTapDisplayUpdate() {
      if (coinsPerTapDisplay) {
        coinsPerTapDisplay.textContent = `+${coinsPerClick}`;
      }
    }

    function coinsToUpUpdate() {
      if (currentRankIndex === 0) {
        coinsToUpDisplay.textContent = '5K';
      } else if (currentRankIndex === 1) {
        coinsToUpDisplay.textContent = '25K';
      } else if (currentRankIndex === 2) {
        coinsToUpDisplay.textContent = '100K';
      } else if (currentRankIndex === 3) {
        coinsToUpDisplay.textContent = '1M';
      } else if (currentRankIndex === 4) {
        coinsToUpDisplay.textContent = '10M';
      } else if (currentRankIndex === 5) {
        coinsToUpDisplay.textContent = 'MAX';
      }
    }
    coinsToUpUpdate();
    coinsPerTapDisplayUpdate();
    updateCoinDisplay();

    function applyUpgrade(cost, increase) {
      if (coins >= cost) {
        coins -= cost;
        coinsPerClick += increase;
        updateCoinDisplay();
        coinsPerTapDisplayUpdate();
        saveData();
      }
    }
  }

  function setupHomePage() {
    const clickBtn = document.getElementById('clickBtn');
    const coinDisplay = document.getElementById('coins');
    const coinsPerTapDisplay = document.getElementById('coins-for-tap');
    const coinsToUpDisplay = document.getElementById('coins-to-up');
    const progressBar = document.getElementById('level-to-up');

    if (clickBtn) {
      clickBtn.addEventListener('click', () => {
        coins += coinsPerClick;
        coinDisplay.textContent = coins;
        updateCoinDisplay();
        updateRank();
        updateProgressBar();
        coinsToUpUpdate();
        saveData();
      });

      function coinsPerTapDisplayUpdate() {
        coinsPerTapDisplay.textContent = `+${coinsPerClick}`;
      }

      function coinsToUpUpdate() {
        if (currentRankIndex === 0) {
          coinsToUpDisplay.textContent = '5K';
          progressBar.style.background = "#b57a23";
        } else if (currentRankIndex === 1) {
          coinsToUpDisplay.textContent = '25K';
          progressBar.style.background = "#bef4f1";
        } else if (currentRankIndex === 2) {
          coinsToUpDisplay.textContent = '100K';
          progressBar.style.background = "#FFDF32";
        } else if (currentRankIndex === 3) {
          coinsToUpDisplay.textContent = '1M';
          progressBar.style.background = "#32CCFF";
        } else if (currentRankIndex === 4) {
          coinsToUpDisplay.textContent = '10M';
          progressBar.style.background = "#bee4f4";
        } else if (currentRankIndex === 5) {
          coinsToUpDisplay.textContent = 'MAX';
          progressBar.style.background = "#FFCC66";
        }
      }

      document.getElementById('rank').textContent = `League: ${ranks[currentRankIndex].name}`;
      updateProgressBar();
      coinsPerTapDisplayUpdate();
      coinsToUpUpdate();
      coinDisplay.textContent = localStorage.getItem('coins') || 0;
    }
  }
  function updateCoinDisplay() {
    if (coinDisplay) {
      coinDisplay.textContent = coins;
    }
  }

  homeBtn.addEventListener('click', () => loadPage('home'));
  mineBtn.addEventListener('click', () => loadPage('mine'));
  settingsBtn.addEventListener('click', () => loadPage('settings'));

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  loadPage('home');

  setInterval(updateCoinDisplay, 1000);
});
