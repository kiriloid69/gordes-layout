// Фиксированная шапка с плавным появлением при прокрутке
document.addEventListener("DOMContentLoaded", function () {
    const headerFixed = document.querySelector(".header-fixed");
    const scrollThreshold = 150; // Порог прокрутки в пикселях

    if (!headerFixed) {
        return;
    }

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Если прокрутка больше порога, всегда показываем фиксированную шапку
        if (scrollTop >= scrollThreshold) {
            headerFixed.classList.add("visible");
        } else {
            // Если прокрутка меньше порога, скрываем
            headerFixed.classList.remove("visible");
        }
    }

    // Оптимизация с помощью requestAnimationFrame
    let ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Инициализация бургер-меню для фиксированной шапки
    const burgerMenuFixed = document.getElementById("burgerMenuFixed");
    if (burgerMenuFixed) {
        const navListFixed = headerFixed.querySelector(".nav__list");
        const menuOverlay = document.querySelector(".menu-overlay");
        
        if (navListFixed) {
            burgerMenuFixed.addEventListener("click", function () {
                const isActive = navListFixed.classList.contains("active");
                navListFixed.classList.toggle("active");
                burgerMenuFixed.classList.toggle("active");
                if (menuOverlay) {
                    menuOverlay.classList.toggle("active");
                }
                document.body.style.overflow = !isActive ? "hidden" : "";
            });

            if (menuOverlay) {
                menuOverlay.addEventListener("click", function () {
                    navListFixed.classList.remove("active");
                    burgerMenuFixed.classList.remove("active");
                    menuOverlay.classList.remove("active");
                    document.body.style.overflow = "";
                });
            }
        }
    }
});

