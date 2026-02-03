
(function () {
    const COLLAPSED_CLASS = 'is-collapsed';
    const HIDDEN_CLASS = 'is-hidden';
    const VISIBLE_ITEMS = 5;

    function init() {
        const columns = document.querySelectorAll('.footer-links__column');
        columns.forEach((column) => {
            const list = column.querySelector('.footer-links__list[data-collapsible]');
            const toggle = column.querySelector('.footer-links__toggle');

            if (!list || !toggle) return;

            const items = list.querySelectorAll('li');
            if (items.length <= VISIBLE_ITEMS) {
                toggle.classList.add(HIDDEN_CLASS);
                toggle.setAttribute('aria-hidden', 'true');
                return;
            }

            list.classList.add(COLLAPSED_CLASS);
            toggle.classList.remove(HIDDEN_CLASS);
            toggle.setAttribute('aria-hidden', 'false');

            const textSpan = toggle.querySelector('.footer-links__toggle-text');
            const icon = toggle.querySelector('.footer-links__toggle-icon');

            toggle.addEventListener('click', function () {
                const isCollapsed = list.classList.toggle(COLLAPSED_CLASS);
                if (textSpan) textSpan.textContent = isCollapsed ? 'Показать ещё' : 'Скрыть';
                if (icon) icon.textContent = isCollapsed ? 'expand_more' : 'expand_less';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
