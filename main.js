// Cempasúchil petals floating animation on canvas
(function () {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const MARIGOLD_COLORS = [
    '#f59e0b', '#fbbf24', '#f59e0bcc', '#ffb24ccc'
  ];

  const petals = [];
  const PETAL_COUNT = Math.max(28, Math.floor((window.innerWidth * window.innerHeight) / 28000));
  function createPetal(x) {
    const size = 6 + Math.random() * 10;
    return {
      x: x ?? Math.random() * width,
      y: -20 - Math.random() * 200,
      vx: -0.6 + Math.random() * 1.2,
      vy: 0.8 + Math.random() * 1.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (-0.02 + Math.random() * 0.04),
      size,
      color: MARIGOLD_COLORS[Math.floor(Math.random() * MARIGOLD_COLORS.length)],
      wobble: Math.random() * 2 * Math.PI,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
    };
  }
  for (let i = 0; i < PETAL_COUNT; i++) petals.push(createPetal(Math.random() * width));

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    const w = p.size * (0.6 + Math.sin(p.rot) * 0.2);
    const h = p.size * 1.6;
    const grd = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    grd.addColorStop(0, p.color);
    grd.addColorStop(1, '#ffa94d');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h / 4, 0, 0);
    ctx.quadraticCurveTo(-w / 2, h / 4, 0, h / 2);
    ctx.quadraticCurveTo(w / 3, h / 6, 0, 0);
    ctx.closePath();
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.restore();
  }

  let lastTime = performance.now();
  function tick(now) {
    const delta = Math.min(32, now - lastTime);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.wobble += p.wobbleSpeed * delta;
      p.x += p.vx + Math.sin(p.wobble) * 0.3;
      p.y += p.vy;
      p.rot += p.rotSpeed;

      // slight wind
      p.vx += (Math.sin(now * 0.0002 + i) * 0.002);

      drawPetal(p);

      if (p.y > height + 40) {
        petals[i] = createPetal(Math.random() * width);
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Interaction: on click, spawn a small burst
  canvas.addEventListener('pointerdown', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    for (let i = 0; i < 8; i++) petals.push(createPetal(x));
  });
})();

// === Carrusel Día de Muertos ===
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track?.children || []);
  const nextBtn = document.querySelector(".carousel-btn.next");
  const prevBtn = document.querySelector(".carousel-btn.prev");

  // Si no hay carrusel o diapositivas, no ejecutar el script.
  if (!track || slides.length === 0 || !nextBtn || !prevBtn) {
    console.warn("Elementos del carrusel no encontrados.");
    return;
  }

  let currentIndex = 0;
  let autoSlideInterval; // Variable para controlar el intervalo

  function updateCarousel() {
    // Asegurarse de que hay diapositivas antes de medir
    if (slides.length > 0) {
      const slideWidth = slides[0].getBoundingClientRect().width;
      // CORRECCIÓN: Se usaron comillas invertidas (`) para la plantilla de cadena.
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  // === Event Listeners ===

  // Botones de navegación
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Ajustar el carrusel si la ventana cambia de tamaño
  window.addEventListener("resize", updateCarousel);

  // Funciones para el auto-deslizamiento
  function startAutoSlide() {
    // Limpiar cualquier intervalo anterior para evitar duplicados
    clearInterval(autoSlideInterval); 
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }


  
  // Pausar el carrusel al pasar el mouse sobre él
  track.addEventListener("mouseenter", stopAutoSlide);
  track.addEventListener("mouseleave", startAutoSlide);

  // Iniciar todo
  updateCarousel();
  startAutoSlide();
});