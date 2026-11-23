//
function returnValue() {
    const w = window.innerWidth;
    if (w > 1920) return 46;
    if (w > 1700) return 55;
    if (w > 1500) return 53;
    if (w > 1400) return 51;
    if (w > 1300) return 57;
    if (w >= 1280) return 55;
    return 63;
}

document.addEventListener("DOMContentLoaded", () => {
    /*Responsive video source*/
    document.querySelectorAll('video.lozad[data-src-md]').forEach(function (video) {
        var w = window.innerWidth;
        if (w >= 1880 && video.dataset.srcLg) {
            video.dataset.src = video.dataset.srcXl;
        } else if (w >= 1441 && video.dataset.srcLg) {
            video.dataset.src = video.dataset.srcLg;
        } else if (w >= 769 && video.dataset.srcMd) {
            video.dataset.src = video.dataset.srcMd;
        }
    });

    /*LazyLoad*/
    function initLazyLoad() {
        setTimeout(function () {
            observer = lozad('.lozad', {
                rootMargin: '200px 0px',
                threshold: 0,
                loaded: function (el) {
                    el.classList.add('loaded')
                }
            })
            observer.observe()
        }, 100)
    }

    initLazyLoad()

    // /*After ajax pagination*/
    // /*After ajax pagination*/
    // $(document).on('pdopage_load', function (event, config, response) {
    //     //Функция которые должны примениться к новым элементам
    //     initLazyLoad()
    // })
    //
    // /*After mFilter2 load*/
    // $(document).on('mse2_load', function (e, data) {
    //     initLazyLoad()
    // });
})

// Vanilla Input Mask init
const phoneMask = [
    '+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ',
    '-', /\d/, /\d/, /\d/, ' ',
    '-', /\d/, /\d/, ' ',
    '-', /\d/, /\d/
];

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    const mobMenu = header.querySelector('.mob-menu');
    const button = header.querySelector('.header__burger');
    const logo = header.querySelector('.header__logo');
    const bottom = header.querySelector('.header__bottom');

    button.addEventListener('click', () => {
        const isOpening = !mobMenu.classList.contains('active');

        if (isOpening) {
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
            document.body.classList.add('mob-menu-open');
        } else {
            const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
            document.body.classList.remove('mob-menu-open');
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
        }

        mobMenu.classList.toggle('active');
        button.classList.toggle('active');
        logo.classList.toggle('active');
        bottom.classList.toggle('active');
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const listPhoneInputs = document.querySelectorAll('input[type="tel"]')
    listPhoneInputs.forEach((input) => {
        console.log(vanillaTextMask)
        const maskedInputController = vanillaTextMask.maskInput({
            inputElement: input,
            mask: phoneMask
        })
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const freeConsult = document.querySelector('#free-consult');
    if (freeConsult) {
        const checkbox = freeConsult.querySelector('input[name="agree-policy"]');
        const submitBtn = freeConsult.querySelector('button[type="submit"]');
        if (checkbox && submitBtn) {
            checkbox.addEventListener('change', () => {
                submitBtn.disabled = !checkbox.checked;
            });
        }
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const sales = document.querySelectorAll('.sales');
    sales.forEach((block) => {
        const slider = block.querySelector('.swiper')
        const prevBtn = block.querySelector('.slider-button-prev')
        const nextBtn = block.querySelector('.slider-button-next')
        const pag = block.querySelector(`[data-swiper="pagination"]`)

        const swiper = new Swiper(slider, {
            slidesPerView: 1,
            navigation: {
                prevEl: prevBtn,
                nextEl: nextBtn
            },
            pagination: {
                el: pag,
            }
        })
    })
})

document.addEventListener("DOMContentLoaded", () => {

    const listPrograms = document.querySelectorAll('.programs:not(.programs--native)');
    listPrograms.forEach((block) => {
        const slider = block.querySelector('.swiper');
        const prevBtn = block.querySelector(`[data-id="prev"]`);
        const nextBtn = block.querySelector(`[data-id="next"]`);

        const videos = slider.querySelectorAll('video');
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // На мобилке всегда виден 1 слайд — ленивая загрузка не нужна.
            // Устанавливаем src, вызываем load() и play() явно — autoplay-атрибут
            // браузер учитывает только при парсинге, а не при программной смене src.
            videos.forEach((v) => {
                const src = v.dataset.src || v.dataset.vsrc;
                if (src && !v.getAttribute('src')) {
                    v.src = src;
                    try { v.load(); } catch (_) {}
                    const p = v.play();
                    if (p !== undefined) p.catch(() => {});
                }
                v.removeAttribute('data-src');
                v.removeAttribute('data-vsrc');
                v.classList.remove('lozad');
            });
        } else {
            // Перехватываем src до инициализации Swiper — иначе браузер начнёт грузить все видео сразу.
            // autoplay оставляем: он помогает видео стартовать когда данные буферизованы,
            // а для частично видимых слайдов IO подавляет его явным pause().
            videos.forEach((v) => {
                const src = v.dataset.src || v.getAttribute('src');
                if (src) v.dataset.vsrc = src;
                if (v.hasAttribute('src')) v.removeAttribute('src');
                v.removeAttribute('data-src');
                v.classList.remove('lozad');
                try { v.load(); } catch (_) {}
            });
        }

        new Swiper(slider, {
            navigation: {
                prevEl: prevBtn,
                nextEl: nextBtn
            },
            breakpoints: {
                0:    { slidesPerView: 1.1 },
                768:  { slidesPerView: 2.1 },
                1024: { slidesPerView: 3.1 },
                1280: { slidesPerView: 3.1 }
            },
        });

        if (!isMobile) {
            const ensureSrc = (v) => {
                if (v.src) return;
                const src = v.dataset.vsrc;
                if (!src) return;
                v.src = src;
                try { v.load(); } catch (_) {}
            };
            const releaseSrc = (v) => {
                if (!v.src) return;
                v.pause();
                v.removeAttribute('src');
                try { v.load(); } catch (_) {}
            };

            // Уровень 1: горизонтальная видимость внутри слайдера.
            // root: slider работает потому что .swiper имеет overflow:hidden —
            // слайды за кадром получают ratio=0 и освобождают декодер.
            const videoIO = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const v = entry.target;
                    const r = entry.intersectionRatio;
                    if (r >= 0.99) {
                        ensureSrc(v);
                        const p = v.play();
                        if (p !== undefined) p.catch(() => {});
                    } else if (r > 0) {
                        ensureSrc(v);
                        v.pause();
                    } else {
                        releaseSrc(v);
                    }
                });
            }, { root: slider, threshold: [0, 0.01, 0.99, 1] });

            // Уровень 2: вертикальная видимость секции в окне браузера.
            // Когда блок уходит из вьюпорта — мгновенно освобождаем все видео,
            // не дожидаясь медленных колбеков videoIO.
            const sectionIO = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) videos.forEach(releaseSrc);
            }, { threshold: 0 });

            sectionIO.observe(block);
            videos.forEach((v) => videoIO.observe(v));
        }
    });
})

