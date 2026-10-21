// Menjalankan semua fitur interaktif setelah halaman siap
document.addEventListener('DOMContentLoaded', () => {
    linkNavbar();
    aktifkanScrollSpy();
    animasiHasilPenggunaan();
    validasiEmailNewsletter();
});

// Menandai menu yang aktif sesuai bagian yang sedang dilihat (Bootstrap ScrollSpy)
const aktifkanScrollSpy = () => {
    new bootstrap.ScrollSpy(document.body, {
        target: '#navbar',
        rootMargin: '-30% 0px -60% 0px'
    });
};

// Mengisi progress bar hasil penggunaan saat bagian tersebut terlihat
const animasiHasilPenggunaan = () => {
    const bars = document.querySelectorAll('.progress-bar[data-nilai]');
    const isiBar = () => bars.forEach(bar => { bar.style.width = bar.dataset.nilai + '%'; });

    if (!('IntersectionObserver' in window)) return isiBar();

    const pengamat = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
            isiBar();
            pengamat.disconnect();
        }
    }, { threshold: 0.3 });
    pengamat.observe(document.getElementById('hasil-penggunaan'));
};

// Smooth scrolling dengan posisi disesuaikan tinggi navbar
const linkNavbar = () => {
    const navbar = document.getElementById('navbar');
    const menu = document.getElementById('navbarSupportedContent');
    const links = document.querySelectorAll('a.nav-link, a.navbar-brand');
    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            e.preventDefault();

            // Tutup menu hamburger pada layar ponsel
            if (menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }

            const posisiTarget = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
            window.scrollTo({
                top: posisiTarget,
                behavior: kurangiGerak ? 'auto' : 'smooth'
            });
        });
    });
};

// Format email: teks sebelum @, domain, titik, lalu ekstensi minimal 2 huruf
const polaEmail = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

// Validasi newsletter. Modal konfirmasi hanya simulasi antarmuka
const validasiEmailNewsletter = () => {
    const form = document.getElementById('newsletterForm');
    const inputEmail = document.getElementById('validationEmail');
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('newsletterModal'));

    const periksaEmail = () => {
        const valid = polaEmail.test(inputEmail.value.trim());
        inputEmail.setCustomValidity(valid ? '' : 'Format email tidak valid');
        return valid;
    };

    inputEmail.addEventListener('input', () => {
        if (form.classList.contains('was-validated')) periksaEmail();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = periksaEmail();
        form.classList.add('was-validated');

        if (valid) {
            modal.show();
            form.reset();
            form.classList.remove('was-validated');
        }
    });
};
