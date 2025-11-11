// Прелоадер - скрывается после полной загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.querySelector(".preloader");

    if (!preloader) {
        return;
    }

    // Ждем полной загрузки всех ресурсов
    window.addEventListener("load", function () {
        // Небольшая задержка для плавности
        setTimeout(function () {
            preloader.classList.add("hidden");
            
            // Удаляем прелоадер из DOM после анимации
            setTimeout(function () {
                preloader.remove();
            }, 500);
        }, 300);
    });
});

