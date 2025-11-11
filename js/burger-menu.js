// Бургер-меню
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    
    if (!burgerMenu) {
        console.warn('Burger menu button not found');
        return;
    }
    
    // Находим nav__list в обычном header, а не в header-fixed
    // Ищем ближайший header, который не является header-fixed
    let header = burgerMenu.closest('.header');
    if (!header || header.classList.contains('header-fixed')) {
        // Если не нашли или это header-fixed, ищем обычный header
        header = document.querySelector('.header:not(.header-fixed)');
    }
    
    const navList = header ? header.querySelector('.nav__list') : document.querySelector('.nav__list:not(.header-fixed .nav__list)');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if (!navList || !menuOverlay) {
        console.error('Burger menu elements not found:', {
            burgerMenu: !!burgerMenu,
            navList: !!navList,
            menuOverlay: !!menuOverlay,
            header: !!header
        });
        return;
    }

    let scrollPosition = 0;

    function openMenu() {
        // Сохраняем позицию скролла
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        burgerMenu.classList.add('active');
        navList.classList.add('active');
        menuOverlay.classList.add('active');
        
        // Блокируем прокрутку
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
    }

    function closeMenu() {
        burgerMenu.classList.remove('active');
        navList.classList.remove('active');
        menuOverlay.classList.remove('active');
        
        // Разблокируем прокрутку
        body.style.overflow = '';
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        
        // Восстанавливаем позицию скролла
        window.scrollTo(0, scrollPosition);
    }

    // Открытие/закрытие меню по клику на бургер
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        if (burgerMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Закрытие меню по клику на оверлей
    menuOverlay.addEventListener('click', function() {
        closeMenu();
    });

    // Закрытие меню по клику на ссылку в меню
    const navLinks = navList.querySelectorAll('.nav__link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Закрытие меню по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && burgerMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Закрытие меню при изменении размера окна (если стало больше 768px)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && burgerMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});

