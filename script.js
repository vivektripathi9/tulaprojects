(function () {
// Legacy menu markup (demo pages only) — home uses navbar.js
// Use a distinct name so this file can load on the same page as navbar.js (no duplicate `const overlay`).
const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");
const legacyDemoOverlay = document.getElementById("overlay");

if (menuToggle && sideMenu && legacyDemoOverlay) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    sideMenu.classList.toggle("active");
    legacyDemoOverlay.classList.toggle("active");

    if (sideMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });

  legacyDemoOverlay.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    sideMenu.classList.remove("active");
    legacyDemoOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  const navLinks = document.querySelectorAll(".menu-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      sideMenu.classList.remove("active");
      legacyDemoOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });
}

const detailsBtn = document.querySelector(".details-btn");

if (detailsBtn) {
  detailsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    alert("More Details button clicked!");
  });
}

// Gallery Section

const galleries = [
  [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  ],
  [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471",
  ],
];

let currentGallery = 0;
let currentIndex = 0;

const sliderTrack = document.getElementById("sliderTrack");
const buttons = document.querySelectorAll(".gallery-btn");

if (sliderTrack) {
  function renderSlider() {
    const images = galleries[currentGallery];
    const total = images.length;

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    sliderTrack.innerHTML = `
    <div class="slide left">
      <img src="${images[prevIndex]}?w=1200&q=80" alt="Previous Image">
    </div>
    <div class="slide center">
      <img src="${images[currentIndex]}?w=1200&q=80" alt="Active Image">
    </div>
    <div class="slide right">
      <img src="${images[nextIndex]}?w=1200&q=80" alt="Next Image">
    </div>
  `;
  }

  function switchGallery(index) {
    currentGallery = index;
    currentIndex = 0;

    buttons.forEach((btn) => btn.classList.remove("active"));
    buttons[index].classList.add("active");

    renderSlider();
  }

  renderSlider();
}

// Testimonial Section

/* =========================
       UNIQUE TULA TESTIMONIAL SLIDER
    ========================== */

