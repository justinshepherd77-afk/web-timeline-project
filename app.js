const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

function openModal(modalId) {
    const modal = qs(`#${modalId}`);
    if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');

        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        modal.addEventListener('keydown', handleModalKeydown);
    }
}

function closeModal(modalId) {
    const modal = qs(`#${modalId}`);
    if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modal.removeEventListener('keydown', handleModalKeydown);
    }
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        const modal = e.currentTarget;
        closeModal(modal.id);
    }

    if (e.key === 'Tab') {
        const modal = e.currentTarget;
        const focusableElements = qsa(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            modal.querySelector('.modal-content')
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

qsa('[data-modal-close]').forEach(element => {
    element.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

const chatgptButtons = qsa('[data-chatgpt-button]');
chatgptButtons.forEach(button => {
    button.addEventListener('click', () => {
        openModal('chatgpt-modal');
    });
});

qsa('[data-feedback-mini]').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        console.log('Feedback submitted:', data);

        alert('Thank you for your feedback!');
        form.reset();

        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function setToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedPrefs = getFromLocalStorage('userPrefs', {});
    console.log('User preferences loaded:', savedPrefs);
});