// ui-tabs.module.js
document.addEventListener("DOMContentLoaded", () => {
    const listTabs = document.querySelectorAll(`[data-tabs]`);

    listTabs.forEach((block) => {
        const tabs = [...block.querySelectorAll(`[data-tab='tab']`)];
        const contents = block.querySelectorAll(`[data-tab='content']`);

        const closeAll = () => {
            contents.forEach((content) => content.removeAttribute("data-tab-active"));
            tabs.forEach((tab) => tab.removeAttribute("data-tab-active"));
        };

        const toggleTab = (index) => {
            closeAll();
            contents[index].setAttribute("data-tab-active", "");
            tabs[index].setAttribute("data-tab-active", "");

            block.dispatchEvent(
                new CustomEvent("tab-change", {
                    bubbles: true,
                    detail: {index},
                })
            );
        };

        tabs.forEach((tab, index) => {
            tab.addEventListener("click", () => {
                // Если кликаем по активному табу и его индекс не 0 - переключаемся на первый таб
                const isActive = tab.hasAttribute("data-tab-active");
                if (isActive && index !== 0) {
                    toggleTab(0);
                } else if (!isActive) {
                    toggleTab(index);
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const listShopsSlider = document.querySelectorAll(`[data-tab-slider]`);

    listShopsSlider.forEach((block) => {
        const contents = block.querySelectorAll("[data-tab='content']");
        const controls = block.querySelectorAll(`[data-swiper="controls"]`);

        // Кэш инстансов по индексу таба
        const swipers = new Map();

        block.addEventListener("tab-change", (e) => {
            const {index} = e.detail;
            initOrAttach(index);
        });

        // Инициализация при загрузке
        requestAnimationFrame(() => {
            block.dispatchEvent(
                new CustomEvent("tab-change", {
                    bubbles: true,
                    detail: {index: 0},
                })
            );
        });

        function initOrAttach(index) {
            const swiperEl = contents[index]?.querySelector(".swiper");
            if (!swiperEl) return;

            // Лениво создаём Swiper, НО без привязки навигации/пагинации
            if (!swipers.has(index)) {
                const instance = new Swiper(swiperEl, {
                    slidesPerView: 1,
                    watchOverflow: true,
                    observer: true,
                    observeParents: true,
                });
                swipers.set(index, instance);
            }

            // Перепривязываем ОДИН общий controls к активному Swiper
            const swiper = swipers.get(index);
            attachControls(swiper, controls[index]);
        }

        function attachControls(swiper, controlsRoot) {
            const prevBtn = controlsRoot.querySelector('[data-id="prev"]');
            const nextBtn = controlsRoot.querySelector('[data-id="next"]');
            const pagination = controlsRoot.querySelector(`[data-swiper="pagination"]`);

            // Навигация
            // 1) уничтожаем прошлую привязку (если была)
            swiper.navigation?.destroy();
            // 2) задаём новые элементы
            swiper.params.navigation = swiper.params.navigation || {};
            swiper.params.navigation.prevEl = prevBtn;
            swiper.params.navigation.nextEl = nextBtn;
            // 3) инициализируем и обновляем
            swiper.navigation.init();
            swiper.navigation.update();

            // Пагинация (fraction)
            swiper.pagination?.destroy();
            swiper.params.pagination = swiper.params.pagination || {};
            swiper.params.pagination.el = pagination;
            swiper.pagination.init();
            swiper.pagination.render(); // чтобы сразу нарисовать фракцию
            swiper.pagination.update();
        }
    });
})

document.addEventListener("DOMContentLoaded", () => {
    const listShopsSlider = document.querySelectorAll(`[data-directions-slider]`);
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    listShopsSlider.forEach((block) => {
        const contents = block.querySelectorAll("[data-tab='content']");
        const controls = block.querySelectorAll(`[data-swiper="controls"]`);

        const deskParamas = {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            speed: 800,
            initialSlide: 1,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 2,
                slideShadows: true,
            },
        }

        const mobParams = {
            slidesPerView: 1,
            initialSlide: 0,
            watchOverflow: true,
            observer: true,
            observeParents: true,
        }

        // Кэш инстансов по индексу таба
        const swipers = new Map();

        if (!isMobile) {
            // Десктоп: инициализируем все сразу
            requestAnimationFrame(() => {
                contents.forEach((_, index) => initOrAttach(index));
            });
        } else {
            // Мобайл: лениво по событию смены вкладки
            block.addEventListener("tab-change", (e) => {
                initOrAttach(e.detail.index);
            });

            requestAnimationFrame(() => {
                block.dispatchEvent(
                    new CustomEvent("tab-change", {
                        bubbles: true,
                        detail: {index: 0},
                    })
                );
            });
        }

        function initOrAttach(index) {
            const swiperEl = contents[index]?.querySelector(".swiper");
            if (!swiperEl) return;

            if (!swipers.has(index)) {
                const instance = new Swiper(swiperEl, isMobile ? mobParams : deskParamas);

                if (!isMobile) {
                    initVideoHover(instance);
                    requestAnimationFrame(() => instance.update());
                }

                swipers.set(index, instance);
            }

            const swiper = swipers.get(index);
            attachControls(swiper, controls[index]);
        }

        function initLazyLoad() {
            setTimeout(function () {
                observer = lozad('.v-lozad', {
                    rootMargin: '200px 0px',
                    threshold: 0,
                    loaded: function (el) {
                        el.classList.add('loaded')
                        el.pause()
                        if (el.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
                            el.play()
                        }
                    }
                })
                observer.observe()
            }, 100)
        }

        function initVideoHover(swiper) {
            let isTransitioning = false;
            let currentZone = null;

            initLazyLoad()

            playActiveVideo();

            swiper.on("slideChangeTransitionStart", () => {
                isTransitioning = true;
                pauseAllVideos();
            });

            swiper.on("slideChangeTransitionEnd", () => {
                isTransitioning = false;
                playActiveVideo();
            });

            swiper.el.addEventListener("mousemove", (e) => {
                if (isTransitioning) return;

                const rect = swiper.el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const zone = x < rect.width * 0.3 ? "left"
                           : x > rect.width * 0.7 ? "right"
                           : "center";

                if (zone === currentZone) return;
                currentZone = zone;

                if (zone === "left") swiper.slidePrev();
                else if (zone === "right") swiper.slideNext();
            });

            swiper.el.addEventListener("mouseleave", () => {
                currentZone = null;
            });

            function playActiveVideo() {
                const video = swiper.el.querySelector(".swiper-slide-active video");
                if (!video) return;
                // if (!video.src && video.dataset.src) {
                //     // video.src = video.dataset.src;
                //     video.load();
                // }
                video.play().catch(() => {});
            }

            function pauseAllVideos() {
                swiper.slides.forEach(s => s.querySelector("video")?.pause());
            }
        }

        function attachControls(swiper, controlsRoot) {
            const prevBtn = controlsRoot.querySelector('[data-id="prev"]');
            const nextBtn = controlsRoot.querySelector('[data-id="next"]');
            // 1) уничтожаем прошлую привязку (если была)
            swiper.navigation?.destroy();
            // 2) задаём новые элементы
            swiper.params.navigation = swiper.params.navigation || {};
            swiper.params.navigation.prevEl = prevBtn;
            swiper.params.navigation.nextEl = nextBtn;
            // 3) инициализируем и обновляем
            swiper.navigation.init();
            swiper.navigation.update();
        }
    });
})

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof Observer !== 'undefined') gsap.registerPlugin(Observer);

    // Lenis — плавный скролл (только десктоп)
    if (typeof Lenis !== 'undefined' && window.innerWidth > 767) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            wrapper: window,
            content: document.documentElement,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        window.lenis = lenis;
    }

    // На мобилке нормализуем скролл встроенным инструментом GSAP —
    // сглаживает iOS-momentum и убирает резкие остановки.
    // ignore: горизонтально-скроллируемые контейнеры — иначе normalizeScroll
    // вызывает preventDefault() в capture-фазе и блокирует их нативный свайп.
    if (window.innerWidth <= 767) {
        ScrollTrigger.normalizeScroll({
            ignore: '.constructor__item, .constructor__tabs, .mob-menu, .directions__tabs',
        });
    }

    // Маппинг направлений: класс → смещение для начального состояния
    const directionMap = {
        'from-left':   { x: -200, y: 0 },
        'from-right':  { x: 200,  y: 0 },
        'from-top':    { x: 0,    y: -200 },
        'from-bottom': { x: 0,    y: 200 },
    };

    const sections = document.querySelectorAll("section");
    const header = document.querySelector('.header');
    const chooseProgram = document.querySelector('.choose-program');

    // Данные для stateless пересчёта: список green-header секций с margin-ами
    // (вычисляются один раз при init) + ссылка на tl2 из tihs-секции.
    const greenSectionData = [];   // для header — все green-header секции
    const cpSectionData = [];      // для choose-program — green-header без white-programs
    let tihsTl2 = null;
    let tihsSection = null;
    let tihsGalleryStart = 0;

    const updateHeaderColor = () => {
        if (!header) return;
        const tihsBigSliderActive = tihsSection && tihsTl2 && !tihsTl2.reversed() && tihsTl2.time() >= tihsGalleryStart;
        const tihsInView = tihsBigSliderActive && (() => {
            const r = tihsSection.getBoundingClientRect();
            return r.bottom > 0 && r.top < window.innerHeight;
        })();

        const checkGreen = (data, refBottom) => data.some(({ section, mt, mb }) => {
            const rect = section.getBoundingClientRect();
            if ((rect.top - mt) > refBottom || (rect.bottom + mb) < refBottom) return false;
            if (section === tihsSection && tihsBigSliderActive) return false;
            return true;
        });

        // Header — все green-header секции, своя позиция
        if (tihsInView) {
            header.classList.remove('header--green');
        } else {
            header.classList.toggle('header--green', checkGreen(greenSectionData, header.getBoundingClientRect().bottom));
        }

        // choose-program — только секции без white-programs.
        // tihsInView НЕ используем: он держит CP white пока tihs полностью не уйдёт
        // с экрана (~725px скролла), хотя defines уже давно перекрывает кнопку.
        // Для CP достаточно простой проверки: нижний край кнопки физически
        // находится внутри секции — без поправок на margin.
        if (chooseProgram) {
            const cpBottom = chooseProgram.getBoundingClientRect().bottom;
            const cpGreen = cpSectionData.some(({ section }) => {
                const r = section.getBoundingClientRect();
                return r.top <= cpBottom && r.bottom >= cpBottom;
            });
            chooseProgram.classList.toggle('green', cpGreen);
        }
    };

    sections.forEach((section) => {
        // Анимации directionMap
        const isHalf = section.classList.contains('half-section');
        Object.keys(directionMap).forEach((cls) => {
            const offset = directionMap[cls];
            section.querySelectorAll('.' + cls).forEach((el) => {
                // defines__item внутри half-section анимируются отдельно
                if (isHalf && el.classList.contains('defines__item')) return;
                el.style.willChange = 'transform, opacity';
                const isMob = window.innerWidth < 768;
                gsap.fromTo(el,
                    { x: offset.x, y: offset.y, opacity: 0 },
                    {
                        x: 0, y: 0, opacity: 1,
                        duration: isMob ? 0.7 : undefined,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 90%',
                            ...(isMob ? {} : {
                                end: 'top 15%',
                                scrub: 2.5,
                                fastScrollEnd: true,
                                preventOverlaps: true,
                            }),
                            onLeave: () => { el.style.willChange = 'auto'; },
                            onEnterBack: () => { el.style.willChange = 'transform, opacity'; },
                        }
                    }
                );
            });
        });

        // Собираем данные green-header секций для stateless updateHeaderColor.
        // Margins вычисляем один раз при init — они не меняются при скролле.
        if (section.classList.contains('green-header')) {
            const cs = getComputedStyle(section);
            const entry = {
                section,
                mt: parseFloat(cs.marginTop) || 0,
                mb: parseFloat(cs.marginBottom) || 0,
            };
            greenSectionData.push(entry);
            if (!section.classList.contains('white-programs')) cpSectionData.push(entry);
        }

        // tihs — многошаговая анимация на ScrollTrigger
        // data-anim="css" — альтернативная реализация на чистом CSS (прототип в test.html)
        if (section.classList.contains('tihs') && section.dataset.anim !== 'css') {
            const pathGroups = section.querySelectorAll('.tihs-g');
            const mobilePathGroups = section.querySelectorAll('.tihs-g-mob');
            const titleEl = section.querySelector('.tihs__title');
            const textSpans = section.querySelectorAll('.tihs__title-text');
            const maskReveal = section.querySelector('.tihs__mask-reveal');
            const bigSliderWrapper = section.querySelector('.big-slider-wrapper');

            const isMobileTihs = window.innerWidth < 768;
            let tl1, tl2;
            let bigSlider = null, descContainer = null;

            // === Мобилка: tl1 — линии (3 группы), tl2 — fade + big-slider ===
            if (isMobileTihs) {
                const svgBigPrint = section.querySelector('.tihs__big-print');
                if (svgBigPrint) svgBigPrint.style.display = 'none';

                // Размер/позиция heart под мобилку
                const atmosSpan = textSpans[textSpans.length - 1];
                let mX = 50, mY = 50;
                if (atmosSpan && maskReveal) {
                    const spanRect = atmosSpan.getBoundingClientRect();
                    const sectionRect = section.getBoundingClientRect();
                    const firstSpan = textSpans[0];
                    const firstSpanRect = firstSpan ? firstSpan.getBoundingClientRect() : spanRect;

                    let mSize = (spanRect.height / sectionRect.width) * 100;
                    if (mSize < 25) mSize = 25;
                    const betweenY = (firstSpanRect.bottom + spanRect.top) / 2;
                    mX = ((spanRect.left + spanRect.width / 2 - sectionRect.left) / sectionRect.width) * 100;
                    mY = ((betweenY - sectionRect.top) / sectionRect.height) * 100;

                    const sizeStr = mSize + '%';
                    const posStr = mX + '% ' + mY + '%';
                    maskReveal.style.maskSize = sizeStr;
                    maskReveal.style.webkitMaskSize = sizeStr;
                    maskReveal.style.maskPosition = posStr;
                    maskReveal.style.webkitMaskPosition = posStr;
                }

                // === tl1: прорисовка 3 мобильных линий clip-path (как на десктопе) ===
                const mobAnimOrder = [
                    { idx: 0, from: 'polygon(-50% -50%, 150% -50%, 150% -10%, -50% -30%)',
                               to:   'polygon(-50% -50%, 150% -50%, 150% 130%, -50% 110%)' },
                    { idx: 1, from: 'polygon(150% -50%, 110% -50%, 130% 150%, 150% 150%)',
                               to:   'polygon(150% -50%, -30% -50%, -10% 150%, 150% 150%)' },
                    { idx: 2, from: 'polygon(-50% 150%, 150% 150%, 150% 110%, -50% 130%)',
                               to:   'polygon(-50% 150%, 150% 150%, 150% -30%, -50% -10%)' },
                ];
                mobAnimOrder.forEach((item) => {
                    const g = mobilePathGroups[item.idx];
                    if (g) gsap.set(g, { clipPath: item.from });
                });

                tl1 = gsap.timeline({ paused: true });
                mobAnimOrder.forEach((item, order) => {
                    const g = mobilePathGroups[item.idx];
                    if (!g) return;
                    tl1.to(g, { clipPath: item.to, duration: 1.5, ease: 'power3.out' }, order * 0.15);
                });

                // === tl2: heart уходит влево + big-slider въезжает справа ===
                const heartExitDur = 0.8;
                const bigSliderEnterDelay = heartExitDur * 0.5;                      // 0.4s
                const bigSliderEnterDur = 0.7;
                const descRevealDelay = bigSliderEnterDelay + bigSliderEnterDur * 0.5; // 0.75s — desc начинает когда bigSlider наполовину въехал
                const descRevealDur = 0.5;
                const galleryStart = bigSliderEnterDelay + bigSliderEnterDur;         // 1.1s

                bigSlider = section.querySelector('.big-slider');
                descContainer = section.querySelector('.big-slider__desc-container');

                section.style.overflow = 'hidden';
                // flex align-items: center центрировал бы pin-spacer (h:2103px) вертикально → bigSliderWrapper
                // оказывался бы на -701px от верха viewport — выше видимой области. flex-start прижимает к верху.
                section.style.alignItems = 'flex-start';
                // bigSlider.overflow оставляем hidden — это скрывает "сложенные" секции --2 и --3
                // (они имеют translate(0%,100%) от ScrollTrigger и при visible торчали бы снизу)
                if (bigSliderWrapper) gsap.set(bigSliderWrapper, { opacity: 1, zIndex: 6 });

                const sliderStartX = window.innerWidth * 1.05;
                if (bigSlider) gsap.set(bigSlider, { x: sliderStartX });
                // desc смещён вниз за overflow:hidden bigSlider — невидим пока bigSlider off-screen
                if (descContainer) gsap.set(descContainer, { y: window.innerHeight });

                const maskPosObj = { x: mX, y: mY };
                const applyMobMaskPos = () => {
                    if (!maskReveal) return;
                    const p = maskPosObj.x + '% ' + maskPosObj.y + '%';
                    maskReveal.style.maskPosition = p;
                    maskReveal.style.webkitMaskPosition = p;
                };

                const tihsWrapper = section.querySelector('.wrapper');

                tl2 = gsap.timeline({ paused: true });

                // Heart уезжает влево, wrapper (тайтл + линии) одновременно fade out —
                // пока bigSlider вне viewport, wrapper иначе просвечивал бы сквозь
                if (maskReveal) tl2.to(maskPosObj, { x: -50, y: 45, duration: heartExitDur, ease: 'power2.inOut', onUpdate: applyMobMaskPos }, 0);
                if (tihsWrapper) tl2.to(tihsWrapper, { opacity: 0, duration: heartExitDur * 0.8, ease: 'power1.out' }, 0);
                // bigSlider въезжает справа (overflow:hidden обрезает sections --2, --3)
                if (bigSlider) tl2.fromTo(bigSlider,
                    { x: sliderStartX },
                    { x: 0, duration: bigSliderEnterDur, ease: 'power2.out' },
                    bigSliderEnterDelay
                );
                // desc поднимается снизу внутри bigSlider как только он частично на экране
                if (descContainer) tl2.fromTo(descContainer,
                    { y: window.innerHeight },
                    { y: 0, duration: descRevealDur, ease: 'power2.out' },
                    descRevealDelay
                );

                tihsTl2 = tl2;
                tihsSection = section;
                tihsGalleryStart = galleryStart;
                tl2.call(() => updateHeaderColor(), null, galleryStart);
            } else {

            // Вычисляем позицию и размер маски от слова "атмосферу"
            let maskStartX = 35;
            let maskStartY = 59;
            let maskStartSize = 5;
            const atmosSpan = textSpans[textSpans.length - 1]; // последний span = "атмосферу"
            const isMobile = window.innerWidth < 768;
            if (atmosSpan && maskReveal) {
                const spanRect = atmosSpan.getBoundingClientRect();
                const sectionRect = section.getBoundingClientRect();
                const firstSpan = textSpans[0];
                const firstSpanRect = firstSpan ? firstSpan.getBoundingClientRect() : spanRect;

                // Размер маски: подгоняем под высоту текста
                const desiredHeight = spanRect.height;
                const maskFullHeight = desiredHeight * 1;
                maskStartSize = (maskFullHeight / sectionRect.width) * 100;
                if (isMobile && maskStartSize < 25) maskStartSize = 25;

                if (isMobile) {
                    // Мобилка: по центру между двумя строками, горизонтально по центру "атмосферу"
                    const betweenY = (firstSpanRect.bottom + spanRect.top) / 2;
                    maskStartX = ((spanRect.left + spanRect.width / 2 - sectionRect.left) / sectionRect.width) * 100;
                    maskStartY = ((betweenY - sectionRect.top) / sectionRect.height) * 100;
                } else {
                    // Десктоп: фикс-размер иконки 105px независимо от разрешения.
                    // maskStartSize (%) пересчитываем обратно из px, чтобы вся
                    // остальная логика (maskStartPxX/Y, bgStartX/Y) считалась корректно.
                    const FIXED_ICON_SIZE_PX = 105;
                    maskStartSize = (FIXED_ICON_SIZE_PX / sectionRect.width) * 100;
                    const iconW = FIXED_ICON_SIZE_PX;
                    const gap = spanRect.height * 0.3;
                    const offsetPx = 80; // сдвиг heart вправо
                    maskStartX = ((spanRect.left - iconW / 2 - gap - sectionRect.left + offsetPx) / sectionRect.width) * 100;
                    maskStartY = ((spanRect.top + spanRect.height * 0.58 - sectionRect.top) / sectionRect.height) * 100 ;
                }
            }

            // Вычисляем конечный bgSize как эквивалент cover
            // background-size в % = процент ширины контейнера
            // Для cover: если контейнер "выше" (sectionRatio < imgRatio), масштабируем по высоте
            const imgW = 4000, imgH = 5000;
            const imgRatio = imgW / imgH;
            const contW = section.offsetWidth;
            const contH = section.offsetHeight;
            const sectionRatio = contW / contH;
            const bgSizeEnd = sectionRatio < imgRatio
                ? (imgRatio / sectionRatio) * 100  // ширина фона > 100%, чтобы покрыть высоту
                : 100;

            // Координаты цветка на исходном изображении (4000×5000)
            const plantFracX = 1300 / imgW;  // 0.325
            const plantFracY = 3015 / imgH;  // 0.583

            // Вычисляем bgX, bgY чтобы цветок попал в центр маски на любом разрешении
            const initBgSize = 300; // начальный background-size в %
            const renderedH = initBgSize / 100 * contW * (imgH / imgW);
            const bgStartX = (plantFracX * initBgSize - maskStartX) / (initBgSize - 100) * 100;
            const bgStartY = (plantFracY * renderedH - (maskStartY / 100) * contH) / (renderedH - contH) * 100 ;

            // -2% по Y от расчётного — подстройка под slide-1_test.jpg
            // Переходим с процентных mask-size/position на пиксельные — чтобы
            // работала pivot-based логика роста (как `transform-origin` в Figma).
            // mask-size в %% растит маску симметрично вокруг процентной точки,
            // а нам нужен рост строго влево от правого края стартовой иконки.
            // Дополнительная добавка к стартовому размеру маски в px.
            // posX/posY компенсируются на -EXTRA/2, чтобы центр иконки остался
            // на месте. Для десктопа размер фиксируется в 105px выше, поэтому
            // EXTRA = 0. Для мобилки — расчётный, здесь тоже 0 (подгоняй при надобности).
            const MASK_SIZE_EXTRA = 0;
            const _maskBaseSize = maskStartSize / 100 * contW;
            const maskStartSizePx = _maskBaseSize + MASK_SIZE_EXTRA;
            const maskStartPxX = (contW - _maskBaseSize) * (maskStartX / 100) - MASK_SIZE_EXTRA / 2;
            const maskStartPxY = (contH - _maskBaseSize) * (maskStartY / 100) + 27 + 4 - MASK_SIZE_EXTRA / 2;
            // Конечный размер маски — с запасом, чтобы при центрировании
            // в контейнере форма сердца покрыла весь вьюпорт.
            const maskEndSizePx = Math.max(contW, contH) * 3;

            const maskProps = {
                size: maskStartSizePx,
                posX: maskStartPxX,
                posY: maskStartPxY,
                bgSize: initBgSize,
                bgX: bgStartX,
                bgY: bgStartY - 2,
            };

            // Позиционируем SVG <image> синхронно с CSS background на mask-reveal
            // SVG рендерится 3840×2160 px (1:1 с viewBox), центрирован в секции contW×contH
            const svgBgImage = section.querySelector('.tihs__bg-image');
            if (svgBgImage) {
                const vbW = 3840, vbH = 2160;
                // Размер фона в CSS-пикселях (= viewBox-юнитах при 1:1)
                const bgRenderedW = initBgSize / 100 * contW;
                const bgRenderedH = bgRenderedW * (imgH / imgW);
                // Смещение фона в координатах секции (CSS background-position %)
                const bgOffsetX = (bgStartX / 100) * (contW - bgRenderedW);
                const bgOffsetY = (bgStartY / 100) * (contH - bgRenderedH);
                // Сдвиг: секция → viewBox (SVG центрирован, поэтому левый край секции = (vbW-contW)/2 в viewBox)
                const svgShiftX = (vbW - contW) / 2;
                const svgShiftY = (vbH - contH) / 2;
                svgBgImage.setAttribute('x', bgOffsetX + svgShiftX + 500);
                svgBgImage.setAttribute('y', bgOffsetY + svgShiftY);
                svgBgImage.setAttribute('width', bgRenderedW);
                svgBgImage.setAttribute('height', bgRenderedH);
            }

            function applyMaskProps() {
                if (!maskReveal) return;
                const s = maskProps.size + 'px';
                const p = maskProps.posX + 'px ' + maskProps.posY + 'px';
                const bg = maskProps.bgSize + '%';
                const bp = maskProps.bgX + '% ' + maskProps.bgY + '%';
                maskReveal.style.maskSize = s;
                maskReveal.style.webkitMaskSize = s;
                maskReveal.style.maskPosition = p;
                maskReveal.style.webkitMaskPosition = p;
                maskReveal.style.backgroundSize = bg;
                maskReveal.style.backgroundPosition = bp;
            }

            // Начальное состояние — clip-path на каждом path скрывает его (задаётся ниже в forEach)
            if (titleEl) gsap.set(titleEl, { opacity: 1 });
            if (textSpans.length) gsap.set(textSpans, { opacity: 1 });
            if (maskReveal) {
                gsap.set(maskReveal, { opacity: 1 });
                applyMaskProps();
            }
            if (bigSliderWrapper) gsap.set(bigSliderWrapper, { opacity: 0, zIndex: 3 });

            // Двухэтапный таймлайн:
            //   tl1 — появление линий и пан bg-image
            //   tl2 — fade линий/заголовка + heart zoom + big-slider
            // Между этапами секция залипает в промежуточном состоянии
            // (линии полностью видны, заголовок на месте, big-slider ещё нет).
            tl1 = gsap.timeline({ paused: true });
            tl2 = gsap.timeline({ paused: true });

            // Порядок от центра к краям (по расстоянию от центра SVG 1920×1080)
            const animOrder = [
                { idx: 9,  from: 'polygon(-50% -50%, 150% -50%, 150% -10%, -50% -30%)',
                           to:   'polygon(-50% -50%, 150% -50%, 150% 130%, -50% 110%)' },
                { idx: 11, from: 'polygon(-50% -50%, -10% -50%, -30% 150%, -50% 150%)',
                           to:   'polygon(-50% -50%, 130% -50%, 110% 150%, -50% 150%)' },
                { idx: 2,  from: 'polygon(-50% 150%, 150% 150%, 150% 110%, -50% 130%)',
                           to:   'polygon(-50% 150%, 150% 150%, 150% -30%, -50% -10%)' },
                { idx: 1,  from: 'polygon(150% -50%, 110% -50%, 130% 150%, 150% 150%)',
                           to:   'polygon(150% -50%, -30% -50%, -10% 150%, 150% 150%)' },
                { idx: 6,  from: 'polygon(-50% -50%, 150% -50%, 150% -10%, -50% -30%)',
                           to:   'polygon(-50% -50%, 150% -50%, 150% 130%, -50% 110%)' },
                { idx: 0,  from: 'polygon(-50% 150%, 150% 150%, 150% 110%, -50% 130%)',
                           to:   'polygon(-50% 150%, 150% 150%, 150% -30%, -50% -10%)' },
                { idx: 8,  from: 'polygon(150% -50%, 110% -50%, 130% 150%, 150% 150%)',
                           to:   'polygon(150% -50%, -30% -50%, -10% 150%, 150% 150%)' },
                { idx: 3,  from: 'polygon(150% -50%, 110% -50%, 130% 150%, 150% 150%)',
                           to:   'polygon(150% -50%, -30% -50%, -10% 150%, 150% 150%)' },
                { idx: 4,  from: 'polygon(150% 150%, 150% 110%, 110% 150%, 150% 150%)',
                           to:   'polygon(150% 150%, 150% -50%, -50% -50%, -50% 150%)' },
                { idx: 10, from: 'polygon(-50% -50%, 150% -50%, 150% -10%, -50% -30%)',
                           to:   'polygon(-50% -50%, 150% -50%, 150% 130%, -50% 110%)' },
                { idx: 5,  from: 'polygon(-50% -50%, -10% -50%, -50% -10%, -50% -50%)',
                           to:   'polygon(-50% -50%, 150% -50%, 150% 150%, -50% 150%)' },
                { idx: 7,  from: 'polygon(-50% -50%, -10% -50%, -30% 150%, -50% 150%)',
                           to:   'polygon(-50% -50%, 130% -50%, 110% 150%, -50% 150%)' },
            ];
            // Начальное состояние paths — скрытые clip-path
            animOrder.forEach((item) => {
                const g = pathGroups[item.idx];
                if (g) gsap.set(g, { clipPath: item.from });
            });

            // === tl1: Lines (tihs-g) прорисовка + SVG bg pan (≈1.72s) ===
            // Каждая линия 1.5s, stagger 0.02s → последняя финиширует 0.22+1.5=1.72s.
            // Base 1.3s («вылет линий 1500мс» от дизайнера) + 200мс.
            const linesDraw = 1.5;
            animOrder.forEach((item, order) => {
                const g = pathGroups[item.idx];
                if (!g) return;
                tl1.to(g, {
                    clipPath: item.to,
                    duration: linesDraw,
                }, 0.0 + order * 0.02);
            });

            if (svgBgImage) {
                const finalX = parseFloat(svgBgImage.getAttribute('x'));
                const finalY = parseFloat(svgBgImage.getAttribute('y'));
                const finalW = parseFloat(svgBgImage.getAttribute('width'));
                const finalH = parseFloat(svgBgImage.getAttribute('height'));
                const scaleOffset = 1.25;
                const startW = finalW * scaleOffset;
                const startH = finalH * scaleOffset;
                const startX = finalX - (startW - finalW) * 0.6;
                const startY = finalY - (startH - finalH) * 0.8;
                svgBgImage.setAttribute('x', startX);
                svgBgImage.setAttribute('y', startY);
                svgBgImage.setAttribute('width', startW);
                svgBgImage.setAttribute('height', startH);
                tl1.to(svgBgImage, {
                    attr: { x: finalX, y: finalY, width: finalW, height: finalH },
                    duration: 1.7,
                    ease: 'power1.inOut',
                }, 0.0);
            }

            // === tl2: fade + heart zoom (1400мс) + big-slider (≈1.65s) ===
            // Heart 1200мс + 200мс = 1400мс. Прочие — base + 200мс.
            const heartDur = 1.7;
            if (pathGroups.length) tl2.to(pathGroups, { opacity: 0, duration: 1.0, ease: 'power1.inOut' }, 0.1);
            if (textSpans.length) tl2.to(textSpans, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0);
            if (titleEl) tl2.to(titleEl, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0);

            if (maskReveal) tl2.set(maskReveal, { backgroundImage: "url('/assets/images/tour/slide-1_no-logo.jpg')" }, 0);
            // Рост в центр: size растёт, posX/posY анимируются напрямую в
            // положение, при котором центр маски совпадает с центром секции.
            // На старте маска стоит у слова «атмосферу» (исходные posX/posY);
            // на финише — центрирована в контейнере.
            // Фон (bg-size/position) параллельно уходит в cover 50/50 — к концу
            // совпадает с первым слайдом big-slider, без шва.
            // Калибровка подобрана на 1920×1080: size += 1500, posX -= 500,
            // posY = contH - maskEndSizePx/2.6. Хард-пиксели (1500, 500)
            // переводим в доли contW, чтобы на 2К / 1024 / прочих масштабах
            // сохранялась та же относительная позиция «кадра» сердца.
            // bgY зеркалирует object-position Y первого слайда big-slider (SCSS-каскад).

            const bgYEnd = returnValue();
            const REF_W = 1920;
            tl2.to(maskProps, {
                size: maskEndSizePx + (1400 / REF_W) * contW,
                posX: contW - maskEndSizePx - (500 / REF_W) * contW,
                posY: contH - maskEndSizePx / 2.7,
                bgSize: bgSizeEnd, bgX: 0, bgY: bgYEnd,
                duration: heartDur,
                ease: 'power2.inOut',
                onUpdate: applyMaskProps,
            }, 0);
            if (maskReveal) tl2.to(maskReveal, { scale: 1, duration: heartDur, ease: 'power1.inOut' }, 0);

            // Gallery стартует за 0.3s до конца heart (t = 1.1), маска гаснет
            // ПОСЛЕ полного покрытия — это тот же оверлап, что и раньше, без
            // сдвига раньше.
            const galleryStart = heartDur;
            tihsTl2 = tl2;
            tihsSection = section;
            tihsGalleryStart = galleryStart;
            if (bigSliderWrapper) tl2.call(() => gsap.set(bigSliderWrapper, { opacity: 1, duration: 0.1 }), null, galleryStart);
            if (maskReveal) tl2.to(maskReveal, { opacity: 0, duration: 0, ease: 'none' }, galleryStart);

            tl2.call(() => updateHeaderColor(), null, galleryStart);
            }

            // === Scroll-hijack через GSAP Observer ===
            // Десктоп: двухэтапная анимация со стадиями stage ∈ {0, 1, 2}.
            //   0 — initial, 1 — между этапами (tl1 сыграна), 2 — final.
            //   Из stage=1 нельзя «выйти» из секции — только вперёд или назад.
            // Мобилка: одноступенчатая, stage всегда 0 или 2 (переходы через tl).
            let animating = false;
            let observer = null;
            let safetyTimer = null;
            let lockedSnapY = 0;
            let activeTl = null;      // таймлайн, который сейчас лочится (для safety timer)
            let stage = 0;            // 0/1/2 (десктоп); для мобилки — 0 или 2
            let animDone = false;     // true после финального этапа — снимаем lock навсегда
            let sectionST = null;     // ссылка на ScrollTrigger этой секции
            let fromBelow = false;    // true если страница загружена ниже секции

            const BLOCKED_KEYS = { 32:1, 33:1, 34:1, 35:1, 36:1, 37:1, 38:1, 39:1, 40:1 };
            const onKeyDown = (e) => { if (BLOCKED_KEYS[e.keyCode]) e.preventDefault(); };

            const snapTo = (y) => {
                if (window.lenis) {
                    if (window.lenis.scrollTo) window.lenis.scrollTo(y, { immediate: true, force: true, lock: true });
                    if ('targetScroll' in window.lenis) window.lenis.targetScroll = y;
                    if ('animatedScroll' in window.lenis) window.lenis.animatedScroll = y;
                }
                window.scrollTo(0, y);
            };
            const onLockedScroll = () => {
                if (!animating) return;
                if (Math.abs(window.scrollY - lockedSnapY) > 0.5) snapTo(lockedSnapY);
            };

            const engageLock = (snapY) => {
                lockedSnapY = snapY;
                if (window.lenis && window.lenis.stop) window.lenis.stop();
                snapTo(snapY);
                if (typeof Observer !== 'undefined') {
                    observer = Observer.create({
                        target: window,
                        type: 'wheel,touch,pointer',
                        preventDefault: true,
                        capture: true,
                        wheelSpeed: 0,
                        tolerance: 10,
                    });
                }
                window.addEventListener('keydown', onKeyDown, { capture: true });
                window.addEventListener('scroll', onLockedScroll, { passive: true, capture: true });
                clearTimeout(safetyTimer);
                const dur = activeTl ? activeTl.duration() / activeTl.timeScale() : 5;
                safetyTimer = setTimeout(disengageLock, dur * 1000 + 2000);
            };

            const disengageLock = () => {
                clearTimeout(safetyTimer);
                if (observer) { observer.kill(); observer = null; }
                window.removeEventListener('keydown', onKeyDown, { capture: true });
                window.removeEventListener('scroll', onLockedScroll, { capture: true });
                if (window.lenis && window.lenis.start) window.lenis.start();
            };

            document.addEventListener('visibilitychange', () => {
                if (document.hidden && animating) { animating = false; disengageLock(); }
            });

            const sectionAbsTop = () => section.getBoundingClientRect().top + window.scrollY;

            const REVERSE_SPEED = 1;

            // --- Выбор таймлайна для следующего шага ---
            // Мобилка теперь тоже использует tl1/tl2 + stage, как десктоп.
            const canAdvance = () => stage < 2;
            const canRetreat = () => stage > 0;
            const nextAdvanceTl = () => stage === 0 ? tl1 : tl2;
            const nextRetreatTl = () => stage === 2 ? tl2 : tl1;

            // --- Idle-guard: блокирует «неправильное» направление в покое ---
            let idleWheel = null, idleTouchStart = null, idleTouchMove = null;
            let idleTouchY = 0;
            const disarmIdleGuard = () => {
                if (idleWheel) window.removeEventListener('wheel', idleWheel, { capture: true });
                if (idleTouchStart) window.removeEventListener('touchstart', idleTouchStart, { capture: true });
                if (idleTouchMove) window.removeEventListener('touchmove', idleTouchMove, { capture: true });
                idleWheel = idleTouchStart = idleTouchMove = null;
                section.style.touchAction = '';
            };
            const armIdleGuard = () => {
                disarmIdleGuard();
                // touch-action:none сообщает браузеру не скроллить секцию —
                // это позволяет использовать passive:true на touchmove и не блокировать compositor-поток.
                section.style.touchAction = 'none';
                const handle = (goingDown) => {
                    if (animating) return;
                    // Guard работает только когда секция ровно прилипла к верху
                    // (|rect.top| ≤ 2). Иначе юзер уже ушёл и мы ничего не делаем.
                    const rect = section.getBoundingClientRect();
                    const atTop = Math.abs(rect.top) <= 2;
                    if (!atTop) { disarmIdleGuard(); return; }

                    // Блокируем направление только если там действительно есть
                    // следующий этап. На краях (stage 0 вверх, stage 2 вниз)
                    // даём скроллу естественно выйти из секции.
                    const block = (goingDown && canAdvance()) || (!goingDown && canRetreat());
                    if (block) {
                        disarmIdleGuard();
                        if (goingDown) playForward(); else playReverse();
                    } else {
                        disarmIdleGuard();
                    }
                };
                idleWheel = (e) => {
                    const dy = e.deltaY || 0;
                    if (dy === 0) return;
                    handle(dy > 0);
                };
                idleTouchStart = (e) => { idleTouchY = e.touches[0].clientY; };
                idleTouchMove = (e) => {
                    const dy = idleTouchY - e.touches[0].clientY;
                    if (Math.abs(dy) < 5) return;
                    handle(dy > 0);
                };
                window.addEventListener('wheel', idleWheel, { passive: false, capture: true });
                window.addEventListener('touchstart', idleTouchStart, { passive: true, capture: true });
                window.addEventListener('touchmove', idleTouchMove, { passive: true, capture: true });
            };

            const playForward = () => {
                if (animating || !canAdvance() || animDone) return;
                fromBelow = false;
                disarmIdleGuard();
                animating = true;
                const t = nextAdvanceTl();
                activeTl = t;
                t.timeScale(1);
                engageLock(sectionAbsTop());
                t.eventCallback('onReverseComplete', null);
                t.eventCallback('onComplete', () => {
                    animating = false;
                    activeTl = null;
                    stage++;
                    disengageLock();
                    const fullyDone = stage >= 2;
                    if (fullyDone) {
                        animDone = true;
                        disarmIdleGuard();
                        if (sectionST) { sectionST.kill(); sectionST = null; }
                        updateHeaderColor();
                        section.classList.add('tihs-done');
                        if (bigSliderWrapper) gsap.set(bigSliderWrapper, { zIndex: 9 });
                        if (isMobileTihs) {
                            section.style.overflow = '';
                            section.style.alignItems = '';
                            const tihsWrapperEl = section.querySelector('.wrapper');
                            if (tihsWrapperEl) gsap.set(tihsWrapperEl, { clearProps: 'opacity' });
                            if (bigSliderWrapper) gsap.set(bigSliderWrapper, { clearProps: 'transform' });
                            if (bigSlider) gsap.set(bigSlider, { clearProps: 'transform' });
                            if (descContainer) gsap.set(descContainer, { clearProps: 'transform' });
                        }
                        requestAnimationFrame(() => {
                            ScrollTrigger.refresh();
                            if (window._bigSliderST) window._bigSliderST.scrollTrigger.enable();
                            if (window._initBigSliderBtnST) window._initBigSliderBtnST();
                        });
                    } else {
                        armIdleGuard();
                    }
                });
                t.play();
            };

            const playReverse = () => {
                if (animating || !canRetreat() || animDone) return;
                disarmIdleGuard();
                animating = true;
                const t = nextRetreatTl();
                activeTl = t;
                t.timeScale(REVERSE_SPEED);
                engageLock(sectionAbsTop());
                t.eventCallback('onComplete', null);
                t.eventCallback('onReverseComplete', () => {
                    animating = false;
                    activeTl = null;
                    stage--;
                    disengageLock();
                    armIdleGuard();
                });
                t.reverse();
            };

            // Лучший момент для проверки "секция уже пройдена" — внутри onEnter,
            // потому что к тому моменту ScrollTrigger уже сделал refresh с учётом
            // всех pin-spacer-ов (в т.ч. от leisure). Ранний guard в forEach
            // запускается до pin-spacer leisure → позиции ещё неверные.
            const restoreFinished = () => {
                // Секция была выше вьюпорта при загрузке — оставляем начальное
                // состояние. fromBelow=true позволяет onLeaveBack (скролл вверх до
                // секции) запустить playForward вместо playReverse.
                fromBelow = true;
                armIdleGuard();
            };

            // Детектор пересечения верха секции вьюпортом — без pin, без pin-spacer.
            // onEnter: скролл вниз, top секции достиг верха вьюпорта → forward.
            // onLeaveBack: скролл вверх, top секции уходит обратно за верх
            //              вьюпорта → reverse. Пользователь на этот момент уже
            //              сам доскроллил до начала секции — снап обратно к
            //              sectionAbsTop() не даёт видимого рывка.
            // ВАЖНО: onEnterBack (у границы `bottom top`) НЕ биндим — иначе при
            // возврате снизу (низ секции едва показался) снап к верху секции
            // телепортирует юзера на 100vh вверх.
            sectionST = ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                onEnter: () => {
                    // Если bottom < 0 — секция полностью над viewport: это
                    // инициализационный вызов после refresh (не реальный вход),
                    // армируем idle guard и ждём скролла юзера вниз.
                    if (section.getBoundingClientRect().bottom < 0) {
                        restoreFinished();
                        return;
                    }
                    playForward();
                },
                onLeaveBack: () => {
                    // Если секция загружена выше вьюпорта (fromBelow=true) и юзер
                    // скроллит вверх до неё — запускаем анимацию вперёд и лочим скролл.
                    // В обычном flow (fromBelow=false) — reverse как обычно.
                    if (!animDone && fromBelow && stage === 0) {
                        playForward();
                    } else {
                        playReverse();
                    }
                },
            });
        }

        // half-section — пошаговое появление defines__item + движение dot
        if (isHalf) {
            const items = section.querySelectorAll('.defines__item');
            const dot = section.querySelector('.gsap-dot');
            const body = section.querySelector('.defines__body');
            if (!items.length || !body) return;

            const isMobile = window.innerWidth <= 767;

            // Начальное состояние items (первые 2 видны сразу)
            items.forEach((item, i) => {
                if (i < 2) return;
                const cls = [...item.classList].find(c => directionMap[c]);
                const offset = cls ? directionMap[cls] : { x: isMobile ? -320 : -160, y: 0 };
                gsap.set(item, { x: offset.x, y: offset.y, opacity: 0 });
            });

            // Dot — отдельный timeline с меньшим scrub чтобы всегда успевать
            // за скроллом даже при быстром движении. Bounce-эффект сохраняется
            // через Lenis, scrub здесь только время догоняния.
            // Максимальная нижняя точка — центр последнего item.


            if (dot) {
                const lastItem = items[items.length - 1];
                const bodyRect = body.getBoundingClientRect();
                const lastItemRect = lastItem.getBoundingClientRect();
                const dotEndY = (lastItemRect.top - bodyRect.top) + lastItemRect.height / 2;
                gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: 'bottom center',
                        scrub: isMobile ? 2 : 0.9,
                    }
                // }).to(dot, { top: dotEndY + 'px', duration: 1, ease: 'none' }, 0);
                }).to(dot, { top: body.offsetHeight + 'px', duration: 1, ease: 'none' }, 0);
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom 75%',
                    scrub: isMobile ? 7 : 2.5,
                }
            });

            // Items появляются последовательно по мере движения dot (первые 2 уже видны)
            items.forEach((item, i) => {
                if (i < 2) return;
                tl.to(item, { x: 0, y: 0, opacity: 1, duration: isMobile ? 3 : 1.2, ease: 'power2.out' }, (i - 2) * (isMobile ? 2 : 1.0));
            });
        }

        // Видео: play при входе в секцию, pause при уходе
        // .programs исключаем — там preload="none" и запуск всех видео разом даёт микролаги
        const sectionVideos = section.classList.contains('programs')
            ? []
            : section.querySelectorAll('video');
        if (sectionVideos.length) {
            // Для запиненных секций end должен покрывать весь pin-спейсер
            const isHScroll = section.classList.contains('horizontal-scroll-section');
            const hBody = isHScroll && section.querySelector('.horizontal-scroll-section-body');
            ScrollTrigger.create({
                trigger: section,
                start: 'top 80%',
                end: hBody ? () => '+=' + (hBody.scrollWidth - hBody.clientWidth + section.offsetHeight) : 'bottom 20%',
                onEnter: () => startVideos(section, sectionVideos),
                onEnterBack: () => startVideos(section, sectionVideos),
                onLeave: () => stopVideos(section, sectionVideos),
                onLeaveBack: () => stopVideos(section, sectionVideos),
            });

            function safePlay(video) {
                const p = video.play();
                if (p) p.catch(() => {});
            }

            function startVideos(sec, videos) {
                if (videos.length > 1) {
                    // Несколько видео — запускаем только видимые через IntersectionObserver
                    const obs = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                safePlay(entry.target);
                            } else {
                                entry.target.pause();
                            }
                        });
                    }, { threshold: 0.1 });

                    videos.forEach((video) => obs.observe(video));
                    sec._videoObserver = obs;
                } else {
                    videos.forEach((video) => safePlay(video));
                }
            }

            function stopVideos(sec, videos) {
                if (sec._videoObserver) {
                    videos.forEach((video) => sec._videoObserver.unobserve(video));
                    sec._videoObserver.disconnect();
                    delete sec._videoObserver;
                }
                videos.forEach((video) => video.pause());
            }
        }

        // horizontal-scroll-section — горизонтальный скролл при вертикальном скролле
        if (section.classList.contains('horizontal-scroll-section')) {
            const body = section.querySelector('.horizontal-scroll-section-body');
            if (body) {
                const getScrollDistance = () => body.scrollWidth - body.clientWidth;
                // Десктоп — ускоряем в 1.5× (короче вертикальный путь → тот же
                // горизонтальный дистанс за меньшее количество скролла).
                // Мобилка оставляет 1:1 как было.
                const SPEED = window.innerWidth >= 768 ? 1.5 : 1;

                gsap.to(body, {
                    scrollLeft: getScrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => '+=' + (getScrollDistance() / SPEED),
                        pin: true,
                        scrub: 2,
                        invalidateOnRefresh: true,
                    }
                });
                if (window.innerWidth > 768) {
                    gsap.fromTo(section,
                    { backgroundPosition: '0% 50%' },
                    {
                        backgroundPosition: '100% 50%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top top',
                            end: () => '+=' + (getScrollDistance() / SPEED),
                            scrub: 2,
                            invalidateOnRefresh: true,
                        }
                    }
                );
                    }
            }
        }
    });

    if (window.lenis) {
        window.lenis.on('scroll', updateHeaderColor);
    } else {
        // На мобилке Lenis не запускается — слушаем нативный скролл
        window.addEventListener('scroll', updateHeaderColor, { passive: true });
    }
    updateHeaderColor();
});

