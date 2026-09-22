// =========================================
// Theme toggle (dark / light)
// =========================================
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    );
  }
}

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (e) {
    // localStorage unavailable; fall back to system preference
  }
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // Ignore storage errors (e.g. private browsing)
    }
  });
}

// =========================================
// Typing animation for hero role text
// =========================================
const typedTextEl = document.getElementById('typedText');

if (typedTextEl) {
  const roles = ['IT Support', 'Web Developer', 'Team Leader'];
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseAfterType = 1500;
  const pauseAfterDelete = 400;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentWord = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      typedTextEl.textContent = currentWord.slice(0, charIndex);

      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseAfterType);
        return;
      }
      setTimeout(typeLoop, typingSpeed);
    } else {
      charIndex--;
      typedTextEl.textContent = currentWord.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, pauseAfterDelete);
        return;
      }
      setTimeout(typeLoop, deletingSpeed);
    }
  }

  typeLoop();
}

// =========================================
// Mobile menu toggle
// =========================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('primaryNav');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after clicking a nav link (mobile)
  navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// =========================================
// Smooth scrolling for in-page nav links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update the URL hash without jumping
    history.pushState(null, '', targetId);
  });
});

// =========================================
// Contact form submission (client-side only)
// =========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all fields before sending.';
      formStatus.style.color = '#e5534b';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.style.color = '#e5534b';
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    formStatus.textContent = 'Sending...';
    formStatus.style.color = '';

    const formData = new FormData(contactForm);

    fetch('https://formsubmit.co/ajax/eugeneboypradosanchez@gmail.com', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      })
      .then(() => {
        formStatus.textContent = `Thanks, ${name}! Your message has been sent.`;
        formStatus.style.color = '';
        contactForm.reset();
      })
      .catch(() => {
        formStatus.textContent = 'Something went wrong. Please email me directly instead.';
        formStatus.style.color = '#e5534b';
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

// =========================================
// Footer year
// =========================================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}