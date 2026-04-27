document.getElementById('yr').textContent = new Date().getFullYear();


function navigate(page, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const nav = linkEl || document.querySelector('[data-page="' + page + '"]');
  if (nav) nav.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById('nav-links').classList.remove('open');
  const hb = document.getElementById('hamburger');
  if (hb) hb.classList.remove('open');
}


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
    // { t: 'h', br: false },
    // { t: 'u', br: false },
    // { t: 'g', br: false },
    // { t: 'o', br: false },
    // { t: '\u00a0', br: false },
    // { t: '/', br: false },
    // { t: '\u00a0', br: false },
    { t: 'i', br: false  },
    { t: 'r', br: false  },
    { t: 'i', br: false  },
    { t: 'd', br: false  },
    { t: 'e', br: false  },
    { t: 's', br: false  },
    { t: 'c', br: false  },
    { t: 'e', br: false  },
    { t: 'n', br: false  },
    { t: 't', br: false  },
    { t: 'h', br: false  },
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
    window.addEventListener('resize', resize);
    resize();


    const STAR_COUNT = 160;
    const stars = Array.from({length: STAR_COUNT}, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.1 + 0.2,
      o: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));


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

    const meteors = [];
    let   frame   = 0;

    function spawnMeteor() {
      if (meteors.length < 6) meteors.push(new Meteor());
    }


    meteors.push(new Meteor());
    meteors.push(new Meteor());

    function tick() {
      ctx.clearRect(0, 0, W, H);


      const t = performance.now() / 1000;
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 6 + s.twinklePhase);
        ctx.beginPath();
        ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,220,${s.o * twinkle})`;
        ctx.fill();
      }


      frame++;
      if (frame % 90 === 0 || (frame % 30 === 0 && Math.random() < 0.25)) spawnMeteor();


      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();
        if (meteors[i].dead) {
          meteors.splice(i, 1);

          if (Math.random() < 0.7) meteors.push(new Meteor());
        }
      }

      requestAnimationFrame(tick);
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
    requestAnimationFrame(drawWave);
  }
  drawWave();
})();

(function () {
  const cv = document.getElementById('constellation-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H;

  const DOTS = 18;
  let dots = [];

  function resize() {
    const rect = cv.parentElement.getBoundingClientRect();
    W = cv.width  = rect.width  || 400;
    H = cv.height = rect.height || 260;
    dots = Array.from({ length: DOTS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.2 + .5,
    }));
  }
  resize();
  new ResizeObserver(resize).observe(cv.parentElement);

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
          ctx.strokeStyle = `rgba(103,232,249,${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(103,232,249,0.8)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(103,232,249,0.08)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

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
// refresh every 45 seconds
setInterval(loadLastFm, 45000);