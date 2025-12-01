// Выпадающее меню для мобильных устройств (по клику)
document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    
    // Проверяем, мобильное ли устройство
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    dropdownItems.forEach(function(item) {
        const link = item.querySelector('.nav__link');
        const dropdown = item.querySelector('.nav__dropdown');
        
        if (!link || !dropdown) {
            return;
        }
        
        // Обработчик клика для мобильных
        link.addEventListener('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем всплытие события
                
                // Закрываем другие открытые меню
                dropdownItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherDropdown = otherItem.querySelector('.nav__dropdown');
                        if (otherDropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    }
                });
                
                // Переключаем текущее меню
                item.classList.toggle('active');
                dropdown.classList.toggle('active');
            }
        });
        
        // При клике на ссылки внутри выпадающего меню - закрываем основное меню
        const dropdownLinks = dropdown.querySelectorAll('.nav__dropdown-link');
        dropdownLinks.forEach(function(dropdownLink) {
            dropdownLink.addEventListener('click', function() {
                if (isMobile()) {
                    // Закрываем выпадающее меню
                    item.classList.remove('active');
                    dropdown.classList.remove('active');
                    
                    // Закрываем основное бургер-меню
                    const burgerMenu = document.getElementById('burgerMenu');
                    const navList = item.closest('.nav__list');
                    const menuOverlay = document.getElementById('menuOverlay');
                    
                    if (burgerMenu && navList && menuOverlay) {
                        burgerMenu.classList.remove('active');
                        navList.classList.remove('active');
                        menuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                    }
                }
            });
        });
        
        // Закрытие выпадающего меню при клике вне его (но не закрываем основное меню)
        document.addEventListener('click', function(e) {
            if (isMobile() && !item.contains(e.target) && !link.contains(e.target)) {
                item.classList.remove('active');
                dropdown.classList.remove('active');
            }
        });
    });
    
    // Обновление при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Закрываем все меню при изменении размера
            if (!isMobile()) {
                dropdownItems.forEach(function(item) {
                    item.classList.remove('active');
                    const dropdown = item.querySelector('.nav__dropdown');
                    if (dropdown) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        }, 250);
    });
});

