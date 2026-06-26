/* ============================================================
   VIAAN THAKUR — Portfolio JS
   ============================================================ */

'use strict';

// ── Site Data ───────────────────────────────────────────────
let SITE_DATA = null;

async function loadData() {
  try {
    const r = await fetch('./data/site.json');
    SITE_DATA = await r.json();
  } catch (e) {
    console.error('Could not load site.json', e);
  }
}

// ── Utility ─────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const esc = str => String(str).replace(/</g,'&lt;').replace(/>/g,'&gt;');

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

// ── Loader ──────────────────────────────────────────────────
function hideLoader() {
  const loader = $('#loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1500);
  }
}

// ── Theme ───────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = $('#btn-theme');
  if (btn) btn.innerHTML = theme === 'dark'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// ── Navbar ──────────────────────────────────────────────────
function initNavbar() {
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu
  const mobileNav = $('#mobile-nav');
  const navOverlay = $('#nav-overlay');
  const btnMenu = $('#btn-menu');

  function openMobileNav() {
    mobileNav.classList.add('open');
    navOverlay.classList.add('open');
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    navOverlay.classList.remove('open');
  }

  btnMenu?.addEventListener('click', openMobileNav);
  navOverlay?.addEventListener('click', closeMobileNav);

  $$('#mobile-nav a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
}

// ── Hero Canvas ─────────────────────────────────────────────
function initCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [], frame = 0;

  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : h + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.hue = Math.random() > 0.6 ? 190 : 260;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const color = isDark()
        ? `hsla(${this.hue}, 100%, 70%, ${this.alpha})`
        : `hsla(${this.hue}, 80%, 40%, ${this.alpha * 0.5})`;
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  // Circuit grid
  const NODES = [];
  function buildGrid() {
    NODES.length = 0;
    const cols = Math.ceil(w / 100) + 1;
    const rows = Math.ceil(h / 100) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        NODES.push({ x: c * 100 + (Math.random() - 0.5) * 40, y: r * 100 + (Math.random() - 0.5) * 40 });
      }
    }
  }

  function drawGrid() {
    const alpha = isDark() ? 0.04 : 0.025;
    ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
    ctx.lineWidth = 1;
    NODES.forEach(n => {
      NODES.forEach(m => {
        const d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d > 0 && d < 130) {
          ctx.globalAlpha = alpha * (1 - d / 130);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      });
    });
    ctx.globalAlpha = 1;
  }

  function init() {
    resize();
    buildGrid();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    if (frame % 2 === 0) drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    frame++;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); buildGrid(); }, { passive: true });
  init();
  loop();
}

// ── Terminal Typing ─────────────────────────────────────────
function initTerminal() {
  const term = $('#hero-terminal');
  if (!term) return;

  const lines = [
    { type: 'prompt', text: '~/AxionAOSP', cmd: 'source build/envsetup.sh' },
    { type: 'out',    text: 'including device/oneplus/larry/vendorsetup.sh', color: 'cyan' },
    { type: 'prompt', text: '~/AxionAOSP', cmd: 'lunch axion_larry-userdebug' },
    { type: 'out',    text: '============================================' },
    { type: 'out',    text: 'PLATFORM_VERSION_CODENAME=REL', color: 'muted' },
    { type: 'out',    text: 'TARGET_PRODUCT=axion_larry', color: 'green' },
    { type: 'out',    text: 'TARGET_BUILD_VARIANT=userdebug', color: 'amber' },
    { type: 'prompt', text: '~/AxionAOSP', cmd: 'm bacon -j$(nproc --all)' },
    { type: 'out',    text: '[ 98% 24158/24592] Building AxionAOSP...', color: 'cyan' },
    { type: 'out',    text: 'Out: out/target/product/larry/axion-larry.zip', color: 'green' },
  ];

  let html = '';
  lines.forEach((l, i) => {
    if (l.type === 'prompt') {
      html += `<div class="t-line"><span class="t-prompt">viaan@archlinux</span> <span style="color:var(--text-muted)">${esc(l.text)} $</span> <span class="t-cmd">${esc(l.cmd)}</span></div>`;
    } else {
      const col = l.color === 'cyan' ? 'var(--cyan)' : l.color === 'green' ? 'var(--green)' : l.color === 'amber' ? 'var(--amber)' : 'var(--text-muted)';
      html += `<div class="t-line t-out" style="color:${col}">${esc(l.text)}</div>`;
    }
  });
  html += `<div class="t-line"><span class="t-prompt">viaan@archlinux</span> <span style="color:var(--text-muted)">~/AxionAOSP $</span> <span class="t-cursor"></span></div>`;

  term.innerHTML = html;
}

