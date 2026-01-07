# Wheel of Fortune - Person Picker

A web application for randomly selecting a person from a group using a wheel of fortune, powered by the Random.org API.

## Features

- **Five Participants**: D, F, J, M, O
- **Toggle Activation**: Click buttons to activate/deactivate participants
- **Visual Wheel**: Beautiful animated wheel showing only active participants
- **Random Selection**: Uses Random.org API for true randomness
- **Winner Animation**: Exciting confetti and animation effects when displaying the winner

## Setup Instructions

### 1. Get a Random.org API Key

1. Visit [Random.org Client Area](https://www.random.org/clients/)
2. Sign up for a free account (Developer Plan)
3. Create a new API key
4. Copy your API key

### 2. Configure the API Key

1. Open `config.js`
2. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const RANDOM_ORG_API_KEY = 'your-actual-api-key-here';
   ```

**IMPORTANT**: The `config.js` file is already in `.gitignore` to prevent accidentally committing your API key. Never commit this file to version control!

### 3. Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select your branch (usually `main` or `master`)
4. Select the root folder
5. Click Save

Your app will be available at `https://yourusername.github.io/repository-name/`

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Usage

1. Click on person buttons (D, F, J, M, O) to activate them
   - Active buttons will be highlighted in purple
   - Click again to deactivate
2. The wheel will update to show only active participants
3. Click "Spin the Wheel!" to randomly select a winner
4. The winner will be displayed with confetti animation

## Security Note

⚠️ **IMPORTANT**: The API key is stored in `config.js` which is excluded from version control via `.gitignore`. However, since this is a **client-side application**, the API key will be visible in the browser's developer tools when the page loads.

### Current Protection:
- ✅ `config.js` is in `.gitignore` - your API key won't be committed to the repository
- ✅ Only you need to configure it locally or in your deployment

### Limitations:
- ⚠️ The API key will be visible in the browser's developer tools (this is unavoidable for client-side apps)
- ⚠️ Anyone who views the page source can see the API key

### For Enhanced Security (Optional):
If you need true API key protection, you would need to:
1. **Use a Backend Proxy**: Create a server-side endpoint that makes the Random.org API calls
2. **Use GitHub Actions**: Build the site with the API key injected, but this still exposes it client-side
3. **Use Random.org's Usage Limits**: Set up usage limits on your API key to prevent abuse
4. **Use CORS Restrictions**: Configure your Random.org API key to only accept requests from your domain

For most personal/educational use cases, the current setup (with `config.js` in `.gitignore`) is sufficient.

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- Canvas API
- Fetch API

## License

This project is open source and available for personal use.