// document.addEventListener("DOMContentLoaded", () => {
//     const listBigSliders = document.querySelectorAll(`.big-slider`);
//
//     listBigSliders.forEach((block) => {
//         const gallerySelector = block.querySelector('.big-slider__gallery')
//         const controlsSelector = block.querySelector(`.big-slider__controls`);
//         const prevBtn = controlsSelector.querySelector(`[data-id="prev"]`);
//         const nextBtn = controlsSelector.querySelector(`[data-id="next"]`);
//         const pag = controlsSelector.querySelector(`.swiper-progress`);
//         const isMob = window.innerWidth < 768
//
//         // Сначала создаем оба свайпера БЕЗ thumbs
//         const swiperGal = new Swiper(gallerySelector.querySelector('.swiper'), {
//             watchSlidesProgress: true,
//             slidesPerView: 1,
//             pagination: {
//                 el: pag,
//                 type: 'progressbar'
//             },
//             navigation: {
//                 nextEl: nextBtn,
//                 prevEl: prevBtn,
//             },
//             breakpoints: {
//                 0: {
//                     direction: 'horizontal',
//                     allowTouchMove: false,
//                 },
//                 768: {
//                     direction: 'vertical',
//                     allowTouchMove: true,
//                 }
//             }
//         });
//     })
// })

