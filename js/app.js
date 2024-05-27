document.addEventListener('DOMContentLoaded', (event) => {
  let coins = parseInt(localStorage.getItem('coins'));
  if (isNaN(coins)) {
    coins = 0;
  }
  let coinsPerClick = 1000;
  let currentRankIndex = 0;
  let autoEarningPerSecond = 0;
  const coinDisplay = document.getElementById('coins');
  const earnDisplay = document.getElementById('earn-at-hour');
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

  let upgrades = [
    { name: 'cloudListing', cost: 1000, earnings: 100, level: 0 },
    { name: 'cloudStaking', cost: 200, earnings: 12, level: 0 }
  ];

  const defaultUpgrades = [
    { name: 'cloudListing', cost: 1000, earnings: 100, level: 0 },
    { name: 'cloudStaking', cost: 200, earnings: 12, level: 0 }
  ];

  function saveData() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('currentRankIndex', currentRankIndex);
    localStorage.setItem('coinsPerClick', coinsPerClick);
    localStorage.setItem('autoEarningPerSecond', autoEarningPerSecond);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
  }
  function loadData() {
    coins = parseInt(localStorage.getItem('coins') || 0);
    if (isNaN(coins)) {
      coins = 0;
    }
    currentRankIndex = parseInt(localStorage.getItem('currentRankIndex') || 0);
    coinsPerClick = parseInt(localStorage.getItem('coinsPerClick') || 1000);
    autoEarningPerSecond = parseInt(localStorage.getItem('autoEarningPerSecond') || 0);
    const savedUpgrades = JSON.parse(localStorage.getItem('upgrades') || '[]');
    savedUpgrades.forEach((savedUpgrade, index) => {
      if (upgrades[index]) {
        upgrades[index].level = savedUpgrade.level;
        upgrades[index].cost = savedUpgrade.cost;
        upgrades[index].earnings = savedUpgrade.earnings;
      }
    });
  }

  function updateRank() {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (coins >= ranks[i].points && currentRankIndex < i) {
        currentRankIndex = i;
        document.getElementById('rank').textContent = `${ranks[i].name}`;
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

  function startAutoEarning() {
    const coinDisplay = document.getElementById('coins');
    if (!coinDisplay) {
      console.error('Element with id "coinDisplay" not found');
      return;
    }
    const earnDisplay = document.getElementById('earn-at-hour');
    if (!earnDisplay) {
      console.error('Element with id "earnDisplay" not found')
    }

    setInterval(() => {
      coins += autoEarningPerSecond;
      coinDisplay.textContent = coins;
      earnDisplay.textContent = autoEarningPerSecond;
      updateRank();
      updateProgressBar();
      saveData();
    }, 1000);
  }

  function earnAtHourDisplayUpdate() {
    const earnDisplay = document.getElementById('earn-at-hour');
    earnDisplay.textContent = autoEarningPerSecond;
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


  /* Settings page */
  function setupSettingsPage() {
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const restartBtn = document.getElementById('restartBtn');
    loadData();
    toggleThemeBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
    restartBtn.addEventListener('click', () => {
      coins = 0;
      currentRankIndex = 0;
      autoEarningPerSecond = 0;
      upgrades = defaultUpgrades;
      saveData();
      updateRank();
    })
  }


  /* Mine page */
  function setupMinePage() {
    const coinsPerTapDisplay = document.getElementById('coins-for-tap');
    if (!coinsPerTapDisplay) {
      console.error('Element with id "coins-for-tap" not found');
      return;
    }
    const coinDisplay = document.getElementById('coins');
    if (!coinDisplay) {
      console.error('Element with if "coins" not found');
      return;
    }
    const coinsToUpDisplay = document.getElementById('coins-to-up');
    loadData();
    updateCoinDisplay();
    earnAtHourDisplayUpdate();
    /*coinDisplay.addEventListener('load', () => {
      coinDisplay.textContent = coins;
    });*/

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

    upgrades.forEach((upgrade, index) => {
      const upgradeBtn = document.getElementById(`upgradeBtn${index}`);
      if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
          if (coins >= upgrade.cost) {
            coins -= upgrade.cost;
            upgrade.level++;
            autoEarningPerSecond += upgrade.earnings;
            upgrade.cost = Math.round(upgrade.cost * 1.5);
            updateUpgradeUI(index);
            coinDisplay.textContent = coins;
            saveData();
          }
        });
      }

    });

    function updateUpgradeUI(index) {
      const upgrade = upgrades[index];
      const upgradeCostDisplay = document.getElementById(`upgradeCost${index}`);
      const upgradeEarningsDisplay = document.getElementById(`upgradeEarnings${index}`);
      if (upgradeCostDisplay) {
        upgradeCostDisplay.textContent = `${upgrade.cost}`;
      }
      if (upgradeEarningsDisplay) {
        upgradeEarningsDisplay.textContent = `+${upgrade.earnings}/s (level ${upgrade.level})`;
      }
    }

    upgrades.forEach((_, index) => updateUpgradeUI(index));

    startAutoEarning();
    coinsToUpUpdate();
    coinsPerTapDisplayUpdate();
    coinDisplay.textContent = coins;
    updateCoinDisplay();
  }


  /* Home page */
  function setupHomePage() {
    const clickBtn = document.getElementById('clickBtn');
    const coinDisplay = document.getElementById('coins');
    const coinsPerTapDisplay = document.getElementById('coins-for-tap');
    const coinsToUpDisplay = document.getElementById('coins-to-up');
    const progressBar = document.getElementById('level-to-up');
    loadData();
    updateCoinDisplay();
    updateProgressBar();
    earnAtHourDisplayUpdate();


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

      document.getElementById('rank').textContent = `${ranks[currentRankIndex].name}`;
      updateProgressBar();
      coinDisplay.textContent = coins;
      updateCoinDisplay();
      coinsPerTapDisplayUpdate();
      coinsToUpUpdate();
      startAutoEarning()
    }
  }

  /* Updates */
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

  /*setInterval(updateCoinDisplay, 1000);*/
  loadData();
  startAutoEarning();
  loadPage('home');
});
