// Прелоадер - скрывается после загрузки первого экрана
document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.querySelector(".preloader");

    if (!preloader) {
        return;
    }

    let isHidden = false;

    function hidePreloader() {
        if (isHidden) {
            return;
        }
        isHidden = true;
        
            preloader.classList.add("hidden");
            
            // Удаляем прелоадер из DOM после анимации
            setTimeout(function () {
                preloader.remove();
            }, 500);
    }

    // Проверяем, загружено ли критическое изображение (логотип)
    const logoImg = preloader.querySelector("img");
    if (logoImg && logoImg.complete) {
        // Изображение уже загружено
        setTimeout(hidePreloader, 300);
    } else if (logoImg) {
        // Ждем загрузки логотипа, но не более 1.5 секунд
        logoImg.addEventListener("load", function() {
            setTimeout(hidePreloader, 300);
        });
        logoImg.addEventListener("error", function() {
            setTimeout(hidePreloader, 300);
        });
        
        // Максимальное время ожидания - 1.5 секунды
        setTimeout(hidePreloader, 1500);
    } else {
        // Если нет изображения, скрываем через небольшую задержку
        setTimeout(hidePreloader, 500);
    }
});

