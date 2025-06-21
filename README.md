# Rutenett Mønster Verktøy

En interaktiv web-applikasjon for å lage mønstre på et rutenett. Perfekt for å designe pixel art, mønstre, eller bare for å eksperimentere med geometriske former. Denne applikasjonen er 100% certified vibecoded.

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

### TODO

- Forhåndsdefinerte mønstre
- Fargevalg for aktive ruter
- Eksport til PNG/SVG
- Animerte mønstre
- Symmetriske tegnemodi

## 🚀 Live Demo

Du kan teste applikasjonen live på: [GitHub Pages](https://jonasnico.github.io/grid/)
