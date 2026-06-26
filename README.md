# Viaan Thakur — Personal Portfolio

A premium, static personal portfolio website for **Viaan Thakur**, Android Custom ROM Developer and Kernel Maintainer.

---

## ✨ Features

- **Fully static** — no backend required
- **GitHub Pages compatible**
- **PWA support** — installable as an app
- **Dark / Light mode** with persistence
- **Live GitHub API integration** — repos, stats, activity feed
- **Animated canvas hero** — circuit-board particle effect
- **Typing terminal** — showcases build commands
- **Interactive search** — Ctrl+K search across all content
- **Smooth scroll reveal animations**
- **Fully responsive** — mobile to 4K
- **SEO optimized** — Open Graph, Twitter Card, meta tags
- **Accessible** — keyboard navigation, ARIA labels, reduced motion support

---

## 📁 Project Structure

```
viaan-portfolio/
├── index.html          # Main HTML (single page)
├── manifest.json       # PWA manifest
├── css/
│   └── style.css       # Design system & all styles
├── js/
│   └── main.js         # All JavaScript (rendering, APIs, animations)
├── data/
│   └── site.json       # Site content (projects, devices, skills, timeline)
└── blog/               # (Optional) markdown blog posts
```

---

## 🚀 Deployment — GitHub Pages

### Method 1: Direct Upload

1. Go to your GitHub profile → **New repository**
2. Name it: `ViaanLarryROMS.github.io`
3. Upload all files from this folder
4. Go to **Settings → Pages → Source: main branch / root**
5. Your site will be live at: `https://ViaanLarryROMS.github.io`

### Method 2: Git Deploy

```bash
# Initialize repo
git init
git add .
git commit -m "feat: initial portfolio release"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/ViaanLarryROMS/ViaanLarryROMS.github.io.git

# Push
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository Settings.

### Method 3: Custom Domain

1. Add a `CNAME` file with your domain: `echo "viaan.dev" > CNAME`
2. Configure your domain's DNS:
   - A record → `185.199.108.153` (GitHub Pages IP)
   - CNAME `www` → `viaanlarryROMS.github.io`
3. Enable HTTPS in GitHub Pages settings

---

## ✏️ Customization

### Update Content
Edit `data/site.json` to modify:
- Projects, devices, skills, timeline events

### Add Blog Posts
Create a JSON file under `data/blog/` and update `BLOG_POSTS` array in `js/main.js`.

### Change Colors
Edit CSS custom properties in `css/style.css` under `:root { }`:
```css
--cyan:   #00D4FF;   /* Primary accent */
--violet: #7C3AED;   /* Secondary accent */
--bg:     #0A0E1A;   /* Background */
```

### Update GitHub Username
In `data/site.json`, change:
```json
"github": "YourGitHubUsername"
```

---

## 🛠️ Local Development

Since the site is fully static with no build step:

```bash
# Option 1: Python (built-in)
cd viaan-portfolio
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: Node.js
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> **Note:** Running `index.html` directly as a file:// URL may block some fetch requests. Always use a local server.

---

## 🌐 Technologies Used

- Vanilla HTML5, CSS3, JavaScript (ES2022+)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — Display font
- [Inter](https://fonts.google.com/specimen/Inter) — Body font
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Code/terminal font
- GitHub REST API v3 — Live repository data
- Canvas 2D API — Particle animation
- IntersectionObserver API — Scroll reveals

---

## 📄 License

MIT License — feel free to adapt for your own portfolio.

---

Made with ❤️ for the open-source Android community.
