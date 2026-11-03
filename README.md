# Soyggota

Private tours in Armenia and Georgia. English, Armenian and Russian website.

Website: https://daklodli.github.io/soyggota/

## Files

- `index.html`, `style.css`: page layout and design
- `content.js`: translated page copy
- `app.js`: routes, filters, dialogs and enquiry interface
- `core.js`: date validation and enquiry message formatting
- `selects.js`: keyboard-accessible language and route menus
- `assets/`: photographs, supplied logo and self-hosted fonts
- `tests/`: automated regression checks
- `.nojekyll`: serve the static files directly on GitHub Pages

## Run locally

With Python 3 installed, run `python3 -m http.server 4173` from this folder and open http://localhost:4173/ .

With Node.js 20 or newer, run `npm test` or `npm run check`. No package installation is needed.

After changing translations, run `node tools/finish.mjs` to refresh the English HTML fallback. The website itself has no build step. GitHub Pages publishes the root of `main` when changes are committed.

## Enquiries

The form validates trip details and prepares a message that visitors copy and send through the supplied Instagram or Facebook links. It does not send an enquiry or reserve a tour automatically. No visitor form data is sent to GitHub or stored on a server. Only the selected language is saved locally in the browser. The Instagram shortcut copies the request and opens the chat link; visitors still paste the text and tap Send in Instagram.

Actual prices, availability, contact numbers, guest reviews and booking terms need to be supplied by the business. They are not invented by the website.

## Rights

The supplied logo and business content belong to their respective owner. Photo credits and Creative Commons links are included in the site footer. Font license notices are in `assets/fonts/`. No blanket license is granted for business branding or content.
