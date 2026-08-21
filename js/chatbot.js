// ============================================================
// AnalogToApex — chatbot.js
// Rule-based service assistant. No backend, no API calls —
// pure keyword matching against the service catalog below,
// which mirrors the content already on the page (index.html).
//
// To edit what the bot knows about your services, edit the
// SERVICES array. Everything else (matching, rendering, the
// quote hand-off to the contact form) works off that data.
// ============================================================

(function () {
  'use strict';

  const SERVICES = [
    {
      id: 'website-dev',
      name: 'Website Development',
      icon: '🌐',
      anchor: '#website-dev',
      desc: 'Whatever platform fits your business, we build it clean, fast, and easy for you to manage afterward.',
      price: 'From $150',
      subservices: [
        'Business Websites', 'E-Commerce (Shopify, WooCommerce)', 'Custom Websites',
        'Landing Pages', 'Dropshipping Websites', 'WordPress Development',
        'Wix / Webflow / Bubble / Squarespace / GoDaddy',
        'Maintenance — Customization, Bug Fixes, Backup & Migration, Speed Optimization'
      ],
      keywords: [
        'website', 'web design', 'web site', 'landing page', 'landing pages', 'wordpress',
        'woocommerce', 'shopify', 'ecommerce', 'e-commerce', 'online store', 'dropship',
        'dropshipping', 'wix', 'webflow', 'bubble', 'squarespace', 'godaddy',
        'business website', 'custom website', 'maintenance', 'backup', 'migration',
        'speed optimization', 'bug fix', 'no-code'
      ]
    },
    {
      id: 'ai-native',
      name: 'AI-Native Web Development',
      icon: '✨',
      anchor: '#ai-native',
      desc: 'Built specifically for AI/agent-driven delivery — this is where our workflow gives you the biggest speed advantage.',
      price: 'From $500',
      subservices: [
        'AI Websites & Software', 'AI Integrations into existing sites/apps',
        'AI Agents — built & deployed as the product', 'AI Technology Consulting',
        '"Vibe Coding" — Dev & MVP', 'Troubleshooting & Improvements',
        'Deployments & DevOps', 'Consultation & Training'
      ],
      keywords: [
        'ai website', 'ai software', 'ai integration', 'ai integrations', 'ai agent',
        'ai agents', 'vibe coding', 'vibe-coding', 'ai consulting', 'ai consultant',
        'ai product', 'artificial intelligence website', 'llm app', 'gpt', 'chatgpt integration',
        'ai mvp', 'ai strategy'
      ]
    },
    {
      id: 'software',
      name: 'Software Development',
      icon: '🛠️',
      anchor: '#software',
      desc: 'Web-facing software that connects your tools, automates your workflow, and extends your product.',
      price: 'From $400',
      subservices: [
        'Full Stack Web Apps', 'APIs & Integrations', 'Automations & Agents (workflow automation)',
        'Scripting', 'Plugin Development', 'Browser Extensions'
      ],
      keywords: [
        'full stack', 'fullstack', 'web app', 'web application', 'api', 'apis', 'integration',
        'integrations', 'automation', 'automations', 'workflow', 'script', 'scripting',
        'plugin', 'plug-in', 'browser extension', 'extension', 'saas', 'mvp app'
      ]
    },
    {
      id: 'chatbots',
      name: 'Chatbot Development',
      icon: '💬',
      anchor: '#chatbots',
      desc: 'Conversational tools that capture leads, answer support questions, and work around the clock.',
      price: 'From $250',
      subservices: ['AI Chatbot Development', 'Rule-Based Chatbots'],
      keywords: [
        'chatbot', 'chat bot', 'bot', 'conversational', 'support bot', 'live chat',
        'rule-based bot', 'rule based bot', 'ai chatbot', 'messaging bot', 'assistant like this'
      ]
    },
    {
      id: 'cloud-devops',
      name: 'Cloud Computing & DevOps',
      icon: '☁️',
      anchor: '#cloud-devops',
      desc: 'Reliable infrastructure and deployment pipelines — with extra human review before anything touches production.',
      price: 'From $400',
      subservices: ['Cloud Computing', 'DevOps Engineering'],
      keywords: [
        'cloud', 'aws', 'azure', 'gcp', 'google cloud', 'devops', 'ci/cd', 'cicd',
        'deployment', 'deployments', 'infrastructure', 'server setup', 'kubernetes', 'docker',
        'hosting setup', 'pipeline'
      ]
    },
    {
      id: 'qa-testing',
      name: 'QA & Testing',
      icon: '✅',
      anchor: '#qa-testing',
      desc: 'Automated coverage plus a real human pass, because trust matters most here.',
      price: 'From $200',
      subservices: ['QA & Review', 'User Testing'],
      keywords: [
        'qa', 'quality assurance', 'testing', 'test', 'bug testing', 'user testing',
        'code review', 'review my site', 'review my app', 'regression testing', 'test suite'
      ]
    }
  ];

  const OVERVIEW_KEYWORDS = [
    'service', 'services', 'what do you do', 'what can you build', 'what can you do',
    'help me', 'options', 'catalog', 'offer', 'offerings', 'pricing', 'everything',
    'show me everything', 'menu'
  ];

  // ---------- DOM refs ----------
  const widget = document.getElementById('chatWidget');
  const launcher = document.getElementById('chatLauncher');
  const win = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatInputForm');
  const input = document.getElementById('chatInput');
  const tooltip = document.getElementById('chatTooltip');

  if (!widget || !launcher || !win) return; // markup missing, bail quietly

  let hasGreeted = false;
  let isOpen = false;

  // ---------- Low-level render helpers ----------
  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text; // always text-only: never render user input as HTML
    msg.appendChild(bubble);
    body.appendChild(msg);
    scrollToBottom();
  }

  // contentBuilder receives the bubble element to fill with DOM nodes
  function addBotMessage(contentBuilder) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    contentBuilder(bubble);
    msg.appendChild(bubble);
    body.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  function addChoices(container, choices) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-choices';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-chip' + (choice.primary ? ' primary' : '');
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        // Lock this specific choice row so old options can't be replayed
        wrap.querySelectorAll('button').forEach(b => (b.disabled = true));
        wrap.style.opacity = '.55';
        addUserMessage(choice.label);
        choice.onClick();
      });
      wrap.appendChild(btn);
    });
    container.appendChild(wrap);
  }

  let typingEl = null;
  function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'chat-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typingEl);
    scrollToBottom();
  }
  function hideTyping() {
    if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    typingEl = null;
  }

  // Simulates a brief "thinking" pause before the bot replies.
  function respond(fn, delay) {
    showTyping();
    setTimeout(() => {
      hideTyping();
      fn();
    }, delay || 500 + Math.random() * 300);
  }

  // ---------- Content builders ----------
  function categoryChipList(excludeId) {
    return SERVICES.filter(s => s.id !== excludeId).map(s => ({
      label: `${s.icon} ${s.name}`,
      onClick: () => respond(() => renderCategoryDetail(s.id))
    }));
  }

  function renderGreeting() {
    addBotMessage(bubble => {
      const p1 = document.createElement('p');
      p1.innerHTML = '👋 Hi! I\'m the <strong>AnalogToApex</strong> assistant. I can walk you through what we build and what it costs.';
      bubble.appendChild(p1);
      const p2 = document.createElement('p');
      p2.textContent = 'What are you looking for?';
      bubble.appendChild(p2);
      addChoices(bubble, [
        ...SERVICES.map(s => ({
          label: `${s.icon} ${s.name}`,
          onClick: () => respond(() => renderCategoryDetail(s.id))
        })),
        { label: '📋 Show me everything', onClick: () => respond(renderAllServices) }
      ]);
    });
  }

  function renderAllServices(introText) {
    addBotMessage(bubble => {
      const intro = document.createElement('p');
      intro.textContent = introText || 'Here\'s everything we offer — tap a category for full details and pricing:';
      bubble.appendChild(intro);

      SERVICES.forEach(s => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${s.icon} ${s.name}`;
        p.appendChild(strong);
        p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(s.subservices.join(' · ')));
        bubble.appendChild(p);
      });

      addChoices(bubble, SERVICES.map(s => ({
        label: `${s.icon} ${s.name}`,
        onClick: () => respond(() => renderCategoryDetail(s.id))
      })));
    });
  }

  function flashHighlight(el) {
    el.classList.add('chat-highlight');
    setTimeout(() => el.classList.remove('chat-highlight'), 1600);
  }

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;
    win.hidden = true;
    widget.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  function goToSection(service) {
    closeChat();
    const el = document.querySelector(service.anchor);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        flashHighlight(el);
      }, 150);
    }
  }

  function requestQuote(service) {
    closeChat();
    const contactForm = document.getElementById('contactForm');
    const select = contactForm ? contactForm.querySelector('select[name="service"]') : null;
    if (select) {
      const match = [...select.options].find(o => o.value === service.name || o.text === service.name);
      if (match) select.value = match.value;
    }
    const section = document.getElementById('contact');
    setTimeout(() => {
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        flashHighlight(section);
      }
      const nameField = contactForm ? contactForm.querySelector('input[name="name"]') : null;
      if (nameField) setTimeout(() => nameField.focus(), 500);
    }, 150);
  }

  function renderCategoryDetail(serviceId) {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    addBotMessage(bubble => {
      const p1 = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${service.icon} ${service.name}`;
      p1.appendChild(strong);
      bubble.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = service.desc;
      bubble.appendChild(p2);

      const list = document.createElement('ul');
      service.subservices.forEach(sub => {
        const li = document.createElement('li');
        li.textContent = sub;
        list.appendChild(li);
      });
      bubble.appendChild(list);

      const price = document.createElement('span');
      price.className = 'chat-service-price';
      price.textContent = `${service.price} · final price scoped per project`;
      bubble.appendChild(price);

      addChoices(bubble, [
        { label: 'View full section on page', onClick: () => goToSection(service) },
        { label: 'Get a quote for this', primary: true, onClick: () => requestQuote(service) },
        { label: '← See other services', onClick: () => respond(() => renderAllServices('Here\'s the full list again:')) }
      ]);
    });
  }

  // ---------- Matching ----------
  function matchMessage(raw) {
    const text = raw.toLowerCase().trim();
    if (!text) return { type: 'empty' };

    const overviewScore = OVERVIEW_KEYWORDS.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);

    let bestService = null;
    let bestScore = 0;
    let tie = false;

    SERVICES.forEach(service => {
      const score = service.keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        bestService = service;
        tie = false;
      } else if (score === bestScore && score > 0) {
        tie = true;
      }
    });

    if (bestService && bestScore > 0 && !tie && bestScore >= overviewScore) {
      return { type: 'category', service: bestService };
    }
    if (overviewScore > 0 || tie) {
      return { type: 'overview' };
    }
    return { type: 'unmatched' };
  }

  function handleUserInput(text) {
    addUserMessage(text);
    const result = matchMessage(text);

    if (result.type === 'category') {
      respond(() => renderCategoryDetail(result.service.id));
    } else if (result.type === 'overview') {
      respond(() => renderAllServices());
    } else {
      respond(() => {
        addBotMessage(bubble => {
          const p = document.createElement('p');
          p.textContent = 'I didn\'t quite catch that — here\'s everything we offer, just tap a category:';
          bubble.appendChild(p);
          addChoices(bubble, SERVICES.map(s => ({
            label: `${s.icon} ${s.name}`,
            onClick: () => respond(() => renderCategoryDetail(s.id))
          })));
        });
      });
    }
  }

  // ---------- Open / close / tooltip ----------
  function openChat() {
    isOpen = true;
    win.hidden = false;
    widget.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    tooltip.classList.remove('visible');

    if (!hasGreeted) {
      hasGreeted = true;
      respond(renderGreeting, 400);
    }
    setTimeout(() => input.focus(), 150);
  }

  launcher.addEventListener('click', () => {
    if (isOpen) closeChat();
    else openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleUserInput(text);
  });

  // One-time attention tooltip
  setTimeout(() => {
    if (!isOpen) tooltip.classList.add('visible');
  }, 2500);
  setTimeout(() => tooltip.classList.remove('visible'), 9000);
  launcher.addEventListener('mouseenter', () => tooltip.classList.remove('visible'));
})();
