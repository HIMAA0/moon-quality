// ===== Stars Canvas =====
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');

  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4200);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251,241,234,${alpha.toFixed(2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();


// ===== Quality Data =====
// Index-ordered to match the slider steps (0 = lowest, 4 = highest)
const qualitySteps = ['144', '240', '480', '720', '1080'];

const qualityData = {
  '144':  { label: '144p · Pixelated', res: '144p',  tier: 'Basic'     },
  '240':  { label: '240p · Low',       res: '240p',  tier: 'Standard'  },
  '480':  { label: '480p · Standard',  res: '480p',  tier: 'Medium'    },
  '720':  { label: '720p · HD',        res: '720p',  tier: 'High'      },
  '1080': { label: '1080p · Full HD',  res: '1080p', tier: 'Ultra'     },
};


// ===== DOM Refs =====
const slider          = document.getElementById('quality-slider');
const images          = document.querySelectorAll('.moon-image');
const imageContainer  = document.getElementById('image-container');
const qualityBadge    = document.getElementById('quality-badge');
const infoRes         = document.getElementById('info-res');
const infoTier        = document.getElementById('info-tier');
const flowerContainer = document.getElementById('flower-container');
const tickEls         = document.querySelectorAll('.slider-ticks span');


// ===== Update UI for a given step index =====
function applyQuality(index, animateCelebration) {
  const q = qualitySteps[index];
  const data = qualityData[q];

  images.forEach(img => {
    img.classList.add('hidden');
    if (img.id === `moon-${q}`) img.classList.remove('hidden');
  });

  qualityBadge.textContent = data.label;
  infoRes.textContent      = data.res;
  infoTier.textContent     = data.tier;

  tickEls.forEach(t => t.classList.toggle('active', Number(t.dataset.i) === index));

  // Fill the ribbon track up to the current step
  const pct = (index / (qualitySteps.length - 1)) * 100;
  slider.style.setProperty('--fill', pct + '%');

  // Golden-rose glow at the top quality tier
  if (q === '1080') {
    imageContainer.classList.add('hd-glow');
    if (animateCelebration) createFlowers();
  } else {
    imageContainer.classList.remove('hd-glow');
  }
}

// ===== Slider Events =====
slider.addEventListener('input', (e) => {
  applyQuality(Number(e.target.value), true);
});

// Initialize on load
applyQuality(Number(slider.value), false);


// ===== Flowers =====
function createFlowers() {
  const emojis = ['🌹', '🌸', '💗', '✨', '💫'];
  for (let i = 0; i < 18; i++) {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    flower.style.left = (Math.random() * 100) + 'vw';
    flower.style.animationDelay = (Math.random() * 2.5) + 's';
    flower.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
    flowerContainer.appendChild(flower);
    setTimeout(() => flower.remove(), 5000);
  }
}