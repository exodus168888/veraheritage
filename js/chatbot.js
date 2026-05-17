/* ============================================================
   VERA HERITAGE — AI Chatbot Engine
   Hybrid rule-based + pattern matching chatbot

   TO CONNECT TO REAL AI (Claude API / OpenAI):
   Replace the getBotReply() function with an async fetch to
   your backend endpoint or directly to the AI API.

   Example Claude API integration:
   async function getBotReply(userMsg) {
     const response = await fetch('/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: userMsg, context: 'vera-heritage-ube-exporter' })
     });
     const data = await response.json();
     return data.reply;
   }
   ============================================================ */

'use strict';

/* --- Knowledge Base --- */
const KNOWLEDGE = {
  company: {
    name: 'Vera Heritage',
    tagline: 'Purple is the New Gold',
    founded: 2024,
    location: 'Philippines (exporting globally)',
    mission: 'Source and export premium Philippine ube while sharing profits equitably with Filipino farmers',
    email: 'export@veraheritage.ph',
  },
  products: {
    powder: {
      name: 'Ube Powder / Flour',
      grades: ['Grade A (Kinampay)', 'Grade B (Standard)'],
      moq: '100 kg',
      shelf_life: '12 months',
      specs: 'Moisture ≤8%, 80-200 mesh, zero fillers',
      certs: 'COA, HACCP, FDA, allergen declaration',
      strategic: 'Highest export value — shelf stable, B2B ready',
    },
    puree: {
      name: 'Frozen / Grated / Puree / Paste',
      moq: '200 kg',
      storage: 'IQF frozen at -18°C',
      certs: 'FDA, cold-chain compliant',
    },
    halaya: {
      name: 'Halaya / Jam / Spread',
      moq: '60 units',
      packaging: 'Retail 350g jars, food service 5kg tubs',
    },
    extract: {
      name: 'Ube Extract / Flavor',
      moq: '20 litres',
      use: 'Ice cream, beverages, confectionery, bakery',
    },
    fresh: {
      name: 'Fresh Whole Ube',
      seasonal: 'November–December harvest',
      moq: '500 kg',
      note: 'Phytosanitary certified, air freight',
    },
  },
  variety: {
    kinampay: 'Heritage variety from Bohol. Unmatched aroma, deep violet hue, no substitute. 100% traceable, COA certified. Commands ₱120–150/kg farmgate — premium grade.',
    cordillera: 'Highland ube from Benguet. High starch content, earthy notes. Excellent for powder with long shelf life.',
    standard: 'Commercial cultivar from Quezon/Mindanao. High volume, Grade B powder. Cost-effective for large-scale buyers.',
  },
  market: {
    global: '$455M global market in 2024, growing to $943M by 2035 at 6.9% CAGR',
    philippines: 'PH exports currently only ~$3M — Vera Heritage is closing the gap',
    destinations: 'USA (largest), Japan, China, Middle East, UK/Italy, Australia/NZ',
    trend: 'Ube featured in NYT, Bloomberg, CNN, Starbucks menus globally',
  },
  supply_chain: {
    stages: 'Farm → Collection & Grading → HACCP Processing → Lab Testing → Cold Storage → Export',
    lot_tracking: 'Every batch has a unique lot number (e.g. KIN-0512) traceable to a specific farm, farmer, and harvest date',
    certifications: 'Philippine FDA, HACCP, COA per batch, phytosanitary cert, allergen declaration, nutritional panels',
    lead_time: 'Powder: 2–3 weeks processing + shipping. Frozen: 3–4 weeks. Seasonal fresh: November–December only.',
  },
  farmers: {
    count: '48 registered partner farmers',
    regions: 'Bohol (premium Kinampay), Batangas, Benguet, Quezon, Leyte, Bukidnon',
    model: 'Direct farmgate premium (2.8× market price), co-op processing ownership, profit dividends',
    farmer_income: 'Farmers earn only 5-8% of retail value without us. Vera changes this with direct premiums and co-op stakes.',
  },
  ordering: {
    process: '1. Submit inquiry via portal or email  2. Receive quote within 24h  3. Confirm spec & quantity  4. 30–50% deposit to commence  5. Processing & testing (2–3 weeks)  6. Final payment before shipment  7. Export documents + real-time tracking',
    portal: 'Login at portal.veraheritage.ph with your buyer credentials',
    min_order: 'Powder: 100 kg | Puree: 200 kg | Extract: 20L | Halaya: 60 units',
    payment: 'Wire transfer (T/T), 30–50% deposit, balance before shipment',
  },
};