document.addEventListener("DOMContentLoaded", () => {
    const listReviews = document.querySelectorAll(`.reviews`);

    listReviews.forEach((block) => {
        const slider = block.querySelector('.swiper')
        const prevBtn = block.querySelector(`[data-id="prev"]`)
        const nextBtn = block.querySelector(`[data-id="next"]`)

        const swiper = new Swiper(slider, {
            navigation: {
                prevEl: prevBtn,
                nextEl: nextBtn,
            },
            breakpoints: {
                0: {slidesPerView: 1.1, spaceBetween: 20},
                768: {slidesPerView: 2, spaceBetween: 20},
                1024: {slidesPerView: 3, spaceBetween: 20},
                1280: {slidesPerView: 4, spaceBetween: 20},
                1441: {slidesPerView: 5, spaceBetween: 20},
            }
        })
    })
})



// ui-dropdown.module.js
document.addEventListener("DOMContentLoaded", () => {
    const listDropdowns = document.querySelectorAll(".ui-dropdown");

    listDropdowns.forEach(block => {
        const panel = block.querySelector(".ui-dropdown__panel");
        const panelLabel = panel.querySelector(".ui-dropdown__label");
        const listItems = block.querySelectorAll(".ui-dropdown__item");
        panel.addEventListener("click", () => {
            block.classList.toggle("ui-dropdown--open");
        });
        listItems.forEach(listItem => {
            listItem.addEventListener("click", () => {
                block.classList.remove("ui-dropdown--open");
                panelLabel.textContent = listItem.textContent;
                listItem.classList.add("ui-dropdown__item--active");
            })
        })
        document.addEventListener("click", ({target}) => {
            !block.contains(target) && block.classList.remove("ui-dropdown--open");
        });
    })
});

