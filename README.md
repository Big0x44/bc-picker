# BuSeiHerrWahlWerk

Ein Tool zur Wahl des Seitenherrschers auf Basis von [Random.org](https://random.org).

## Vorbereitung

### 1. Random.org API Key erstellen

1. Auf [Random.org Client Area](https://www.random.org/clients/) gehen
2. Registrieren. (Developer Plan)
3. Neuen API key erstellen.
4. API key kopieren.

### 2. API Key konfigurieren

1. `config.js` öffnen.
2. `'YOUR_API_KEY_HERE'` durch den API key ersetzen:
   ```javascript
   const RANDOM_ORG_API_KEY = 'your-actual-api-key-here';
   ```

## Starten

`index.html` in einem beliebigen Web-Browser öffnen.

Alternativ kann auch ein lokaler Webservice gestartet werden:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Die App ist dann unter `http://localhost:8000` im Browser erreichbar.

## Sicherheit

Die App darf nicht öffentlich gehosted werden, da ansonsten der Random.org API key öffentlich zugänglich wäre!