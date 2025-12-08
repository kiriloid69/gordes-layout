// Обработка кнопки "Читать далее" для services__text
document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtn = document.querySelector('.services__read-more');
    const servicesText = document.querySelector('.services__text');
    
    if (readMoreBtn && servicesText) {
        // Вычисляем высоту контента и устанавливаем начальную высоту (30% видимо)
        const fullHeight = servicesText.scrollHeight;
        const initialHeight = fullHeight * 0.3;
        
        servicesText.style.maxHeight = initialHeight + 'px';
        
        readMoreBtn.addEventListener('click', function() {
            const isExpanded = servicesText.classList.contains('expanded');
            
            if (isExpanded) {
                // Сворачиваем
                servicesText.classList.remove('expanded');
                servicesText.style.maxHeight = initialHeight + 'px';
                readMoreBtn.classList.remove('expanded');
                readMoreBtn.querySelector('span').textContent = 'Читать далее';
            } else {
                // Разворачиваем
                servicesText.classList.add('expanded');
                servicesText.style.maxHeight = fullHeight + 'px';
                readMoreBtn.classList.add('expanded');
                readMoreBtn.querySelector('span').textContent = 'Свернуть';
            }
        });
    }
    
    // Плавная прокрутка к блоку "Цены" при клике на кнопку "Узнать стоимость"
    const priceButton = document.querySelector('.hero__button:not(.yellow-button)');
    if (priceButton && priceButton.textContent.trim() === 'Узнать стоимость') {
        priceButton.addEventListener('click', function(e) {
            e.preventDefault();
            const priceSection = document.getElementById('price');
            if (priceSection) {
                const headerOffset = 80; // Отступ от верха (можно настроить)
                const elementPosition = priceSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Плавная прокрутка к блоку "Лицензии" при клике на ссылку "Смотреть все документы"
    const licensesLink = document.querySelector('.hero__link');
    if (licensesLink && licensesLink.textContent.trim() === 'Смотреть все документы') {
        licensesLink.addEventListener('click', function(e) {
            e.preventDefault();
            const licensesSection = document.getElementById('licenses');
            if (licensesSection) {
                const headerOffset = 80; // Отступ от верха (можно настроить)
                const elementPosition = licensesSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Плавная прокрутка к верху страницы
    const topLink = document.querySelector('.footer__top-link');
    if (topLink) {
        topLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Переключение табов в price-table
    const tabTitles = document.querySelectorAll('.price-table__table-title');
    const contentItems = document.querySelectorAll('.price-table__content-item');
    const dropdownButton = document.getElementById('price-table-dropdown-button');
    const dropdownList = document.getElementById('price-table-dropdown-list');
    const dropdownItems = document.querySelectorAll('.price-table__dropdown-item');
    const dropdownText = dropdownButton ? dropdownButton.querySelector('.price-table__dropdown-text') : null;

    // Функция для переключения таба
    function switchTab(tabIndex) {
        // Убираем активный класс со всех табов
        tabTitles.forEach(function(t) {
            t.classList.remove('active');
        });

        // Убираем активный класс со всего контента
        contentItems.forEach(function(item) {
            item.classList.remove('active');
        });

        // Добавляем активный класс к выбранному табу
        const selectedTab = document.querySelector(`.price-table__table-title[data-tab="${tabIndex}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Обновляем текст в dropdown кнопке
        const selectedDropdownItem = document.querySelector(`.price-table__dropdown-item[data-tab="${tabIndex}"]`);
        if (selectedDropdownItem && dropdownText) {
            dropdownText.textContent = selectedDropdownItem.textContent;
        }

        // Закрываем dropdown
        if (dropdownButton && dropdownList) {
            dropdownButton.classList.remove('active');
            dropdownList.classList.remove('active');
        }

        // Показываем соответствующий контент
        const targetContent = document.querySelector(`.price-table__content-item[data-content="${tabIndex}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    // Обработчик для кликов по табам
    if (tabTitles.length > 0 && contentItems.length > 0) {
        tabTitles.forEach(function(tab) {
            tab.addEventListener('click', function() {
                const tabIndex = this.getAttribute('data-tab');
                switchTab(tabIndex);
            });
        });
    }

    // Обработчик для кнопки dropdown
    if (dropdownButton && dropdownList) {
        dropdownButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = this.classList.contains('active');
            
            // Закрываем все открытые dropdown
            document.querySelectorAll('.price-table__dropdown-button').forEach(function(btn) {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.price-table__dropdown-list').forEach(function(list) {
                list.classList.remove('active');
            });

            // Открываем/закрываем текущий dropdown
            if (!isActive) {
                this.classList.add('active');
                dropdownList.classList.add('active');
            }
        });
    }

    // Обработчик для элементов dropdown
    if (dropdownItems.length > 0 && contentItems.length > 0) {
        dropdownItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const tabIndex = this.getAttribute('data-tab');
                switchTab(tabIndex);
            });
        });
    }

    // Закрытие dropdown при клике вне его
    document.addEventListener('click', function(e) {
        if (dropdownButton && dropdownList && 
            !dropdownButton.contains(e.target) && 
            !dropdownList.contains(e.target)) {
            dropdownButton.classList.remove('active');
            dropdownList.classList.remove('active');
        }
    });

    // Синхронизация высоты кнопок в каждом ряду cat-items
    function syncButtonHeights() {
        const catItemsContainers = document.querySelectorAll('.cat-items');
        
        catItemsContainers.forEach(function(container) {
            const items = container.querySelectorAll('.cat-item');
            if (items.length === 0) return;
            
            // Группируем элементы по рядам
            const rows = [];
            let currentRow = [];
            let currentTop = null;
            
            items.forEach(function(item, index) {
                const rect = item.getBoundingClientRect();
                
                if (currentTop === null || Math.abs(rect.top - currentTop) < 5) {
                    // Тот же ряд
                    currentRow.push(item);
                    if (currentTop === null) currentTop = rect.top;
                } else {
                    // Новый ряд
                    if (currentRow.length > 0) {
                        rows.push(currentRow);
                    }
                    currentRow = [item];
                    currentTop = rect.top;
                }
            });
            
            // Добавляем последний ряд
            if (currentRow.length > 0) {
                rows.push(currentRow);
            }
            
            // Для каждого ряда находим максимальную высоту кнопки и применяем ко всем
            rows.forEach(function(row) {
                let maxHeight = 0;
                const buttons = [];
                
                row.forEach(function(item) {
                    const button = item.querySelector('.cat-item__button');
                    if (button) {
                        buttons.push(button);
                        // Сбрасываем высоту для правильного измерения
                        button.style.height = 'auto';
                        const height = button.offsetHeight;
                        if (height > maxHeight) {
                            maxHeight = height;
                        }
                    }
                });
                
                // Применяем максимальную высоту ко всем кнопкам в ряду
                buttons.forEach(function(button) {
                    button.style.height = maxHeight + 'px';
                });
            });
        });
    }
    
    // Вызываем при загрузке и изменении размера окна
    syncButtonHeights();
    window.addEventListener('resize', syncButtonHeights);
    
    // Также вызываем после небольшой задержки для учета загрузки изображений
    setTimeout(syncButtonHeights, 500);
});

