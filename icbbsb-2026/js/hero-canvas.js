/**
 * ICBBSB 2026 — Hero Canvas: Animated Bio-Molecular Ecosystem
 * Features:
 * 1. Parametric Undulating DNA Double-Helix with alternating Bio-Green and Amber base nodes
 * 2. Floating Hexagonal Molecular Rings (Monomers & Enzymes) with rotating resonance bonds
 * 3. Harmonic Organic Bio-Blobs / Cellular Organelles with bioluminescent glow
 * 4. Bioluminescent green proximity connectors with nutrient flow micro-particles
 * 5. Interactive cursor ripple repulsion
 * 6. High-DPI Retina scaling, IntersectionObserver pause/resume, prefers-reduced-motion support
 */

(function () {
  'use strict';

  function initBioCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let isVisible = false;
    let time = 0;

    // Mouse interactive coordinates
    const mouse = { x: -1000, y: -1000, radius: 120 };

    // Hexagonal Molecular Rings
    const hexagons = [];
    const NUM_HEXAGONS = 12;

    // Organic Bio-Blobs
    const bioBlobs = [];
    const NUM_BLOBS = 6;

    // Nutrient Flow Micro-Particles along connections
    const nutrientParticles = [];
    const MAX_NUTRIENTS = 40;

    class HexagonMolecule {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.r = 16 + Math.random() * 18;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.012;
        this.alpha = 0.35 + Math.random() * 0.45;
        this.colorType = Math.random() > 0.3 ? 'green' : 'amber';
      }

      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotSpeed;

        // Wrap around boundaries with padding
        if (this.x < -40) this.x = w + 40;
        if (this.x > w + 40) this.x = -40;
        if (this.y < -40) this.y = h + 40;
        if (this.y > h + 40) this.y = -40;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);

        const strokeColor = this.colorType === 'green'
          ? `rgba(34, 197, 94, ${this.alpha})`
          : `rgba(245, 158, 11, ${this.alpha})`;
        const fillColor = this.colorType === 'green'
          ? `rgba(34, 197, 94, ${this.alpha * 0.15})`
          : `rgba(245, 158, 11, ${this.alpha * 0.15})`;

        // Outer Hexagon
        context.beginPath();
        for (let i = 0; i < 6; i++) {
          const theta = (i * Math.PI) / 3;
          const px = this.r * Math.cos(theta);
          const py = this.r * Math.sin(theta);
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.strokeStyle = strokeColor;
        context.lineWidth = 1.2;
        context.fillStyle = fillColor;
        context.fill();
        context.stroke();

        // Inner Resonance Circle
        context.beginPath();
        context.arc(0, 0, this.r * 0.58, 0, Math.PI * 2);
        context.strokeStyle = strokeColor;
        context.lineWidth = 0.8;
        context.setLineDash([3, 3]);
        context.stroke();
        context.setLineDash([]);

        // Vertices Atoms
        for (let i = 0; i < 6; i++) {
          const theta = (i * Math.PI) / 3;
          const px = this.r * Math.cos(theta);
          const py = this.r * Math.sin(theta);
          context.beginPath();
          context.arc(px, py, 2.2, 0, Math.PI * 2);
          context.fillStyle = this.colorType === 'green' ? '#4ade80' : '#fbbf24';
          context.fill();
        }

        context.restore();
      }
    }

    class BioBlob {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseRadius = 45 + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.015 + Math.random() * 0.015;
      }

      update(w, h, t) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -80) this.x = w + 80;
        if (this.x > w + 80) this.x = -80;
        if (this.y < -80) this.y = h + 80;
        if (this.y > h + 80) this.y = -80;
      }

      draw(context, t) {
        context.save();
        context.translate(this.x, this.y);

        // Soft Radial Glow
        const grad = context.createRadialGradient(0, 0, 0, 0, 0, this.baseRadius * 1.3);
        grad.addColorStop(0, 'rgba(34, 197, 94, 0.09)');
        grad.addColorStop(0.6, 'rgba(34, 197, 94, 0.03)');
        grad.addColorStop(1, 'rgba(34, 197, 94, 0)');

        context.beginPath();
        const steps = 36;
        for (let i = 0; i <= steps; i++) {
          const phi = (i / steps) * Math.PI * 2;
          const r = this.baseRadius * (1 + 0.16 * Math.sin(3 * phi + t * this.speed + this.phase) + 0.1 * Math.cos(2 * phi - t * this.speed));
          const px = r * Math.cos(phi);
          const py = r * Math.sin(phi);
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.fillStyle = grad;
        context.fill();

        context.strokeStyle = 'rgba(34, 197, 94, 0.12)';
        context.lineWidth = 1;
        context.stroke();

        context.restore();
      }
    }

    class NutrientParticle {
      constructor() {
        this.active = false;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.progress = 0;
        this.speed = 0.01;
        this.size = 2;
        this.color = '#4ade80';
      }

      spawn(p1, p2) {
        this.x1 = p1.x;
        this.y1 = p1.y;
        this.x2 = p2.x;
        this.y2 = p2.y;
        this.progress = Math.random();
        this.speed = 0.006 + Math.random() * 0.008;
        this.size = 1.5 + Math.random() * 1.5;
        this.color = Math.random() > 0.35 ? '#4ade80' : '#fbbf24';
        this.active = true;
      }

      update() {
        if (!this.active) return;
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.progress = 0;
          this.active = false;
        }
      }

      draw(context) {
        if (!this.active) return;
        const currentX = this.x1 + (this.x2 - this.x1) * this.progress;
        const currentY = this.y1 + (this.y2 - this.y1) * this.progress;
        const alpha = Math.sin(this.progress * Math.PI) * 0.8;

        context.beginPath();
        context.arc(currentX, currentY, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowColor = this.color;
        context.shadowBlur = 6;
        context.globalAlpha = alpha;
        context.fill();
        context.globalAlpha = 1;
        context.shadowBlur = 0;
      }
    }

    function initEntities() {
      hexagons.length = 0;
      for (let i = 0; i < NUM_HEXAGONS; i++) {
        hexagons.push(new HexagonMolecule(width, height));
      }

      bioBlobs.length = 0;
      for (let i = 0; i < NUM_BLOBS; i++) {
        bioBlobs.push(new BioBlob(width, height));
      }

      nutrientParticles.length = 0;
      for (let i = 0; i < MAX_NUTRIENTS; i++) {
        nutrientParticles.push(new NutrientParticle());
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!hexagons.length) {
        initEntities();
      }
    }

    /**
     * Draw the Parametric Undulating DNA Double-Helix
     */
    function drawDNAHelix(context, t) {
      const numStations = 34;
      const amplitude = Math.min(width * 0.14, 90);
      const waveFreq = 0.18;
      const omega = 0.024;

      // Diagonal flowing axis for organic dynamism
      const startX = width * 0.05;
      const endX = width * 0.95;
      const startY = height * 0.2;
      const endY = height * 0.85;

      const nodesStrand1 = [];
      const nodesStrand2 = [];

      for (let i = 0; i < numStations; i++) {
        const u = i / (numStations - 1);
        const axisX = startX + (endX - startX) * u;
        const axisY = startY + (endY - startY) * u + Math.sin(u * Math.PI * 2 + t * 0.01) * 20;

        // Normal perpendicular direction to helix trajectory
        const nx = -(endY - startY) / Math.hypot(endX - startX, endY - startY);
        const ny = (endX - startX) / Math.hypot(endX - startX, endY - startY);

        const phase = i * waveFreq + t * omega;
        const offset = Math.cos(phase) * amplitude;
        const depth = Math.sin(phase); // -1 to 1 for depth & scale

        const p1 = {
          x: axisX + nx * offset,
          y: axisY + ny * offset,
          z: depth,
          index: i
        };

        const p2 = {
          x: axisX - nx * offset,
          y: axisY - ny * offset,
          z: -depth,
          index: i
        };

        nodesStrand1.push(p1);
        nodesStrand2.push(p2);

        // Draw Base Pair Rung
        const rungAlpha = 0.15 + 0.3 * ((depth + 1) / 2);
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.strokeStyle = `rgba(34, 197, 94, ${rungAlpha})`;
        context.lineWidth = 1 + (depth + 1) * 0.6;
        context.stroke();

        // Draw Base Pair Atoms
        const nodeRadius1 = 3 + (depth + 1) * 1.5;
        const nodeRadius2 = 3 + (-depth + 1) * 1.5;

        // Strand 1 Node (Bio-Green)
        context.beginPath();
        context.arc(p1.x, p1.y, nodeRadius1, 0, Math.PI * 2);
        context.fillStyle = i % 2 === 0 ? '#22c55e' : '#4ade80';
        context.shadowColor = '#22c55e';
        context.shadowBlur = depth > 0 ? 8 : 0;
        context.fill();
        context.shadowBlur = 0;

        // Strand 2 Node (Warm Amber)
        context.beginPath();
        context.arc(p2.x, p2.y, nodeRadius2, 0, Math.PI * 2);
        context.fillStyle = i % 2 === 0 ? '#f59e0b' : '#fbbf24';
        context.shadowColor = '#f59e0b';
        context.shadowBlur = -depth > 0 ? 8 : 0;
        context.fill();
        context.shadowBlur = 0;
      }

      // Draw continuous backbone strands
      context.beginPath();
      for (let i = 0; i < nodesStrand1.length; i++) {
        if (i === 0) context.moveTo(nodesStrand1[i].x, nodesStrand1[i].y);
        else context.lineTo(nodesStrand1[i].x, nodesStrand1[i].y);
      }
      context.strokeStyle = 'rgba(74, 222, 128, 0.4)';
      context.lineWidth = 2;
      context.stroke();

      context.beginPath();
      for (let i = 0; i < nodesStrand2.length; i++) {
        if (i === 0) context.moveTo(nodesStrand2[i].x, nodesStrand2[i].y);
        else context.lineTo(nodesStrand2[i].x, nodesStrand2[i].y);
      }
      context.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      context.lineWidth = 1.8;
      context.stroke();

      return [...nodesStrand1, ...nodesStrand2];
    }

    /**
     * Draw Proximity Ecosystem Connections
     */
    function drawEcosystemNetwork(context, dnaNodes) {
      const allActivePoints = [
        ...hexagons.map(h => ({ x: h.x, y: h.y, type: 'hex' })),
        ...dnaNodes.filter((_, idx) => idx % 3 === 0)
      ];

      const PROXIMITY_DIST = 135;
      const PROX_SQ = PROXIMITY_DIST * PROXIMITY_DIST;

      for (let i = 0; i < allActivePoints.length; i++) {
        for (let j = i + 1; j < allActivePoints.length; j++) {
          const p1 = allActivePoints[i];
          const p2 = allActivePoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < PROX_SQ) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / PROXIMITY_DIST) * 0.22;

            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            context.lineWidth = 0.9;
            context.stroke();

            // Randomly spawn nutrient particle
            if (Math.random() < 0.004) {
              const inactiveNutrient = nutrientParticles.find(n => !n.active);
              if (inactiveNutrient) {
                inactiveNutrient.spawn(p1, p2);
              }
            }
          }
        }
      }
    }

    /**
     * Render a single static snapshot when prefers-reduced-motion is active
     */
    function renderStaticSnapshot() {
      ctx.clearRect(0, 0, width, height);

      // Render static bio-blobs
      bioBlobs.forEach(blob => blob.draw(ctx, 10));

      // Render static DNA
      const dnaNodes = drawDNAHelix(ctx, 15);

      // Render static hexagons
      hexagons.forEach(hex => hex.draw(ctx));

      // Connect ecosystem
      drawEcosystemNetwork(ctx, dnaNodes);
    }

    /**
     * Main rAF Animation Loop
     */
    function renderLoop() {
      if (!isVisible) return;

      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Organic Bio-Blobs (Background Layer)
      bioBlobs.forEach(blob => {
        blob.update(width, height, time);
        blob.draw(ctx, time);
      });

      // 2. Draw Parametric DNA Double-Helix
      const dnaNodes = drawDNAHelix(ctx, time);

      // 3. Draw Floating Hexagonal Rings
      hexagons.forEach(hex => {
        hex.update(width, height);
        hex.draw(ctx);
      });

      // 4. Draw Interconnected Network & Proximity Lines
      drawEcosystemNetwork(ctx, dnaNodes);

      // 5. Draw Nutrient Particles (Foreground Glow)
      nutrientParticles.forEach(n => {
        n.update();
        n.draw(ctx);
      });

      animationFrameId = window.requestAnimationFrame(renderLoop);
    }

    // Pointer events for subtle cursor interaction
    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    }, { passive: true });

    // IntersectionObserver to pause rendering when canvas is scrolled off-screen
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animationFrameId && !prefersReducedMotion) {
            renderLoop();
          }
        } else {
          if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    canvasObserver.observe(canvas);

    // Window Resize Handler with rAF Throttling
    let resizeTicking = false;
    window.addEventListener('resize', () => {
      if (!resizeTicking) {
        window.requestAnimationFrame(() => {
          resize();
          if (prefersReducedMotion) {
            renderStaticSnapshot();
          }
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    }, { passive: true });

    // Initial setup
    resize();

    if (prefersReducedMotion) {
      renderStaticSnapshot();
    } else {
      isVisible = true;
      renderLoop();
    }
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBioCanvas);
  } else {
    initBioCanvas();
  }
})();
