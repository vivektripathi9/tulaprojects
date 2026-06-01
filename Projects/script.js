(function () {
/* =========================
   LUXORA GALLERY SLIDER
========================= */

const luxoraGalleryTrack = document.querySelector(".luxora-gallery-track");
const luxoraGallerySlides = document.querySelectorAll(".luxora-gallery-slide");
const luxoraGalleryPrevBtn = document.querySelector(".luxora-gallery-prev");
const luxoraGalleryNextBtn = document.querySelector(".luxora-gallery-next");
const luxoraGalleryDots = document.querySelectorAll(".luxora-gallery-dot");

let luxoraGalleryIndex = 0;

/* Update Slider */

function updateLuxoraGallerySlider() {

    luxoraGalleryTrack.style.transform =
        `translateX(-${luxoraGalleryIndex * 100}%)`;

    luxoraGalleryDots.forEach(dot => {
        dot.classList.remove("active");
    });

    luxoraGalleryDots[luxoraGalleryIndex].classList.add("active");
}

/* Next Slide */

function nextLuxoraGallerySlide() {

    luxoraGalleryIndex++;

    if (luxoraGalleryIndex >= luxoraGallerySlides.length) {
        luxoraGalleryIndex = 0;
    }

    updateLuxoraGallerySlider();
}

/* Prev Slide */

function prevLuxoraGallerySlide() {

    luxoraGalleryIndex--;

    if (luxoraGalleryIndex < 0) {
        luxoraGalleryIndex = luxoraGallerySlides.length - 1;
    }

    updateLuxoraGallerySlider();
}

/* Buttons */

luxoraGalleryNextBtn.addEventListener(
    "click",
    nextLuxoraGallerySlide
);

luxoraGalleryPrevBtn.addEventListener(
    "click",
    prevLuxoraGallerySlide
);

/* Dots */

luxoraGalleryDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        luxoraGalleryIndex = index;

        updateLuxoraGallerySlider();

    });

});

/* Auto Slide */

setInterval(() => {

    nextLuxoraGallerySlide();

}, 5000);

})();