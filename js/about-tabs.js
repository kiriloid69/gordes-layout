// Переключение вкладок в блоке "О компании"
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.about-company__nav-item');
    const contentItems = document.querySelectorAll('.about-company__item');

    if (navItems.length === 0 || contentItems.length === 0) {
        return;
    }

    navItems.forEach(function(navItem, index) {
        navItem.addEventListener('click', function(e) {
            e.preventDefault();

            // Убираем активный класс со всех элементов навигации
            navItems.forEach(function(item) {
                item.classList.remove('active');
            });

            // Добавляем активный класс к текущему элементу
            navItem.classList.add('active');

            // Скрываем все контентные блоки
            contentItems.forEach(function(item) {
                item.classList.remove('active');
            });

            // Показываем соответствующий контентный блок
            const targetContent = document.querySelector(`.about-company__item[data-content="${index}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});