/* --- Intent patterns --- */
const INTENTS = [
  {
    patterns: [/kinampay/i, /heritage variety/i, /bohol ube/i, /what.*variety/i, /best ube/i],
    reply: () => `**Kinampay** is our flagship variety — the premium heirloom ube native to Bohol, Philippines 🏆\n\n• Unmatched natural aroma\n• Deep violet pigmentation (127mg anthocyanin/100g)\n• 100% traceable to specific farms\n• No fillers, no substitutes\n• Farmgate: ₱120–150/kg (we pay 2.8× market)\n\nIt's the "Champagne" of ube — the original that others imitate. Would you like specs or a sample request?`,
  },
  {
    patterns: [/product/i, /what.*sell/i, /what.*offer/i, /catalog/i, /product.*list/i],
    reply: () => `We export **5 product forms** of premium Philippine ube:\n\n🫙 **Ube Powder / Flour** — Grade A & B, 100kg MOQ, 12-month shelf life\n🍠 **Frozen Puree / Grated** — IQF, 200kg MOQ, cold chain\n🍯 **Halaya / Jam / Spread** — Retail & food service, 60 units MOQ\n🧪 **Extract / Flavor** — Food grade, 20L MOQ\n🌱 **Fresh Whole Ube** — Seasonal Nov–Dec, 500kg MOQ\n\nAll products: Philippine FDA registered, COA certified, HACCP compliant. Which product interests you?`,
  },
  {
    patterns: [/powder/i, /flour/i, /spec.*powder/i, /powder.*spec/i],
    reply: () => `**Ube Powder specs:**\n\n• Moisture: ≤8% w/w\n• Particle size: 75–180µm (80–200 mesh)\n• Anthocyanin: ≥50mg/100g Grade A, ≥120mg Grade A Kinampay\n• Starch: ≥70% dry basis\n• Additives: NONE — 100% pure ube\n• Shelf life: 12 months sealed, 18°C\n• MOQ: 100 kg\n• Packaging: 25kg / 50kg bags or 1MT FIBC\n\nCustom particle size and moisture spec available on request. Want a quote or COA sample?`,
  },
  {
    patterns: [/certif/i, /haccp/i, /fda/i, /coa/i, /document/i, /compliance/i, /halal/i],
    reply: () => `**Our certification stack:**\n\n✅ Philippine FDA registration\n✅ Certificate of Analysis (COA) — per batch, third-party lab\n✅ HACCP certified facility\n✅ Phytosanitary certificate (BPI)\n✅ Allergen declaration (EU Top 14)\n✅ Nutritional panels (US / EU / PH format)\n✅ Lot-numbered export packaging\n✅ Single-origin provenance certificate\n\n🔜 In progress for 2026: Halal, Organic, FSSC 22000\n\nAll documents are available in our B2B portal document vault. Need a specific cert?`,
  },
  {
    patterns: [/price/i, /pricing/i, /cost/i, /how much/i, /rate/i, /usd.*kg/i],
    reply: () => `Pricing varies by product, grade, volume, and destination. General ranges:\n\n🫙 **Ube Powder Grade A (Kinampay):** $18–24/kg FOB Manila\n🫙 **Ube Powder Grade B:** $12–16/kg FOB Manila\n🍠 **Frozen Puree:** $8–12/kg FOB (cold chain)\n🍯 **Halaya Retail Jars:** $6–9/unit (350g)\n\nPrices are FOB Manila. Volume discounts available at 500kg+.\n\n👉 For a firm quote, submit an inquiry via the B2B portal or email export@veraheritage.ph with your quantity and destination.`,
  },
  {
    patterns: [/order/i, /how.*buy/i, /purchase/i, /place.*order/i, /ordering process/i],
    reply: () => `**How to order from Vera Heritage:**\n\n1️⃣ Submit inquiry (portal or email)\n2️⃣ Receive quote within 24 business hours\n3️⃣ Confirm product spec, quantity, packaging\n4️⃣ 30–50% deposit to commence production\n5️⃣ Processing & lab testing (2–3 weeks)\n6️⃣ Balance payment before shipment\n7️⃣ Export docs + real-time tracking shared\n\n📦 **MOQ:** Powder 100kg | Puree 200kg | Extract 20L | Halaya 60 units\n\nReady to start? Visit the B2B portal or email export@veraheritage.ph`,
  },
  {
    patterns: [/lead.*time/i, /how.*long/i, /timeline/i, /delivery.*time/i, /when.*receive/i],
    reply: () => `**Lead times (from order confirmation):**\n\n⚙️ **Ube Powder:** 2–3 weeks processing + transit\n❄️ **Frozen Puree:** 3–4 weeks\n🍯 **Halaya/Jam:** 2–3 weeks\n🧪 **Extract:** 3–4 weeks\n🌱 **Fresh Ube:** Available Nov–Dec only\n\n✈️ **Transit times:**\n• To USA/Japan: 5–7 days air freight\n• To USA/Europe: 18–25 days sea freight\n• To Middle East: 12–18 days sea freight\n\n📦 We have in-stock powder batches ready for faster dispatch. Ask about current stock!`,
  },
  {
    patterns: [/stock/i, /inventory/i, /available/i, /current.*batch/i, /ready.*order/i],
    reply: () => `**Current available inventory:**\n\n🟢 **Ube Powder Grade A (KIN-0512):** 3,500 kg\n🟢 **Ube Powder Grade B:** 2,800 kg\n🟢 **Frozen Puree:** 1,200 kg\n🟢 **Halaya Retail:** 640 units\n🟢 **Ube Extract:** 280 litres\n\nAll batches have current COAs. Powder batches are ready for immediate dispatch.\n\nLogin to the B2B portal for real-time inventory and instant ordering.`,
  },
  {
    patterns: [/track/i, /shipment/i, /where.*order/i, /lot.*number/i, /trace/i, /provenance/i],
    reply: () => `Every Vera Heritage batch has a **unique lot number** (e.g. KIN-0512) that traces to:\n\n📍 Specific farm & farmer\n📅 Harvest date & weight\n⚙️ Processing facility & date\n🧬 Lab test results (COA)\n❄️ Storage conditions\n✈️ Shipping & AWB number\n\nYou can track any batch on our **Supply Chain Tracker** page or in the B2B portal under "Shipment Tracking".\n\nEnter your lot number at: veraheritage.ph/supply-chain.html`,
  },
  {
    patterns: [/farmer/i, /who.*grow/i, /where.*farm/i, /bohol/i, /province/i],
    reply: () => `We partner with **48 certified farmers** across 6 Philippine provinces:\n\n🏝️ **Bohol** — Premium Kinampay heritage (18 farmers, 6,200 kg/year)\n🌋 **Batangas** — Kinampay heritage (9 farmers)\n🏔️ **Benguet** — Highland Cordillera ube (7 farmers)\n📍 **Quezon** — Volume production (6 farmers)\n🌺 **Leyte** — Emerging premium region (5 farmers)\n🌄 **Bukidnon** — Development program (3 farmers)\n\nAll farmers receive **2.8× market price** and co-op processing stakes. View the full Farmer Network at veraheritage.ph/farmers.html`,
  },
  {
    patterns: [/market.*size/i, /global.*market/i, /market.*value/i, /how.*big/i, /demand/i],
    reply: () => `The global ube market is **booming** 📈\n\n• $455M global market in 2024\n• Growing to $943M by 2035 (6.9% CAGR)\n• 359 new ube product launches per year\n• Philippine exports: only ~$3M — massive gap\n\nUbe is trending globally: featured in New York Times, Bloomberg, CNN. Starbucks added ube to their menu. Filipino diaspora driving demand in US, Japan, Australia, Middle East.\n\nThe origin country (Philippines) captures less than 1% of global value. Vera Heritage is changing that.`,
  },
  {
    patterns: [/sample/i, /trial.*order/i, /test.*order/i, /try.*before/i],
    reply: () => `Yes, we offer **sample packs** for qualified buyers! 🌟\n\n• 500g–1kg sample packs available\n• Grade A (Kinampay) and Grade B samples\n• Includes COA and spec sheet\n• Shipping cost covered by buyer\n\nTo request samples:\n📧 Email: export@veraheritage.ph\n🌐 Portal: Submit inquiry → select "Sample Request"\n\nAllow 5–7 business days for sample preparation and dispatch.`,
  },
  {
    patterns: [/private.*label/i, /white.*label/i, /custom.*pack/i, /our.*brand/i],
    reply: () => `Yes! We offer **private label** and **white-label** solutions 📦\n\n• Your brand on our products\n• Custom packaging design (we assist)\n• US, EU, and PH format nutritional panels\n• MOQ for private label: 200kg powder, 120 jars\n• Lead time: add 1–2 weeks for label production\n\nMany of our international buyers use Vera Heritage as their exclusive Philippine ube supplier with their own branding. Contact export@veraheritage.ph for a private label proposal.`,
  },
  {
    patterns: [/hello|hi |hey |good morning|good afternoon|greetings/i],
    reply: () => `Hello! Welcome to Vera Heritage 🌿\n\nI'm Vera AI, your ube sourcing assistant. We export premium Philippine ube — powder, puree, halaya, extract, and fresh — directly from certified Filipino farmers with full traceability.\n\nHow can I help you today? You can ask about:\n• Products & pricing\n• Certifications & compliance\n• Order process & lead times\n• Farmer network & provenance`,
  },
  {
    patterns: [/thank|thanks|appreciate/i],
    reply: () => `You're very welcome! 🙏\n\nFeel free to ask anything else. If you're ready to discuss a specific order, you can also:\n📧 Email: export@veraheritage.ph\n🌐 Access our B2B portal for real-time inventory and orders\n\nHave a great day, and thank you for your interest in authentic Philippine ube!`,
  },
  {
    patterns: [/contact|email|phone|reach|speak.*human|talk.*person/i],
    reply: () => `Here's how to reach the Vera Heritage team:\n\n📧 **Export inquiries:** export@veraheritage.ph\n🌾 **Farmer partnerships:** farmers@veraheritage.ph\n🌐 **B2B Portal:** portal access at veraheritage.ph/portal.html\n\nOur export team responds within 24 business hours (Manila time, Mon–Fri). For urgent matters, mention "URGENT" in your email subject.\n\nFor real-time assistance, I'm here 24/7! 🤖`,
  },
  {
    patterns: [/portal.*access|login|sign.*in|how.*access.*portal/i],
    reply: () => `The **B2B Buyer Portal** is your complete sourcing platform:\n\n🛒 Place orders & request quotes\n📦 Track active shipments in real-time\n📄 Download COAs, HACCP, FDA certs\n🌾 View farmer profiles & harvest data\n📊 Inventory availability dashboard\n🤖 AI assistant (that's me!)\n\nAccess: veraheritage.ph/portal.html\n\nTo get credentials, email export@veraheritage.ph — we'll set up your verified buyer account.`,
  },
];

