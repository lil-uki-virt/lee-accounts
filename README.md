# Lee Accounts

A parody of trumpaccounts.gov announcing a real $1,000 gift from Kevin Lee to his two nieces and his nephew.

## Change the kids' names here

Edit the `KIDS` array at the top of `data.js`. The names currently there (`Niece One`, `Niece Two`, `Nephew`) are placeholders — everything on the page (hero, balance card, switcher, FAQ) reads from that file, so this is the only edit you need for a new kid or a name change.

## View it

Open `index.html` directly in a browser. No server, no build step, no dependencies — it runs straight off disk over `file://`.

If you'd rather serve it (some browsers are fussier than others about `file://`):

```bash
python3 -m http.server 4173 --directory lee-accounts
```

then visit http://localhost:4173.

## Account type

The FAQ says the gift lands either in a 529 education savings plan in the child's name, or as a direct transfer to their parents — whichever suits each family. If you settle on one for everyone, three answers in the "For Parents" section currently describe both paths and could be tightened: "How do I claim my child's Lee Account?", "What will the money be invested in?", and "When can funds be used?"

## Deploy

Same approach as fated-list: a GitHub Actions workflow publishes to GitHub Pages on
every push to `main`. The workflow lives in `.github/workflows/deploy.yml`. There is no
build step — the repo root is uploaded as-is.

From this folder:

```bash
bash deploy.sh
```

The first run creates `lil-uki-virt/lee-accounts`, pushes, and points Pages at Actions.
Re-run it any time to publish changes. It needs `gh` installed and authenticated as an
account with write access to `lil-uki-virt`.

The site ends up at https://lil-uki-virt.github.io/lee-accounts/

The owner determines the hostname — `https://<owner>.github.io/<repo>/` — so to publish
under a different account, either edit `OWNER` in `deploy.sh` or run:

```bash
GH_OWNER=some-other-account bash deploy.sh
```

**Note:** the repo has to be public, because GitHub Pages on a private repo requires a
paid plan. That means the kids' first names are on a public URL — unlisted and
unlinked, but public. Netlify's free tier can serve a private repo if you'd rather:
drag this folder onto https://app.netlify.com/drop.

## Data and privacy

The site collects nothing and makes no network requests — no forms, no `fetch`, no analytics, no cookies, no `localStorage`. There is nothing to configure or secure.
