const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Avoid wasting bandwidth/CPU on videos far outside the viewport.
const videos = [...document.querySelectorAll('video[autoplay]')];
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  });
}, { rootMargin: '250px 0px' });
videos.forEach((video) => videoObserver.observe(video));


// Slightly stagger reveal timing so sections feel paced instead of appearing all at once.
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 45}ms`;
});

// Light hero particles: decorative only, intentionally sparse.
const particleLayer = document.querySelector('.hero-particles');
if (particleLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const points = [
    [8,20,7.5],[17,68,9.2],[28,34,8.4],[39,80,10.5],[48,16,7.9],[57,58,11.2],
    [66,29,9.7],[74,72,8.8],[84,22,10.8],[91,60,7.7],[13,45,12.1],[33,11,9.5],
    [52,87,8.1],[69,49,11.5],[79,91,9.1],[95,37,10.1]
  ];
  points.forEach(([x,y,d]) => {
    const dot = document.createElement('i');
    dot.style.left = `${x}%`; dot.style.top = `${y}%`; dot.style.setProperty('--dur', `${d}s`);
    dot.style.animationDelay = `${-(x+y)%7}s`;
    particleLayer.appendChild(dot);
  });
}

// Gentle pointer parallax on large media only; capped to avoid gimmickry.
if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.feature-media,.proof-film-frame,.mode-proof-media').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(1000px) rotateX(${(-y*1.4).toFixed(2)}deg) rotateY(${(x*1.6).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform=''; });
  });
}
