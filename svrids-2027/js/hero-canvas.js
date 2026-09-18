/**
 * SVRIDS 2027 - 3D Rocket & Launch Trajectory Canvas Animation
 * Mathematical Specification:
 * - Cubic Bezier ascending launch trajectory
 * - 3D-styled polygonal deeptech rocket vehicle with dynamic heading
 * - High-velocity dual particle trails (Electric Blue #3b82f6 and High-Energy Orange #f97316)
 * - Research-to-Startup node transformation (Research circles -> Incubation hexagons -> Startup stars)
 * - Dynamic 3D perspective energy grid with horizon depth
 * - High-DPI retina scaling, IntersectionObserver pause/resume, and prefers-reduced-motion support.
 */

(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animFrameId = null;
  let isVisible = false;
  let lastTime = performance.now();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Bezier curve progress
  let rocketProgress = 0; // 0 to 1
  const rocketSpeed = 0.0018; // Speed along Bezier curve

  // Particles array
  const exhaustParticles = [];
  const maxParticles = 180;

  // Research nodes array
  let researchNodes = [];
  const nodeCount = 36;

  // Perspective grid parameters
  let gridOffset = 0;

  function initNodes() {
    researchNodes = [];
    for (let i = 0; i < nodeCount; i++) {
      // Clustered across the lower left and center regions
      const x = (0.05 + Math.random() * 0.75) * width;
      const y = (0.35 + Math.random() * 0.55) * height;
      researchNodes.push({
        x,
        y,
        originX: x,
        originY: y,
        state: 0, // 0 = Research Node, 1 = Incubation, 2 = Startup Star
        transitionProgress: 0,
        radius: 2.5 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        sparkles: []
      });
    }
  }

  function getBezierPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    // Derivative for tangent heading angle
    const dx = 3 * uu * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * tt * (p3.x - p2.x);
    const dy = 3 * uu * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * tt * (p3.y - p2.y);
    const angle = Math.atan2(dy, dx);

    return { x, y, angle };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    initNodes();

    if (prefersReducedMotion) {
      renderStaticSnapshot();
    }
  }

  function addExhaustParticle(nozzleX, nozzleY, angle) {
    if (exhaustParticles.length >= maxParticles) {
      exhaustParticles.shift();
    }

    const spread = (Math.random() - 0.5) * 0.6;
    const speed = 2.5 + Math.random() * 4.5;
    const particleAngle = angle + Math.PI + spread;

    const isOrange = Math.random() > 0.45;

    exhaustParticles.push({
      x: nozzleX + (Math.random() - 0.5) * 4,
      y: nozzleY + (Math.random() - 0.5) * 4,
      vx: Math.cos(particleAngle) * speed,
      vy: Math.sin(particleAngle) * speed,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.02,
      size: 3.5 + Math.random() * 3.5,
      isOrange
    });
  }

  function drawGrid() {
    const horizonY = height * 0.65;
    const vanishingX = width * 0.5;

    ctx.save();
    ctx.lineWidth = 1;

    // Longitudinal rays converging to vanishing point
    const rays = 18;
    for (let i = 0; i <= rays; i++) {
      const bottomX = (i / rays) * width * 1.6 - width * 0.3;
      const alpha = 0.04 + Math.sin((i / rays) * Math.PI) * 0.08;
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(vanishingX, horizonY);
      ctx.lineTo(bottomX, height);
      ctx.stroke();
    }

    // Transverse lines moving towards viewer
    const transverseLines = 10;
    for (let j = 0; j < transverseLines; j++) {
      const p = ((j + gridOffset) % transverseLines) / transverseLines;
      const y = horizonY + (height - horizonY) * Math.pow(p, 2.2);
      const alpha = Math.pow(p, 1.8) * 0.15;
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Horizon line with subtle glow
    const grad = ctx.createLinearGradient(0, horizonY, width, horizonY);
    grad.addColorStop(0, "rgba(59, 130, 246, 0)");
    grad.addColorStop(0.5, "rgba(59, 130, 246, 0.25)");
    grad.addColorStop(1, "rgba(249, 115, 22, 0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.stroke();

    ctx.restore();
  }

  function drawTrajectoryLine(p0, p1, p2, p3) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    const grad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
    grad.addColorStop(0, "rgba(59, 130, 246, 0.05)");
    grad.addColorStop(0.4, "rgba(59, 130, 246, 0.2)");
    grad.addColorStop(0.8, "rgba(249, 115, 22, 0.35)");
    grad.addColorStop(1, "rgba(251, 191, 36, 0.5)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.restore();
  }

  function drawRocket(x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Rocket Glow
    const glowGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
    glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    glowGrad.addColorStop(0.4, "rgba(249, 115, 22, 0.3)");
    glowGrad.addColorStop(1, "rgba(59, 130, 246, 0)");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();

    // Wings / Fins
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-18, -14);
    ctx.lineTo(-8, -4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.lineTo(-18, 14);
    ctx.lineTo(-8, 4);
    ctx.closePath();
    ctx.fill();

    // Rocket Body (Sleek aerodynamic capsule)
    const bodyGrad = ctx.createLinearGradient(-14, 0, 18, 0);
    bodyGrad.addColorStop(0, "#1e293b");
    bodyGrad.addColorStop(0.5, "#3b82f6");
    bodyGrad.addColorStop(1, "#f8fafc");

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(18, 0); // Nose cone apex
    ctx.quadraticCurveTo(8, -6, -12, -5);
    ctx.lineTo(-14, -2);
    ctx.lineTo(-14, 2);
    ctx.lineTo(-12, 5);
    ctx.quadraticCurveTo(8, 6, 18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cabin Window
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(4, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // High-Energy Thruster Flame Core
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(-14, -3);
    ctx.lineTo(-24 - Math.random() * 8, 0);
    ctx.lineTo(-14, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawNodes(rocketPos) {
    ctx.save();

    for (let i = 0; i < researchNodes.length; i++) {
      const node = researchNodes[i];
      node.rotation += node.rotSpeed;
      node.pulsePhase += 0.03;

      // Distance to rocket
      const distToRocket = Math.hypot(node.x - rocketPos.x, node.y - rocketPos.y);

      // Trigger transformation if rocket passes close
      if (distToRocket < 150 && node.state === 0) {
        node.state = 1;
      }
      if (distToRocket < 80 && node.state === 1) {
        node.state = 2;
      }

      if (node.state > 0 && node.transitionProgress < 1) {
        node.transitionProgress = Math.min(1, node.transitionProgress + 0.04);
      }

      if (node.state === 0) {
        // State 0: Academic Research Node (Muted slate with subtle pulse)
        const pRadius = node.radius + Math.sin(node.pulsePhase) * 0.8;
        ctx.fillStyle = "rgba(100, 116, 139, 0.6)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, pRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (node.state === 1) {
        // State 1: Incubation / Tech Transfer (Pulsing Electric Blue Hexagon)
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);

        const hexRadius = (node.radius + 3) * node.transitionProgress;
        ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const angle = (s * Math.PI) / 3;
          const hx = Math.cos(angle) * hexRadius;
          const hy = Math.sin(angle) * hexRadius;
          if (s === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      } else {
        // State 2: DeepTech Startup Star / Diamond (Orange & Gold Radiant Star)
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);

        const starSize = (node.radius + 6) * node.transitionProgress;
        const pulse = 1 + Math.sin(node.pulsePhase * 2) * 0.2;

        // Radiant glow
        const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, starSize * 2.5);
        glow.addColorStop(0, "rgba(249, 115, 22, 0.8)");
        glow.addColorStop(0.5, "rgba(251, 191, 36, 0.3)");
        glow.addColorStop(1, "rgba(249, 115, 22, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, starSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 4-pointed Star
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(0, -starSize * pulse);
        ctx.quadraticCurveTo(0, 0, starSize * 0.4 * pulse, 0);
        ctx.quadraticCurveTo(0, 0, 0, starSize * pulse);
        ctx.quadraticCurveTo(0, 0, -starSize * 0.4 * pulse, 0);
        ctx.quadraticCurveTo(0, 0, 0, -starSize * pulse);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Proximity links between nodes
      for (let j = i + 1; j < researchNodes.length; j++) {
        const other = researchNodes[j];
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.18;
          if (node.state === 2 || other.state === 2) {
            ctx.strokeStyle = `rgba(249, 115, 22, ${alpha * 1.5})`;
          } else if (node.state === 1 || other.state === 1) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 1.2})`;
          } else {
            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
          }
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  function updateParticles() {
    ctx.save();
    for (let i = exhaustParticles.length - 1; i >= 0; i--) {
      const p = exhaustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        exhaustParticles.splice(i, 1);
        continue;
      }

      const alpha = p.life;
      const currentRadius = p.size * p.life;

      if (p.isOrange) {
        ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.85})`;
        ctx.shadowColor = "#f97316";
      } else {
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.85})`;
        ctx.shadowColor = "#3b82f6";
      }
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderStaticSnapshot() {
    ctx.clearRect(0, 0, width, height);

    drawGrid();

    const p0 = { x: width * 0.08, y: height * 0.85 };
    const p1 = { x: width * 0.35, y: height * 0.7 };
    const p2 = { x: width * 0.55, y: height * 0.35 };
    const p3 = { x: width * 0.92, y: height * 0.12 };

    drawTrajectoryLine(p0, p1, p2, p3);

    const rocketPos = getBezierPoint(0.55, p0, p1, p2, p3);
    drawRocket(rocketPos.x, rocketPos.y, rocketPos.angle);
    drawNodes(rocketPos);
  }

  function loop(now) {
    if (!isVisible) {
      animFrameId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    // Update grid offset
    gridOffset += dt * 1.5;

    // Draw background 3D energy perspective grid
    drawGrid();

    // Define trajectory control points
    const p0 = { x: width * 0.08, y: height * 0.88 };
    const p1 = { x: width * 0.35, y: height * 0.72 };
    const p2 = { x: width * 0.55, y: height * 0.32 };
    const p3 = { x: width * 0.92, y: height * 0.1 };

    // Draw trajectory guide curve
    drawTrajectoryLine(p0, p1, p2, p3);

    // Update rocket position along Bezier curve
    rocketProgress = (rocketProgress + rocketSpeed) % 1.0;
    const rocketPos = getBezierPoint(rocketProgress, p0, p1, p2, p3);

    // Emit exhaust particles from rocket thruster nozzle
    const nozzleOffset = -14;
    const nozzleX = rocketPos.x + Math.cos(rocketPos.angle) * nozzleOffset;
    const nozzleY = rocketPos.y + Math.sin(rocketPos.angle) * nozzleOffset;

    for (let k = 0; k < 3; k++) {
      addExhaustParticle(nozzleX, nozzleY, rocketPos.angle);
    }

    // Render particles
    updateParticles();

    // Draw Rocket
    drawRocket(rocketPos.x, rocketPos.y, rocketPos.angle);

    // Draw Research Nodes & Star transformations
    drawNodes(rocketPos);

    animFrameId = requestAnimationFrame(loop);
  }

  // IntersectionObserver to pause loop when off-screen
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = entry.isIntersecting;
      if (isVisible && !prefersReducedMotion) {
        if (!animFrameId) {
          lastTime = performance.now();
          animFrameId = requestAnimationFrame(loop);
        }
      } else {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      }
    },
    { threshold: 0.05 }
  );

  window.addEventListener("resize", resize, { passive: true });

  // Initial setup
  resize();
  observer.observe(canvas);
})();
