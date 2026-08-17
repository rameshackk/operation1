/**
 * WealthGrowthBackground - High-performance ambient animated background
 * Visualizes mutual fund compounding curves, rising financial yield symbols (₹, %, CAGR, SIP, NAV, +15.2%),
 * and market growth sparklines in Sovereign Gold and Emerald CFP tones.
 */

export function initWealthGrowthBackground() {
  if (document.getElementById('wealth-growth-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'wealth-growth-canvas';
  canvas.className = 'fixed inset-0 pointer-events-none z-0 transition-opacity duration-700';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
  
  // Insert before root so it sits beneath all page UI
  const root = document.getElementById('root');
  if (root && root.parentNode) {
    root.parentNode.insertBefore(canvas, root);
  } else {
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  // Financial particle items
  const tokens = ['₹', '%', 'SIP', 'CAGR', 'NAV', '+14.8%', '₹1 Cr', 'GROWTH', 'ALPHA', 'BULL', '+18.5%', '₹50L', '₹25L'];
  const particleCount = Math.min(32, Math.floor(width / 45));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      text: tokens[Math.floor(Math.random() * tokens.length)],
      speedY: 0.25 + Math.random() * 0.45,
      speedX: (Math.random() - 0.5) * 0.2,
      size: 11 + Math.random() * 8,
      alpha: 0.12 + Math.random() * 0.22,
      baseAlpha: 0.12 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      isNumber: Math.random() > 0.5
    });
  }

  // Animated compounding growth curves
  let time = 0;

  function render() {
    time += 0.012;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Color palettes
    const goldStroke = isDark ? 'rgba(245, 158, 11, 0.18)' : 'rgba(217, 119, 6, 0.13)';
    const emeraldStroke = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.11)';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.025)';
    const textGold = isDark ? 'rgba(251, 191, 36, ' : 'rgba(180, 83, 9, ';
    const textEmerald = isDark ? 'rgba(52, 211, 153, ' : 'rgba(4, 120, 87, ';

    // 1. DRAW SUBTLE WEALTH PERSPECTIVE GRID
    const gridSize = 120;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 2. DRAW COMPOUNDING EXPONENTIAL GROWTH CURVE 1 (Primary Gold Fund Yield)
    ctx.beginPath();
    ctx.lineWidth = isDark ? 2.5 : 2;
    ctx.strokeStyle = goldStroke;

    const startY1 = height * 0.88;
    ctx.moveTo(0, startY1);

    for (let x = 0; x <= width; x += 15) {
      const progress = x / width;
      // Exponential curve formula: y = startY - (progress^2.2 * height * 0.65) + wave
      const expRise = Math.pow(progress, 2.1) * (height * 0.62);
      const wave = Math.sin(progress * 4 + time) * 16 + Math.cos(progress * 2 - time * 0.8) * 10;
      const y = startY1 - expRise + wave;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. DRAW COMPOUNDING GROWTH CURVE 2 (Secondary Emerald Index Yield)
    ctx.beginPath();
    ctx.lineWidth = isDark ? 2 : 1.5;
    ctx.strokeStyle = emeraldStroke;

    const startY2 = height * 0.94;
    ctx.moveTo(0, startY2);

    for (let x = 0; x <= width; x += 15) {
      const progress = x / width;
      const expRise = Math.pow(progress, 1.85) * (height * 0.52);
      const wave = Math.cos(progress * 3.5 + time * 0.9) * 14 + Math.sin(progress * 2.2 + time) * 8;
      const y = startY2 - expRise + wave;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 4. DRAW ANIMATED WEALTH ACCUMULATION PULSE DOTS ON CURVES
    const pulseProgress1 = (time * 0.12) % 1;
    const pulseX1 = pulseProgress1 * width;
    const pulseExpRise1 = Math.pow(pulseProgress1, 2.1) * (height * 0.62);
    const pulseWave1 = Math.sin(pulseProgress1 * 4 + time) * 16 + Math.cos(pulseProgress1 * 2 - time * 0.8) * 10;
    const pulseY1 = startY1 - pulseExpRise1 + pulseWave1;

    ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.7)' : 'rgba(217, 119, 6, 0.6)';
    ctx.beginPath();
    ctx.arc(pulseX1, pulseY1, 4.5, 0, Math.PI * 2);
    ctx.fill();

    const pulseProgress2 = ((time * 0.12) + 0.5) % 1;
    const pulseX2 = pulseProgress2 * width;
    const pulseExpRise2 = Math.pow(pulseProgress2, 1.85) * (height * 0.52);
    const pulseWave2 = Math.cos(pulseProgress2 * 3.5 + time * 0.9) * 14 + Math.sin(pulseProgress2 * 2.2 + time) * 8;
    const pulseY2 = startY2 - pulseExpRise2 + pulseWave2;

    ctx.fillStyle = isDark ? 'rgba(52, 211, 153, 0.65)' : 'rgba(5, 150, 105, 0.55)';
    ctx.beginPath();
    ctx.arc(pulseX2, pulseY2, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. DRAW GENTLY RISING MONEY & GROWTH PARTICLES
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speedY;
      p.x += Math.sin(time + p.phase) * 0.35 + p.speedX;

      // Wrap around screen
      if (p.y < -30) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -40) p.x = width + 30;
      if (p.x > width + 40) p.x = -30;

      const alphaPulse = p.baseAlpha * (0.8 + Math.sin(time * 2 + p.phase) * 0.2);
      ctx.font = `800 ${p.size}px "Inter", "Noto Sans Tamil", sans-serif`;
      ctx.fillStyle = p.isNumber ? `${textGold}${alphaPulse})` : `${textEmerald}${alphaPulse})`;
      ctx.fillText(p.text, p.x, p.y);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
