document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ANIMIERTER TEXT (HERO SEKTION)
    // ==========================================
    const words = document.querySelectorAll('.animated-word');
    if (words.length > 0) {
        let currentIndex = 0;

        setInterval(() => {
            words[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % words.length;
            words[currentIndex].classList.add('active');
        }, 2500);
    }

    // ==========================================
    // 2. PROJEKTE FILTERN & HINWEIS-TEXT
    // ==========================================
    const filterButtons = document.querySelectorAll('.projects-filter .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreWrapper = document.querySelector('.projects-more-wrapper');
    const emptyMessage = document.getElementById('filter-empty-message');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {

                // Active-Klasse bei Buttons umschalten
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const selectedFilter = button.getAttribute('data-filter').toLowerCase();
                let visibleCardsCount = 0;

                // Karten filtern
                projectCards.forEach(card => {
                    const tagElement = card.querySelector('.project-category-tag');
                    const tagText = tagElement ? tagElement.textContent.toLowerCase() : '';

                    let isMatch = false;

                    // Filter-Logik
                    if (selectedFilter === 'all') {
                        isMatch = true;
                    } else if (selectedFilter === 'grafik' && tagText.includes('grafik')) {
                        isMatch = true;
                    } else if (selectedFilter === 'uiux' && (tagText.includes('ui') || tagText.includes('ux'))) {
                        isMatch = true;
                    } else if (selectedFilter === 'web' && tagText.includes('web')) {
                        isMatch = true;
                    } else if (selectedFilter === 'video' && tagText.includes('video')) {
                        isMatch = true;
                    }

                    // Sichtbarkeit umschalten
                    if (isMatch) {
                        if (selectedFilter === 'all' && card.classList.contains('is-hidden')) {
                            card.style.display = 'none';
                        } else {
                            card.style.display = 'flex';
                            visibleCardsCount++; // Zählt mit, wie viele Karten angezeigt werden
                        }
                    } else {
                        card.style.display = 'none';
                    }
                });

                // HINWEIS-TEXT EIN-/AUSBBLENDEN (wenn 0 Treffer wie z.B. bei Video)
                if (emptyMessage) {
                    if (visibleCardsCount === 0) {
                        emptyMessage.style.display = 'block';
                    } else {
                        emptyMessage.style.display = 'none';
                    }
                }

                // "Mehr anzeigen"-Button ausblenden, wenn nicht "Alle" aktiv ist
                if (loadMoreWrapper) {
                    if (selectedFilter !== 'all') {
                        loadMoreWrapper.style.display = 'none';
                    } else {
                        // Prüfen, ob bei "Alle" überhaupt noch versteckte Karten da sind
                        const hasHidden = document.querySelectorAll('.project-card.is-hidden').length > 0;
                        loadMoreWrapper.style.display = hasHidden ? 'flex' : 'none';
                    }
                }
            });
        });
    }

    // ==========================================
    // 3. PROJEKTE AUFKLAPPEN (LOAD MORE BUTTON)
    // ==========================================
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenCards = document.querySelectorAll('.project-card.is-hidden');

            hiddenCards.forEach(card => {
                card.classList.remove('is-hidden');
                card.style.display = 'flex';
            });

            // Versteckt den Button-Wrapper sanft nach dem Klick
            if (loadMoreWrapper) {
                loadMoreWrapper.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 4. AUTOMATIC SIDE NAV TRACKER (SCROLLSPY)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.side-nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            // Triggers active state when section reaches middle third of screen
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

});

// Schutz für E-Mail & Telefonnummer vor Bots
const emailEl = document.getElementById('safe-email');
if (emailEl) {
    const mail = `${emailEl.dataset.user}@${emailEl.dataset.domain}`;
    emailEl.href = `mailto:${mail}`;
    emailEl.textContent = mail;
}

const phoneEl = document.getElementById('safe-phone');
if (phoneEl) {
    const tel = `+${phoneEl.dataset.country} ${phoneEl.dataset.prefix} ${phoneEl.dataset.number}`;
    phoneEl.href = `tel:+${phoneEl.dataset.country}${phoneEl.dataset.prefix}${phoneEl.dataset.number}`;
    phoneEl.textContent = `Tel.: ${tel}`;
}
