# Rutenett Mønster Verktøy

En interaktiv web-applikasjon for å lage mønstre på et rutenett. Perfekt for å designe pixel art, mønstre, eller bare for å eksperimentere med geometriske former.

## Funksjoner

### 🎯 Grunnleggende funksjonalitet

- **Interaktivt rutenett**: Klikk på rutene for å aktivere/deaktivere dem
- **Dra-funksjonalitet**: Hold museknappen nede og dra for å tegne kontinuerlige linjer
- **Responsive design**: Fungerer på både desktop og mobile enheter

### 📐 Rutenett størrelser

- 10x10 ruter (100 celler)
- 20x20 ruter (400 celler)
- 30x30 ruter (900 celler)
- 40x40 ruter (1600 celler)
- 50x50 ruter (2500 celler)

### 🔍 Zoom funksjonalitet

- Zoom fra 50% til 300%
- Dinamisk tilpasning av cellestørrelse
- Glatt animasjoner ved zoom-endringer

### ↩️ Angre/Gjør om

- Angre de siste 50 handlingene
- Gjør om angrede handlinger
- Bevarer både rutenett-størrelse og mønstre i historikken

### 💾 Lagre og laste mønstre

- **Lagre**: Eksporter mønsteret som JSON-fil
- **Laste**: Importer tidligere lagrede mønstre
- Automatisk filnavn med tidsstempel

### ⌨️ Hurtigtaster

- `Ctrl/Cmd + Z`: Angre
- `Ctrl/Cmd + Shift + Z` eller `Ctrl/Cmd + Y`: Gjør om
- `Ctrl/Cmd + S`: Lagre mønster
- `Delete` eller `Backspace`: Tøm rutenett

## Bruk

1. **Åpne `index.html`** i en nettleser
2. **Velg rutenett-størrelse** fra dropdown-menyen
3. **Klikk på rutene** for å lage mønstre
4. **Bruk zoom-slideren** for å tilpasse visningen
5. **Lagre mønsteret** når du er fornøyd

## Teknisk informasjon

### Filstruktur

```text
grid/
├── index.html      # Hovedside med HTML-struktur
├── styles.css      # CSS-styling og animasjoner
├── script.js       # JavaScript-funksjonalitet
└── README.md       # Denne filen
```

### Teknologier

- **HTML5**: Semantisk markup og moderne strukturer
- **CSS3**: Flexbox, Grid, gradients og animasjoner
- **Vanilla JavaScript**: ES6+ klasser og moderne JavaScript
- **JSON**: For lagring og lasting av mønstre

### Kompatibilitet

- Chrome, Firefox, Safari, Edge (moderne versjoner)
- Desktop og mobile enheter
- Touch-støtte for tablets og telefoner

## Utvikling

For å utvide applikasjonen kan du:

1. **Legge til nye rutenett-størrelser**: Rediger `<select id="gridSize">` i HTML
2. **Endre farger**: Tilpass CSS-variablene i `styles.css`
3. **Nye funksjoner**: Utvid `GridPatternTool`-klassen i `script.js`

### Eksempel på nye funksjoner du kan legge til

- Forhåndsdefinerte mønstre
- Fargevalg for aktive ruter
- Eksport til PNG/SVG
- Animerte mønstre
- Symmetriske tegnemodi

## 🚀 Live Demo

Du kan teste applikasjonen live på: [GitHub Pages](https://username.github.io/grid)

*(Erstatt `username` med ditt GitHub-brukernavn)*

## 📦 Deployment til GitHub Pages

### Automatisk deployment (anbefalt)

1. **Fork eller klon dette repositoriet**
2. **Gå til repository settings på GitHub**
3. **Scroll ned til "Pages" seksjonen**
4. **Under "Source", velg "Deploy from a branch"**
5. **Velg "main" branch og "/ (root)" folder**
6. **Klikk "Save"**
7. **Siden vil være tilgjengelig på `https://[ditt-brukernavn].github.io/[repository-navn]`**

### Manuell deployment

```bash
# Klon repositoriet
git clone https://github.com/[ditt-brukernavn]/grid.git
cd grid

# Legg til alle filer
git add .
git commit -m "Initial commit"
git push origin main

# Aktiver GitHub Pages i repository settings
```
