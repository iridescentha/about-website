document.getElementById('yr').textContent = new Date().getFullYear();


function updateNavIndicator(linkEl) {
  const indicator = document.getElementById('nav-indicator');
  const list = document.getElementById('nav-links');
  if (!indicator || !list || !linkEl) return;
  const linkRect = linkEl.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();
  indicator.style.opacity = '1';
  indicator.style.width = linkRect.width + 'px';
  indicator.style.transform = `translateX(${linkRect.left - listRect.left}px)`;
}

function navigate(page, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const nav = linkEl || document.querySelector('[data-page="' + page + '"]');
  if (nav) { nav.classList.add('active'); updateNavIndicator(nav); }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById('nav-links').classList.remove('open');
  const hb = document.getElementById('hamburger');
  if (hb) hb.classList.remove('open');
}

updateNavIndicator(document.querySelector('.nav-links a.active'));
window.addEventListener('load',   () => updateNavIndicator(document.querySelector('.nav-links a.active')));
window.addEventListener('resize', () => updateNavIndicator(document.querySelector('.nav-links a.active')));

(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


  const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    document.getElementById('nav-links').classList.toggle('open');
  });
}

  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', e => e.preventDefault())
  );


  const nameWrap = document.getElementById('name-wrap');
  const letters = [
    { t: '>>', br: true  },
    { t: 'h', br: false  },
    { t: 'u', br: false  },
    { t: 'g', br: false  },
    { t: 'o', br: false  },
    { t: 'a', br: false  },
    { t: 'f', br: false  },
    { t: 'i', br: false  },
    { t: 'z', br: false  },
    { t: 'a', br: false  },
    { t: 'a', br: false  },
  ];
  letters.forEach((l, i) => {
    const s = document.createElement('span');
    s.className = 'ink-char' + (l.br ? ' br' : '');
    s.style.setProperty('--d', (i * 75) + 'ms');
    s.textContent = l.t;
    nameWrap.appendChild(s);
  });


  (function() {
    const canvas = document.getElementById('meteor-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });
    resize();

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX / window.innerWidth  - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
    });


    const STAR_COUNT = 160;
    const PARALLAX_STRENGTH = 18;
    const stars = Array.from({length: STAR_COUNT}, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.1 + 0.2,
      o: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const NEBULA_BLOBS = [
      { xR: 0.14, yR: 0.14, r: 420, color: '150,120,220', alpha: 0.095, driftSeed: 0 },
      { xR: 0.30, yR: 0.24, r: 360, color: '100,195,205', alpha: 0.085, driftSeed: 2 },
      { xR: 0.09, yR: 0.32, r: 340, color: '215,130,165', alpha: 0.075, driftSeed: 4 },
      { xR: 0.24, yR: 0.42, r: 300, color: '210,180,120', alpha: 0.06,  driftSeed: 6 },
    ];
    function drawNebula(t) {
      for (const b of NEBULA_BLOBS) {
        const dx = Math.sin(t * 0.02 + b.driftSeed) * 16;
        const dy = Math.cos(t * 0.015 + b.driftSeed) * 10;
        const x = W * b.xR + dx, y = H * b.yR + dy;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        grad.addColorStop(0, `rgba(${b.color},${b.alpha})`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }


    class Meteor {
      constructor() { this.reset(true); }
      reset(initial = false) {

        this.x     = Math.random() * W * 1.4;
        this.y     = initial ? Math.random() * H * 0.5 - H * 0.2 : -20;
        this.len   = Math.random() * 120 + 60;
        this.speed = Math.random() * 3.5 + 1.8;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15; 
        this.vx    = Math.cos(this.angle) * this.speed;
        this.vy    = Math.sin(this.angle) * this.speed;
        this.alpha = 0;
        this.life  = 0;
        this.maxLife = Math.random() * 90 + 60;
        this.width = Math.random() * 1.2 + 0.4;
        this.dead  = false;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        if (this.life < 15) this.alpha = this.life / 15;
        else if (this.life > this.maxLife - 20) this.alpha = Math.max(0, (this.maxLife - this.life) / 20);
        else this.alpha = 1;
        if (this.life >= this.maxLife || this.x > W + 50 || this.y > H + 50) this.dead = true;
      }
      draw() {
        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, `rgba(74,222,128,0)`);
        grad.addColorStop(0.6, `rgba(74,222,128,${this.alpha * 0.25})`);
        grad.addColorStop(1, `rgba(200,255,230,${this.alpha * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = this.width;
        ctx.lineCap     = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,255,240,${this.alpha * 0.9})`;
        ctx.fill();
      }
    }

    class SpecialMeteor {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * W * 1.4;
        this.y     = -30;
        this.len   = Math.random() * 180 + 120;
        this.speed = Math.random() * 2.5 + 5.5;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15;
        this.alpha = 0;
        this.life  = 0;
        this.maxLife = Math.random() * 80 + 50;
        this.width = Math.random() * 2.5 + 2.2;
        this.dead  = false;
        this.glowPhase = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.35 + 0.25);

        this.isRare = Math.random() < 0.12;
        if (this.isRare) {
          this.width *= 1.8;
          this.len   *= 1.3;
          this.speed *= 0.85;
          this.maxLife *= 1.3;
        }
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        const rayCount = this.isRare ? Math.floor(Math.random() * 3) + 6 : Math.floor(Math.random() * 4) + 4;
        this.rays = Array.from({length: rayCount}, (_, i) => ({
          baseAngle: (Math.PI * 2 * i) / rayCount + (Math.random() - 0.5) * 0.6,
          lenMul:  Math.random() * 0.6 + 0.7,
          speedMul: Math.random() * 0.8 + 0.6,
          phaseOffset: Math.random() * Math.PI * 2,
        }));

        this.embers = [];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.glowPhase += 0.08;

        if (this.life < 15) this.alpha = this.life / 15;
        else if (this.life > this.maxLife - 20) this.alpha = Math.max(0, (this.maxLife - this.life) / 20);
        else this.alpha = 1;
        if (this.life >= this.maxLife || this.x > W + 50 || this.y > H + 50) this.dead = true;

        if (!this.dead && this.embers.length < 40 && Math.random() < 0.55) {
          const back = Math.random() * this.len * 0.4;
          this.embers.push({
            x: this.x - Math.cos(this.angle) * back,
            y: this.y - Math.sin(this.angle) * back,
            vx: (Math.random() - 0.5) * 0.7 - this.vx * 0.04,
            vy: (Math.random() - 0.5) * 0.7 - this.vy * 0.04,
            r: Math.random() * 1.4 + 0.4,
            life: 0,
            maxLife: Math.random() * 40 + 25,
          });
        }
        for (let i = this.embers.length - 1; i >= 0; i--) {
          const e = this.embers[i];
          e.x += e.vx; e.y += e.vy; e.vy += 0.012; e.life++;
          if (e.life >= e.maxLife) this.embers.splice(i, 1);
        }
      }
      draw() {
        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, `rgba(100,200,150,0)`);
        grad.addColorStop(0.5, `rgba(150,220,180,${this.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(200,255,200,${this.alpha})`);
        
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = this.width;
        ctx.lineCap     = 'round';
        ctx.stroke();

        const glowR = Math.sin(this.glowPhase) * 0.3 + 0.6;
        const rgbShift = Math.sin(this.glowPhase * 0.5);
        
        const glowIntensity = this.alpha * 0.4;
        const r1 = Math.round(100 + 80 * glowR + 30 * rgbShift);
        const g1 = Math.round(220 + 20 * rgbShift);
        const b1 = Math.round(150 + 50 * glowR - 20 * rgbShift);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r1},${g1},${b1},${glowIntensity * 0.3})`;
        ctx.fill();

        const r2 = Math.round(180 + 60 * glowR + 40 * rgbShift);
        const g2 = Math.round(255 + 10 * rgbShift);
        const b2 = Math.round(200 + 40 * glowR - 30 * rgbShift);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r2},${g2},${b2},${this.alpha * 0.8})`;
        ctx.fill();

        const r3 = Math.round(220 + 30 * rgbShift);
        const g3 = 255;
        const b3 = Math.round(240 - 20 * rgbShift);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r3},${g3},${b3},${this.alpha})`;
        ctx.fill();

        const r4 = Math.round(255 + 20 * rgbShift);
        const g4 = Math.round(255 - 10 * rgbShift);
        const b4 = Math.round(220 - 30 * rgbShift);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r4},${g4},${b4},${this.alpha * 0.9})`;
        ctx.fill();

        if (this.isRare) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.width * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,255,210,${glowIntensity * 0.18})`;
          ctx.fill();
        }

        this.drawAstigmatismBurst();
        this.drawEmbers();
      }

      drawAstigmatismBurst() {
        const rayWidth = this.width * 0.3;

        for (const ray of this.rays) {
          const rotatedAngle = ray.baseAngle + this.glowPhase * this.rotationSpeed * ray.speedMul;
          const pulse = 0.8 + 0.2 * Math.sin(this.glowPhase * 1.6 + ray.phaseOffset);
          const rayLength = this.width * 30 * ray.lenMul * pulse;
          const rayAlpha = this.alpha * (0.65 + 0.35 * Math.sin(this.glowPhase + ray.phaseOffset));

          const endX = this.x + Math.cos(rotatedAngle) * rayLength;
          const endY = this.y + Math.sin(rotatedAngle) * rayLength;

          const rayGrad = ctx.createLinearGradient(this.x, this.y, endX, endY);
          rayGrad.addColorStop(0, `rgba(200,255,200,${rayAlpha * 0.8})`);
          rayGrad.addColorStop(0.4, `rgba(180,255,200,${rayAlpha * 0.5})`);
          rayGrad.addColorStop(1, `rgba(150,255,180,0)`);

          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = rayWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      drawEmbers() {
        for (const e of this.embers) {
          const a = this.alpha * Math.max(0, 1 - e.life / e.maxLife);
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(190,255,210,${a * 0.85})`;
          ctx.fill();
        }
      }
    }

    const meteors = [];
    let   frame   = 0;
    let   specialMeteorFrame = 0;
    const SPECIAL_METEOR_INTERVAL = 100;

    function spawnMeteor() {
      if (meteors.length < 6) meteors.push(new Meteor());
    }

    function spawnSpecialMeteor() {
      meteors.push(new SpecialMeteor());
    }


    meteors.push(new Meteor());
    meteors.push(new Meteor());

    function tick() {
      ctx.clearRect(0, 0, W, H);


      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const t = performance.now() / 1000;
      drawNebula(t);
      ctx.fillStyle = 'rgb(200,230,220)';
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 6 + s.twinklePhase);
        const px = mouseX * s.r * PARALLAX_STRENGTH;
        const py = mouseY * s.r * PARALLAX_STRENGTH;
        ctx.globalAlpha = s.o * twinkle;
        ctx.beginPath();
        ctx.arc((s.x % W) + px, (s.y % H) + py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;


      frame++;
      specialMeteorFrame++;
      
      if (frame % 90 === 0 || (frame % 30 === 0 && Math.random() < 0.25)) spawnMeteor();
      
      if (specialMeteorFrame >= SPECIAL_METEOR_INTERVAL) {
        specialMeteorFrame = 0;
        const randomDelay = Math.random() * 120;
        if (randomDelay < 30) spawnSpecialMeteor();
      }


      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();
        if (meteors[i].dead) {
          meteors.splice(i, 1);

          if (Math.random() < 0.7) meteors.push(new Meteor());
        }
      }

      if (!REDUCED_MOTION) requestAnimationFrame(tick);
    }
    tick();
  })();
