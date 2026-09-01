/**
 * ============================================================================
 * SVRIAS 2026 — 3D Neural Ethics Shield Canvas Animation
 * ScholarVault Research Integrity & Responsible AI Summit 2026
 *
 * Algorithmic Features:
 * - Parametric 3D Shield Envelope with Poisson-disc Node Distribution
 * - Euler 3D Rotation (Y-axis orbit & X-axis pitch oscillation)
 * - 2D Perspective Projection (Focal length D=400)
 * - Synaptic Teal Edge Connections & Traveling Energy Pulse Packets
 * - Floating Governance, Fairness, Transparency & Attribution Micro-particles
 * - Retina / High-DPI Canvas Auto-scaling
 * - Battery-saver IntersectionObserver Pause/Resume
 * - Full prefers-reduced-motion Accessibility Support
 * ============================================================================
 */

(function () {
  "use strict";

  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Accessibility Check
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animFrameId = null;
  let isVisible = true;
  let lastTime = performance.now();

  // Mouse Interaction State
  const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

  // Simulation Parameters
  const FOCAL_LENGTH = 400;
  const NODE_COUNT = 82;
  const PARTICLE_COUNT = 45;
  const CONNECTION_DIST = 95;
  const PULSE_COUNT = 12;

  // Node & Particle Arrays
  let nodes = [];
  let governanceParticles = [];
  let pulses = [];
  let edges = [];

  /**
   * Helper: Check if a 2D point (x, y) is inside the parametric shield envelope
   */
  function isInsideShield(x, y, wShield, hShield) {
    const nx = Math.abs(x) / wShield;
    const ny = y / hShield;
    if (nx > 1 || ny < -1.1 || ny > 1.1) return false;
    // Top crest curve
    if (ny < -0.3) {
      const topLimit = -1.0 + 0.5 * Math.pow(nx, 2);
      if (ny < topLimit) return false;
    }
    // Bottom tapered tip curve
    if (ny > 0.0) {
      const bottomLimit = 1.0 - 0.9 * (1 - nx);
      if (ny > bottomLimit && nx < 0.95) return false;
    }
    return true;
  }

  /**
   * Generate 3D Shield Nodes using Poisson-disc Rejection Sampling
   */
  function generateShieldNodes(wShield, hShield) {
    const generated = [];
    let attempts = 0;
    const maxAttempts = 2500;
    const minSpacing = 32;

    while (generated.length < NODE_COUNT && attempts < maxAttempts) {
      attempts++;
      const candidateX = (Math.random() * 2 - 1) * wShield;
      const candidateY = (Math.random() * 2.1 - 1.05) * hShield;
      const candidateZ = (Math.random() * 2 - 1) * 110;

      if (isInsideShield(candidateX, candidateY, wShield, hShield)) {
        let tooClose = false;
        for (let i = 0; i < generated.length; i++) {
          const dx = candidateX - generated[i].x;
          const dy = candidateY - generated[i].y;
          const dz = candidateZ - generated[i].z;
          if (dx * dx + dy * dy + dz * dz < minSpacing * minSpacing) {
            tooClose = true;
            break;
          }
        }
        if (!tooClose) {
          generated.push({
            x: candidateX,
            y: candidateY,
            z: candidateZ,
            baseX: candidateX,
            baseY: candidateY,
            baseZ: candidateZ,
            projX: 0,
            projY: 0,
            scale: 1,
            pulse: Math.random() * Math.PI * 2,
            radius: 3.2 + Math.random() * 1.8,
            importance: Math.random() > 0.75 ? "hub" : "node"
          });
        }
      }
    }
    return generated;
  }

  /**
   * Generate Floating Governance Micro-Particles
   */
  function generateGovernanceParticles() {
    const classes = ["Governance", "Fairness", "Transparency", "Attribution"];
    const list = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      list.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: 1.5 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.4,
        type: classes[i % classes.length],
        phase: Math.random() * Math.PI * 2
      });
    }
    return list;
  }

  /**
   * Rebuild Connectivity Edges & Pulses
   */
  function buildEdges() {
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        const dz = nodes[i].baseZ - nodes[j].baseZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECTION_DIST) {
          edges.push({ from: i, to: j, dist: dist });
        }
      }
    }

    pulses = [];
    for (let p = 0; p < PULSE_COUNT; p++) {
      if (edges.length === 0) break;
      const edge = edges[Math.floor(Math.random() * edges.length)];
      pulses.push({
        edgeIndex: Math.floor(Math.random() * edges.length),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        forward: Math.random() > 0.5
      });
    }
  }

  /**
   * Resize Canvas buffer with DPI scaling
   */
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const shieldScale = Math.min(width * 0.32, height * 0.38, 260);
    nodes = generateShieldNodes(shieldScale, shieldScale * 1.22);
    governanceParticles = generateGovernanceParticles();
    buildEdges();

    if (prefersReducedMotion) {
      renderStaticFrame();
    }
  }

  /**
   * Render single static frame for reduced motion
   */
  function renderStaticFrame() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.48;

    // Render background governance particles
    for (let i = 0; i < governanceParticles.length; i++) {
      const p = governanceParticles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(45, 212, 191, ${p.alpha * 0.5})`;
      ctx.fill();
    }

    // Static 3D project
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const scale = FOCAL_LENGTH / (FOCAL_LENGTH + n.baseZ);
      n.projX = centerX + n.baseX * scale;
      n.projY = centerY + n.baseY * scale;
      n.scale = scale;
    }

    // Draw static edges
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const n1 = nodes[e.from];
      const n2 = nodes[e.to];
      ctx.beginPath();
      ctx.moveTo(n1.projX, n1.projY);
      ctx.lineTo(n2.projX, n2.projY);
      ctx.strokeStyle = "rgba(15, 118, 110, 0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw static nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.projX, n.projY, n.radius * n.scale, 0, Math.PI * 2);
      ctx.fillStyle = n.importance === "hub" ? "#0f766e" : "#2dd4bf";
      ctx.fill();
      ctx.strokeStyle = "rgba(15, 23, 42, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  /**
   * Main Dynamic Animation Loop
   */
  function animate(now) {
    if (!isVisible) {
      animFrameId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.06);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    const time = now * 0.001;
    const centerX = width * 0.5;
    const centerY = height * 0.48;

    // Euler Rotation Angles
    const rotY = time * 0.35;
    const rotX = Math.sin(time * 0.45) * 0.15;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // 1. Update & Render Governance Micro-Particles
    for (let i = 0; i < governanceParticles.length; i++) {
      const p = governanceParticles[i];
      p.x += p.vx + Math.sin(time + p.phase) * 0.15;
      p.y += p.vy + Math.cos(time + p.phase) * 0.15;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(45, 212, 191, ${alpha * 0.6})`;
      ctx.fill();
    }

    // 2. 3D Node Transformations & Perspective Projection
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      // Subtle breathing motion
      const breathing = Math.sin(time * 1.5 + n.pulse) * 4;
      const bx = n.baseX;
      const by = n.baseY + breathing;
      const bz = n.baseZ;

      // Rotate Y
      const x1 = bx * cosY + bz * sinY;
      const z1 = -bx * sinY + bz * cosY;

      // Rotate X
      const y2 = by * cosX - z1 * sinX;
      const z2 = by * sinX + z1 * cosX;
      const x2 = x1;

      // Mouse repulsion in projected plane
      const scale = FOCAL_LENGTH / (FOCAL_LENGTH + z2);
      let px = centerX + x2 * scale;
      let py = centerY + y2 * scale;

      if (mouse.active) {
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const mDist = Math.sqrt(dx * dx + dy * dy);
        if (mDist < 120 && mDist > 0) {
          const force = (1 - mDist / 120) * 24;
          px += (dx / mDist) * force;
          py += (dy / mDist) * force;
        }
      }

      n.projX = px;
      n.projY = py;
      n.scale = scale;
      n.currZ = z2;
    }

    // 3. Draw Synaptic Edges
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const n1 = nodes[e.from];
      const n2 = nodes[e.to];

      const dx = n1.projX - n2.projX;
      const dy = n1.projY - n2.projY;
      const pDist = Math.sqrt(dx * dx + dy * dy);

      if (pDist < CONNECTION_DIST * 1.5) {
        const avgScale = (n1.scale + n2.scale) * 0.5;
        const alpha = Math.max(0.04, (1 - pDist / (CONNECTION_DIST * 1.5)) * 0.28 * avgScale);

        ctx.beginPath();
        ctx.moveTo(n1.projX, n1.projY);
        ctx.lineTo(n2.projX, n2.projY);
        ctx.strokeStyle = `rgba(15, 118, 110, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, 1.2 * avgScale);
        ctx.stroke();
      }
    }

    // 4. Update & Draw Synaptic Pulses
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        p.edgeIndex = Math.floor(Math.random() * edges.length);
        p.forward = Math.random() > 0.5;
      }

      const edge = edges[p.edgeIndex];
      if (edge) {
        const nFrom = p.forward ? nodes[edge.from] : nodes[edge.to];
        const nTo = p.forward ? nodes[edge.to] : nodes[edge.from];

        const pulseX = nFrom.projX + (nTo.projX - nFrom.projX) * p.progress;
        const pulseY = nFrom.projY + (nTo.projY - nFrom.projY) * p.progress;
        const pulseScale = (nFrom.scale + nTo.scale) * 0.5;

        // Glowing pulse head
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3.2 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = "#2dd4bf";
        ctx.shadowColor = "#2dd4bf";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // 5. Draw 3D Nodes (Sorted by Depth Z)
    const sortedNodes = [...nodes].sort((a, b) => b.currZ - a.currZ);
    for (let i = 0; i < sortedNodes.length; i++) {
      const n = sortedNodes[i];
      const nodeAlpha = Math.max(0.35, Math.min(1, n.scale * 0.9));
      const radius = n.radius * n.scale;

      ctx.beginPath();
      ctx.arc(n.projX, n.projY, radius, 0, Math.PI * 2);

      if (n.importance === "hub") {
        ctx.fillStyle = `rgba(15, 118, 110, ${nodeAlpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(45, 212, 191, ${nodeAlpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Subtle outer pulse ring
        const outerPulse = (Math.sin(time * 3 + n.pulse) + 1) * 3;
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, radius + outerPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(45, 212, 191, ${0.3 * (1 - outerPulse / 6)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(45, 212, 191, ${nodeAlpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(15, 23, 42, ${nodeAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    animFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners & IntersectionObserver
  window.addEventListener("resize", () => {
    resize();
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  // IntersectionObserver for Battery Saver
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !prefersReducedMotion) {
      if (!animFrameId) {
        lastTime = performance.now();
        animFrameId = requestAnimationFrame(animate);
      }
    } else {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  }, { threshold: 0.05 });

  observer.observe(canvas);

  // Initialize
  resize();
  if (!prefersReducedMotion) {
    animFrameId = requestAnimationFrame(animate);
  }
})();
