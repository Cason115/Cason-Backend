const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');

app.use(compression({
    level: 5,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode}`);
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, headers: true }));

app.all('/player/login/dashboard', function (req, res) {
    const tData = {};
    try {
        const uData = JSON.stringify(req.body).split('"')[1].split('\\n'); const uName = uData[0].split('|'); const uPass = uData[1].split('|');
        for (let i = 0; i < uData.length - 1; i++) { const d = uData[i].split('|'); tData[d[0]] = d[1]; }
        if (uName[1] && uPass[1]) { res.redirect('/player/growid/login/validate'); }
    } catch (why) { console.log(`Warning: ${why}`); }

    res.render(__dirname + '/public/html/dashboard.ejs', { data: tData });
});

app.all('/player/growid/login/validate', (req, res) => {
    const _token = req.body._token;
    const growId = req.body.growId;
    const password = req.body.password;

    const token = Buffer.from(
        `_token=${_token}&growId=${growId}&password=${password}`,
    ).toString('base64');

    res.send(
        `{"status":"success","message":"Account Validated.","token":"${token}","url":"","accountType":"growtopia"}`,
    );
});

app.all('/player/*', function (req, res) {
    res.status(301).redirect('https://cason-fomo.vercel.app/player/' + req.path.slice(8));
});

app.get('/', function (req, res) {
    <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Chromatic Store</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossorigin="anonymous" />
  <style>
    :root {
      --bg: #0f172a;
      --text: #1e3a8a;
      --box-bg: #ffffff;
      --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    [data-theme="light"] {
      --bg: #ffffff;
      --text: #1e3a8a;
      --box-bg: #f1f5f9;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      transition: background 0.3s, color 0.3s;
      overflow-x: hidden;
    }

    .stars {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    nav {
      background: var(--text);
      color: white;
      padding: 15px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
      position: relative;
    }

    .brand {
      font-weight: 700;
      font-size: 1.3em;
    }

    .nav-actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .menu-toggle {
      font-size: 1.4em;
      cursor: pointer;
      display: none;
    }

    .theme-toggle {
      background: none;
      border: none;
      color: white;
      font-size: 1.2em;
      cursor: pointer;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      background: var(--text);
      position: absolute;
      top: 60px;
      right: 20px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .nav-links a {
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      display: block;
      transition: background 0.3s;
    }

    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .section {
      display: none;
      padding: 30px 20px;
      position: relative;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.6s ease;
    }

    .active {
      display: block;
      opacity: 1;
    }

    .home-container {
      min-height: calc(100vh - 80px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .home-content, .product-box, .about-box, .contact-box {
      background: var(--box-bg);
      border-radius: 20px;
      box-shadow: var(--box-shadow);
      max-width: 600px;
      padding: 40px 30px;
      margin: auto;
      position: relative;
      color: var(--text);
      border: 5px solid transparent;
      background-clip: padding-box;
    }

    .home-content::before,
    .product-box::before,
    .about-box::before,
    .contact-box::before {
      content: "";
      position: absolute;
      top: -5px; left: -5px; right: -5px; bottom: -5px;
      z-index: -1;
      border-radius: 25px;
      background: linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet);
    }

    .home-buttons {
      margin-top: 30px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .home-buttons button {
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      background-color: var(--text);
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .home-buttons button:hover {
      background-color: #2563eb;
    }

    footer {
      background: var(--text);
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 0.9em;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }
    }
  </style>
</head>
<body data-theme="dark">
  <div class="stars"><canvas id="starCanvas"></canvas></div>

  <nav>
    <div class="brand">CHROMATIC</div>
    <div class="nav-actions">
      <button class="theme-toggle" onclick="toggleTheme()" title="Toggle Theme">
        <i class="fa-solid fa-moon" id="themeIcon"></i>
      </button>
      <i class="fa-solid fa-bars menu-toggle" onclick="toggleMenu()"></i>
      <div class="nav-links" id="navLinks">
        <a onclick="showPage('home')">Beranda</a>
        <a onclick="showPage('product')">Produk</a>
        <a onclick="showPage('about')">Tentang Kami</a>
        <a onclick="showPage('contact')">Kontak</a>
      </div>
    </div>
  </nav>

  <div class="section home-section active" id="home">
    <div class="home-container">
      <div class="home-content">
        <h1>Selamat Datang di Chromatic Store!</h1>
        <p>Toko terpercaya dengan produk digital berkualitas dan pelayanan terbaik.</p>
        <div class="home-buttons">
          <button onclick="showPage('product')">Lihat Produk</button>
          <button onclick="showPage('about')">Tentang Kami</button>
          <button onclick="showPage('contact')">Kontak</button>
        </div>
      </div>
    </div>
  </div>

  <div class="section" id="product">
    <div class="product-box">
      <h2>Produk</h2>
      <p>Ini adalah halaman produk.</p>
    </div>
  </div>

  <div class="section" id="about">
    <div class="about-box">
      <h2>Tentang Kami</h2>
      <p>Informasi mengenai tim dan visi misi toko kami.</p>
    </div>
  </div>

  <div class="section" id="contact">
    <div class="contact-box">
      <h2>Kontak</h2>
      <p>Hubungi kami melalui email atau sosial media.</p>
    </div>
  </div>

  <footer>
    &copy; 2025 Chromatic Store. All rights reserved.
  </footer>

  <script>
    // Navbar
    function toggleMenu() {
      const nav = document.getElementById('navLinks');
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    }

    function toggleTheme() {
      const body = document.body;
      const icon = document.getElementById('themeIcon');
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      icon.classList.toggle('fa-moon', !isDark);
      icon.classList.toggle('fa-sun', isDark);
    }

    // Page transition with fade
    function showPage(id) {
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });

      const target = document.getElementById(id);
      target.style.display = 'block';
      setTimeout(() => target.classList.add('active'), 10);

      document.getElementById('navLinks').style.display = 'none';
    }

    // Stars
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random()
      });
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
    }

    function updateStars() {
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
    }

    function animate() {
      drawStars();
      updateStars();
      requestAnimationFrame(animate);
    }

    animate();
  </script>
</body>
</html>
});

app.listen(5000, function () {
    console.log('Listening on port 5000');
});