const lbar = document.getElementById('lbar');
if (lbar) {
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'lb';
    const lo = (Math.random() * 4 + 3).toFixed(1);
    const hi = (Math.random() * 9 + 8).toFixed(1);
    const d  = (Math.random() * 0.5 + 0.3).toFixed(2);
    const dl = (Math.random() * 0.4).toFixed(2);
    b.style.cssText = `--lo:${lo}px;--hi:${hi}px;--d:${d}s;--dl:${dl}s;height:${lo}px;`;
    lbar.appendChild(b);
  }
}

(function () {
  const cv = document.getElementById('music-wave');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, frame = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = cv.parentElement.getBoundingClientRect();
    W = cv.width  = rect.width  || 800;
    H = cv.height = rect.height || 220;
  }
  resize();
  new ResizeObserver(resize).observe(cv.parentElement);

  const LINES = 5;
  function drawWave() {
    ctx.clearRect(0, 0, W, H);
    const t = frame / 80;
    for (let l = 0; l < LINES; l++) {
      const amp   = 18 + l * 9;
      const freq  = 0.008 + l * 0.003;
      const phase = l * 1.1;
      const yBase = H * (.25 + l * .13);
      const alpha = 0.06 - l * 0.008;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = yBase + Math.sin(x * freq + t + phase) * amp
                        + Math.sin(x * freq * 1.7 + t * 1.3 + phase) * (amp * .4);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(74,222,128,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    frame++;
    if (!reducedMotion) requestAnimationFrame(drawWave);
  }
  drawWave();
})();

function initConstellation(canvasId, rgb, dotCount) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dots = [];

  function resize() {
    const rect = cv.getBoundingClientRect();
    W = cv.width  = rect.width  || 400;
    H = cv.height = rect.height || 260;
    dots = Array.from({ length: dotCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.2 + .5,
    }));
  }
  resize();
  new ResizeObserver(resize).observe(cv);

  const CONNECT_DIST = 90;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    }

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.45;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${rgb},${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},0.8)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},0.08)`;
      ctx.fill();
    }

    if (!reducedMotion) requestAnimationFrame(draw);
  }
  draw();
}
initConstellation('constellation-canvas', '103,232,249', 18);

const LFM_KEY  = 'f4ee87a255993557ff82b1e27e0a9a73';
const LFM_USER = 'Duragov';
const LFM_URL  = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFM_USER}&api_key=${LFM_KEY}&limit=5&format=json`;