document.addEventListener("DOMContentLoaded", () => {
    const tabsSlider = document.querySelectorAll(`[data-tab-slider]`);

    tabsSlider.forEach(block => {
        const slider = block.querySelector(`.tab-slider__tabs.swiper`);

        new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 24,
        })
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const listDocBlocks = document.querySelectorAll(`.doctors`);

    listDocBlocks.forEach(block => {
        const slider = block.querySelector('.swiper')

        new Swiper(slider, {
            spaceBetween: 20,
            breakpoints: {
                0: {slidesPerView: 1.1},
                768: {slidesPerView: 1.5},
                1024: {slidesPerView: 2},
                1280: {slidesPerView: 2.5},
                1441: {slidesPerView: 3}
            }
        })
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const listCards = document.querySelectorAll(`.placement__card`);

    listCards.forEach(block => {
        const slider = block.querySelector('.swiper')
        const pag = block.querySelector('.placement__pag')
        const prevBtn = block.querySelector(`[data-id="prev"]`)
        const nextBtn = block.querySelector(`[data-id="next"]`)

        new Swiper(slider, {
            slidesPerView: 1,
            navigation: {
              prevEl: prevBtn,
              nextEl: nextBtn,
            },
            pagination: {
              el: pag,
              clickable: true
            },
        })
    })
})

const moonModal = new MoonModal({
    modal: {
        active: "modal--open",
        associated: {}
    },
    overlay: {
        el: ".overlay",
        active: "overlay--active"
    },
    timeout: 200
});
moonModal.info.overlay.addEventListener("click", () => {
    moonModal.close();
});
const listOpenButtons = document.querySelectorAll("[data-modal-open]");
if (listOpenButtons.length) {
    listOpenButtons.forEach((block) => {
        const id = block.getAttribute("data-modal-open");
        block.addEventListener("click", () => {
            moonModal.open(id);
        });
    });
}
const listCloseButtons = document.querySelectorAll("[data-modal-close]");
if (listCloseButtons.length) {
    listCloseButtons.forEach((block) => {
        block.addEventListener("click", () => {
            moonModal.close();
        });
    });
}
document.addEventListener("click", ({ target }) => {
    if (target.classList.contains("modal"))
        moonModal.close();
});

document.addEventListener("DOMContentLoaded", () => {
    const listAccordions = document.querySelectorAll(`[data-accordion]`);

    listAccordions.forEach((block) => {
        const panel = block.querySelector(`[data-accordion-panel]`);
        panel.addEventListener("click", () => {
                block.classList.toggle("active");
        });
    });
});

// ─── Big Slider ────────────────────────────────────────────────────────────
(function initBigSlider() {
    const wrapper  = document.querySelector('.big-slider-wrapper');
    const section1 = document.querySelector('.big-slider__section--1');
    const section2 = document.querySelector('.big-slider__section--2');
    const section3 = document.querySelector('.big-slider__section--3');
    const desc     = document.querySelector('.big-slider__slide-desc');
    const isMob = window.innerWidth < 768

    if (!wrapper || !section2 || !section3 || !desc) return;

    // ─── Spans: fade + width animation ───────────────────────────────
    const spans = Array.from(desc.querySelectorAll('span'));
    let activeIndex = 0;

    // Измеряем offsetWidth контейнера для каждого спана поочерёдно.
    // Это вызывает reflow, но только один раз при инициализации.
    const spanWidths = spans.map((_, i) => {
        spans.forEach((s, j) => { s.style.display = j === i ? 'block' : 'none'; });
        return desc.clientWidth + 20;
    });

    // Начальное состояние: показываем только первый спан
    spans.forEach((s, i) => {
        s.style.display = i === 0 ? 'block' : 'none';
        if (i !== 0) gsap.set(s, { opacity: 0 });
    });
    gsap.set(desc, { width: spanWidths[0] });

    function updateDesc(newIndex) {
        if (newIndex === activeIndex) return;
        const prev = activeIndex;
        activeIndex = newIndex;

        // Убиваем все текущие твины — исключает race condition при быстром скролле
        gsap.killTweensOf([...spans, desc]);

        // Старый спан убираем мгновенно (нет задержанного onComplete, нет вспышки)
        spans[prev].style.display = 'none';
        gsap.set(spans[prev], { opacity: 0 });

        // Новый спан появляется с плавным fade
        spans[newIndex].style.display = 'block';
        gsap.set(spans[newIndex], { opacity: 0 });

        gsap.to(desc, { width: spanWidths[newIndex], duration: 0.35, ease: 'power2.inOut' });
        gsap.to(spans[newIndex], { opacity: 1, duration: 0.25 });
    }

    // ─── Parallax: object-position на изображениях ───────────────────
    const imgs1 = section1 ? section1.querySelectorAll('img') : [];
    const imgs2 = section2.querySelectorAll('img');

    // ─── ScrollTrigger + timeline ────────────────────────────────────
    // enabled: false — активируется только после tihs animDone (через window._bigSliderST)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=200%',
            pin: wrapper,
            pinSpacing: true,
            scrub: true,
            enabled: false,
            onUpdate(self) {
                if (self.progress < 0.25)      updateDesc(0);
                else if (self.progress < 0.75) updateDesc(1);
                else                           updateDesc(2);
            }
        }
    });
    window._bigSliderST = tl;

    // Фаза 1: section--2 выезжает снизу
    tl.fromTo(section2,
        { yPercent: 100 },
        { yPercent: 0, duration: 1, ease: 'none' },
        0
    );
    // Фаза 1: section--1 изображение уходит вниз (параллакс)
    if (imgs1.length) {
        tl.fromTo(imgs1,
            { objectPosition: `${isMob ? '50%' : '0'} ${returnValue()}%` },
            { objectPosition: `${isMob ? '50%' : '0'} 80%`, duration: 1, ease: 'none' },
            0
        );
    }

    // Фаза 2: section--3 выезжает снизу
    tl.fromTo(section3,
        { yPercent: 100 },
        { yPercent: 0, duration: 1, ease: 'none' },
        1
    );
    // Фаза 2: section--2 изображение уходит вниз (параллакс)
    if (imgs2.length) {
        tl.fromTo(imgs2,
            { objectPosition: '0 20%' },
            { objectPosition: '0 70%', duration: 1, ease: 'none' },
            1
        );
    }

}());

// ─── Big Slider Button entrance ──────────────────────────────────────────────
(function initBigSliderButton() {
    const btn = document.querySelector('.big-slider__section--button');
    if (!btn) return;

    gsap.set(btn, { opacity: 0, y: -200 });

    // ScrollTrigger создаётся после ScrollTrigger.refresh() в animDone —
    // только тогда pin-spacer уже в DOM и позиция кнопки рассчитана верно
    window._initBigSliderBtnST = function () {
        ScrollTrigger.create({
            trigger: '.chlenix',
            start: 'top bottom',
            onEnter() {
                gsap.to(btn, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.inOut' });
            },
            onLeaveBack() {
                gsap.to(btn, { opacity: 0, y: -140, duration: 0.3, ease: 'power2.in' });
            }
        });
    };
}());