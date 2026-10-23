/*
 * The only file you need to edit.
 *
 * Replace the three placeholder names below with the real ones. Everything on the
 * page — the account switcher, the balance card, the FAQ, the hero — reads from here.
 */

const KIDS = [
  { name: "Tilden" },
  { name: "Rose" },
  { name: "Desmond" },
];

/* The one-time contribution, per child, in dollars. */
const GIFT_AMOUNT = 1000;

/*
 * Nominal annual return used for every projection on the page.
 * 8% is roughly the long-run nominal S&P 500 average. It is an assumption, not a
 * promise, and the page says so out loud next to the numbers.
 */
const ANNUAL_RETURN = 0.08;

/*
 * The growth section is a grid: the tabs pick the age, and the three cards show what
 * the balance looks like at that age for each yearly contribution level.
 */
const GROWTH_AGES = [18, 27, 55];
const CONTRIBUTION_LEVELS = [0, 250, 5000];
