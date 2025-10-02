function applyStreak(element) {
    if (!element) return;

    element.classList.add('streak');

    setTimeout(() => {
        element.classList.remove('streak');
    }, 300);
}

function fadeInUp(element) {
    if (!element) return;

    element.classList.add('fade-in-up');
}

function parallaxScroll(backgroundElement, factor = 0.5) {
    if (!backgroundElement) return;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const yPos = -(scrolled * factor);
        backgroundElement.style.transform = `translateY(${yPos}px)`;
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
}

const parallaxBg = document.querySelector('.parallax-bg');
if (parallaxBg) {
    parallaxScroll(parallaxBg, 0.3);
}