function timeAgo(unixTs) {
  const diff = Math.floor(Date.now() / 1000) - parseInt(unixTs);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400)return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function makeBars() {
  const wrap = document.createElement('div');
  wrap.className = 'lfm-bars';
  const speeds = ['.35s', '.5s', '.4s'];
  const delays = ['0s', '.15s', '.08s'];
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('span');
    s.style.setProperty('--bd', speeds[i]);
    s.style.setProperty('--bdl', delays[i]);
    s.style.height = '5px';
    wrap.appendChild(s);
  }
  return wrap;
}

async function loadLastFm() {
  const panel = document.getElementById('lfm-panel');
  if (!panel) return;

  try {
    const res  = await fetch(LFM_URL);
    const data = await res.json();
    const tracks = data.recenttracks?.track;
    if (!tracks || !tracks.length) throw new Error('no tracks');

    const header = panel.querySelector('.lfm-header');
    panel.innerHTML = '';
    panel.appendChild(header);

    tracks.slice(0, 5).forEach((t, idx) => {
      const isNow = t['@attr']?.nowplaying === 'true';
      const row   = document.createElement('a');
      row.className = 'lfm-track' + (isNow ? ' now' : '');
      row.href = `https://www.last.fm/user/${LFM_USER}`;
      row.target = '_blank';
      row.rel = 'noopener';
      row.style.textDecoration = 'none';

      const imgSrc = t.image?.find(i => i.size === 'small')?.['#text'];
      if (imgSrc && imgSrc.trim() !== '') {
        const img = document.createElement('img');
        img.className = 'lfm-img';
        img.src = imgSrc;
        img.alt = '';
        img.onerror = () => { img.replaceWith(ph()); };
        row.appendChild(img);
      } else {
        row.appendChild(ph());
      }

      const body = document.createElement('div');
      body.className = 'lfm-body';
      body.innerHTML = `
        <div class="lfm-name">${t.name}</div>
        <div class="lfm-artist">${t.artist?.['#text'] || t.artist?.name || ''}</div>
      `;
      row.appendChild(body);

      const right = document.createElement('div');
      right.className = 'lfm-right';
      if (isNow) {
        right.appendChild(makeBars());
      } else {
        const ts = t.date?.uts;
        const time = document.createElement('span');
        time.className = 'lfm-time';
        time.textContent = ts ? timeAgo(ts) : '';
        right.appendChild(time);
      }
      row.appendChild(right);

      panel.appendChild(row);
    });

  } catch (e) {
    const panel = document.getElementById('lfm-panel');
    if (panel) {
      const err = document.createElement('div');
      err.className = 'lfm-err';
      err.textContent = 'could not load tracks';
      panel.appendChild(err);
    }
  }
}

function ph() {
  const d = document.createElement('div');
  d.className = 'lfm-img-ph';
  d.textContent = '♪';
  return d;
}

loadLastFm();
setInterval(loadLastFm, 45000);