// js/main.js

// Load Component Function (Reusable for all components)
async function loadComponent(id, file) {
    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${file} not found`);
        document.getElementById(id).innerHTML = await res.text();
        console.log(`[DevOps Portal] ✅ Component loaded: #${id} ← ${file}`);
        if (id === 'navbar') bindThemeToggle(); // Re-bind after load
    } catch (err) {
        console.warn(`[DevOps Portal] ⚠️ Using inline fallback for #${id} (${err.message})`);
    }
}

// Theme Toggle Binding with Persistence
function bindThemeToggle() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleLabel = document.getElementById('toggleLabel');

    if (!toggleBtn) return;

    const updateUI = (theme) => {
        const isLight = theme === 'light';
        toggleIcon.textContent = isLight ? '☀️' : '🌙';
        toggleLabel.textContent = isLight ? 'Light' : 'Dark';
        html.setAttribute('data-theme', theme);
    };

    // Initial state
    const savedTheme = localStorage.getItem('theme') || 'dark';
    updateUI(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        updateUI(nextTheme);
    });
}

// Custom Cursor Logic
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    if (!cursor || !cursorRing) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX - 6 + 'px';
        cursor.style.top = mouseY - 6 + 'px';
    });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX - 18 + 'px';
        cursorRing.style.top = ringY - 18 + 'px';
        requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .status-card, .btn-primary, .btn-secondary').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadComponent("navbar", "/components/navbar.html");
    loadComponent("footer", "/components/footer.html");
    bindThemeToggle();
    initCustomCursor();
});