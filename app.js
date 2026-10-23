/*
 * Lee Accounts — app.js
 *
 * Classic script (no `type="module"`): the page is opened over file://, where
 * module scripts are blocked by CORS. Loads after data.js, so KIDS,
 * GIFT_AMOUNT, ANNUAL_RETURN, GROWTH_AGES, and CONTRIBUTION_LEVELS are
 * already global.
 *
 * No network calls, no storage, no analytics. Every DOM lookup tolerates a
 * missing element so one typo in the HTML never blanks the whole page.
 */
(function () {
  'use strict';

  /**
   * Projects the account balance at `targetAge`, given an annual contribution
   * made at the end of each year through age 18 (growth continues to
   * targetAge even if contributions stop at 18).
   */
  function projectBalance(targetAge, annualContribution) {
    let value = GIFT_AMOUNT;
    for (let year = 1; year <= targetAge; year++) {
      value *= 1 + ANNUAL_RETURN;
      if (year <= Math.min(targetAge, 18)) value += annualContribution;
    }
    return value;
  }

  const wholeDollars = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const centsDollars = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  // ---------------------------------------------------------------------
  // Growth tabs
  // ---------------------------------------------------------------------
  function setupGrowthTabs() {
    const tabs = Array.from(document.querySelectorAll('.growth__tab'));
    const amounts = Array.from(document.querySelectorAll('.growth-card__amount'));
    if (!tabs.length || !Array.isArray(GROWTH_AGES) || !GROWTH_AGES.length) return;

    function activate(ageIndex) {
      const age = GROWTH_AGES[ageIndex];
      if (age === undefined) return;

      tabs.forEach((tab) => {
        const tabIndex = Number(tab.dataset.ageIndex);
        tab.setAttribute('aria-selected', tabIndex === ageIndex ? 'true' : 'false');
      });

      amounts.forEach((amountEl) => {
        const contributionIndex = Number(amountEl.dataset.contributionIndex);
        const contribution = CONTRIBUTION_LEVELS[contributionIndex];
        if (contribution === undefined) return;
        amountEl.textContent = wholeDollars.format(projectBalance(age, contribution));
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const index = Number(tab.dataset.ageIndex);
        if (!Number.isNaN(index)) activate(index);
      });

      tab.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;
        event.preventDefault();

        const currentIndex = tabs.indexOf(tab);
        let nextIndex = currentIndex;
        if (key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else if (key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        else if (key === 'Home') nextIndex = 0;
        else if (key === 'End') nextIndex = tabs.length - 1;

        const nextTab = tabs[nextIndex];
        nextTab.focus();
        const ageIndex = Number(nextTab.dataset.ageIndex);
        if (!Number.isNaN(ageIndex)) activate(ageIndex);
      });
    });

    activate(0);
  }

  // ---------------------------------------------------------------------
  // Phone mockups
  //
  // One child per screen, in KIDS order, so all three appear across the page.
  // The balance gain is a fixed figure rather than a random one, so the number
  // stays put across reloads instead of looking invented.
  // ---------------------------------------------------------------------
  const BALANCE_GAIN = 0.018;

  function setKidName(elementId, kidIndex) {
    const kid = Array.isArray(KIDS) ? KIDS[kidIndex] : null;
    if (kid) setText(elementId, kid.name);
  }

  function setupPhoneScreens() {
    setKidName('deposit-name', 2);
    setKidName('balance-name', 0);
    setKidName('projection-name', 1);

    setText('balance-amount', centsDollars.format(GIFT_AMOUNT * (1 + BALANCE_GAIN)));
    setText('balance-delta', `up ${(BALANCE_GAIN * 100).toFixed(1)}% all time`);
    setText('projection-amount', wholeDollars.format(projectBalance(18, 0)));
  }

  // ---------------------------------------------------------------------
  // Claim modal
  // ---------------------------------------------------------------------
  function setupClaimModal() {
    const dialog = $('claim-modal');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    document.querySelectorAll('[data-open-claim]').forEach((trigger) => {
      trigger.addEventListener('click', () => dialog.showModal());
    });

    dialog.querySelectorAll('.modal__close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => dialog.close());
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupGrowthTabs();
    setupPhoneScreens();
    setupClaimModal();
  });
})();
