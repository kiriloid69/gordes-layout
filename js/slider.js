document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".slider");

    if (sliders.length === 0) {
        console.warn("Фото не найдены на странице");
        return;
    }

    sliders.forEach(function (slider) {
        initSlider(slider);
    });

    function initSlider(slider) {
        const track = slider.querySelector(".slider__track");
        const items = slider.querySelectorAll(".slider__item");
        const prevBtn = slider.querySelector(".slider__arrow--prev");
        const nextBtn = slider.querySelector(".slider__arrow--next");
        const dotsContainer = slider.querySelector(".slider__dots");

        let currentIndex = 0;
        const totalItems = items.length;

        if (dotsContainer && totalItems > 1) {
            items.forEach(function (item, index) {
                const dot = document.createElement("button");
                dot.className = "slider__dot";
                if (index === 0) dot.classList.add("active");
                dot.setAttribute("aria-label", `Перейти к слайду ${index + 1}`);
                dot.addEventListener("click", function () {
                    goToSlide(index);
                });
                dotsContainer.appendChild(dot);
            });
        }

        function goToSlide(index, smooth = true) {
            // Циклическая прокрутка
            if (index < 0) {
                index = totalItems - 1;
            } else if (index >= totalItems) {
                index = 0;
            }

            currentIndex = index;

            if (smooth) {
                track.style.transition = "transform 0.5s ease";
            } else {
                track.style.transition = "none";
            }

            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".slider__dot");
                dots.forEach(function (dot, i) {
                    if (i === currentIndex) {
                        dot.classList.add("active");
                    } else {
                        dot.classList.remove("active");
                    }
                });
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                goToSlide(currentIndex + 1);
            });
        }

        items.forEach(function (item, index) {
            const img = item.querySelector("img");
            if (img) {
                img.style.cursor = "pointer";
                img.addEventListener("click", function () {
                    currentIndex = index;
                    goToSlide(index);
                    openLightbox(img.src, img.alt, items, index);
                });
            }
        });

        track.style.transform = "translateX(0)";
    }

    function openLightbox(src, alt, items, startIndex) {
        if (!items || items.length === 0) return;

        let currentLightboxIndex = startIndex;
        const totalLightboxItems = items.length;

        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";

        let lightboxHTML = `
            <div class="lightbox__overlay"></div>
            <div class="lightbox__content">
                <button class="lightbox__close" aria-label="Закрыть">
                    <i class="material-icons">close</i>
                </button>`;

        if (totalLightboxItems > 1) {
            lightboxHTML += `
                <button class="lightbox__arrow lightbox__arrow--prev" aria-label="Предыдущее изображение">
                    <i class="material-icons">chevron_left</i>
                </button>
                <button class="lightbox__arrow lightbox__arrow--next" aria-label="Следующее изображение">
                    <i class="material-icons">chevron_right</i>
                </button>`;
        }

        lightboxHTML += `
                <img src="${src}" alt="${alt}" class="lightbox__image" />
            </div>
        `;

        lightbox.innerHTML = lightboxHTML;
        document.body.appendChild(lightbox);
        document.body.style.overflow = "hidden";

        const overlay = lightbox.querySelector(".lightbox__overlay");
        const closeBtn = lightbox.querySelector(".lightbox__close");
        const lightboxImage = lightbox.querySelector(".lightbox__image");
        const prevArrow = lightbox.querySelector(".lightbox__arrow--prev");
        const nextArrow = lightbox.querySelector(".lightbox__arrow--next");

        function updateLightboxImage(index) {
            if (index < 0) index = totalLightboxItems - 1;
            if (index >= totalLightboxItems) index = 0;

            currentLightboxIndex = index;
            const newImg = items[index].querySelector("img");
            if (newImg) {
                lightboxImage.src = newImg.src;
                lightboxImage.alt = newImg.alt || "";
            }
        }

        if (prevArrow) {
            prevArrow.addEventListener("click", function (e) {
                e.stopPropagation();
                updateLightboxImage(currentLightboxIndex - 1);
            });
        }

        if (nextArrow) {
            nextArrow.addEventListener("click", function (e) {
                e.stopPropagation();
                updateLightboxImage(currentLightboxIndex + 1);
            });
        }

        function handleKeydown(e) {
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowLeft" && totalLightboxItems > 1) {
                updateLightboxImage(currentLightboxIndex - 1);
            } else if (e.key === "ArrowRight" && totalLightboxItems > 1) {
                updateLightboxImage(currentLightboxIndex + 1);
            }
        }

        document.addEventListener("keydown", handleKeydown);

        function closeLightbox() {
            lightbox.classList.add("closing");
            document.removeEventListener("keydown", handleKeydown);
            setTimeout(function () {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
                document.body.style.overflow = "";
            }, 300);
        }

        overlay.addEventListener("click", closeLightbox);
        closeBtn.addEventListener("click", closeLightbox);

        setTimeout(function () {
            lightbox.classList.add("active");
        }, 10);
    }

    function openSingleImageLightbox(src, alt) {
        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.innerHTML = `
            <div class="lightbox__overlay"></div>
            <div class="lightbox__content">
                <button class="lightbox__close" aria-label="Закрыть">
                    <i class="material-icons">close</i>
                </button>
                <img src="${src}" alt="${alt}" class="lightbox__image" />
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = "hidden";

        const overlay = lightbox.querySelector(".lightbox__overlay");
        const closeBtn = lightbox.querySelector(".lightbox__close");

        function closeLightbox() {
            lightbox.classList.add("closing");
            setTimeout(function () {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
                document.body.style.overflow = "";
            }, 300);
        }

        overlay.addEventListener("click", closeLightbox);
        closeBtn.addEventListener("click", closeLightbox);

        // Закрытие по Escape
        function handleEscape(e) {
            if (e.key === "Escape") {
                closeLightbox();
                document.removeEventListener("keydown", handleEscape);
            }
        }
        document.addEventListener("keydown", handleEscape);

        setTimeout(function () {
            lightbox.classList.add("active");
        }, 10);
    }

    const licenseImage = document.querySelector(".licenses__image");
    if (licenseImage) {
        licenseImage.addEventListener("click", function () {
            openSingleImageLightbox(this.src, this.alt);
        });
    }

    const licenseButton = document.querySelector(".hero__button.yellow-button");
    if (licenseButton && licenseButton.textContent.trim() === "Государственная лицензия") {
        licenseButton.addEventListener("click", function (e) {
            e.preventDefault();
            if (licenseImage) {
                openSingleImageLightbox(licenseImage.src, licenseImage.alt);
            }
        });
    }
});
