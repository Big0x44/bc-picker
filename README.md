# BuSeiHerrWahlWerk

A web application for randomly selecting a person from a group using a wheel of fortune, powered by the Random.org API. The API key is securely protected using Cloudflare Workers.

## Features

- **Five Participants**: D, F, J, M, O
- **Toggle Activation**: Click buttons to activate/deactivate participants
- **Visual Wheel**: Beautiful animated wheel showing only active participants
- **Random Selection**: Uses Random.org API for true randomness
- **Winner Animation**: Exciting confetti and animation effects when displaying the winner
- **Secure API Key**: API key is protected server-side using Cloudflare Workers

## Setup Instructions

### 1. Get a Random.org API Key

1. Visit [Random.org Client Area](https://www.random.org/clients/)
2. Sign up for a free account (Developer Plan)
3. Create a new API key
4. Copy your API key (you'll need it for step 3)

### 2. Set Up Cloudflare Workers

1. **Create a Cloudflare account** (if you don't have one)
   - Go to [Cloudflare](https://dash.cloudflare.com/sign-up)
   - Sign up for a free account

2. **Install Wrangler CLI** (Cloudflare's command-line tool)
   ```bash
   npm install -g wrangler
   # or
   npm install wrangler --save-dev
   ```

3. **Login to Cloudflare**
   ```bash
   wrangler login
   ```
   This will open your browser to authenticate.

4. **Deploy the Cloudflare Worker**
   ```bash
   wrangler deploy
   ```
   This will deploy the worker from `worker.js` to Cloudflare.

5. **Set the API Key as a Secret**
   ```bash
   wrangler secret put RANDOM_ORG_API_KEY
   ```
   When prompted, paste your Random.org API key. This stores it securely in Cloudflare (not in your code).

6. **Get your Worker URL**
   After deployment, Wrangler will show you the worker URL, or you can find it in the Cloudflare dashboard.
   The URL will look like: `https://buseiherr-wahlwerk-proxy.YOUR_SUBDOMAIN.workers.dev`

### 3. Configure the Frontend

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Open `config.js` and replace `YOUR_SUBDOMAIN` with your actual Cloudflare Workers subdomain:
   ```javascript
   const CLOUDFLARE_WORKER_URL = 'https://buseiherr-wahlwerk-proxy.your-subdomain.workers.dev';
   ```

**Note**: The `config.js` file is in `.gitignore` to keep your worker URL private (optional, but recommended).

### 4. Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select your branch (usually `main` or `master`)
4. Select the root folder
5. Click Save

Your app will be available at `https://yourusername.github.io/repository-name/`

## Local Development

### Frontend Development

1. Make sure you've configured `config.js` with your Cloudflare Worker URL (see step 3 above)
2. Start a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` in your browser

### Testing Cloudflare Worker Locally

You can test the Cloudflare Worker locally before deploying:

```bash
# Start local development server
wrangler dev

# The worker will be available at http://localhost:8787
# Update config.js temporarily to use http://localhost:8787 for local testing
```

**Note**: For local testing, you'll need to set the secret locally:
```bash
# Create a .dev.vars file (this is gitignored)
echo 'RANDOM_ORG_API_KEY=your-api-key-here' > .dev.vars
```

## Usage

1. Click on person buttons (D, F, J, M, O) to activate them
   - Active buttons will be highlighted in purple
   - Click again to deactivate
2. The wheel will update to show only active participants
3. Click "Spin the Wheel!" to randomly select a winner
4. The winner will be displayed with confetti animation

## Security

### API Key Protection

✅ **The Random.org API key is now fully protected!**

- The API key is stored securely in **Cloudflare Workers Secrets** (server-side)
- The API key is **never** exposed to the client-side code
- The frontend only calls your Cloudflare Worker endpoint (which doesn't contain the key)
- The worker acts as a secure proxy between your frontend and Random.org

### Architecture

```
Frontend (GitHub Pages) 
    ↓ (no API key)
Cloudflare Worker (has API key in secrets)
    ↓ (API key used here)
Random.org API
```

### Additional Security Recommendations

1. **Rate Limiting**: Consider adding rate limiting to your Cloudflare Worker to prevent abuse
2. **CORS Configuration**: The worker allows all origins by default (`*`). For production, you may want to restrict this to your GitHub Pages domain
3. **Monitor Usage**: Check your Cloudflare Workers dashboard regularly for unusual activity
4. **Random.org Limits**: Set up usage limits on your Random.org API key as an additional safeguard

### Updating the Worker

If you need to update the worker code:

```bash
# Make changes to worker.js
# Then redeploy
wrangler deploy
```

If you need to update the API key:

```bash
wrangler secret put RANDOM_ORG_API_KEY
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- Canvas API
- Fetch API

## License

This project is open source and available for personal use.
