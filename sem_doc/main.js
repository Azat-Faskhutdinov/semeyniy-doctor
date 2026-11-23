document.addEventListener("DOMContentLoaded", () => {
    const listTabs = document.querySelectorAll(`[data-tabs]`)

    listTabs.forEach(block => {
        const tabs     = block.querySelectorAll('[data-tab]')
        const contents = block.querySelectorAll('[data-content]')
        const activeValue = block.querySelector('.si-prices__active-value')
        const panel = block.querySelector('.si-prices__tabs-panel')
        const tabWrap = block.querySelector('.si-prices__tabs')

        panel.addEventListener('click', () => {
            tabWrap.classList.toggle('active')
        })

        // Инициализация: выставляем текст активного таба в si-prices__active-value
        const initialTab = block.querySelector('[data-tab][data-tab-active]')
        if (activeValue && initialTab) {
            activeValue.textContent = initialTab.textContent.trim()
        }

        // Инициализация toggle для каждой панели контента
        contents.forEach(content => initToggle(content))

        // Переключение табов
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.removeAttribute('data-tab-active'))
                contents.forEach(c => c.removeAttribute('data-tab-active'))

                tab.setAttribute('data-tab-active', '')
                contents[index]?.setAttribute('data-tab-active', '')

                if (activeValue) {
                    activeValue.textContent = tab.textContent.trim()
                }
            })
        })
    })

    function initToggle(content) {
        // Только прямые дочерние строки (исключаем строку внутри si-prices__head)
        const rows   = content.querySelectorAll('.si-prices__row')
        const toggle = content.querySelector('.si-prices__toggle')

        if (!toggle) return

        // Если строк 6 или меньше — toggle не нужен
        if (rows.length <= 6) {
            toggle.style.display = 'none'
            return
        }

        // Скрываем строки с индексом >= 6 (7-я и далее)
        rows.forEach((row, i) => {
            if (i >= 6) row.hidden = true
        })

        const span = toggle.querySelector('span')
        const svg  = toggle.querySelector('svg')
        let expanded = false

        toggle.addEventListener('click', () => {
            expanded = !expanded

            rows.forEach((row, i) => {
                if (i >= 6) row.hidden = !expanded
            })

            if (span) span.textContent = expanded ? 'Скрыть список' : 'Развернуть список'
            if (svg)  svg.style.transform = expanded ? 'rotate(180deg)' : ''
        })
    }
})

document.addEventListener("DOMContentLoaded", () => {
    // ─── SI-DIRECTIONS mobile collapse ───────────────────────────────────────
    document.querySelectorAll('.si-directions').forEach(section => {
        const button    = section.querySelector('.si-directions__button')
        const cards     = section.querySelectorAll('.si-directions__card')
        const countSpan = button?.querySelector('.count')

        function init() {
            if (window.innerWidth < 1024) {
                const hiddenCards = Array.from(cards).slice(2)
                hiddenCards.forEach(card => card.classList.add('hidden'))
                if (countSpan) countSpan.textContent = hiddenCards.length
                if (button) button.style.display = ''
            } else {
                cards.forEach(card => card.classList.remove('hidden'))
                if (button) button.style.display = 'none'
            }
        }

        if (button) {
            button.addEventListener('click', () => {
                cards.forEach(card => card.classList.remove('hidden'))
                button.style.display = 'none'
            })
        }

        init()
        window.addEventListener('resize', init)
    })
})

document.addEventListener("DOMContentLoaded", () => {
    // ─── SI-INPATIENT ─────────────────────────────────────────────────────────
    const inpatientSection = document.querySelector('.si-inpatient')

    if (inpatientSection) {
        const inpatientThumbs = new Swiper(inpatientSection.querySelector('.si-inpatient__thumbs'), {
            breakpoints: {
                0: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
                1280: {
                    slidesPerView: 6,
                    spaceBetween: 10,
                }
            },
            watchSlidesProgress: true,
            freeMode: true,
        })

        new Swiper(inpatientSection.querySelector('.si-inpatient__main'), {
            spaceBetween: 0,
            thumbs: {
                swiper: inpatientThumbs,
            },
        })
    }
})

document.addEventListener("DOMContentLoaded", () => {
    // ─── SI-INPATIENT ─────────────────────────────────────────────────────────
    const inpatientSection = document.querySelectorAll('.si-steps--stacionar')

    inpatientSection.forEach(block => {
        new Swiper(block.querySelector('.swiper'), {
            slidesPerView: 1.1,
            spaceBetween: 10,
        })
    })
})

document.addEventListener("DOMContentLoaded", () => {
    // ─── SI-VIDEOS ────────────────────────────────────────────────────────────
    const videosSection = document.querySelector('.si-videos')

    if (videosSection) {
        const thumbsSwiper = new Swiper(videosSection.querySelector('.si-videos__thumbs'), {


            breakpoints: {
              0: {
                  direction: 'horizontal',
                  spaceBetween: 10,
                  slidesPerView: 3,
              }  ,
                1023: {
                    direction: 'vertical',
                    spaceBetween: 20,
                    slidesPerView: 3,
                }
            },
            watchSlidesProgress: true,
            freeMode: true,
        })

        new Swiper(videosSection.querySelector('.si-videos__main'), {
            spaceBetween: 0,
            navigation: {
                prevEl: videosSection.querySelector(`[data-swiper="prev"]`),
                nextEl: videosSection.querySelector(`[data-swiper="next"]`),
            },
            thumbs: {
                swiper: thumbsSwiper,
            },
        })
    }

    const listGalleeries = document.querySelectorAll('.si-gallery')

    listGalleeries.forEach((block) => {
        new Swiper(block.querySelector('.swiper'), {
            breakpoints: {
                0: {
                    slidesPerView: 1.2,
                    spaceBetween: 10,
                },
              768: {
                  slidesPerView: 2.1,
                  spaceBetween: 20,
              },
                1280: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                }
            },
            navigation: {
                prevEl: block.querySelector(`[data-swiper="prev"]`),
                nextEl: block.querySelector(`[data-swiper="next"]`),
            },
        })
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const faqs = document.querySelectorAll('.si-faq')

    faqs.forEach((block) => {
        const listAccs = block.querySelectorAll('.si-faq__acc')
        listAccs.forEach((acc) => {
            const panel = acc.querySelector('.si-faq__acc-panel')

            panel.addEventListener('click', () => acc.classList.toggle('active'))
        })
    })
})