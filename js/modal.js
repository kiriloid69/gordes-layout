// Модальное окно формы
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('orderModal');
    const modalClose = modal.querySelector('.modal__close');
    const modalOverlay = modal;
    const modalForm = modal.querySelector('.modal__form');
    const modalPhoneInput = document.getElementById('modalPhone');
    const modalNameInput = document.getElementById('modalName');
    const modalSubmitButton = modal.querySelector('.modal__button');

    // Находим все кнопки CTA по тексту и классам
    const allButtons = document.querySelectorAll('button');
    const ctaButtons = Array.from(allButtons).filter(function(button) {
        const text = button.textContent.trim();
        const hasCallbackClass = button.classList.contains('callback-button');
        const isHeroButton = button.classList.contains('hero__button') && !button.classList.contains('yellow-button');
        
        // Исключаем кнопку "Узнать стоимость" из hero
        const isHeroCostButton = isHeroButton && text === 'Узнать стоимость';
        
        return hasCallbackClass ||
               (isHeroButton && !isHeroCostButton) ||
               text === 'Заказать обратный звонок' ||
               text === 'Заказать обработку' ||
               text === 'Заказать консультацию' ||
               text === 'Получить консультацию';
    });

    // Функция открытия модального окна
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Триггерим события для обновления валидации при открытии
        setTimeout(function() {
            if (modalPhoneInput) {
                modalPhoneInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (modalNameInput) {
                modalNameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const modalConsentCheckbox = modalForm.querySelector('.modal__checkbox');
            if (modalConsentCheckbox) {
                modalConsentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
            modalPhoneInput.focus();
        }, 300);
    }

    // Функция закрытия модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Очистка формы
        modalForm.reset();
        modalSubmitButton.disabled = true;
        // Триггерим события для обновления валидации
        if (modalPhoneInput) {
            modalPhoneInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (modalNameInput) {
            modalNameInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const modalConsentCheckbox = modalForm.querySelector('.modal__checkbox');
        if (modalConsentCheckbox) {
            modalConsentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Обработчики для кнопок открытия
    ctaButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Если это кнопка "Узнать стоимость", сначала скроллим, потом открываем форму
            if (button.textContent.trim() === 'Узнать стоимость') {
                e.preventDefault();
                const priceSection = document.getElementById('price');
                if (priceSection) {
                    const headerOffset = 80;
                    const elementPosition = priceSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Открываем форму через небольшую задержку
                    setTimeout(openModal, 500);
                } else {
                    openModal();
                }
            } else {
                e.preventDefault();
                openModal();
            }
        });
    });

    // Закрытие по клику на overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Закрытие по клику на кнопку закрытия
    modalClose.addEventListener('click', closeModal);

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });


    // Обработка отправки формы
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь можно добавить отправку данных на сервер
            alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
            closeModal();
        });
    }
});