// ── About Skills ────────────────────────────────────────────
function renderSkills() {
  if (!SITE_DATA) return;
  const grid = $('#skills-grid');
  if (!grid) return;

  const top = SITE_DATA.skills.slice(0, 8);
  grid.innerHTML = top.map(s => `
    <div class="skill-row">
      <div class="skill-meta">
        <span class="skill-name">${esc(s.name)}</span>
        <span class="skill-pct">${s.level}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" style="width:${s.level}%"></div>
      </div>
    </div>
  `).join('');
}

function animateSkills() {
  $$('.skill-fill').forEach(f => f.classList.add('animated'));
}

// ── About Tags ──────────────────────────────────────────────
const ABOUT_TAGS = [
  'ROM Development', 'Kernel Dev', 'Device Bring-up',
  'SELinux', 'Android Debugging', 'Linux SysAdmin',
  'Build Infrastructure', 'CI/CD', 'Cloud & Servers',
  'Open Source', 'Web Development', 'Device Trees'
];

function renderAboutTags() {
  const wrap = $('#about-tags');
  if (!wrap) return;
  wrap.innerHTML = ABOUT_TAGS.map(t =>
    `<span class="tag">${esc(t)}</span>`
  ).join('');
}

// ── Projects ────────────────────────────────────────────────
function renderProjects() {
  if (!SITE_DATA) return;
  const grid = $('#projects-grid');
  if (!grid) return;

  grid.innerHTML = SITE_DATA.projects.map((p, i) => {
    const featured = p.featured && i === 0;
    return `
    <div class="project-card ${p.featured ? 'featured' : ''}" 
         style="--card-accent: ${p.color}22;"
         tabindex="0" role="article">
      <svg class="project-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 17L17 7M7 7h10v10"/>
      </svg>
      <span class="project-icon">${p.icon}</span>
      <div class="project-name">${esc(p.name)}</div>
      <div class="project-tagline" style="color:${p.color}">${esc(p.tagline)}</div>
      <div class="project-desc">${esc(p.description)}</div>
      ${p.size ? `<div class="project-size" style="font-family:var(--font-mono);font-size:0.8rem;color:${p.color};margin-bottom:12px;">📦 ${p.size}</div>` : ''}
      <div class="project-tags">
        ${p.tags.map(t => `<span class="project-tag">${esc(t)}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

// ── Devices ─────────────────────────────────────────────────
const DEVICE_ICONS = { OnePlus: '🔴', Xiaomi: '🟠', Lenovo: '🔵' };

function renderDevices() {
  if (!SITE_DATA) return;
  const grid = $('#devices-grid');
  if (!grid) return;

  grid.innerHTML = SITE_DATA.devices.map(d => {
    const statusClass = 'status-' + d.status.toLowerCase().replace(/\s+/g, '-');
    return `
    <div class="device-card">
      <div class="device-icon-wrap">${DEVICE_ICONS[d.oem] || '📱'}</div>
      <div>
        <div class="device-name">${esc(d.name)}</div>
        <div class="device-codename">${esc(d.codename)}</div>
        <div class="device-meta">
          <span class="device-badge ${statusClass}">${esc(d.status)}</span>
          <span class="device-badge">Android ${esc(d.android)}</span>
          <span class="device-badge">${esc(d.chip)}</span>
          <span class="device-badge">${esc(d.role)}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── GitHub ──────────────────────────────────────────────────
const LANG_COLORS = {
  'C': '#555555', 'C++': '#f34b7d', 'Makefile': '#427819',
  'Shell': '#89e051', 'Python': '#3572A5', 'JavaScript': '#f1e05a',
  'HTML': '#e34c26', 'CSS': '#563d7c', 'Kotlin': '#A97BFF',
  'Java': '#b07219', 'YAML': '#cb171e', 'Smali': '#1e4b7b'
};

async function loadGitHub() {
  const username = SITE_DATA?.meta?.github || 'ViaanLarryROMS';
  const profileEl = $('#github-profile');
  const reposEl   = $('#repos-list');
  const activityEl = $('#activity-feed-items');

  // Profile
  try {
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=10`)
    ]);

    if (profileRes.ok) {
      const p = await profileRes.json();
      if (profileEl) {
        profileEl.innerHTML = `
          <img src="${p.avatar_url}" class="github-avatar" alt="${esc(p.login)}" loading="lazy">
          <div class="github-username">@${esc(p.login)}</div>
          <div class="github-name">${esc(p.name || p.login)}</div>
          <div class="github-stats">
            <div class="gh-stat"><div class="gh-stat-val">${p.public_repos}</div><div class="gh-stat-lbl">Repos</div></div>
            <div class="gh-stat"><div class="gh-stat-val">${p.followers}</div><div class="gh-stat-lbl">Followers</div></div>
            <div class="gh-stat"><div class="gh-stat-val">${p.following}</div><div class="gh-stat-lbl">Following</div></div>
          </div>
          <a href="${p.html_url}" target="_blank" rel="noopener" class="btn-secondary" style="width:100%;justify-content:center;margin-top:16px;display:flex;">
            View Profile
          </a>`;
      }
    }

    if (reposRes.ok && reposEl) {
      const repos = await reposRes.json();
      reposEl.innerHTML = repos.slice(0, 6).map(r => `
        <a href="${r.html_url}" target="_blank" rel="noopener" class="repo-card">
          <div class="repo-name">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px;opacity:0.5"><path d="M3 3h18v18H3z"/></svg>
            ${esc(r.name)}
          </div>
          <div class="repo-desc">${esc(r.description || 'No description')}</div>
          <div class="repo-meta">
            ${r.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${LANG_COLORS[r.language] || '#888'}"></span>${esc(r.language)}</span>` : ''}
            <span class="repo-stat">⭐ ${r.stargazers_count}</span>
            <span class="repo-stat">🍴 ${r.forks_count}</span>
          </div>
        </a>`).join('');
    }

    if (eventsRes.ok && activityEl) {
      const events = await eventsRes.json();
      const rendered = events.slice(0, 6).map(e => {
        let text = '';
        const when = timeAgo(new Date(e.created_at));
        if (e.type === 'PushEvent') text = `Pushed to <b>${esc(e.repo.name.split('/')[1])}</b>`;
        else if (e.type === 'CreateEvent') text = `Created ${esc(e.payload.ref_type)} <b>${esc(e.payload.ref || e.repo.name.split('/')[1])}</b>`;
        else if (e.type === 'WatchEvent') text = `Starred <b>${esc(e.repo.name)}</b>`;
        else if (e.type === 'ForkEvent') text = `Forked <b>${esc(e.repo.name)}</b>`;
        else if (e.type === 'IssuesEvent') text = `${esc(e.payload.action)} issue in <b>${esc(e.repo.name.split('/')[1])}</b>`;
        else if (e.type === 'PullRequestEvent') text = `${esc(e.payload.action)} PR in <b>${esc(e.repo.name.split('/')[1])}</b>`;
        else return '';
        return `<div class="activity-item">
          <span class="activity-dot"></span>
          <div>
            <div class="activity-text">${text}</div>
            <div class="activity-time">${when}</div>
          </div>
        </div>`;
      }).filter(Boolean).join('');
      activityEl.innerHTML = rendered || '<div class="activity-item"><span class="activity-dot"></span><div class="activity-text">No recent activity found</div></div>';
    }

  } catch (err) {
    console.warn('GitHub API error:', err);
    if (profileEl) profileEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:0.85rem">GitHub data unavailable.<br><a href="https://github.com/ViaanLarryROMS" target="_blank" style="color:var(--cyan)">@ViaanLarryROMS</a></div>`;
    if (reposEl)   reposEl.innerHTML   = `<div style="color:var(--text-muted);font-size:0.85rem;padding:20px;text-align:center">Could not load repositories.</div>`;
  }
}

function timeAgo(date) {
  const s = (Date.now() - date) / 1000;
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

// ── Tech Stack ──────────────────────────────────────────────
const TECH_ICONS = {
  android: '🤖', linux: '🐧', arch: '🔵', git: '🔀', github: '🐙',
  bash: '💻', python: '🐍', c: '⚙️', make: '🔨', yaml: '📄',
  cloudflare: '🌐', docker: '🐳', html: '🌍', js: '⚡'
};

function renderTechStack() {
  if (!SITE_DATA) return;
  const grid = $('#tech-grid');
  if (!grid) return;
  grid.innerHTML = SITE_DATA.skills.map(s => `
    <div class="tech-pill">
      <div class="tech-icon">${TECH_ICONS[s.icon] || '🔧'}</div>
      <span class="tech-pill-name">${esc(s.name)}</span>
    </div>`).join('');
}

// ── Timeline ────────────────────────────────────────────────
function renderTimeline() {
  if (!SITE_DATA) return;
  const track = $('#timeline-track');
  if (!track) return;
  track.innerHTML = SITE_DATA.timeline.map((t, i) => `
    <div class="timeline-item" style="transition-delay:${i*0.07}s">
      <div class="timeline-node">${t.icon}</div>
      <div class="timeline-year">${esc(t.year)}</div>
      <div class="timeline-title">${esc(t.title)}</div>
      <div class="timeline-desc">${esc(t.description)}</div>
    </div>`).join('');
}

// ── Blog ────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    emoji: '🛠️',
    bg: 'linear-gradient(135deg,#0A0E1A,#1A2240)',
    tag: 'ROM Development',
    title: 'Building Your First Android ROM from AOSP Source',
    excerpt: 'A complete guide to setting up your build environment, syncing sources, and compiling your first custom Android ROM.',
    date: 'Jun 2025',
    readtime: '12 min read'
  },
  {
    emoji: '⚡',
    bg: 'linear-gradient(135deg,#0A0E1A,#1A2240)',
    tag: 'Kernel Dev',
    title: 'Optimizing Linux Kernel Schedulers for Mobile',
    excerpt: 'Deep dive into EAS, HMP, and custom governors — how to tune your kernel for maximum performance and battery life.',
    date: 'May 2025',
    readtime: '9 min read'
  },
  {
    emoji: '🔒',
    bg: 'linear-gradient(135deg,#0A0E1A,#1A2240)',
    tag: 'SELinux',
    title: 'Writing SELinux Policies for Android Device Trees',
    excerpt: 'From denials to policies — a practical guide to understanding and writing SELinux rules for Android device bring-up.',
    date: 'Apr 2025',
    readtime: '8 min read'
  },
  {
    emoji: '🌲',
    bg: 'linear-gradient(135deg,#0A0E1A,#1A2240)',
    tag: 'Device Bring-up',
    title: 'Android Device Tree Structure Explained',
    excerpt: 'Everything you need to know about device trees, BoardConfig, vendor blobs, and how they fit together.',
    date: 'Mar 2025',
    readtime: '10 min read'
  },
  {
    emoji: '🔍',
    bg: 'linear-gradient(135deg,#0A0E1A,#1A2240)',
    tag: 'Debugging',
    title: 'Advanced Android Log Analysis with logcat',
    excerpt: 'Tools, techniques, and patterns for debugging Android boot issues, crashes, and performance problems.',
    date: 'Feb 2025',
    readtime: '7 min read'
  },
  {
    emoji: '⚙️',
    bg: 'linear-gradient(135deg,#0A0E1A,#1A2240)',
    tag: 'Build Infra',
    title: 'Automating Android Builds with GitHub Actions',
    excerpt: 'Setting up CI/CD pipelines for automated ROM compilation, testing, and release distribution.',
    date: 'Jan 2025',
    readtime: '11 min read'
  }
];

function renderBlog() {
  const grid = $('#blog-grid');
  if (!grid) return;
  grid.innerHTML = BLOG_POSTS.map(p => `
    <article class="blog-card">
      <div class="blog-card-header" style="background:${p.bg}">${p.emoji}</div>
      <div class="blog-card-body">
        <div class="blog-tag">${esc(p.tag)}</div>
        <h3 class="blog-title">${esc(p.title)}</h3>
        <p class="blog-excerpt">${esc(p.excerpt)}</p>
        <div class="blog-meta">
          <span>${esc(p.date)}</span>
          <span>${esc(p.readtime)}</span>
        </div>
      </div>
    </article>`).join('');
}

// ── Search ──────────────────────────────────────────────────
function buildSearchIndex() {
  const index = [];
  if (!SITE_DATA) return index;

  SITE_DATA.projects.forEach(p => index.push({ type: 'Project', title: p.name, sub: p.tagline, href: '#projects' }));
  SITE_DATA.devices.forEach(d => index.push({ type: 'Device', title: d.name, sub: d.codename, href: '#devices' }));
  SITE_DATA.skills.forEach(s => index.push({ type: 'Skill', title: s.name, sub: `${s.level}% proficiency`, href: '#tech-stack' }));
  BLOG_POSTS.forEach(p => index.push({ type: 'Blog', title: p.title, sub: p.tag, href: '#blog' }));
  ['About', 'Projects', 'Devices', 'GitHub', 'Tech Stack', 'Timeline', 'Blog'].forEach(s =>
    index.push({ type: 'Section', title: s, sub: `Jump to section`, href: '#' + s.toLowerCase().replace(/\s+/g, '-') })
  );
  return index;
}

function initSearch() {
  const overlay  = $('#search-overlay');
  const input    = $('#search-input');
  const results  = $('#search-results');
  const btnOpen  = $('#btn-search');
  const btnClose = $('#btn-search-close');

  let index = [];

  function open() {
    if (index.length === 0) index = buildSearchIndex();
    overlay.classList.add('open');
    input.focus();
    results.innerHTML = '';
  }

  function close() {
    overlay.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  }

  btnOpen?.addEventListener('click', open);
  btnClose?.addEventListener('click', close);

  overlay?.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if ((e.key === 'k' && e.metaKey) || (e.key === 'k' && e.ctrlKey)) { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });

  input?.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const hits = index.filter(item =>
      item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!hits.length) {
      results.innerHTML = '<div class="search-result-item"><span class="activity-text" style="color:var(--text-muted)">No results found</span></div>';
      return;
    }

    results.innerHTML = hits.map(h => `
      <div class="search-result-item" data-href="${esc(h.href)}">
        <span class="res-type">${esc(h.type)}</span>
        <div>
          <div style="font-size:0.875rem;color:var(--text-primary)">${esc(h.title)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${esc(h.sub)}</div>
        </div>
      </div>`).join('');

    $$('.search-result-item[data-href]').forEach(item => {
      item.addEventListener('click', () => {
        close();
        const href = item.dataset.href;
        if (href && href !== '#') {
          const target = $(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });
}

// ── Intersection Observer ────────────────────────────────────
function initReveal() {
  const opts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, opts);

  $$('.reveal').forEach(el => revealObs.observe(el));

  // Skills
  const skillsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateSkills();
      skillsObs.disconnect();
    }
  }, { threshold: 0.3 });

  const skillsSection = $('#about');
  if (skillsSection) skillsObs.observe(skillsSection);

  // Timeline
  const timelineObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  $$('.timeline-item').forEach(el => timelineObs.observe(el));
}

// ── Hero Stats ───────────────────────────────────────────────
function animateCounter(el, to, duration = 1800) {
  const start = performance.now();
  const from = 0;
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * ease) + (el.dataset.suffix || '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('[data-count]', e.target.closest('section') || document).forEach(el => {
          animateCounter(el, parseInt(el.dataset.count));
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  $$('.stat-card').forEach(el => obs.observe(el));
}

// ── Main ─────────────────────────────────────────────────────
async function init() {
  initTheme();
  await loadData();

  renderSkills();
  renderAboutTags();
  renderProjects();
  renderDevices();
  renderTechStack();
  renderTimeline();
  renderBlog();

  initNavbar();
  initCanvas();
  initTerminal();
  initSearch();
  initReveal();
  initCounters();
  loadGitHub();

  // Event listeners
  $('#btn-theme')?.addEventListener('click', toggleTheme);
  $('#btn-search')?.addEventListener('click', () => {});

  hideLoader();
}

document.addEventListener('DOMContentLoaded', init);
