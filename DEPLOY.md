# Vera Heritage — Cloudflare Pages Deployment

## Project Structure
```
Vera Heritage Website/
├── index.html          ← Main landing page
├── portal.html         ← B2B Buyer Portal (login: buyer@veraheritage.com / VeraDemo2026)
├── farmers.html        ← Farmer Network Tracker
├── supply-chain.html   ← Supply Chain Tracker + Lot Number Tool
├── css/main.css        ← Complete design system
├── js/app.js           ← Animations, counters, scroll effects, chatbot core
├── js/chatbot.js       ← AI chatbot engine (upgrade to Claude API here)
├── js/dashboard.js     ← Portal dashboard JS
├── assets/logo.svg     ← Vera Heritage logo
├── _headers            ← Cloudflare security & cache headers
└── _redirects          ← Friendly URL redirects
```

## Deploy to Cloudflare Pages

### Option 1: Git + Cloudflare (Recommended)
1. Create a GitHub/GitLab repo and push this folder
2. Go to https://dash.cloudflare.com → Pages → Create a project
3. Connect your Git repo
4. Build settings:
   - Framework preset: None
   - Build command: (leave blank)
   - Build output directory: / (root)
5. Click Save & Deploy

### Option 2: Direct Upload (Fastest)
1. Go to https://dash.cloudflare.com → Pages → Create a project
2. Choose "Upload assets"
3. Drag the entire website folder
4. Deploy

### Option 3: Wrangler CLI
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy . --project-name vera-heritage
```

## Custom Domain
1. After deploy, go to your Pages project → Custom domains
2. Add: veraheritage.ph (or your domain)
3. Update DNS nameservers to Cloudflare

## Upgrading the AI Chatbot to Real AI

Replace `getBotReply()` in `js/chatbot.js` with a real API call:

### Using Claude API (via Cloudflare Worker):

**1. Create a Cloudflare Worker** (`/api/chat`):
```javascript
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    const { message } = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: `You are Vera AI, the assistant for Vera Heritage — a premium Philippine ube (purple yam) exporter. 
        You help international buyers with: product info (ube powder, puree, halaya, extract), 
        certifications (COA, HACCP, FDA), ordering process, pricing, lead times, and supply chain traceability.
        Vera Heritage sources from certified Filipino farmers in Bohol (Kinampay heritage), Batangas, Benguet, Quezon, Leyte.
        Keep responses concise, helpful, and professional. Use "Purple is the New Gold" as a tagline where appropriate.`,
        messages: [{ role: 'user', content: message }],
      }),
    });
    
    const data = await response.json();
    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};
```

**2. Set secret:** `wrangler secret put ANTHROPIC_API_KEY`

**3. Update `js/chatbot.js`** `getBotReply()`:
```javascript
async function getBotReply(userMsg) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMsg }),
  });
  const data = await res.json();
  return data.reply;
}
```

## Demo Credentials (Change Before Production)
- Portal login: buyer@veraheritage.com / VeraDemo2026
- Change in portal.html line ~250 (handleLogin function)

## Next Steps
- [ ] Replace placeholder emoji visuals with real farm photos
- [ ] Connect contact form to Formspree or Cloudflare Worker (email)
- [ ] Add Google Analytics / Cloudflare Web Analytics
- [ ] Connect real AI API (see above)
- [ ] Add real inventory data via Cloudflare D1 database
- [ ] Set up Cloudflare Access for portal authentication
- [ ] Add Cloudflare Turnstile CAPTCHA on contact form
