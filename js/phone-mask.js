document.addEventListener('DOMContentLoaded', function() {
    // Основная форма
    const phoneInput = document.querySelector('.order-specialist__input[type="tel"]');
    const nameInput = document.querySelector('.order-specialist__input[type="text"]');
    const submitButton = document.querySelector('.order-specialist__button');
    const form = document.querySelector('.order-specialist__form');
    const consentCheckbox = document.querySelector('.order-specialist__checkbox');
    
    // Модальная форма
    const modalPhoneInput = document.getElementById('modalPhone');
    const modalNameInput = document.getElementById('modalName');
    const modalSubmitButton = document.querySelector('.modal__button');
    const modalForm = document.querySelector('.modal__form');
    const modalConsentCheckbox = document.querySelector('.modal__checkbox');
    
    // Применяем маску к основной форме
    if (phoneInput && nameInput && submitButton) {
        initPhoneMask(phoneInput, nameInput, submitButton, form, consentCheckbox);
    }
    
    // Применяем маску к модальной форме
    if (modalPhoneInput && modalNameInput && modalSubmitButton) {
        initPhoneMask(modalPhoneInput, modalNameInput, modalSubmitButton, modalForm, modalConsentCheckbox);
    }
    
    function initPhoneMask(phoneInput, nameInput, submitButton, form, consentCheckbox) {
        if (!phoneInput || !nameInput || !submitButton) return;
        
        const placeholder = 'Введите ваш телефон';
        const phonePrefix = '+7 (';
        
        function formatPhone(value) {
            // Удаляем все нецифровые символы
            let digits = value.replace(/\D/g, '');
            
            // Если начинается с 7 или 8, убираем первую цифру
            if (digits.startsWith('7')) {
                digits = digits.substring(1);
            } else if (digits.startsWith('8')) {
                digits = digits.substring(1);
            }
            
            // Ограничиваем до 10 цифр
            digits = digits.substring(0, 10);
            
            if (digits.length === 0) {
                return phonePrefix;
            }
            
            let formatted = phonePrefix;
            
            if (digits.length > 0) {
                formatted += digits.substring(0, 3);
            }
            
            if (digits.length >= 3) {
                formatted += ')';
            }
            
            if (digits.length >= 4) {
                formatted += ' ' + digits.substring(3, 6);
            }
            
            if (digits.length >= 7) {
                formatted += '-' + digits.substring(6, 8);
            }
            
            if (digits.length >= 9) {
                formatted += '-' + digits.substring(8, 10);
            }
            
            return formatted;
        }
        
        // Обработка фокуса
        phoneInput.addEventListener('focus', function() {
            if (this.value === '' || this.value === placeholder) {
                this.value = phonePrefix;
            }
        });
        
        // Обработка blur
        phoneInput.addEventListener('blur', function() {
            const value = this.value.replace(/\D/g, '');
            if (value.length === 0 || value === '7') {
                this.value = '';
                this.placeholder = placeholder;
            }
        });
        
        // Обработка ввода
        phoneInput.addEventListener('input', function(e) {
            const cursorPosition = this.selectionStart;
            const oldValue = this.value;
            
            // Если пользователь пытается удалить префикс +7 (, предотвращаем это
            if (this.value.length < phonePrefix.length && !this.value.startsWith(phonePrefix)) {
                this.value = phonePrefix;
                this.setSelectionRange(phonePrefix.length, phonePrefix.length);
                return;
            }
            
            // Получаем только цифры
            let digits = this.value.replace(/\D/g, '');
            
            // Убираем первую 7 если есть
            if (digits.startsWith('7')) {
                digits = digits.substring(1);
            } else if (digits.startsWith('8')) {
                digits = digits.substring(1);
            }
            
            // Ограничиваем до 10 цифр
            digits = digits.substring(0, 10);
            
            // Форматируем
            const formatted = formatPhone(digits);
            this.value = formatted;
            
            // Восстанавливаем позицию курсора
            let newCursorPosition = cursorPosition;
            const oldLength = oldValue.length;
            const newLength = formatted.length;
            
            if (oldLength < newLength) {
                // Добавлен символ
                newCursorPosition = cursorPosition + (newLength - oldLength);
            } else if (oldLength > newLength) {
                // Удален символ
                newCursorPosition = Math.max(phonePrefix.length, cursorPosition - (oldLength - newLength));
            }
            
            // Убеждаемся, что курсор не попадает в префикс
            if (newCursorPosition < phonePrefix.length) {
                newCursorPosition = phonePrefix.length;
            }
            
            this.setSelectionRange(newCursorPosition, newCursorPosition);
            
            // Проверяем валидность формы
            checkFormValidity();
        });
        
        // Предотвращаем ввод нецифровых символов (кроме управляющих)
        phoneInput.addEventListener('keydown', function(e) {
            // Разрешаем: Backspace, Delete, Tab, Escape, Enter, стрелки
            if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Запрещаем все остальное, если это не цифра
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        
        // Функция проверки валидности формы
        function checkFormValidity() {
            const phoneValue = phoneInput.value.replace(/\D/g, '');
            const phoneDigits = phoneValue.startsWith('7') ? phoneValue.substring(1) : phoneValue;
            const nameValue = nameInput.value.trim();
            const isConsentChecked = consentCheckbox ? consentCheckbox.checked : true;
            
            const isPhoneValid = phoneDigits.length === 10;
            const isNameValid = nameValue.length > 0;
            
            if (isPhoneValid && isNameValid && isConsentChecked) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            } else {
                submitButton.disabled = true;
                submitButton.style.opacity = '0.8';
                submitButton.style.cursor = 'not-allowed';
            }
        }
        
        // Проверка при вводе имени
        nameInput.addEventListener('input', function() {
            checkFormValidity();
        });
        
        // Проверка при изменении чекбокса политики
        if (consentCheckbox) {
            consentCheckbox.addEventListener('change', function() {
                checkFormValidity();
            });
        }
        
        // Проверка при загрузке страницы
        checkFormValidity();
        
        // Предотвращение отправки формы если невалидна
        if (form) {
            form.addEventListener('submit', function(e) {
                const phoneValue = phoneInput.value.replace(/\D/g, '');
                const phoneDigits = phoneValue.startsWith('7') ? phoneValue.substring(1) : phoneValue;
                const nameValue = nameInput.value.trim();
                const isConsentChecked = consentCheckbox ? consentCheckbox.checked : true;
                
                if (phoneDigits.length !== 10 || nameValue.length === 0 || !isConsentChecked) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
});
