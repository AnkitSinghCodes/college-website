document.addEventListener('DOMContentLoaded', () => {
    // Back to Top Logic - Moved to top for priority
    let backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) {
        // Inject button dynamically if missing from HTML
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.title = 'Go to top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }

    if (backToTopBtn) {
        const handleScroll = () => {
            const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            if (scrollPos > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check in case page is already scrolled
        handleScroll();

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hamburger menu logic has been relocated inside the loadComponent callback 
    // to execute correctly after the dynamic header content is loaded.
    // Hero Slider Logic
    const slides = document.querySelectorAll('.hero-image');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 4000; // Change slide every 4 seconds

        setInterval(() => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');

            // Move to next slide
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active class to new slide
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }


    // Category Modal Logic
    const categoryCards = document.querySelectorAll('.interactive-category');
    const modal = document.getElementById('categoryModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close-btn');

    const categoryData = {
        faculty: {
            title: "Meet Our Faculty",
            desc: "Explore our experienced and dedicated department-wise faculty members.",
            type: "buttons",
            items: [
                { id: "ce", label: "Civil Engineering", icon: "fa-city" },
                { id: "cse", label: "Computer Science & Engineering", icon: "fa-laptop-code" },
                { id: "eee", label: "Electrical and Electronics Engineering", icon: "fa-microchip" },
                { id: "sh", label: "Science & Humanities", icon: "fa-atom" }
            ]
        },
        staff: {
            title: "Meet Our Staff",
            desc: "Our institution is supported by a strong team of skilled staff members.",
            type: "buttons",
            items: [
                { id: "tech", label: "Technical Staff", icon: "fa-tools" },
                { id: "nontech", label: "Non-Teaching Staff", icon: "fa-user-shield" },
                { id: "admin", label: "Administrative Staff", icon: "fa-file-invoice" },
                { id: "cont", label: "Contingency Staff", icon: "fa-broom" },
                { id: "cas", label: "Casual Staff", icon: "fa-user-clock" }
            ]
        },
        students: {
            title: "Meet Our Students",
            desc: "Select your department to begin exploring class photos.",
            type: "wizard-dept"
        },
        alumni: {
            title: "Meet Our Alumni",
            desc: "Contributing to industries and organizations across the country.",
            type: "soon"
        }
    };

    function openModal(category, step = null) {
        const data = categoryData[category];
        if (!data) return;

        let contentHtml = `
            <div class="modal-header-section">
                <h2>${data.title}</h2>
                <p>${data.desc}</p>
            </div>
        `;

        if (data.type === "buttons") {
            contentHtml += `<div class="sub-category-grid">`;
            data.items.forEach(item => {
                contentHtml += `
                    <button class="sub-btn" onclick="showCategoryMembers('${category}', '${item.id}')">
                        <i class="fas ${item.icon}"></i>
                        ${item.label}
                    </button>
                `;
            });
            contentHtml += `</div>`;
        } else if (data.type === "wizard-dept") {
            contentHtml += `
                <div class="sub-category-grid">
                    <button class="sub-btn" onclick="showStudentYears('Computer Science & Engineering')">
                        <i class="fas fa-laptop-code"></i>
                        Computer Science & Engineering
                    </button>
                    <button class="sub-btn" onclick="showStudentYears('Civil Engineering')">
                        <i class="fas fa-city"></i>
                        Civil Engineering
                    </button>
                    <button class="sub-btn" onclick="showStudentYears('Computer Science & Engineering')">
                        <i class="fas fa-laptop-code"></i>
                        Computer Science & Engineering
                    </button>
                    <button class="sub-btn" onclick="showStudentYears('Electrical and Electronics Engineering')">
                        <i class="fas fa-microchip"></i>
                        Electrical and Electronics Engineering
                    </button>
                    <button class="sub-btn" onclick="showStudentYears('Science & Humanities')">
                        <i class="fas fa-atom"></i>
                        Science & Humanities
                    </button>
                </div>
            `;
        } else if (data.type === "soon") {
            contentHtml += `
                <div class="coming-soon-banner">
                    <i class="fas fa-tools"></i>
                    <h3>Coming Soon</h3>
                    <p>This section will showcase alumni achievements, placements, and success stories.</p>
                </div>
            `;
        }

        modalBody.innerHTML = contentHtml;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    // Commented out modal click listener as these cards now navigate directly to separate pages (faculty.html, staff.html, etc.).
    // This prevents the modal overlay from appearing and locking the scroll when returning to index.html via the browser's Back button.
    // categoryCards.forEach(card => {
    //     card.addEventListener('click', () => {
    //         const category = card.getAttribute('data-category');
    //         openModal(category);
    //     });
    // });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === document.querySelector('.modal-overlay')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Global helper functions for modal interactions
    window.showCategoryMembers = (category, subId) => {
        const deptLink = category === 'faculty' ? `<a href="departments/${subId}/profile.html" class="view-more-btn" style="text-decoration:none; margin-left: 10px;">View Full Dept Profile <i class="fas fa-external-link-alt"></i></a>` : '';

        modalBody.innerHTML = `
            <div class="modal-header-section">
                <button class="view-more-btn" style="margin-bottom: 20px;" onclick="openModal('${category}')">
                    <i class="fas fa-arrow-left"></i> Back to ${category}
                </button>
                ${deptLink}
                <h2>${subId.toUpperCase()} Profiles</h2>
            </div>
            <div class="member-grid">
                <div class="member-card">
                    <div class="member-photo"><i class="fas fa-user"></i></div>
                    <h4 class="member-name">John Doe</h4>
                    <p class="member-designation">Senior Lecturer</p>
                    <div class="member-info">
                        <p><strong>Qualification:</strong> M.Tech</p>
                        <p><strong>Experience:</strong> 10+ Years</p>
                    </div>
                </div>
                <div class="member-card">
                    <div class="member-photo"><i class="fas fa-user"></i></div>
                    <h4 class="member-name">Jane Smith</h4>
                    <p class="member-designation">Assistant Professor</p>
                    <div class="member-info">
                        <p><strong>Qualification:</strong> PhD</p>
                        <p><strong>Experience:</strong> 5 Years</p>
                    </div>
                </div>
            </div>
        `;
    };

    // Wizard Helper: Step 2 for Students
    window.showStudentYears = (dept) => {
        modalBody.innerHTML = `
            <div class="modal-header-section">
                <button class="view-more-btn" style="margin-bottom: 20px;" onclick="openModal('students')">
                    <i class="fas fa-arrow-left"></i> Change Department
                </button>
                <h2>${dept}</h2>
                <p>Select the academic year to view photos.</p>
            </div>
            <div class="sub-category-grid">
                <button class="sub-btn" onclick="showStudentPhotos('${dept}', '1st Year')">
                    <i class="fas fa-user-graduate"></i>
                    1st Year
                </button>
                <button class="sub-btn" onclick="showStudentPhotos('${dept}', '2nd Year')">
                    <i class="fas fa-user-graduate"></i>
                    2nd Year
                </button>
                <button class="sub-btn" onclick="showStudentPhotos('${dept}', '3rd Year')">
                    <i class="fas fa-user-graduate"></i>
                    3rd Year
                </button>
            </div>
        `;
    };

    window.showStudentPhotos = (dept, year) => {
        modalBody.innerHTML = `
            <div class="modal-header-section">
                <button class="view-more-btn" style="margin-bottom: 20px;" onclick="showStudentYears('${dept}')">
                    <i class="fas fa-arrow-left"></i> Back to Year Selection
                </button>
                <h2>${dept} - ${year}</h2>
                <p>Class Group Photos</p>
            </div>
            <div class="member-grid">
                <div class="member-card">
                    <div class="member-photo" style="border-radius: 10px; font-size: 1.5rem;">Group Photo</div>
                    <h4 class="member-name">Batch A</h4>
                </div>
            </div>
        `;
    };

    window.openModal = openModal;


    // Video Section Logic
    const videoWrapper = document.querySelector('.video-wrapper');
    const mainVideo = videoWrapper ? videoWrapper.querySelector('video') : null;

    if (videoWrapper && mainVideo) {
        videoWrapper.addEventListener('click', () => {
            if (mainVideo.paused) {
                mainVideo.play();
                videoWrapper.classList.add('video-playing');
                mainVideo.controls = true; // Show native controls once playing
            } else {
                mainVideo.pause();
                videoWrapper.classList.remove('video-playing');
            }
        });

        // Loop decorative progress (simple visual effect)
        mainVideo.addEventListener('timeupdate', () => {
            const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
            const progressBar = videoWrapper.querySelector('.video-progress-bar');
            if (progressBar) progressBar.style.width = progress + '%';
        });

        // Hide overlay if video ends
        mainVideo.addEventListener('ended', () => {
            videoWrapper.classList.remove('video-playing');
            mainVideo.controls = false;
            mainVideo.load(); // Reset to poster
        });
    }
});





// load-components.js - Enhanced with local fallbacks
document.addEventListener("DOMContentLoaded", async function() {
    const scripts = document.getElementsByTagName('script');
    let base = './';
    for(let i = 0; i < scripts.length; i++) {
        let src = scripts[i].getAttribute('src');
        if(src && src.includes('js/script.js')) {
            const cleanSrc = src.split('?')[0];
            base = cleanSrc.replace('js/script.js', '');
            if(base === '') base = './';
            break;
        }
    }

    const FALLBACK_HEADER = `
<style>
    /* ==========================================
       0. Core Variables & Global Resets
       ========================================== */
    :root {
        --bg-light: #fbfbfd;
        --glass-bg: rgba(255, 255, 255, 0.65);
        --glass-blur: blur(20px) saturate(180%);
        --glass-border: rgba(255, 255, 255, 0.4);
        --primary-color: #004aAD;
        --primary-glass: rgba(0, 74, 173, 0.7);
        --secondary-color: #6c757d;
        --secondary-glass: rgba(108, 117, 125, 0.1);
        --shadow-lg: 0 40px 100px -20px rgba(0, 0, 0, 0.15);
        --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
        --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.02);
        --text-dark: #1d1d1f;
        --text-dim: #86868b;
        --text-light: #f5f5f7;
        --transition-speed: 0.4s;
        --white: #ffffff;
    }

    #header-placeholder {
        display: contents;
    }

    header {
        display: contents;
    }

    .container {
        margin: 0 auto;
        padding: 0 15px;
        max-width: 1400px;
    }

    /* ==========================================
       1. Top Bar Section Styles
       ========================================== */
    .top-bar {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding: 8px 0;
        background-color: var(--bg-light);
        font-size: 0.85rem;
    }

    .top-bar-content {
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .top-nav {
        display: flex;
        gap: 20px;
    }

    .top-nav a {
        transition: color 0.3s ease;
        color: var(--text-dim);
        font-weight: 500;
        text-decoration: none;
    }

    .top-nav a:hover, 
    .top-nav a.active-nav-link {
        color: var(--primary-color);
    }

    .top-utils {
        align-items: center;
        display: flex;
        gap: 15px;
    }

    .top-contact {
        transition: color 0.3s ease;
        align-items: center;
        color: var(--text-dark);
        display: flex;
        font-weight: 500;
        gap: 8px;
        text-decoration: none;
    }

    .top-contact i {
        color: var(--primary-color);
        font-size: 0.9rem;
    }

    .social-icons {
        display: flex;
        gap: 12px;
    }

    .social-icons a {
        transition: color 0.3s ease;
        color: var(--text-dim);
        text-decoration: none;
    }

    .social-icons a:hover {
        color: var(--primary-color);
    }

    /* ==========================================
       2. Main Header Section Styles
       ========================================== */
    .main-header {
        background: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding: 20px 0;
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        box-shadow: var(--shadow-sm);
    }

    .header-content {
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .logo-section {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .logo-section img {
        height: 120px;
        object-fit: contain;
        width: auto;
    }

    .logo-ticker {
        background: var(--primary-color);
        padding: 3px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: #fff;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-top: 5px;
        overflow: hidden;
        text-transform: uppercase;
        white-space: nowrap;
        width: 150px;
    }

    .logo-ticker span {
        animation: logo-marquee 10s linear infinite;
        display: inline-block;
        padding-left: 100%;
    }

    @keyframes logo-marquee {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-100%, 0); }
    }

    .text-section {
        padding: 0 20px;
        flex-grow: 1;
        text-align: center;
    }

    .hindi-name {
        color: #000;
        font-family: 'Noto Sans Devanagari', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.2;
        margin-top: 5px;
    }

    .english-name {
        color: #0044cc;
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        margin-bottom: 5px;
        text-transform: uppercase;
        white-space: wrap;
    }

    .subtitle {
        color: #666;
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 5px;
    }

    .address {
        color: #666;
        font-size: 1rem;
        margin-bottom: 5px;
    }

    .right-logos {
        align-items: center;
        display: flex;
        gap: 25px;
    }

    .g20-logo, 
    .azadi-logo {
        height: 90px;
        width: auto;
    }

    .logo-item {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .logo-label {
        color: #444;
        font-size: 0.7rem;
        font-weight: 700;
        line-height: 1.2;
        text-align: center;
    }

    /* ==========================================
       3. Main Navbar Section Styles
       ========================================== */
    .main-navbar {
        background-color: var(--primary-color);
        box-shadow: var(--shadow-md);
        color: var(--white);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .mobile-quick-nav {
        display: none;
        gap: 12px;
        align-items: center;
    }

    .mobile-nav-btn {
        color: var(--white) !important;
        font-size: 1.1rem;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .mobile-nav-btn:hover,
    .mobile-nav-btn:active {
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }

    @media (max-width: 992px) {
        .mobile-quick-nav {
            display: flex;
        }
        .desktop-only-link {
            display: none !important;
        }
    }


    .nav-container {
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .nav-links {
        list-style: none;
        display: flex;
        gap: 15px;
        justify-content: space-between;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    .nav-links>li {
        position: relative;
    }

    .nav-links>li>a {
        padding: 15px 12px;
        transition: background-color 0.3s ease;
        color: var(--white);
        display: block;
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
    }

    .nav-links>li>a:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links .fa-chevron-down {
        font-size: 0.75rem;
        margin-left: 5px;
        opacity: 0.8;
    }

    .has-mega-menu {
        position: static !important;
    }

    .mega-menu {
        border-top: 3px solid var(--primary-color);
        padding: 40px max(15px, calc((100% - 1400px) / 2 + 15px));
        transition: all 0.3s ease;
        background-color: var(--white);
        box-shadow: var(--shadow-lg);
        display: grid;
        gap: 40px;
        grid-template-columns: repeat(4, 1fr);
        left: 0;
        opacity: 0;
        position: absolute;
        top: 100%;
        transform: translateY(10px);
        visibility: hidden;
        width: 100%;
        z-index: 1000;
    }

    /* Hover gap bridge for mega menu and dropdowns */
    .dropdown-menu::before, 
    .mega-menu::before {
        content: '';
        position: absolute;
        top: -20px;
        left: 0;
        width: 100%;
        height: 20px;
        background: transparent;
    }

    .has-mega-menu:hover .mega-menu, 
    .dropdown:hover .dropdown-menu {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
    }

    .mega-col h4 {
        border-bottom: 2px solid #f0f0f0;
        transition: all 0.3s ease;
        color: var(--primary-color);
        font-size: 1.1rem;
        letter-spacing: 1px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        text-transform: uppercase;
        min-height: 52px;
        display: flex;
        align-items: flex-end;
    }

    .mega-col:hover h4 {
        color: var(--primary-color);
        letter-spacing: 1.2px;
    }

    .mega-links {
        list-style: none;
        padding: 0;
    }

    .mega-links li {
        margin-bottom: 8px;
    }

    .mega-links li a {
        padding: 2px 0;
        transition: color 0.2s;
        color: #555;
        display: block;
        font-size: 0.9rem;
        text-decoration: none;
    }

    .mega-links li a:hover {
        color: var(--secondary-color);
        padding-left: 5px;
    }

    .dropdown-menu {
        border-top: 3px solid var(--primary-color);
        list-style: none;
        padding: 10px 0;
        transition: all 0.3s ease;
        background-color: var(--white);
        border-radius: 0 0 4px 4px;
        box-shadow: var(--shadow-lg);
        left: 0;
        min-width: 220px;
        opacity: 0;
        position: absolute;
        top: 100%;
        transform: translateY(10px);
        visibility: hidden;
    }

    .dropdown-menu li {
        margin: 0;
        padding: 0;
    }

    .dropdown-menu li a {
        border-left: 3px solid transparent;
        padding: 8px 20px;
        transition: all 0.2s ease;
        color: var(--text-dark);
        display: block;
        font-size: 0.9rem;
        text-decoration: none;
    }

    .dropdown-menu li a:hover {
        border-left: 3px solid var(--primary-color);
        background-color: var(--bg-light);
        color: var(--primary-color);
        padding-left: 25px;
    }

    .hamburger-menu {
        padding: 10px;
        color: var(--white);
        cursor: pointer;
        display: none;
        font-size: 1.5rem;
    }

    /* Active navigation link styling */
    .top-nav a.active-nav-link {
        color: var(--primary-color) !important;
        font-weight: 600;
    }

    .nav-links>li>a.active-nav-link {
        background-color: rgba(255, 255, 255, 0.15);
        font-weight: 700;
        border-radius: 4px;
    }

    .dropdown-menu li a.active-nav-link {
        border-left: 3px solid var(--primary-color);
        background-color: var(--bg-light);
        color: var(--primary-color);
        padding-left: 25px;
        font-weight: 600;
    }

    .mega-links li a.active-nav-link {
        color: var(--secondary-color);
        font-weight: 600;
        padding-left: 5px;
    }

    /* ==========================================
       4. Responsive Media Queries
       ========================================== */
    @media (max-width: 1430px) {
        .mega-menu {
            padding: 40px 30px;
        }
    }

    @media (max-width: 992px) {
        .top-nav {
            display: none;
        }

        .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
        }

        .right-logos {
            justify-content: center;
        }

        .mega-menu {
            padding: 15px;
            display: none;
            grid-template-columns: 1fr;
            position: relative;
            box-shadow: none;
            border-top: none;
            transform: none;
            opacity: 1;
            visibility: visible;
        }

        .has-mega-menu.active .mega-menu {
            display: block;
        }

        .nav-links {
            padding: 10px 0;
            background-color: var(--primary-color);
            box-shadow: var(--shadow-lg);
            display: none;
            flex-direction: column;
            left: 0;
            position: absolute;
            top: 100%;
            width: 100%;
            z-index: 99;
        }

        .nav-links.active {
            display: flex;
        }

        .nav-links>li {
            width: 100%;
        }

        .nav-links>li>a {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 20px;
        }

        .hamburger-menu {
            display: block;
        }

        .dropdown-menu,
        .mega-menu {
            border-top: none;
            background-color: rgba(255, 255, 255, 0.05);
            box-shadow: none;
            display: none;
            opacity: 1;
            padding-left: 20px;
            position: static;
            transform: none;
            visibility: visible;
            width: 100%;
        }

        .dropdown.active .dropdown-menu {
            display: block;
        }

        .dropdown-menu li a,
        .mega-links li a {
            color: var(--white);
            border-left: none;
        }

        .dropdown-menu li a:hover,
        .mega-links li a:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--white);
            padding-left: 20px;
        }
    }
</style>

<header>
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="container top-bar-content">
                <nav class="top-nav">
                    <a href="about/institute-reports.html">Institute Report</a>
                    <a href="admissions/online-payment.html">Online Payment</a>
                    <a href="about/rti.html">RTI</a>
                    <a href="examination/results.html">Result</a>
                    <a href="contact/webmail.html">Webmail</a>
                    <a href="examination/downloads.html">Download</a>
                </nav>
                <div class="top-utils">
                    <a href="mailto:info.gpc.ziro@gmail.com" class="top-contact">
                        <i class="fas fa-envelope"></i> info.gpc.ziro@gmail.com
                    </a>
                    <div class="social-icons">
                        <a href="#"><i class="fas fa-play"></i></a>
                        <a href="#"><i class="fas fa-camera"></i></a>
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Header -->
        <div class="main-header">
            <div class="container header-content">
                <div class="logo-section">
                    <img src="images/logo.jpeg" alt="Government Polytechnic College Ziro Logo" class="college-logo">
                    <div class="logo-ticker">
                        <span>Engineering the budding technocrats</span>
                    </div>
                </div>
                <div class="text-section">
                    <p class="subtitle">Government of Arunachal Pradesh</p>
                    <h1 class="english-name">GOVERNMENT POLYTECHNIC COLLEGE ZIRO</h1>
                    <h2 class="hindi-name">राजकीय पॉलिटेक्निक कॉलेज जीरो, लोअर सुबनसिरी</h2>
                    <p class="address">Village: Jugo, Tajang, PO: Ziro-791120,
                        Lower Subansiri District, 
                        Arunachal Pradesh, India.
                    </p>
                </div>
                <div class="right-logos">
                    <div class="logo-item">
                        <img src="images/aicte.jpeg" alt="AICTE Logo" class="azadi-logo">
                        <span class="logo-label">Approved by AICTE</span>
                    </div>
                    <div class="logo-item">
                        <img src="images/APSCTE_logo.jpg" alt="APSCTE Logo" class="g20-logo">
                        <span class="logo-label">Affiliated to APSCTE</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Navbar -->
        <nav class="main-navbar">
            <div class="container nav-container">
                <div class="hamburger-menu">
                    <i class="fas fa-bars"></i>
                </div>
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>

                    <li class="dropdown">
                        <a href="#">About <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="about/about-us.html">About Us</a></li>
                            <li><a href="about/vision-mission.html">Vision & Mission</a></li>
                            <li><a href="about/principal-message.html">Principal's Message</a></li>
                            <li><a href="about/principal-profile.html">Principal's Profile</a></li>
                            <li><a href="about/administration.html">Administration</a></li>
                        </ul>
                    </li>

                    <li class="dropdown">
                        <a href="#">Academics <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="academics/courses-offered.html">Programs Offered</a></li>
                            <li><a href="academics/academic-calendar.html">Academic Calendar</a></li>
                            <li><a href="academics/syllabus.html">Syllabus</a></li>
                            <li><a href="academics/time-table.html">Time Table</a></li>
                        </ul>
                    </li>

                    <li class="dropdown">
                        <a href="#">Admissions <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="admissions/admission-process.html">Admission Section</a></li>
                            <li><a href="admissions/eligibility.html">Eligibility</a></li>
                            <li><a href="admissions/fee-structure.html">Fee Structure</a></li>
                            <li><a href="admissions/online-payment.html">Online Payment</a>
                            </li>
                            <li><a href="admissions/prospectus.html">Prospectus (PDF)</a></li>
                        </ul>
                    </li>

                    <li class="has-mega-menu">
                        <a href="#">Departments <i class="fas fa-chevron-down"></i></a>
                        <div class="mega-menu">
                            <div class="mega-col">
                                <h4>Civil Engineering</h4>
                                <ul class="mega-links">
                                    <li><a href="departments/ce/profile.html">Department Profile</a></li>
                                    <li><a href="departments/ce/labs.html">Laboratories</a></li>
                                    <li><a href="departments/ce/faculties.html">Our Faculty</a></li>
                                    <li><a href="departments/ce/staff.html">Technical Staff</a></li>
                                    <li><a href="departments/ce/students.html">Students</a></li>
                                </ul>
                            </div>
                            <div class="mega-col">
                                <h4>Computer Science and Engineering</h4>
                                <ul class="mega-links">
                                    <li><a href="departments/cse/profile.html">Department Profile</a></li>
                                    <li><a href="departments/cse/labs.html">Laboratories</a></li>
                                    <li><a href="departments/cse/faculties.html">Our Faculty</a></li>
                                    <li><a href="departments/cse/staff.html">Technical Staff</a></li>
                                    <li><a href="departments/cse/students.html">Students</a></li>
                                </ul>
                            </div>
                            <div class="mega-col">
                                <h4>Electrical and Electronics Engineering</h4>
                                <ul class="mega-links">
                                    <li><a href="departments/eee/profile.html">Department Profile</a></li>
                                    <li><a href="departments/eee/labs.html">Laboratories</a></li>
                                    <li><a href="departments/eee/faculties.html">Our Faculty</a></li>
                                    <li><a href="departments/eee/staff.html">Technical Staff</a></li>
                                    <li><a href="departments/eee/students.html">Students</a></li>
                                </ul>
                            </div>
                            <div class="mega-col">
                                <h4>Science & Humanities</h4>
                                <ul class="mega-links">
                                    <li><a href="departments/sh/profile.html">Department Profile</a></li>
                                    <li><a href="departments/sh/labs.html">Laboratories</a></li>
                                    <li><a href="departments/sh/faculties.html">Our Faculty</a></li>
                                    <li><a href="departments/sh/staff.html">Technical Staff</a></li>
                                    <li><a href="departments/sh/students.html">Students</a></li>
                                </ul>
                            </div>
                        </div>
                    </li>

                    <li class="dropdown">
                        <a href="#">Examination <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="examination/rules.html">Rules & Regulations</a></li>
                            <li><a href="examination/schedule.html">Exam Schedule</a></li>
                            <li><a href="examination/results.html">Results</a></li>
                            <li><a href="examination/downloads.html">Downloads</a></li>
                        </ul>
                    </li>

                    <li class="dropdown">
                        <a href="#">Facilities <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="facilities/library.html">Library</a></li>
                            <li><a href="facilities/hostel.html">Hostel</a></li>
                            <li><a href="facilities/laboratory.html">Laboratory</a></li>
                            <li><a href="facilities/sports.html">Sports</a></li>
                            <li><a href="facilities/canteen.html">Canteen</a></li>
                            <li><a href="facilities/medical-facility.html">Medical Facility</a></li>
                        </ul>
                    </li>

                    <li class="dropdown">
                        <a href="#">Cells <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="clubs/nss.html">NSS</a></li>
                            <li><a href="clubs/activities.html">Activities</a></li>
                            <li><a href="clubs/student-council.html">Student Council</a></li>
                            <li><a href="clubs/clubs.html">Clubs</a></li>
                        </ul>
                    </li>

                    <li class="dropdown">
                        <a href="#">T&P <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="tp/placement-cell.html">Training & Placement Cell</a></li>
                            <li><a href="tp/training-partners.html">Training Partners</a></li>
                            <li><a href="tp/placement-records.html">Placement Records</a></li>
                            <li><a href="tp/training-programs.html">Training Programs</a></li>
                        </ul>
                    </li>

                    <li class="dropdown">
                        <a href="#">Gallery <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="gallery/photos.html">Photo Gallery</a></li>
                            <li><a href="gallery/videos.html">Video Gallery</a></li>
                        </ul>
                    </li>

                    <li><a href="contact/contact-us.html">Contact Us</a></li>
                </ul>
            </div>
        </nav>
    </header>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize header functionality for statically inlined instances (e.g. WordPress, static inclusions)
        const initHeader = () => {
            const header = document.querySelector('header');
            if (!header) return;

            // 1. Hamburger menu toggling for mobile view
            const hamburger = header.querySelector('.hamburger-menu');
            const navLinks = header.querySelector('.nav-links');

            if (hamburger && navLinks) {
                // Clone node to clear prior event listeners in case of duplicate runs
                const newHamburger = hamburger.cloneNode(true);
                hamburger.parentNode.replaceChild(newHamburger, hamburger);

                newHamburger.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                    const icon = newHamburger.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-bars');
                        icon.classList.toggle('fa-times');
                    }
                });

                document.addEventListener('click', (e) => {
                    if (!newHamburger.contains(e.target) && !navLinks.contains(e.target)) {
                        navLinks.classList.remove('active');
                        const icon = newHamburger.querySelector('i');
                        if (icon) {
                            icon.classList.add('fa-bars');
                            icon.classList.remove('fa-times');
                        }
                    }
                });
            }

            // 2. Mobile click expansion for dropdowns & mega-menus
            const dropdowns = header.querySelectorAll('.dropdown');
            dropdowns.forEach(drop => {
                const trigger = drop.querySelector('a');
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        if (window.innerWidth <= 992) {
                            e.preventDefault();
                            drop.classList.toggle('active');
                        }
                    });
                }
            });

            const megamenu = header.querySelector('.has-mega-menu');
            if (megamenu) {
                const trigger = megamenu.querySelector('a');
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        if (window.innerWidth <= 992) {
                            e.preventDefault();
                            megamenu.classList.toggle('active');
                        }
                    });
                }
            }

            // 3. Dynamic active link highlighting
            try {
                const currentPath = window.location.pathname;
                const navLinksList = header.querySelectorAll('.nav-links a, .top-nav a');

                const normalizeUrl = (urlStr) => {
                    let u = urlStr.split('#')[0].split('?')[0];
                    if (u.endsWith('/index.html')) {
                        u = u.slice(0, -10);
                    }
                    if (u.endsWith('/')) {
                        u = u.slice(0, -1);
                    }
                    return u;
                };

                const currentNormalized = normalizeUrl(window.location.href);

                navLinksList.forEach(link => {
                    const rawHref = link.getAttribute('href');
                    if (rawHref && rawHref !== '#') {
                        const tempAnchor = document.createElement('a');
                        tempAnchor.href = link.href;
                        const linkNormalized = normalizeUrl(tempAnchor.href);

                        if (currentNormalized === linkNormalized) {
                            link.classList.add('active-nav-link');

                            // Highlight parent categories
                            const parentDropdown = link.closest('.dropdown');
                            if (parentDropdown) {
                                const dropdownTrigger = parentDropdown.querySelector('a');
                                if (dropdownTrigger) dropdownTrigger.classList.add('active-nav-link');
                            }

                            const parentMega = link.closest('.has-mega-menu');
                            if (parentMega) {
                                const megaTrigger = parentMega.querySelector('a');
                                if (megaTrigger) megaTrigger.classList.add('active-nav-link');
                            }
                        }
                    }
                });
            } catch (err) {
                console.error('Error in header active navigation:', err);
            }
        };

        initHeader();
    });
</script>
`;

    const FALLBACK_FOOTER = `
<footer>
    <style>
        /* Variables & Global Resets */
        :root {
            --primary-color: #004aAD;
            --secondary-color: #6c757d;
            --white: #ffffff;
            --text-dark: #1d1d1f;
            --text-dim: #86868b;
            --transition-speed: 0.25s;
        }

        footer {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding: 60px 0 0;
            background-color: var(--white);
            font-family: 'Inter', sans-serif;
            width: 100%;
        }

        .footer-content {
            margin: 0 auto;
            padding: 0 15px;
            max-width: 1400px;
        }

        .footer-grid {
            display: grid;
            gap: 40px;
            grid-template-columns: repeat(5, 1fr);
            padding-bottom: 50px;
        }

        .footer-col h4 {
            color: var(--text-dark);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .footer-col ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-col ul li a {
            transition: color var(--transition-speed) ease;
            color: var(--text-dim);
            font-size: 0.9rem;
            font-weight: 400;
            text-decoration: none;
        }

        .footer-col ul li a:hover {
            color: var(--primary-color);
        }

        .footer-socials {
            align-items: center;
            display: flex;
            gap: 16px;
            margin-top: 4px;
        }

        .footer-socials a {
            transition: color var(--transition-speed) ease;
            color: var(--text-dim);
            font-size: 1.15rem;
            text-decoration: none;
        }

        .footer-socials a:hover {
            color: var(--primary-color);
        }

        .footer-bottom {
            border-top: 1px solid rgba(0, 0, 0, 0.07);
            padding: 20px 0;
        }

        .footer-bottom-content {
            align-items: center;
            color: var(--text-dim);
            display: flex;
            font-size: 0.82rem;
            justify-content: space-between;
            margin: 0 auto;
            padding: 0 15px;
            max-width: 1400px;
        }

        .footer-bottom-links {
            display: flex;
            gap: 20px;
        }

        .footer-bottom-links a {
            transition: color var(--transition-speed) ease;
            color: var(--text-dim);
            font-size: 0.82rem;
            text-decoration: none;
        }

        .footer-bottom-links a:hover {
            color: var(--primary-color);
        }

        /* Responsive menu styling rules */
        @media (max-width: 1024px) {
            .footer-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .footer-grid {
                gap: 30px;
                grid-template-columns: repeat(2, 1fr);
            }
            .footer-bottom-content {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <div class="footer-content container">
        <div class="footer-grid">

            <!-- EXPLORE -->
            <div class="footer-col">
                <h4>Explore</h4>
                <ul>
                    <li><a href="about/about-us.html">About</a></li>
                    <li><a href="contact/contact-us.html">Contact Us</a></li>
                    <li><a href="academics/courses-offered.html">Department</a></li>
                    <li><a href="clubs/activities.html">Events &amp; Retreats</a></li>
                </ul>
            </div>

            <!-- IMPORTANT LINKS -->
            <div class="footer-col">
                <h4>Important Links</h4>
                <ul>
                    <li><a href="https://www.education.gov.in/" target="_blank">Ministry of Education</a></li>
                    <li><a href="https://www.aicte-india.org/" target="_blank">AICTE</a></li>
                    <li><a href="https://www.ugc.gov.in/" target="_blank">UGC</a></li>
                    <li><a href="https://swayam.gov.in/" target="_blank">SWAYAM</a></li>
                    <li><a href="https://www.vlab.co.in/" target="_blank">Virtual Labs</a></li>
                    <li><a href="https://nad.digilocker.gov.in/" target="_blank">National Academic Depository</a></li>
                    <li><a href="https://apdhte.nic.in" target="_blank">APDHTE</a></li>
                    <li><a href="https://apdhte.nic.in/apscte.htm" target="_blank">APSCTE</a></li>
                    <li><a href="https://facilities.aicte-india.org/feedback" target="_blank">AICTE-Feedback System</a></li>
                </ul>
            </div>

            <!-- DOWNLOADS -->
            <div class="footer-col">
                <h4>Downloads</h4>
                <ul>
                    <li><a href="examination/downloads.html">Downloads</a></li>
                    <li><a href="admissions/admission-process.html">Student Forms</a></li>
                    <li><a href="academic-section-download/1_Rules-Regulations-2021-22.pdf" target="_blank">Rules & Regulations</a></li>
                    <li><a href="academic-section-download/2_Notification-Hand-book.pdf" target="_blank">Notification Handbook</a></li>
                    <li><a href="academic-section-download/3_Academic-calendar-2025-26.pdf" target="_blank">Academic Calendar 2025-26</a></li>
                    <li><a href="academic-section-download/4_Academic-planner-2025-26.pdf" target="_blank">Academic Planner 2025-26</a></li>
                </ul>
            </div>

            <!-- COMMITTEES -->
            <div class="footer-col">
                <h4>Committees</h4>
                <ul>
                    <li><a href="about/administration.html#anti-ragging-committee">Anti Ragging Committee</a></li>
                    <li><a href="about/administration.html#anti-ragging-squad">Anti Ragging Squad</a></li>
                    <li><a href="about/administration.html#grievance-students">Grievance Redressal (Students)</a></li>
                    <li><a href="about/administration.html#grievance-faculty">Grievance Redressal (Faculty)</a></li>
                    <li><a href="about/administration.html#sc-st-committee">SC/ST Committee</a></li>
                    <li><a href="about/administration.html#iqac">Internal Quality Assurance Cell (IQAC)</a></li>
                    <li><a href="about/administration.html#industry-institute-cell">Industry Institute Interaction Cell</a></li>
                    <li><a href="about/administration.html#internal-complaint-committee">Internal Complaint Committee (ICC)</a></li>
                    <li><a href="about/administration.html#student-counselor">Student Counseling Cell</a></li>
                    <li><a href="about/administration.html#equal-opportunity-cell">Equal Opportunity Cell</a></li>
                    <li><a href="about/administration.html#anti-ragging-form">Anti Ragging Form</a></li>
                    <li><a href="about/administration.html#anti-ragging-affidavit">Submit Affidavit</a></li>
                    <li><a href="about/administration.html#grievance-form">Online Grievance Form</a></li>
                </ul>
            </div>

            <!-- FOLLOW US -->
            <div class="footer-col">
                <h4>Follow Us</h4>
                <div class="footer-socials">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>

        </div>
    </div>
    <div class="footer-bottom">
        <div class="container footer-bottom-content">
            <p>&copy; 2025 Government Polytechnic College Ziro. All Rights Reserved.</p>
            <div class="footer-bottom-links">
                <a href="about/rti.html">RTI</a>
                <a href="contact/contact-us.html">Privacy Policy</a>
                <a href="contact/contact-us.html">Terms of Use</a>
            </div>
        </div>
    </div>
</footer>
`;

    async function loadComponent(placeholderId, filename, fallbackContent) {
        let content = '';
        try {
            const response = await fetch(base + filename);
            if(response.ok) {
                content = await response.text();
            } else {
                content = fallbackContent;
            }
        } catch(e) {
            console.warn(`Local fetch failed for ${filename}, using fallback.`, e);
            content = fallbackContent;
        }

        if (content) {
            // Fix relative paths dynamically
            content = content.replace(/(href|src)="([^"]+)"/g, (match, attr, url) => {
                if(url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('#') || url.startsWith('/') || url.startsWith('tel:')) {
                    return match;
                }
                return `${attr}="${base}${url}"`;
            });
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = content;

                // Dynamic functionality setup for Header
                if (placeholderId === 'header-placeholder') {
                    // 1. Setup hamburger menu click event listeners since header is now in the DOM
                    const hamburger = placeholder.querySelector('.hamburger-menu');
                    const navLinks = placeholder.querySelector('.nav-links');

                    if (hamburger && navLinks) {
                        hamburger.addEventListener('click', () => {
                            console.log('Hamburger clicked');
                            navLinks.classList.toggle('active');
                            const icon = hamburger.querySelector('i');
                            if (icon) {
                                icon.classList.toggle('fa-bars');
                                icon.classList.toggle('fa-times');
                            }
                        });

                        // Close menu when clicking outside
                        document.addEventListener('click', (e) => {
                            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                                navLinks.classList.remove('active');
                                const icon = hamburger.querySelector('i');
                                if (icon) {
                                    icon.classList.add('fa-bars');
                                    icon.classList.remove('fa-times');
                                }
                            }
                        });
                    }

                    // 2. Setup dynamic active link highlighting
                    try {
                        const currentPath = window.location.pathname;
                        const navLinksList = placeholder.querySelectorAll('.nav-links a, .top-nav a');
                        
                        // Normalize URLs by stripping trailing slash and index.html to avoid mismatch
                        const normalizeUrl = (urlStr) => {
                            let u = urlStr.split('#')[0].split('?')[0];
                            if (u.endsWith('/index.html')) {
                                u = u.slice(0, -10);
                            }
                            if (u.endsWith('/')) {
                                u = u.slice(0, -1);
                            }
                            return u;
                        };
                        
                        const currentNormalized = normalizeUrl(window.location.href);

                        navLinksList.forEach(link => {
                            const rawHref = link.getAttribute('href');
                            if (rawHref && rawHref !== '#') {
                                const tempAnchor = document.createElement('a');
                                tempAnchor.href = link.href; // Resolves absolute URL based on page DOM
                                const linkNormalized = normalizeUrl(tempAnchor.href);

                                if (currentNormalized === linkNormalized) {
                                    link.classList.add('active-nav-link');

                                    // Highlight parent dropdown if any
                                    const parentDropdown = link.closest('.dropdown');
                                    if (parentDropdown) {
                                        const dropdownTrigger = parentDropdown.querySelector('a');
                                        if (dropdownTrigger) dropdownTrigger.classList.add('active-nav-link');
                                    }

                                    // Highlight parent mega menu if any
                                    const parentMega = link.closest('.has-mega-menu');
                                    if (parentMega) {
                                        const megaTrigger = parentMega.querySelector('a');
                                        if (megaTrigger) megaTrigger.classList.add('active-nav-link');
                                    }
                                }
                            }
                        });
                    } catch (err) {
                        console.error('Error highlighting active navigation link:', err);
                    }
                }
            }
        }
    }

    // Load Header and Footer
    await loadComponent('header-placeholder', 'header.html', FALLBACK_HEADER);
    await loadComponent('footer-placeholder', 'footer.html', FALLBACK_FOOTER);

    // Smoothly scroll to target element if a hash exists in the URL, accounting for dynamic header loading and sticky navbar height
    if (window.location.hash) {
        const hash = window.location.hash;
        console.log('[HashScroll] Detected hash:', hash);
        
        let autoScrolling = true;
        
        const stopAutoScroll = () => {
            if (autoScrolling) {
                console.log('[HashScroll] User scrolled manually, stopping auto-scroll.');
                autoScrolling = false;
                clearInterval(scrollInterval);
            }
        };

        window.addEventListener('wheel', stopAutoScroll, { passive: true });
        window.addEventListener('touchmove', stopAutoScroll, { passive: true });
        window.addEventListener('keydown', (e) => {
            const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
            if (keys.includes(e.key)) {
                stopAutoScroll();
            }
        }, { passive: true });

        const performScroll = () => {
            if (autoScrolling) {
                try {
                    const target = document.querySelector(hash);
                    if (target) {
                        target.scrollIntoView({ block: 'start' });
                        const navbar = document.querySelector('.main-navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 60;
                        window.scrollBy(0, -navbarHeight - 20);
                    } else {
                        console.warn('[HashScroll] Target not found for hash:', hash);
                    }
                } catch (err) {
                    console.error('[HashScroll] Error scrolling to hash:', err);
                }
            }
        };

        // Poll for 2.5 seconds (every 250ms) to ensure correct position after all dynamic layouts/images load
        let pollCount = 0;
        const scrollInterval = setInterval(() => {
            performScroll();
            pollCount++;
            if (pollCount >= 10) {
                clearInterval(scrollInterval);
            }
        }, 250);

        window.addEventListener('load', performScroll);
        // Capture load events from all images as they render to adjust scroll position dynamically
        window.addEventListener('load', performScroll, true);
    }

    // Dynamic injection of Back and Home buttons for easy navigation (using inline CSS and JS)
    (function() {
        if (document.getElementById('floating-navigation-controls')) return;

        const container = document.createElement('div');
        container.id = 'floating-navigation-controls';
        
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '25px',
            left: '25px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: '999999',
            fontFamily: "'Inter', sans-serif"
        });

        const homeUrl = base + 'index.html';

        // Back button
        const backBtn = document.createElement('button');
        backBtn.title = 'Go Back';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backBtn.onclick = function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = homeUrl;
            }
        };

        // Home button
        const homeBtn = document.createElement('a');
        homeBtn.href = homeUrl;
        homeBtn.title = 'Go to Home Page';
        homeBtn.innerHTML = '<i class="fas fa-home"></i>';

        const btnStyle = {
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#004aAD',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 6px 20px rgba(0, 74, 173, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            fontSize: '1.15rem'
        };

        Object.assign(backBtn.style, btnStyle);
        Object.assign(homeBtn.style, btnStyle);

        const addHover = (el) => {
            el.onmouseenter = () => {
                el.style.backgroundColor = '#00337d';
                el.style.transform = 'translateY(-3px) scale(1.05)';
                el.style.boxShadow = '0 10px 25px rgba(0, 74, 173, 0.5)';
            };
            el.onmouseleave = () => {
                el.style.backgroundColor = '#004aAD';
                el.style.transform = 'none';
                el.style.boxShadow = '0 6px 20px rgba(0, 74, 173, 0.3)';
            };
            el.onmousedown = () => {
                el.style.transform = 'translateY(0) scale(0.95)';
            };
            el.onmouseup = () => {
                el.style.transform = 'translateY(-3px) scale(1.05)';
            };
        };

        addHover(backBtn);
        addHover(homeBtn);

        container.appendChild(backBtn);
        container.appendChild(homeBtn);

        document.body.appendChild(container);
    })();

    // Collapsible Faculty Sections (Principal Profile Pattern)
    (function() {
        const detailSections = document.querySelectorAll('.faculty-detail-section');
        if (detailSections.length === 0) return;

        // 1. Inject the collapsible CSS styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .collapsible-section {
                margin-bottom: 1.25rem !important;
                border: 1px solid rgba(0, 74, 173, 0.1) !important;
                border-radius: 12px !important;
                overflow: hidden !important;
                background: #fff !important;
                box-shadow: 0 4px 15px rgba(0, 74, 173, 0.05) !important;
                transition: all 0.3s ease !important;
            }
            .collapsible-section.active {
                box-shadow: 0 8px 25px rgba(0, 74, 173, 0.1) !important;
                border-color: rgba(0, 74, 173, 0.3) !important;
            }
            .collapsible-header {
                width: 100% !important;
                padding: 1.1rem 1.5rem !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                background: rgba(0, 74, 173, 0.04) !important;
                border: none !important;
                cursor: pointer !important;
                text-align: left !important;
                transition: background 0.3s ease !important;
            }
            .collapsible-header:hover {
                background: rgba(0, 74, 173, 0.08) !important;
            }
            .collapsible-header span {
                font-size: 1.05rem !important;
                font-weight: 700 !important;
                color: var(--primary-color) !important;
                display: flex !important;
                align-items: center !important;
                gap: 0.85rem !important;
            }
            .collapsible-header i.fa-chevron-down {
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                color: var(--primary-color) !important;
                font-size: 0.9rem !important;
                opacity: 0.7 !important;
            }
            .collapsible-section.active .collapsible-header i.fa-chevron-down {
                transform: rotate(180deg) !important;
                opacity: 1 !important;
            }
            .collapsible-content {
                max-height: 0 !important;
                overflow: hidden !important;
                transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) !important;
                background: #fff !important;
            }
            .collapsible-section.active .collapsible-content {
                max-height: 5000px !important;
                transition: max-height 0.5s cubic-bezier(1, 0, 1, 0) !important;
            }
            .collapsible-inner {
                padding: 1.25rem 1.5rem !important;
            }
        `;
        document.head.appendChild(style);

        // Icon mapping based on section title
        const iconMap = {
            'educational qualification': 'fa-graduation-cap',
            'teaching-learning engagement': 'fa-chalkboard-teacher',
            'worked experience': 'fa-briefcase',
            'work experience': 'fa-briefcase',
            'working experience': 'fa-briefcase',
            'professional background': 'fa-briefcase',
            'experience': 'fa-briefcase',
            'research publications': 'fa-book',
            'publications': 'fa-file-alt',
            'courses taught': 'fa-book-open',
            'courses taught at diploma level': 'fa-book-open',
            'professional activity': 'fa-users',
            'administrative duties': 'fa-sitemap',
            'administrative experience': 'fa-sitemap',
            'area of interest': 'fa-star',
            'specialization': 'fa-star',
            'interaction with outside world': 'fa-globe',
            'any other information': 'fa-info-circle'
        };

        // 2. Convert each section
        detailSections.forEach(section => {
            const h4 = section.querySelector('h4');
            if (!h4) return;

            const sectionTitle = h4.textContent.trim();
            const normalizedTitle = sectionTitle.toLowerCase();
            const iconClass = iconMap[normalizedTitle] || 'fa-info-circle';

            // Gather all original child elements to move into inner container
            const innerContainer = document.createElement('div');
            innerContainer.className = 'collapsible-inner';
            
            // Move original children (excluding h4) to the inner container
            const childNodes = Array.from(section.childNodes);
            childNodes.forEach(child => {
                if (child !== h4) {
                    innerContainer.appendChild(child);
                }
            });

            // Create collapsible structure
            const newSection = document.createElement('div');
            newSection.className = 'collapsible-section faculty-detail-section';

            const headerBtn = document.createElement('button');
            headerBtn.className = 'collapsible-header';
            headerBtn.innerHTML = `
                <span><i class="fas ${iconClass}"></i> ${sectionTitle}</span>
                <i class="fas fa-chevron-down"></i>
            `;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'collapsible-content';
            contentDiv.appendChild(innerContainer);

            newSection.appendChild(headerBtn);
            newSection.appendChild(contentDiv);

            // Add click listener
            headerBtn.addEventListener('click', function() {
                newSection.classList.toggle('active');
            });

            // Replace original section with new collapsible section
            section.parentNode.replaceChild(newSection, section);
        });

        // 3. Open first collapsible section for each faculty card by default
        const facultyCards = document.querySelectorAll('.faculty-card');
        facultyCards.forEach(card => {
            const collapsibles = card.querySelectorAll('.collapsible-section');
            if (collapsibles.length > 0) {
                collapsibles[0].classList.add('active');
            }
        });
    })();
});

