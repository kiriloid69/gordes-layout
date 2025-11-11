// Переключение между десктопным и мобильным слайдерами отзывов и сертификатов
// Загружает изображения только для активного слайдера, чтобы не грузить страницу

document.addEventListener("DOMContentLoaded", function () {
    const mobileBreakpoint = 480;
    const reviewsDesktopSliders = document.querySelectorAll(".reviews__slider--desktop");
    const reviewsMobileSliders = document.querySelectorAll(".reviews__slider--mobile");
    const licensesDesktopSliders = document.querySelectorAll(".licenses__slider--desktop");
    const licensesMobileSliders = document.querySelectorAll(".licenses__slider--mobile");

    let reviewsMobileImagesLoaded = false;
    let licensesMobileImagesLoaded = false;

    function switchSliders() {
        const isMobile = window.innerWidth <= mobileBreakpoint;

        // Переключение слайдеров отзывов
        reviewsDesktopSliders.forEach(function (slider) {
            if (isMobile) {
                slider.style.display = "none";
            } else {
                slider.style.display = "block";
            }
        });

        reviewsMobileSliders.forEach(function (slider) {
            if (isMobile) {
                slider.style.display = "block";
                // Ленивая загрузка изображений мобильного слайдера отзывов (только один раз)
                if (!reviewsMobileImagesLoaded) {
                    loadMobileImages(slider);
                    reviewsMobileImagesLoaded = true;
                }
            } else {
                slider.style.display = "none";
            }
        });

        // Переключение слайдеров сертификатов
        licensesDesktopSliders.forEach(function (slider) {
            if (isMobile) {
                slider.style.display = "none";
            } else {
                slider.style.display = "block";
            }
        });

        licensesMobileSliders.forEach(function (slider) {
            if (isMobile) {
                slider.style.display = "block";
                // Ленивая загрузка изображений мобильного слайдера сертификатов (только один раз)
                if (!licensesMobileImagesLoaded) {
                    loadMobileImages(slider);
                    licensesMobileImagesLoaded = true;
                }
            } else {
                slider.style.display = "none";
            }
        });
    }

    function loadMobileImages(slider) {
        const images = slider.querySelectorAll("img[data-src]");
        images.forEach(function (img) {
            if (img.dataset.src) {
                // Загружаем изображение только если оно еще не загружено
                if (!img.src || img.src === window.location.href) {
                    img.src = img.dataset.src;
                }
                img.removeAttribute("data-src");
            }
        });
    }

    // Инициализация при загрузке
    switchSliders();

    // Переключение при изменении размера окна
    let resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            switchSliders();
        }, 100);
    });
});

