  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ── Navigation ── */
  const paths = {};

  function navigate(page, linkEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    target.classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const nav = linkEl || document.querySelector('[data-page="' + page + '"]');
    if (nav) nav.classList.add('active');
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', e => e.preventDefault())
  );

  /* ── Ink diffusion name ── */
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

  /* ── Meteor / shooting-star canvas ── */
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

    // Static star field
    const STAR_COUNT = 160;
    const stars = Array.from({length: STAR_COUNT}, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.1 + 0.2,
      o: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // Meteors
    class Meteor {
      constructor() { this.reset(true); }
      reset(initial = false) {
        // start off-screen top-right area
        this.x     = Math.random() * W * 1.4;
        this.y     = initial ? Math.random() * H * 0.5 - H * 0.2 : -20;
        this.len   = Math.random() * 120 + 60;
        this.speed = Math.random() * 3.5 + 1.8;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15; // ~45°
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
        // fade in quickly, fade out slowly
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
        // bright head dot
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

    // Seed a couple at start
    meteors.push(new Meteor());
    meteors.push(new Meteor());

    function tick() {
      ctx.clearRect(0, 0, W, H);

      // Draw static stars
      const t = performance.now() / 1000;
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 6 + s.twinklePhase);
        ctx.beginPath();
        ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,220,${s.o * twinkle})`;
        ctx.fill();
      }

      // Spawn occasionally
      frame++;
      if (frame % 90 === 0 || (frame % 30 === 0 && Math.random() < 0.25)) spawnMeteor();

      // Update + draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();
        if (meteors[i].dead) {
          meteors.splice(i, 1);
          // immediately respawn to keep a baseline
          if (Math.random() < 0.7) meteors.push(new Meteor());
        }
      }

      requestAnimationFrame(tick);
    }
    tick();
  })();
  const lbar = document.getElementById('lbar');
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