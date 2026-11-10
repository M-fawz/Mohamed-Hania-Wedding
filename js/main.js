/* Mohamed & Hania — invitation logic */
(() => {
  'use strict';

  const CONFIG = {
    // Friday 27 November 2026, 7:00 PM Cairo (UTC+2)
    eventStart: '2026-11-27T19:00:00+02:00',
    // Drop an MP3 at this path to use it instead of YouTube (most reliable on iPhone).
    musicFile: 'assets/music/zaffa.mp3',
    // "زفة موسيقى طلت عروس" — tried in order if one can't be embedded.
    youtubeIds: ['AFaev9au7WU', '2Q45MeFNt68', 'kgovfO1AtFE'],
    googleCal: 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent('Wedding of Mohamed & Hania') +
      '&dates=20261127T170000Z/20261127T210000Z' +
      '&location=' + encodeURIComponent('Sofitel Cairo Downtown Nile, Corniche El Nil, Downtown, Cairo') +
      '&details=' + encodeURIComponent('The Nile Ballroom — we begin at 7:00 PM. بحضوركم تكتمل فرحتنا'),
    icsFile: 'assets/mohamed-hania-wedding.ics'
  };

  const $ = (s, r = document) => r.querySelector(s);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------------- Gold dust (generative canvas) ---------------- */
  const Dust = (() => {
    const c = $('#dust');
    const ctx = c.getContext('2d');
    const golds = ['#C9A55E', '#E8D08F', '#F6E7B8', '#B8904A', '#DCC07C'];
    let W = 0, H = 0, motes = [], flakes = [], sparks = [];

    const mote = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.5 + Math.random() * 1.6,
      vy: -(0.06 + Math.random() * 0.22),
      ph: Math.random() * Math.PI * 2,
      f: 0.5 + Math.random() * 1.5,
      a: 0.25 + Math.random() * 0.5
    });

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(56, (W * H) / 24000));
      while (motes.length < n) motes.push(mote(true));
      motes.length = n;
    }

    function burst() {
      if (reduceMotion) return;
      const n = W < 640 ? 70 : 120;
      for (let i = 0; i < n; i++) {
        flakes.push({
          x: Math.random() * W,
          y: -20 - Math.random() * H * 0.5,
          w: 3 + Math.random() * 5,
          h: 6 + Math.random() * 9,
          vy: 1.1 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.8,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.12,
          tilt: Math.random() * Math.PI * 2,
          col: golds[(Math.random() * golds.length) | 0],
          life: 1
        });
      }
    }

    function spark(x, y, n, spread) {
      if (reduceMotion) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = Math.random() * spread;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.3, s: 1.5 + Math.random() * 2.5, life: 1, col: golds[(Math.random() * golds.length) | 0] });
      }
    }
    function star(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
    }
    let lastMove = 0;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const now = performance.now();
      if (now - lastMove > 45) { lastMove = now; spark(e.clientX, e.clientY, 1, 0.6); }
    }, { passive: true });
    addEventListener('pointerdown', (e) => spark(e.clientX, e.clientY, 10, 2.4), { passive: true });

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.vx *= 0.97; p.life -= 0.022;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = p.col; star(p.x, p.y, p.s * (0.6 + p.life * 0.6));
      }
      ctx.globalAlpha = 1;
      for (const m of motes) {
        m.y += m.vy;
        m.x += Math.sin(t * 0.0004 * m.f + m.ph) * 0.22;
        if (m.y < -10) Object.assign(m, mote(false));
        const a = m.a * (0.5 + 0.5 * Math.sin(t * 0.002 * m.f + m.ph));
        ctx.fillStyle = `rgba(214,182,110,${a * 0.18})`;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 3.2, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(226,196,124,${a})`;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      }
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];
        f.vy += 0.008; f.y += f.vy; f.x += f.vx + Math.sin(f.y * 0.02) * 0.6;
        f.rot += f.vr; f.tilt += 0.09;
        if (f.y > H * 0.65) f.life -= 0.014;
        if (f.life <= 0 || f.y > H + 20) { flakes.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, f.life);
        ctx.translate(f.x, f.y); ctx.rotate(f.rot); ctx.scale(1, Math.cos(f.tilt));
        ctx.fillStyle = f.col;
        ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }

    resize();
    addEventListener('resize', resize);
    if (!reduceMotion) requestAnimationFrame(frame);
    return { burst };
  })();

  /* ---------------- Music ---------------- */
  const Music = (() => {
    const btn = $('#musicBtn');
    let mode = null, audio = null, yt = null, ytReady = false, ytIdx = 0, want = false;

    const setPlaying = (on) => {
      btn.classList.toggle('playing', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    };

    function loadYouTube() {
      mode = 'yt';
      window.onYouTubeIframeAPIReady = () => {
        yt = new YT.Player('yt', {
          width: 200, height: 200,
          host: 'https://www.youtube.com',
          videoId: CONFIG.youtubeIds[ytIdx],
          playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0, enablejsapi: 1, origin: location.origin },
          events: {
            onReady: () => { ytReady = true; if (want) play(); },
            onStateChange: (e) => {
              if (e.data === 1) setPlaying(true);
              else if (e.data === 2) setPlaying(false);
              else if (e.data === 0) { yt.seekTo(0); yt.playVideo(); } // loop
            },
            onError: () => {
              ytIdx++;
              if (ytIdx < CONFIG.youtubeIds.length) {
                want ? yt.loadVideoById(CONFIG.youtubeIds[ytIdx]) : yt.cueVideoById(CONFIG.youtubeIds[ytIdx]);
              } else setPlaying(false);
            }
          }
        });
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }

    async function init() {
      try {
        if (location.protocol.startsWith('http')) {
          const r = await fetch(CONFIG.musicFile, { method: 'HEAD', cache: 'no-store' });
          const type = r.headers.get('content-type') || '';
          if (r.ok && /audio|mpeg|octet/.test(type)) {
            mode = 'file';
            audio = new Audio(CONFIG.musicFile);
            audio.loop = true; audio.preload = 'auto'; audio.volume = 0.8;
            audio.addEventListener('play', () => setPlaying(true));
            audio.addEventListener('pause', () => setPlaying(false));
            if (want) play();
            return;
          }
        }
      } catch (_) { /* fall back to YouTube */ }
      loadYouTube();
    }

    // gentle fade-in so the zaffa doesn't burst in
    let fadeTimer;
    function fadeIn(setVol, target) {
      clearInterval(fadeTimer);
      let v = 0; setVol(0);
      fadeTimer = setInterval(() => { v = Math.min(target, v + target / 20); setVol(v); if (v >= target) clearInterval(fadeTimer); }, 100);
    }
    function play() {
      want = true;
      if (mode === 'file') {
        fadeIn((v) => (audio.volume = v), 0.85);
        audio.play().catch(() => setPlaying(false));
      } else if (ytReady) {
        yt.unMute(); fadeIn((v) => yt.setVolume(v * 100), 0.8); yt.playVideo();
      }
    }
    function pause() {
      want = false;
      if (mode === 'file') audio.pause();
      else if (ytReady) yt.pauseVideo();
      setPlaying(false);
    }

    btn.addEventListener('click', () => (btn.classList.contains('playing') ? pause() : play()));
    init();
    return { play, show: () => btn.classList.add('show') };
  })();

  /* ---------------- Envelope gate ---------------- */
  const gate = $('#gate');
  const openBtn = $('#openBtn');
  function openInvite() {
    Music.play();
    gate.classList.add('is-opening');
    const T = reduceMotion ? [0, 0, 0, 200] : [800, 950, 1350, 2700];
    setTimeout(() => gate.classList.add('flap-behind'), T[0]);
    setTimeout(() => gate.classList.add('letter-up'), T[1]);
    setTimeout(() => Dust.burst(), T[2]);
    setTimeout(() => {
      gate.classList.add('is-gone');
      document.body.classList.remove('is-locked');
      document.body.classList.add('revealed');
      Music.show();
      setTimeout(() => gate.remove(), 1400);
    }, T[3]);
  }
  openBtn.addEventListener('click', openInvite, { once: true });

  /* ---------------- Gate mandala (generative) ---------------- */
  const mandala = $('#mandala');
  if (mandala) {
    const P = (deg, r) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];
    let s = '<g fill="none" stroke="currentColor" stroke-width="1">';
    s += '<g class="r1">';
    for (let i = 0; i < 24; i++) { const a = i * 15; const [x1, y1] = P(a, 110); const [x2, y2] = P(a, 170);
      const [c1x, c1y] = P(a - 7, 145); const [c2x, c2y] = P(a + 7, 145);
      s += `<path d="M${x1} ${y1} Q${c1x} ${c1y} ${x2} ${y2} Q${c2x} ${c2y} ${x1} ${y1}Z"/>`; }
    s += '<circle r="104"/><circle r="176"/></g><g class="r2">';
    for (let i = 0; i < 16; i++) { const a = i * 22.5; const [x, y] = P(a, 215); s += `<circle cx="${x}" cy="${y}" r="22"/>`; }
    s += '<circle r="238" stroke-dasharray="2 6"/></g><g class="r3">';
    for (let i = 0; i < 48; i++) { const [x, y] = P(i * 7.5, 268); s += `<circle cx="${x}" cy="${y}" r="2" fill="currentColor"/>`; }
    s += '<circle r="286"/></g>';
    s += '<rect x="-62" y="-62" width="124" height="124"/><rect x="-62" y="-62" width="124" height="124" transform="rotate(45)"/><circle r="40"/></g>';
    mandala.innerHTML = s;
  }

  /* ---------------- Scroll progress + parallax ---------------- */
  const prog = $('#progress');
  const mono = $('.hero-monogram');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      if (!reduceMotion && scrollY < innerHeight * 1.2) mono.style.translate = `0 ${scrollY * 0.25}px`;
      ticking = false;
    });
  }, { passive: true });

  /* ---------------- Arch leaves (couple illustration) ---------------- */
  const leaves = $('#leaves');
  if (leaves) {
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 150, cy = 170, R = 110, steps = 22;
    for (let i = 0; i <= steps; i++) {
      const th = Math.PI * (1.04 + (0.92 * i) / steps);
      if (Math.abs(th - 1.5 * Math.PI) < 0.07) continue; // keep the crown clear
      const side = i % 2 ? 1 : -1;
      const off = 6 * side;
      const x = cx + (R + off) * Math.cos(th);
      const y = cy + (R + off) * Math.sin(th);
      const deg = (th * 180) / Math.PI + 90 + side * 35;
      const e = document.createElementNS(NS, 'ellipse');
      e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1));
      e.setAttribute('rx', '6'); e.setAttribute('ry', '2.4');
      e.setAttribute('transform', `rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`);
      if (i % 3 === 0) e.setAttribute('fill', '#A9B7A6');
      e.style.animationDelay = (1 + i * 0.06).toFixed(2) + 's';
      leaves.appendChild(e);
    }
  }

  /* ---------------- Scroll reveal ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const sibs = [...el.parentElement.querySelectorAll(':scope > [data-reveal]')];
    el.style.transitionDelay = (sibs.indexOf(el) * 0.12).toFixed(2) + 's';
    io.observe(el);
  });

  /* ---------------- Countdown ---------------- */
  const target = Date.parse(CONFIG.eventStart);
  const nums = {};
  document.querySelectorAll('.cd-num').forEach((n) => (nums[n.dataset.unit] = n));
  const last = {};
  const doneEl = $('#cdDone');
  function setNum(u, v) {
    if (last[u] === v) return;
    last[u] = v;
    const el = nums[u];
    el.textContent = v;
    if (!reduceMotion) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
  }
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['d', 'h', 'm', 's'].forEach((u) => setNum(u, '00'));
      doneEl.hidden = false;
      doneEl.innerHTML = diff > -8 * 3600e3
        ? 'Tonight, forever begins <span lang="ar">— الليلة فرحنا</span>'
        : 'Thank you for celebrating with us <span lang="ar">— شكراً لمشاركتنا فرحتنا</span>';
      clearInterval(timer);
      return;
    }
    const pad = (n) => String(n).padStart(2, '0');
    setNum('d', pad(Math.floor(diff / 864e5)));
    setNum('h', pad(Math.floor(diff / 36e5) % 24));
    setNum('m', pad(Math.floor(diff / 6e4) % 60));
    setNum('s', pad(Math.floor(diff / 1e3) % 60));
  }
  const timer = setInterval(tick, 1000);
  tick();

  /* ---------------- Calendar ---------------- */
  $('#calBtn').addEventListener('click', () => {
    const apple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    if (apple) location.href = CONFIG.icsFile;
    else window.open(CONFIG.googleCal, '_blank', 'noopener');
  });

})();
