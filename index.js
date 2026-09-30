document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------
       MOBILE NAVIGATION MENU
    ------------------------------------------------------------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    /* -------------------------------------------------------------
       SHOWREEL LIGHTBOX PLAYBACK
    ------------------------------------------------------------- */
    const showreelBtn = document.getElementById('btn-showreel');
    const showreelLightbox = document.getElementById('showreel-lightbox');
    const showreelClose = document.getElementById('showreel-close');
    const showreelIframe = document.getElementById('showreel-iframe');
    const showreelVideo = document.getElementById('showreel-video');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');

    const showreelUrl = "ims_showreel.mp4";

    const openShowreel = () => {
        if (!showreelLightbox) return;
        if (showreelVideo && (showreelUrl.endsWith('.mp4') || showreelUrl.endsWith('.webm'))) {
            showreelVideo.src = showreelUrl;
            showreelVideo.classList.remove('hidden');
            if (showreelIframe) showreelIframe.classList.add('hidden');
            showreelVideo.play().catch(err => console.log("Showreel autoplay blocked:", err));
        } else if (showreelIframe) {
            showreelIframe.src = showreelUrl;
            showreelIframe.classList.remove('hidden');
            if (showreelVideo) showreelVideo.classList.add('hidden');
        }
        showreelLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeShowreel = () => {
        if (!showreelLightbox) return;
        if (showreelIframe) showreelIframe.src = "";
        if (showreelVideo) {
            showreelVideo.src = "";
            showreelVideo.pause();
        }
        showreelLightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (showreelBtn) showreelBtn.addEventListener('click', openShowreel);
    if (showreelClose) showreelClose.addEventListener('click', closeShowreel);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeShowreel);

    /* -------------------------------------------------------------
       PROJECT DETAILS MODAL (100% GOOGLE DRIVE PLAYBACK)
    ------------------------------------------------------------- */
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalIframe = document.getElementById('modal-iframe');
    const modalTitle = document.getElementById('modal-title');
    const modalClient = document.getElementById('modal-client');
    const modalRole = document.getElementById('modal-role');
    const modalSoftware = document.getElementById('modal-software');
    const modalDescription = document.getElementById('modal-description');
    const modalDriveBtn = document.getElementById('modal-drive-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video-src') || '';
            const driveLink = card.getAttribute('data-drive-link') || '';
            const title = card.getAttribute('data-title') || '-';
            const client = card.getAttribute('data-client') || '-';
            const role = card.getAttribute('data-role') || '-';
            const software = card.getAttribute('data-software') || '-';
            const description = card.getAttribute('data-description') || '-';

            // Format Google Drive Preview Embed URL
            let embedUrl = videoSrc;
            if (embedUrl.includes('drive.google.com')) {
                const match = embedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || embedUrl.match(/id=([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
                }
            }

            // Set Iframe src to Google Drive embed
            if (modalIframe) {
                modalIframe.src = embedUrl;
            }

            // Update Metadata
            if (modalTitle) modalTitle.textContent = title;
            if (modalClient) modalClient.textContent = client;
            if (modalRole) modalRole.textContent = role;
            if (modalSoftware) modalSoftware.textContent = software;
            if (modalDescription) modalDescription.textContent = description;

            // Set Direct Drive Link Button
            if (modalDriveBtn) {
                if (driveLink) {
                    modalDriveBtn.href = driveLink;
                    modalDriveBtn.style.display = 'inline-flex';
                } else if (embedUrl.includes('drive.google.com')) {
                    const match = embedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) {
                        modalDriveBtn.href = `https://drive.google.com/file/d/${match[1]}/view?usp=sharing`;
                        modalDriveBtn.style.display = 'inline-flex';
                    }
                }
            }

            // Open Modal
            if (projectModal) {
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        if (modalIframe) {
            modalIframe.src = ""; // Stop video playback immediately
        }
        if (projectModal) {
            projectModal.classList.remove('active');
        }
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (projectModal && projectModal.classList.contains('active')) {
                closeModal();
            }
            if (showreelLightbox && showreelLightbox.classList.contains('active')) {
                closeShowreel();
            }
        }
    });

    /* -------------------------------------------------------------
       PORTFOLIO CATEGORY FILTER TABS
    ------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.portfolio-filters .filter-btn');

    function updateFilter(filterValue) {
        portfolioCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.classList.remove('hidden-card');
                void card.offsetWidth; // Trigger reflow for transition
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.pointerEvents = 'auto';
                card.style.display = 'block';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px) scale(0.95)';
                card.style.pointerEvents = 'none';

                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.classList.add('hidden-card');
                        card.style.display = 'none';
                    }
                }, 350);
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            updateFilter(filterValue);
        });
    });

    /* -------------------------------------------------------------
       CONTACT FORM SUBMISSION WITH DIRECT EMAIL LINKING (djcharles007@gmail.com)
    ------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('btn-submit');
    const successOverlay = document.getElementById('form-success');
    const successCloseBtn = document.getElementById('btn-success-close');
    const manualMailBtn = document.getElementById('manual-mail-btn');

    if (contactForm && formSubmitBtn && successOverlay) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const projectTypeInput = document.getElementById('project-type');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const projectType = projectTypeInput ? projectTypeInput.options[projectTypeInput.selectedIndex].text : 'Video Project';
            const message = messageInput ? messageInput.value.trim() : '';

            // Construct mailto URL
            const targetEmail = 'djcharles007@gmail.com';
            const subject = encodeURIComponent(`Project Brief: ${projectType} - from ${name}`);
            const body = encodeURIComponent(
                `Hi Charles,\n\n` +
                `Here are the project details from your portfolio contact form:\n` +
                `--------------------------------------------------\n` +
                `• Full Name: ${name}\n` +
                `• Email Address: ${email}\n` +
                `• Project Category: ${projectType}\n` +
                `--------------------------------------------------\n\n` +
                `Project Details & Raw Footage Links:\n` +
                `${message}\n\n` +
                `Best regards,\n` +
                `${name}`
            );

            const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            if (manualMailBtn) {
                manualMailBtn.href = mailtoUrl;
            }

            formSubmitBtn.disabled = true;
            const originalText = formSubmitBtn.textContent;
            formSubmitBtn.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50" width="20" height="20" style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-linecap="round"></circle>
                </svg>
                Preparing Email...
            `;

            if (!document.getElementById('spinner-keyframes')) {
                const style = document.createElement('style');
                style.id = 'spinner-keyframes';
                style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                formSubmitBtn.disabled = false;
                formSubmitBtn.textContent = originalText;
                successOverlay.classList.add('active');

                // Launch user's default email client
                window.location.href = mailtoUrl;
            }, 800);
        });

        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                successOverlay.classList.remove('active');
                contactForm.reset();
            });
        }
    }

    /* -------------------------------------------------------------
       STATISTICS COUNTER ANIMATION
    ------------------------------------------------------------- */
    const statsSection = document.querySelector('.hero-stats');
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const text = stat.textContent.trim();
            const match = text.match(/^(\d+)(.*)$/);
            if (!match) return;

            const targetVal = parseInt(match[1]);
            const suffix = match[2];
            const duration = 2000;
            let startTime = null;

            const step = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeProgress * targetVal);
                stat.textContent = currentVal + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = targetVal + suffix;
                }
            };
            requestAnimationFrame(step);
        });
    };

    if ('IntersectionObserver' in window && statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(statsSection);
    } else {
        animateStats();
    }

    /* -------------------------------------------------------------
       SMOOTH INTERPOLATED CURSOR GLOW TRAILER
    ------------------------------------------------------------- */
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isMoving) {
            isMoving = true;
            cursorX = mouseX;
            cursorY = mouseY;
        }
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .tool-card, .process-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('cursor-active');
        });
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.12;
        cursorY += dy * 0.12;

        cursorGlow.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* -------------------------------------------------------------
       INTERACTIVE CANVAS BACKGROUND FLOWING RIBBONS
    ------------------------------------------------------------- */
    const canvas = document.getElementById('bg-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let ribbons = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initRibbons();
        }

        class Ribbon {
            constructor(centerY, amp1, amp2, freq1, freq2, speed1, speed2, linesCount, lineOffset) {
                this.centerY = centerY;
                this.amp1 = amp1;
                this.amp2 = amp2;
                this.freq1 = freq1;
                this.freq2 = freq2;
                this.speed1 = speed1;
                this.speed2 = speed2;
                this.linesCount = linesCount;
                this.lineOffset = lineOffset;
                
                this.phase1 = Math.random() * Math.PI * 2;
                this.phase2 = Math.random() * Math.PI * 2;
            }

            update() {
                this.phase1 += this.speed1;
                this.phase2 += this.speed2;
            }

            draw(ctx, width, height) {
                const yBase = this.centerY * height;
                const scale = Math.min(1.5, Math.max(0.5, height / 800));
                const currentAmp1 = this.amp1 * scale;
                const currentAmp2 = this.amp2 * scale;
                
                const grad = ctx.createLinearGradient(0, 0, width, 0);
                grad.addColorStop(0, 'rgba(255, 30, 39, 0.002)');
                grad.addColorStop(0.2, 'rgba(255, 30, 39, 0.07)');
                grad.addColorStop(0.5, 'rgba(255, 94, 98, 0.12)');
                grad.addColorStop(0.8, 'rgba(255, 140, 0, 0.08)');
                grad.addColorStop(1, 'rgba(255, 30, 39, 0.002)');
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.75;

                for (let j = 0; j < this.linesCount; j++) {
                    ctx.beginPath();
                    const linePhase1 = this.phase1 + j * this.lineOffset;
                    const linePhase2 = this.phase2 + j * (this.lineOffset * 0.75);

                    for (let x = -20; x < width + 20; x += 15) {
                        let y = yBase + 
                                Math.sin(x * this.freq1 + linePhase1) * currentAmp1 + 
                                Math.cos(x * this.freq2 + linePhase2) * currentAmp2;
                        
                        if (typeof mouseX !== 'undefined' && typeof mouseY !== 'undefined') {
                            const dx = mouseX - x;
                            const dy = mouseY - y;
                            const dist = Math.hypot(dx, dy);
                            if (dist < 200) {
                                const force = (200 - dist) / 200;
                                y += (mouseY - y) * force * 0.15;
                            }
                        }

                        if (x === -20) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.stroke();
                }
            }
        }

        function initRibbons() {
            ribbons = [
                new Ribbon(0.28, 80, 40, 0.0018, 0.0035, 0.003, 0.005, 14, 0.035),
                new Ribbon(0.55, 110, 50, 0.0014, 0.0028, 0.002, 0.004, 18, 0.03),
                new Ribbon(0.80, 70, 30, 0.0022, 0.004, 0.004, 0.006, 12, 0.04)
            ];
        }

        function drawRibbons() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ribbons.forEach(ribbon => {
                ribbon.update();
                ribbon.draw(ctx, canvas.width, canvas.height);
            });
            requestAnimationFrame(drawRibbons);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawRibbons();
    }

    /* -------------------------------------------------------------
       BACK TO TOP SMOOTH SCROLL
    ------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('btn-back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
