const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('.nav-link, .nav-contact').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

// Rotating hero headline
const phrases = ['data into insights', 'technology into solutions', 'operations into outcomes'];
const typedText = document.getElementById('typedText');
let phraseIndex = 0, charIndex = phrases[0].length, deleting = true;
function typeLoop() {
  const phrase = phrases[phraseIndex];
  if (deleting) {
    charIndex--;
    if (charIndex <= 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  } else {
    charIndex++;
    if (charIndex >= phrases[phraseIndex].length) { deleting = true; setTimeout(typeLoop, 1500); return; }
  }
  typedText.textContent = phrases[phraseIndex].slice(0, charIndex);
  setTimeout(typeLoop, deleting ? 38 : 65);
}
setTimeout(typeLoop, 1500);

// Reveal elements as they enter the viewport
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Highlight the navigation section currently in view
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));


// Lightweight animated particle field with gentle pointer interaction.
(() => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  let width = 0, height = 0, particles = [], frame = 0;
  const pointer = { x: -1000, y: -1000 };
  const makeParticles = () => {
    const count = Math.min(85, Math.max(32, Math.floor((width * height) / 19000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.5 + .45, phase: Math.random() * Math.PI * 2
    }));
  };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); makeParticles();
  };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.phase += .012;
      if (p.x < -10) p.x = width + 10; if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10; if (p.y > height + 10) p.y = -10;
      const dx = pointer.x - p.x, dy = pointer.y - p.y, dist = Math.hypot(dx, dy);
      if (dist < 125 && dist > 0) { p.x -= dx / dist * .22; p.y -= dy / dist * .22; }
      const alpha = .25 + (Math.sin(p.phase) + 1) * .18;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(112, 220, 244, ${alpha})`; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
        if (dd < 105) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(117, 139, 224, ${(1 - dd / 105) * .12})`;
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    });
    frame = requestAnimationFrame(draw);
  };
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.x = -1000; pointer.y = -1000; });
  resize(); draw();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!reduceMotion) draw();
  });
})();
