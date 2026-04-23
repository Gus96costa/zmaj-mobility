document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE LENIS (Elite Smooth Scroll - Silky)
    window.lenisInstance = new Lenis({
        duration: 2,
        lerp: 0.1, // Adjusted for performance
        smoothWheel: true, // Hardware-accelerated smoothing
        wheelMultiplier: 1,
    });
    window.lenisInstance.stop(); // Lock scroll initially

    // Synchronize Lenis with GSAP ScrollTrigger
    window.lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        window.lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // 2. HERO ANIMATION SYSTEM (MatchMedia + Responsive Relatives)
    const mm = gsap.matchMedia();
    let bikeFloatTween;
    let tlScroll;
    let hubTl;
    // window.bikeIntroTween is global

    mm.add({
        isDesktop: "(min-width: 1025px)",
        isMobile: "(max-width: 1024px)"
    }, (context) => {
        let { isDesktop } = context.conditions;

        // Reset elements (GSAP will handle the initial state within matchMedia)
        gsap.set("#central-bike", { clearProps: "all" });
        gsap.set(["#beat-1", "#beat-2", "#beat-3"], { opacity: 0, y: "20vh", x: "0vw" });
        gsap.set("#city-ground", { yPercent: 100, opacity: 1 });

        // 1. INTRO: Falling Bike + Floating Loop (Relative Units)
        window.bikeIntroTween = gsap.from("#central-bike", {
            y: "-100vh",
            duration: 1.5,
            ease: "back.out(1.7)",
            paused: true,
            onComplete: () => {
                const scrollTrigger = ScrollTrigger.getById("heroScroll");
                if (!scrollTrigger || scrollTrigger.progress === 0) {
                    bikeFloatTween = gsap.to("#central-bike", {
                        y: "+=2vh",
                        duration: 1.5,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1
                    });
                }
            }
        });

        // 2. CLOUD DRIFT (Responsive)
        const cloudDrifts = [
            gsap.to("#cloud-front-1", { x: "2vw", y: "-1vh", duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 }),
            gsap.to("#cloud-front-2", { x: "-2vw", y: "1.5vh", duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 }),
            gsap.to("#cloud-back-1", { x: "-1.5vw", y: "-0.8vh", duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 }),
            gsap.to("#cloud-back-2", { x: "1.8vw", y: "1.2vh", duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1 })
        ];

        // 3. MAIN SCROLL TIMELINE
        tlScroll = gsap.timeline({
            id: "heroScroll",
            scrollTrigger: {
                trigger: "#clouds-scroller-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
                onUpdate: (self) => {
                    if (self.progress > 0) {
                        if (window.bikeIntroTween) { window.bikeIntroTween.kill(); window.bikeIntroTween = null; }
                        if (bikeFloatTween) { bikeFloatTween.kill(); bikeFloatTween = null; }
                        cloudDrifts.forEach(d => d.kill());
                    }
                }
            }
        });

        tlScroll.addLabel("sync", 0)
            // Atmospheric Clearance (Relative)
            .to("#cloud-front-1", { x: "-80vw", scale: 2.5, opacity: 0, duration: 85, ease: "power1.inOut" }, "sync")
            .to("#cloud-front-2", { x: "80vw", scale: 2.5, opacity: 0, duration: 85, ease: "power1.inOut" }, "sync")
            .to("#cloud-back-1", { x: "-40vw", scale: 2.5, opacity: 0, duration: 80, ease: "power1.inOut" }, "sync")
            .to("#cloud-back-2", { x: "40vw", scale: 2.5, opacity: 0, duration: 80, ease: "power1.inOut" }, "sync")

            // Descent (Relative)
            .to("#central-bike", { y: "35vh", duration: 100, ease: "none" }, "sync")
            .to("#central-bike", { opacity: 1, scale: isDesktop ? 3 : 2, duration: 15, ease: "power2.out" }, "sync");

        if (isDesktop) {
            // Desktop Zig-Zag
            tlScroll
                .to("#central-bike", { x: "20vw", scale: 1, rotateZ: 12, duration: 15, ease: "power1.inOut" }, 10)
                .to("#central-bike", { x: "-20vw", scale: 1, rotateZ: -12, duration: 25, ease: "power1.inOut" }, 30)
                .to("#central-bike", { x: "0vw", scale: 1.5, rotateZ: 0, duration: 25, ease: "power1.inOut" }, 60);
        } else {
            // Mobile Straight Drop - Minimal scale changes
            tlScroll
                .to("#central-bike", { scale: 0.8, duration: 15, ease: "power1.inOut" }, 10)
                .to("#central-bike", { scale: 1.2, duration: 25, ease: "power1.inOut" }, 30)
                .to("#central-bike", { scale: 1, duration: 25, ease: "power1.inOut" }, 60);
        }

        // Final Landing & Transition
        tlScroll
            .to("#central-bike", { x: "0vw", scale: 1.1, rotateZ: isDesktop ? 3 : 0, duration: 15, ease: "power2.out" }, 85)
            .fromTo("#city-ground", { yPercent: 100, y: 0 }, { yPercent: 0, y: 0, duration: 40, ease: "power2.out" }, 60);

        // TEXT BEATS (Relative)
        tlScroll
            .fromTo("#beat-1", { x: "-10vw", opacity: 0 }, { x: "0vw", opacity: 1, duration: 20, ease: "power1.out" }, 5)
            .to("#beat-1", { y: "-20vh", duration: 15, ease: "none" }, 10)
            .to("#beat-1", { opacity: 0, duration: 5, ease: "power2.in" }, 25)

            .fromTo("#beat-2", { x: "10vw", opacity: 0 }, { x: "0vw", opacity: 1, duration: 20, ease: "power1.out" }, 35)
            .to("#beat-2", { y: "-20vh", duration: 25, ease: "none" }, 40)
            .to("#beat-2", { opacity: 0, duration: 5, ease: "power2.in" }, 65)

            .to("#beat-3", { opacity: 1, y: "5vh", duration: 10, ease: "power2.out" }, 75)
            .to("#beat-3", { y: "-10vh", duration: 15, ease: "none" }, 80)
            .to("#beat-3", { opacity: 0, duration: 5, ease: "power2.in" }, 95);

        // Elite Blend
        tlScroll
            .to("#central-bike", { y: "+=15vh", opacity: 0, duration: 15, ease: "power2.inOut" }, 85)
            .to("#city-ground", { opacity: 0, duration: 10, ease: "power2.inOut" }, 90);
    });


    // --- ANIMACAO DO MANIFESTO STACK (Lazy Evaluation via IntersectionObserver) ---
    const manifestoCards = gsap.utils.toArray('.manifesto-card');
    const manifestoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Initialize GSAP only when the section is at least 10% visible
                manifestoCards.forEach((card, i) => {
                    const nextCard = manifestoCards[i + 1];
                    if (nextCard) {
                        gsap.to(card.querySelector('.card-inner'), {
                            scale: 0.9,
                            opacity: 0.5,
                            ease: "none",
                            scrollTrigger: {
                                trigger: nextCard,
                                start: "top bottom",
                                end: "top 10vh",
                                scrub: true
                            }
                        });
                    }
                });
                // Stop observing once initialized
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const manifestoSectionRef = document.getElementById('vision');
    if (manifestoSectionRef) {
        manifestoObserver.observe(manifestoSectionRef);
    }

    // --- FLASHLIGHT GLOBALLY NA MANIFESTO SECTION ---
    const manifestoSection = document.getElementById("vision");
    const flashlightCards = document.querySelectorAll(".flashlight-card");

    manifestoSection.addEventListener("mousemove", (e) => {
        flashlightCards.forEach(card => {
            // Update the x and y coords mathematically relative to the moving card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.set(card, {
                "--mouse-x": x + "px",
                "--mouse-y": y + "px"
            });

            // Proximity opacity blend for Text Labels targeting Space Mono and Numbers
            const texts = card.querySelectorAll('.interactive-light-target');
            texts.forEach(txt => {
                const txtRect = txt.getBoundingClientRect();
                const txtX = txtRect.left + txtRect.width / 2;
                const txtY = txtRect.top + txtRect.height / 2;

                // Calculando a distância radial da luz até o texto
                const dist = Math.sqrt(Math.pow(e.clientX - txtX, 2) + Math.pow(e.clientY - txtY, 2));

                const maxDist = 300; // Raio de influência da lanterna
                let intensity = gsap.utils.clamp(0, 1, 1 - (dist / maxDist));

                gsap.set(txt, { "--light-intensity": intensity });
            });
        });
    });
    // -------------------------------------------------------------

    // --- END-OF-SECTION BLEND (Saída do Manifesto para a Luz) ---
    const exitManifestoTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#vision",
            start: "92% bottom", // Inicia exatamente quando o último card termina
            end: "98% bottom", // Encurtamento da Cauda Dark: acelera a evasão final do fundo escuro
            scrub: 1
        }
    });

    exitManifestoTl
        // 1. Apaga a "lanterna" primeiro
        .to("#vision", { "--flashlight-opacity": 0, duration: 1 }, 0)
        // 2. Afasta e apaga os últimos cards suavemente
        .to(".stack-container", { opacity: 0, scale: 0.9, y: "-=80px", duration: 2, ease: "power2.inOut" }, 0)
        // 3. FUSÃO AURA: Background do Manifesto adota o tom azul celeste antes de dissipar (Glow-In da Névoa)
        .to("#vision", { backgroundColor: "#E8EDF2", duration: 3, ease: "power1.inOut" }, 0)
        // 4. Manifesto Dark evapora agressivamente -> App Hub com radial-gradient ilumina!
        .to("#vision", { opacity: 0, duration: 3, ease: "power1.inOut" }, 1)
        .to("#app-hub-section", { opacity: 1, duration: 3, ease: "power1.inOut" }, 1);

    // --- SEÇÃO 3: APP HUB (Aura Flashlight) ---
    const hubPhone = document.getElementById("hub-phone");
    const hubCards = document.querySelectorAll(".flashlight-hub-card");

    hubTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#app-hub-section",
            start: "top 15%",
            end: "bottom bottom",
            scrub: 2,
            onUpdate: () => {
                if (!hubPhone) return;
                const phoneRect = hubPhone.getBoundingClientRect();
                const phoneCenterX = phoneRect.left + phoneRect.width / 2;
                const phoneCenterY = phoneRect.top + phoneRect.height / 2;

                hubCards.forEach(card => {
                    const cardRect = card.getBoundingClientRect();
                    const x = phoneCenterX - cardRect.left;
                    const y = phoneCenterY - cardRect.top;

                    gsap.set(card, {
                        "--mouse-x": x + "px",
                        "--mouse-y": y + "px"
                    });
                });
            }
        }
    });

    hubCards.forEach(card => card.classList.add("light-active"));
    gsap.set("#vantage-cards", { x: "-100vw", autoAlpha: 0 });
    gsap.set("#plans-cards-rail", { x: "100vw", autoAlpha: 0 });

    // TIMELINE CALIBRADA: Equilíbrio entre Corda e Velocidade
    hubTl.fromTo("#hub-phone",
        { y: "-150vh", x: "0vw", rotationY: 0, rotationZ: 0, scale: 1.2, opacity: 0 },
        { y: "0vh", x: "0vw", rotationY: 0, rotationZ: 0, scale: 1, opacity: 1, duration: 100, ease: "power2.out" },
        0
    )
        .fromTo("#intro-text-1",
            { opacity: 0, x: -100, filter: "blur(12px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 20, ease: "power2.out" },
            10
        )
        .to("#intro-text-1", { opacity: 0, x: -50, filter: "blur(12px)", duration: 20, ease: "power1.inOut" }, 40)
        .fromTo("#intro-text-2",
            { opacity: 0, x: 100, filter: "blur(12px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 20, ease: "power2.out" },
            60
        )
        .to("#intro-text-2", { opacity: 0, x: 50, filter: "blur(12px)", duration: 20, ease: "power1.inOut" }, 90)
        .addLabel("app-intro-focus", 30)
        .add("start-magnet", 110)

        // TRILHO 1: ECOSYSTEM
        .to("#hub-phone", { x: "-32vw", rotationY: 15, rotationZ: -4, duration: 20, ease: "power2.inOut" }, "start-magnet")
        .to("#vantage-cards", { autoAlpha: 1, duration: 5 }, "start-magnet+=5")
        .to("#vantage-title", { opacity: 1, duration: 5 }, "start-magnet+=8")
        .to("#magnet-glow", { filter: "drop-shadow(0 -15px 40px rgba(56,189,248,0.5))", duration: 5 }, "start-magnet+=10")

        .to("#hub-phone", { x: "32vw", rotationY: -5, duration: 30, ease: "sine.inOut" }, "start-magnet+=25")
        .to("#vantage-cards", { x: "0vw", duration: 30, ease: "sine.inOut" }, "start-magnet+=25")
        .addLabel("ecosystem-focus", "start-magnet+=55")

        .to("#vantage-cards", { x: "0vw", duration: 45 }, "ecosystem-focus")

        .to("#hub-phone", { x: "-32vw", rotationY: 15, duration: 25, ease: "power2.inOut" }, "ecosystem-focus+=45")
        .to("#vantage-cards", { x: "-100vw", autoAlpha: 0, duration: 25, ease: "power2.inOut" }, "ecosystem-focus+=45")
        .to("#vantage-title", { opacity: 0, duration: 10 }, "ecosystem-focus+=45")
        .to("#magnet-glow", { filter: "drop-shadow(0 0 0 rgba(0,0,0,0))", duration: 10 }, "ecosystem-focus+=65")

        // TRILHO 2: PRICING
        .to("#hub-phone", { x: "32vw", rotationY: -15, rotationZ: 4, duration: 25, ease: "power2.inOut" }, "ecosystem-focus+=75")
        .to("#plans-cards-rail", { autoAlpha: 1, duration: 5 }, "ecosystem-focus+=100")
        .to("#pricing-title", { opacity: 1, duration: 5 }, "ecosystem-focus+=103")

        .to("#hub-phone", { x: "-32vw", rotationY: 5, duration: 30, ease: "sine.inOut" }, "ecosystem-focus+=110")
        .to("#plans-cards-rail", { x: "0vw", duration: 30, ease: "sine.inOut" }, "ecosystem-focus+=110")
        .addLabel("plans-focus", "ecosystem-focus+=140")

        .to("#plans-cards-rail", { x: "0vw", duration: 45 }, "plans-focus")

        .to("#hub-phone", { x: "32vw", rotationY: -15, duration: 25, ease: "power2.inOut" }, "plans-focus+=45")
        .to("#plans-cards-rail", { x: "100vw", autoAlpha: 0, duration: 25, ease: "power2.inOut" }, "plans-focus+=45")
        .to("#pricing-title", { opacity: 0, duration: 10 }, "plans-focus+=45")

        // SAÍDA REFINADA: Volta ao centro, pausa e mergulha
        .to("#hub-phone", { x: "0vw", rotationY: 0, rotationZ: 0, duration: 20, ease: "power2.inOut" }, "plans-focus+=75")
        .to("#hub-phone", { x: "0vw", duration: 20 }, "plans-focus+=95") // Pausa no centro
        .to("#hub-phone", { y: "180vh", scale: 0.5, opacity: 0, duration: 40, ease: "power2.in" }, "plans-focus+=115");

    // ==========================================
    // SEÇÃO 4: REVEAL DO VÍDEO E SINCRONIA DE TEXTO
    // ==========================================
    const downloadTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#download",
            start: "top bottom",
            end: "top top",
            scrub: 1.5,
        }
    });

    // Configuração inicial do vídeo e container
    gsap.set("#download-video", { scale: 1.1, filter: "brightness(0.5)" });
    gsap.set("#download-carousel-container", { opacity: 0, y: 50 });

    downloadTl
        .to("#download-video", {
            scale: 1,
            filter: "brightness(1)",
            ease: "none"
        })
        .to("#download-carousel-container", {
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, 0.5); // Reveal sincronizado a 50% da transição

    // --- MAIN FOOTER (Normal Static State) ---
    // Removed reveal / magnet effect for a "glued" and solid experience.
    gsap.set("#main-footer", { opacity: 1, y: 0 });

    // Newsletter Flashlight Influence
    const newsletterWrapper = document.querySelector('.newsletter-flashlight-wrapper');
    if (newsletterWrapper) {
        newsletterWrapper.addEventListener('mousemove', (e) => {
            const rect = newsletterWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            newsletterWrapper.style.setProperty('--mouse-x', `${x}px`);
            newsletterWrapper.style.setProperty('--mouse-y', `${y}px`);
        });
    }


    // ==========================================
    // DOWNLOAD SECTION - INTERACTIVE CAROUSEL
    // ==========================================
    const carouselSection = document.getElementById("download");
    const carouselContainer = document.getElementById("download-carousel-container");
    const carouselSlides = document.querySelectorAll(".carousel-slide-content");
    const carouselDots = document.querySelectorAll(".carousel-dot");
    let activeSlideIndex = 0;
    let autoPlayTimer;
    let isPaused = false;

    function showSlide(index) {
        if (index === activeSlideIndex) return;

        const prevSlide = carouselSlides[activeSlideIndex];
        const nextSlide = carouselSlides[index];

        // Fade out current slide - Snappy out
        gsap.to(prevSlide, {
            opacity: 0,
            y: -15,
            filter: "blur(8px)",
            duration: 0.25,
            zIndex: 10,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(prevSlide, { pointerEvents: "none" });
            }
        });

        // Update dots visual state INSTANTLY
        carouselDots.forEach((dot, idx) => {
            if (idx === index) {
                dot.style.backgroundColor = "#FFFFFF";
                dot.style.boxShadow = "0 0 15px rgba(56, 189, 248, 1)";
                dot.style.opacity = "1";
                dot.style.width = "40px";
            } else {
                dot.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                dot.style.boxShadow = "none";
                dot.style.opacity = "0.6";
                dot.style.width = "24px";
            }
        });

        // Fade in next slide - Snappy in
        gsap.fromTo(nextSlide,
            { opacity: 0, y: 15, filter: "blur(8px)", zIndex: 20 },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.45,
                ease: "power3.out",
                pointerEvents: "auto"
            }
        );

        activeSlideIndex = index;
    }

    function startAutoPlay() {
        stopAutoPlay();
        if (isPaused) return; // Não inicia se o usuário estiver com o mouse em cima

        autoPlayTimer = setInterval(() => {
            const rect = carouselSection.getBoundingClientRect();
            const isVisible = (rect.top < window.innerHeight && rect.bottom > 0);

            if (isVisible && !isPaused) {
                let nextIndex = (activeSlideIndex + 1) % carouselSlides.length;
                showSlide(nextIndex);
            }
        }, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    // Pause on Hover: Agora bloqueia o reinício automático
    carouselContainer.addEventListener("mouseenter", () => {
        isPaused = true;
        stopAutoPlay();
    });

    carouselContainer.addEventListener("mouseleave", () => {
        isPaused = false;
        startAutoPlay();
    });

    // Click manual nos dots: Prioridade total ao usuário
    carouselDots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            // Se clicarmos, queremos ver o slide imediatamente, mas o timer não deve 
            // rodar enquanto o mouse estiver sobre o dot ou o container
            stopAutoPlay();
            showSlide(idx);
            if (!isPaused) startAutoPlay();
        });
    });

    // Initial State: Reveal sincronizado via ScrollTrigger, mas garante estado do primeiro slide
    gsap.set(carouselSlides[0], { opacity: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" });
    startAutoPlay();

    // -------------------------------------------------------------------
    // HIGH-STANDARD NAVIGATION (GSAP ScrollTo)
    // -------------------------------------------------------------------

    const mainNavLinks = document.querySelectorAll('.nav-link-item');
    const anchorSections = ['home', 'vision', 'app-trigger', 'plans', 'download', 'contacts'];
    const activeObserverSections = ['home', 'vision', 'app-hub-section', 'plans', 'download', 'contacts'];

    mainNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);

                if (targetId === 'home') {
                    // 1. Reset logic optimized for Lenis
                    window.history.scrollRestoration = 'manual';
                    ScrollTrigger.clearScrollMemory();

                    window.lenisInstance.scrollTo(0, {
                        duration: 2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Power4-like easing
                        onComplete: () => {
                            if (tlScroll && tlScroll.scrollTrigger) {
                                tlScroll.pause(0);
                                tlScroll.scrollTrigger.disable();
                                tlScroll.scrollTrigger.enable();
                            }
                            if (window.bikeIntroTween) {
                                window.bikeIntroTween.restart();
                            }
                            ScrollTrigger.refresh(true);
                        }
                    });
                    return;
                }

                if (targetId === 'app-trigger') {
                    if (hubTl && hubTl.scrollTrigger) {
                        const introScrollPos = hubTl.scrollTrigger.labelToScroll("app-intro-focus");
                        window.lenisInstance.scrollTo(introScrollPos, {
                            duration: 2,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    } else {
                        window.lenisInstance.scrollTo('#app-hub-section', { duration: 2 });
                    }
                    return;
                }

                if (targetId === 'plans') {
                    if (hubTl && hubTl.scrollTrigger) {
                        const plansScrollPos = hubTl.scrollTrigger.labelToScroll("plans-focus");
                        window.lenisInstance.scrollTo(plansScrollPos, {
                            duration: 2,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    } else {
                        window.lenisInstance.scrollTo('#plans', { duration: 2 });
                    }
                    return;
                }

                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.lenisInstance.scrollTo(targetElement, {
                        duration: 2,
                        offset: targetId === 'download' ? 0 : -80,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });

    // Advanced Active State Tracking
    const activeObserverOptions = {
        root: null,
        rootMargin: '-15% 0px -75% 0px',
        threshold: 0
    };

    const activeObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                mainNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const activeObserver = new IntersectionObserver(activeObserverCallback, activeObserverOptions);
    activeObserverSections.forEach(id => {
        const el = document.getElementById(id);
        if (el) activeObserver.observe(el);
    });
    // --- 9. MOBILE MENU CONTROLS ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        mobileMenuOverlay.classList.toggle('opacity-0');
        mobileMenuOverlay.classList.toggle('pointer-events-none');
        mobileMenuOverlay.classList.toggle('invisible');
        // Prevent scroll when menu is open
        if (!mobileMenuOverlay.classList.contains('opacity-0')) {
            window.lenisInstance.stop();
        } else {
            window.lenisInstance.start();
        }
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenu) closeMobileMenu.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            toggleMobileMenu();
            window.lenisInstance.scrollTo(targetId, {
                offset: -80,
                duration: 2
            });
        });
    });
});

    // ==========================================
    // SUSTAINABILITY IMPACT ANIMATION (DASHBOARD)
    // ==========================================
    const impactSection = document.getElementById('impact');
    if (impactSection) {
        // Envolver a criação do ScrollTrigger em um IntersectionObserver
        const impactObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ScrollTrigger.create({
                        trigger: "#impact",
                        start: "top 75%", // Ativa quando a secção entra 75% no ecrã
                        onEnter: () => {
                            // 1. Animar a contagem dos números (0 a 1200)
                            const counters = document.querySelectorAll('#impact .gsap-counter');
                            counters.forEach(counter => {
                                const target = parseInt(counter.getAttribute('data-target') || counter.innerText);
                                // Reseta para 0 antes de animar
                                counter.innerText = "0"; 
                                gsap.to(counter, {
                                    innerHTML: target,
                                    duration: 2.5,
                                    snap: { innerHTML: 1 }, // Roda sem decimais
                                    ease: "power3.out"
                                });
                            });

                            // 2. Animar o SVG do Gráfico (A linha principal que se desenha)
                            // Procura a tag <path> que representa a linha do gráfico no Card 1
                            const chartLine = document.querySelector('#impact svg path.aura-slice'); 
                            if (chartLine) {
                                const length = chartLine.getTotalLength();
                                // Esconde a linha inicialmente
                                gsap.set(chartLine, { strokeDasharray: length, strokeDashoffset: length });
                                // Desenha a linha da esquerda para a direita
                                gsap.to(chartLine, {
                                    strokeDashoffset: 0,
                                    duration: 2.5,
                                    ease: "power2.inOut",
                                    delay: 0.2
                                });
                            }
                        },
                        once: true // Anima apenas a primeira vez que o utilizador passa
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        impactObserver.observe(impactSection);
    }

// ==========================================
// LOAD STATE & REVEAL CHOREOGRAPHY
// ==========================================
window.addEventListener('load', () => {
    // Força um pequeno atraso de segurança para otimização de CPU no Loader
    setTimeout(() => {
        gsap.to("#loader", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                const loader = document.getElementById("loader");
                if (loader) loader.style.display = "none";

                if (window.lenisInstance) window.lenisInstance.start();
                
                // Delay para diluir o esforço de renderização
                setTimeout(() => {
                    if (window.bikeIntroTween) window.bikeIntroTween.play();
                }, 200);
            }
        });
    }, 100);

    // ==========================================
    // VIDEO VISIBILITY TRACKING (Hardware Optimization)
    // ==========================================
    const bgVideo = document.getElementById('download-video');
    if (bgVideo) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bgVideo.play().catch(e => console.warn("Video auto-play prevented:", e));
                } else {
                    bgVideo.pause();
                }
            });
        }, { threshold: 0.05 }); // Ativa o listener mesmo com baixa visibilidade para não engasgar
        
        videoObserver.observe(bgVideo);
    }
});