/* --- Fallback responses --- */
const FALLBACKS = [
  `That's a great question! For detailed information, I'd recommend:\n\n📧 Email our export team: export@veraheritage.ph\n🌐 Access the B2B Portal for specs, inventory & docs\n\nIs there anything specific about our ube products, certifications, or the ordering process I can help with?`,
  `I want to make sure you get the most accurate answer. Could you clarify what you're looking for?\n\nI can help with:\n• Product specs & pricing\n• Certifications (COA, HACCP, FDA)\n• Order process & lead times\n• Farmer & origin info\n• Supply chain traceability`,
  `Good question! The best person to answer this in detail would be our export team at export@veraheritage.ph.\n\nIn the meantime, I can tell you about our products, certifications, pricing guidelines, or the full supply chain from farm to delivery. What would be most helpful?`,
];

let fallbackIndex = 0;

/* --- Main reply engine --- */
function getBotReply(userMsg) {
  const msg = userMsg.toLowerCase().trim();

  // Check intent patterns
  for (const intent of INTENTS) {
    if (intent.patterns.some(pattern => pattern.test(msg))) {
      return intent.reply();
    }
  }

  // Context-aware fallbacks
  const reply = FALLBACKS[fallbackIndex % FALLBACKS.length];
  fallbackIndex++;
  return reply;
}

/* --- Portal AI panel helper --- */
function initPortalAI() {
  const msgs = document.getElementById('aiMessages');
  if (!msgs || msgs.childElementCount > 0) return;

  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `
    <div class="chat-avatar">🌿</div>
    <div class="chat-bubble">Hi! I'm Vera AI with full access to your account context.<br/><br/>
    I can see your orders, inventory, and documents. Ask me anything about ube sourcing, your shipments, or product specifications.</div>`;
  msgs.appendChild(div);
}