function initializeTulaTestimonialSliderUnique() {
  const sliderShell = document.getElementById("tulaTestimonialSliderShell");
  const sliderTrack = document.getElementById("tulaTestimonialTrack");
  const dotsWrapper = document.getElementById("tulaTestimonialDots");
  const prevArrow = document.querySelector(".tula-testimonial-arrow-left");
  const nextArrow = document.querySelector(".tula-testimonial-arrow-right");

  if (!sliderShell || !sliderTrack || !dotsWrapper || !prevArrow || !nextArrow) {
    return;
  }

  const slides = Array.from(sliderTrack.children);

  let tulaCurrentIndex = 0;
  let tulaSlidesPerView = getTulaSlidesPerView();
  let tulaTotalPages = Math.ceil(slides.length / tulaSlidesPerView);

  let isDraggingTula = false;
  let startPosXTula = 0;
  let currentTranslateXTula = 0;
  let prevTranslateXTula = 0;
  let animationFrameTula = 0;

  function getTulaSlidesPerView() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function createTulaDotsUnique() {
    dotsWrapper.innerHTML = "";
    tulaTotalPages = Math.ceil(slides.length / tulaSlidesPerView);

    for (let i = 0; i < tulaTotalPages; i++) {
      const dot = document.createElement("button");
      dot.className = "tula-testimonial-dot";
      if (i === tulaCurrentIndex) dot.classList.add("active");

      dot.addEventListener("click", () => {
        tulaCurrentIndex = i;
        updateTulaSliderPositionUnique();
      });

      dotsWrapper.appendChild(dot);
    }
  }

  function updateTulaDotsUnique() {
    const dots = dotsWrapper.querySelectorAll(".tula-testimonial-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === tulaCurrentIndex);
    });
  }

  function updateTulaSliderPositionUnique(withTransition = true) {
    const shellWidth = sliderShell.offsetWidth;
    const moveAmount = shellWidth * tulaCurrentIndex;

    sliderTrack.style.transition = withTransition
      ? "transform 0.45s ease"
      : "none";
    sliderTrack.style.transform = `translateX(-${moveAmount}px)`;

    prevTranslateXTula = -moveAmount;
    currentTranslateXTula = -moveAmount;

    updateTulaDotsUnique();
  }

  function goToNextTulaSlideUnique() {
    if (tulaCurrentIndex < tulaTotalPages - 1) {
      tulaCurrentIndex++;
    } else {
      tulaCurrentIndex = 0;
    }
    updateTulaSliderPositionUnique();
  }

  function goToPrevTulaSlideUnique() {
    if (tulaCurrentIndex > 0) {
      tulaCurrentIndex--;
    } else {
      tulaCurrentIndex = tulaTotalPages - 1;
    }
    updateTulaSliderPositionUnique();
  }

  nextArrow.addEventListener("click", goToNextTulaSlideUnique);
  prevArrow.addEventListener("click", goToPrevTulaSlideUnique);

  /* Drag / Swipe */
  function touchStartTulaUnique(event) {
    isDraggingTula = true;
    sliderShell.classList.add("tula-dragging-active");
    startPosXTula = getPositionXTulaUnique(event);
    animationFrameTula = requestAnimationFrame(animationTulaUnique);
    sliderTrack.style.transition = "none";
  }

  function touchMoveTulaUnique(event) {
    if (!isDraggingTula) return;
    const currentPosition = getPositionXTulaUnique(event);
    currentTranslateXTula =
      prevTranslateXTula + currentPosition - startPosXTula;
  }

  function touchEndTulaUnique() {
    cancelAnimationFrame(animationFrameTula);
    isDraggingTula = false;
    sliderShell.classList.remove("tula-dragging-active");

    const movedBy = currentTranslateXTula - prevTranslateXTula;
    const threshold = 80;

    if (movedBy < -threshold) {
      goToNextTulaSlideUnique();
    } else if (movedBy > threshold) {
      goToPrevTulaSlideUnique();
    } else {
      updateTulaSliderPositionUnique();
    }
  }

  function getPositionXTulaUnique(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  function animationTulaUnique() {
    sliderTrack.style.transform = `translateX(${currentTranslateXTula}px)`;
    if (isDraggingTula) requestAnimationFrame(animationTulaUnique);
  }

  /* Mouse Events */
  sliderShell.addEventListener("mousedown", touchStartTulaUnique);
  sliderShell.addEventListener("mousemove", touchMoveTulaUnique);
  sliderShell.addEventListener("mouseup", touchEndTulaUnique);
  sliderShell.addEventListener("mouseleave", () => {
    if (isDraggingTula) touchEndTulaUnique();
  });

  /* Touch Events */
  sliderShell.addEventListener("touchstart", touchStartTulaUnique, {
    passive: true,
  });
  sliderShell.addEventListener("touchmove", touchMoveTulaUnique, {
    passive: true,
  });
  sliderShell.addEventListener("touchend", touchEndTulaUnique);

  /* Resize */
  window.addEventListener("resize", () => {
    const newSlidesPerView = getTulaSlidesPerView();

    if (newSlidesPerView !== tulaSlidesPerView) {
      tulaSlidesPerView = newSlidesPerView;
      tulaTotalPages = Math.ceil(slides.length / tulaSlidesPerView);

      if (tulaCurrentIndex >= tulaTotalPages) {
        tulaCurrentIndex = tulaTotalPages - 1;
      }

      createTulaDotsUnique();
      updateTulaSliderPositionUnique(false);
    } else {
      updateTulaSliderPositionUnique(false);
    }
  });

  /* Init */
  createTulaDotsUnique();
  updateTulaSliderPositionUnique(false);
}

initializeTulaTestimonialSliderUnique();

})();
