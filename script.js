// Optimasi scroll event dengan throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimasi parallax
const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset;
    requestAnimationFrame(() => {
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.dataset.speed;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}, 16);

window.addEventListener('scroll', handleParallax);

// Optimasi theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.remove('light-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
}

// Check saved theme dengan default dark
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(newTheme);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Fungsi untuk mengatur active state dengan smooth transition
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Panggil fungsi
setActiveNavLink();

// Tambahkan efek hover sound (opsional)
const navLinkElements = document.querySelectorAll('.nav-links a');
navLinkElements.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const hoverSound = new Audio('path/to/hover-sound.mp3'); // Tambahkan file audio jika diinginkan
        hoverSound.volume = 0.2;
        hoverSound.play();
    });
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    }
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with reduced motion preference
    AOS.init({
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
});

// Inisialisasi AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Tambahkan event listener untuk animasi stat counter
const statNumbers = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = parseInt(target.textContent);
            animateValue(target, 0, finalValue, 2000);
            observer.unobserve(target);
        }
    });
}, observerOptions);

statNumbers.forEach(number => observer.observe(number));

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}