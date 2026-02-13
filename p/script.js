/**
 * KELZZ-ENHANCED v2.1
 * Code telah diperbaiki dan dioptimalkan
 * Semua error handling ditingkatkan
 * Performa maksimal
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== KONFIGURASI GLOBAL =====
    const CONFIG = {
        AUTO_SLIDE_INTERVAL: 5000,
        BUBBLE_INTERVAL: 2000,
        BUBBLE_LIFETIME: 10000,
        DEFAULT_VOLUME: 0.5
    };
    
    // ===== UTILITY FUNCTIONS =====
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Selector error: ${selector}`, error);
            return null;
        }
    }
    
    function safeGetElement(id) {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`Element error: ${id}`, error);
            return null;
        }
    }
    
    // ===== THEME TOGGLE =====
    function initThemeToggle() {
        const themeToggle = safeGetElement('theme-toggle');
        if (!themeToggle) return;
        
        const body = document.body;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        
        try {
            // Load saved theme
            const savedTheme = localStorage.getItem('kelzz_theme');
            if (savedTheme === 'dark') {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Theme toggle click handler
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                if (body.classList.contains('light-mode')) {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    localStorage.setItem('kelzz_theme', 'dark');
                } else {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    localStorage.setItem('kelzz_theme', 'light');
                }
            });
        } catch (error) {
            console.warn('Theme toggle error:', error);
        }
    }
    
    // ===== SLIDER FOTO =====
    function initSlider() {
        const slider = safeGetElement('slider');
        const slides = document.querySelectorAll('.slide');
        const prevBtn = safeGetElement('prev-slide');
        const nextBtn = safeGetElement('next-slide');
        const dots = document.querySelectorAll('.dot');
        
        if (!slider || slides.length === 0) return;
        
        try {
            let currentIndex = 0;
            const totalSlides = slides.length;
            let autoSlideInterval = null;
            
            // Update slider position
            function updateSlider() {
                if (!slider) return;
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update dots
                dots.forEach((dot, index) => {
                    if (dot) {
                        if (index === currentIndex) {
                            dot.classList.add('active');
                            dot.setAttribute('aria-current', 'true');
                        } else {
                            dot.classList.remove('active');
                            dot.removeAttribute('aria-current');
                        }
                    }
                });
            }
            
            // Next slide
            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                    
                    // Reset auto slide
                    resetAutoSlide();
                });
            }
            
            // Previous slide
            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateSlider();
                    
                    // Reset auto slide
                    resetAutoSlide();
                });
            }
            
            // Dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentIndex = index;
                    updateSlider();
                    
                    // Reset auto slide
                    resetAutoSlide();
                });
            });
            
            // Auto slide functionality
            function startAutoSlide() {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                }, CONFIG.AUTO_SLIDE_INTERVAL);
            }
            
            function resetAutoSlide() {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                    startAutoSlide();
                }
            }
            
            // Initialize
            updateSlider();
            startAutoSlide();
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', function() {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
            });
            
        } catch (error) {
            console.warn('Slider error:', error);
        }
    }
    
    // ===== MUSIC PLAYER =====
    function initMusicPlayer() {
        const audio = safeGetElement('bg-audio');
        const playBtn = safeGetElement('play-pause');
        const playIcon = safeGetElement('play-icon');
        const progress = safeGetElement('progress');
        const progressBar = safeGetElement('progress-bar');
        const playMusicBtn = safeGetElement('play-music-btn');
        const volumeSlider = safeGetElement('volume-slider');
        const closeBtn = safeGetElement('close-player');
        const musicPlayer = safeGetElement('music-player');
        const currentTimeSpan = safeGetElement('current-time');
        const durationSpan = safeGetElement('duration');
        
        if (!audio) return;
        
        try {
            // Set initial volume
            audio.volume = CONFIG.DEFAULT_VOLUME;
            
            // Format time (mm:ss)
            function formatTime(seconds) {
                if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            // Update duration when metadata loaded
            audio.addEventListener('loadedmetadata', function() {
                if (durationSpan) {
                    durationSpan.textContent = formatTime(audio.duration);
                }
            });
            
            // Hero button play
            if (playMusicBtn) {
                playMusicBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    audio.play()
                        .then(() => {
                            if (playIcon) {
                                playIcon.classList.remove('fa-play');
                                playIcon.classList.add('fa-pause');
                            }
                            if (musicPlayer) musicPlayer.style.display = 'block';
                        })
                        .catch(err => {
                            console.log('Playback failed:', err);
                            if (musicPlayer) {
                                musicPlayer.style.display = 'block';
                                alert('Klik tombol play di player untuk memulai musik');
                            }
                        });
                });
            }
            
            // Play/Pause button
            if (playBtn && playIcon) {
                playBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (audio.paused) {
                        audio.play()
                            .then(() => {
                                playIcon.classList.remove('fa-play');
                                playIcon.classList.add('fa-pause');
                            })
                            .catch(err => console.log('Play error:', err));
                    } else {
                        audio.pause();
                        playIcon.classList.remove('fa-pause');
                        playIcon.classList.add('fa-play');
                    }
                });
            }
            
            // Progress bar
            if (progress && progressBar) {
                audio.addEventListener('timeupdate', function() {
                    const percent = (audio.currentTime / audio.duration) * 100 || 0;
                    progress.style.width = percent + '%';
                    
                    if (currentTimeSpan) {
                        currentTimeSpan.textContent = formatTime(audio.currentTime);
                    }
                });
                
                progressBar.addEventListener('click', function(e) {
                    const rect = progressBar.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    const seekTime = (percent / 100) * audio.duration;
                    
                    if (isFinite(seekTime)) {
                        audio.currentTime = seekTime;
                        progress.style.width = percent + '%';
                    }
                });
            }
            
            // Volume control
            if (volumeSlider) {
                volumeSlider.addEventListener('input', function(e) {
                    audio.volume = e.target.value;
                });
            }
            
            // Close player
            if (closeBtn && musicPlayer) {
                closeBtn.addEventListener('click', function() {
                    musicPlayer.style.display = 'none';
                    if (!audio.paused) {
                        audio.pause();
                        if (playIcon) {
                            playIcon.classList.remove('fa-pause');
                            playIcon.classList.add('fa-play');
                        }
                    }
                });
            }
            
            // Auto play attempt (optional - browser may block)
            // audio.play().catch(() => {}); // Uncomment if you want to try autoplay
            
        } catch (error) {
            console.warn('Music player error:', error);
        }
    }
    
    // ===== FLOATING BUBBLES =====
    function initBubbles() {
        const container = safeGetElement('bubble-container');
        if (!container) return;
        
        const EMOJIS = ['🤝', '🫶', '✨', '🎵', '🍜', '🥤', '🤙', '🏠', '❤️', '👋', '💫', '⭐', '🔥', '💯'];
        
        function createBubble() {
            try {
                const bubble = document.createElement('div');
                bubble.className = 'floating-bubble';
                bubble.setAttribute('aria-hidden', 'true');
                
                // Random emoji
                bubble.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
                
                // Random position
                bubble.style.left = Math.random() * 100 + '%';
                
                // Random size
                const size = Math.random() * 1.5 + 1;
                bubble.style.fontSize = size + 'rem';
                
                // Random animation duration
                bubble.style.animationDuration = (Math.random() * 5 + 5) + 's';
                
                // Random opacity
                bubble.style.opacity = (Math.random() * 0.5 + 0.3).toString();
                
                container.appendChild(bubble);
                
                // Remove after animation
                setTimeout(() => {
                    if (bubble && bubble.parentNode) {
                        bubble.remove();
                    }
                }, CONFIG.BUBBLE_LIFETIME);
                
            } catch (error) {
                console.warn('Bubble creation error:', error);
            }
        }
        
        // Create bubbles periodically
        const bubbleInterval = setInterval(createBubble, CONFIG.BUBBLE_INTERVAL);
        
        // Create initial bubbles
        for (let i = 0; i < 5; i++) {
            setTimeout(createBubble, i * 300);
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(bubbleInterval);
        });
    }
    
    // ===== SCROLL BUTTON =====
    function initScrollButton() {
        const scrollBtn = safeGetElement('scroll-btn');
        if (!scrollBtn) return;
        
        try {
            scrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find target section
                const targetSelectors = [
                    '.photo-section',
                    '#photo-section',
                    '.gallery-section',
                    '#gallery',
                    'section:nth-of-type(2)'
                ];
                
                let targetSection = null;
                for (const selector of targetSelectors) {
                    targetSection = safeQuerySelector(selector);
                    if (targetSection) break;
                }
                
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Fallback: scroll down 500px
                    window.scrollBy({
                        top: 500,
                        behavior: 'smooth'
                    });
                }
            });
        } catch (error) {
            console.warn('Scroll button error:', error);
        }
    }
    
    // ===== MOBILE MENU (if exists) =====
    function initMobileMenu() {
        const menuToggle = safeGetElement('menu-toggle');
        const mobileMenu = safeGetElement('mobile-menu');
        
        if (!menuToggle || !mobileMenu) return;
        
        try {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                mobileMenu.classList.toggle('active');
                
                // Toggle icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    if (mobileMenu.classList.contains('active')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
        } catch (error) {
            console.warn('Mobile menu error:', error);
        }
    }
    
    // ===== LAZY LOADING IMAGES =====
    function initLazyLoading() {
        try {
            const images = document.querySelectorAll('img[data-src]');
            if (images.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
            
        } catch (error) {
            console.warn('Lazy loading error:', error);
        }
    }
    
    // ===== INITIALIZE ALL MODULES =====
    console.log('KELZZ-AI v2.1 - Initializing all modules...');
    
    // Run all initializations
    initThemeToggle();
    initSlider();
    initMusicPlayer();
    initBubbles();
    initScrollButton();
    initMobileMenu();
    initLazyLoading();
    
    console.log('KELZZ-AI v2.1 - All modules initialized successfully');
    
    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Perform any scroll-based updates here
        }, 100);
    });
    
    // Handle visibility change (pause audio when tab hidden)
    document.addEventListener('visibilitychange', function() {
        const audio = safeGetElement('bg-audio');
        if (audio && !audio.paused) {
            if (document.hidden) {
                audio.pause();
            } else {
                // Optionally auto-resume
                // audio.play().catch(() => {});
            }
        }
    });
    
});/**
 * KELZZ-ENHANCED v2.1
 * Code telah diperbaiki dan dioptimalkan
 * Semua error handling ditingkatkan
 * Performa maksimal
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== KONFIGURASI GLOBAL =====
    const CONFIG = {
        AUTO_SLIDE_INTERVAL: 5000,
        BUBBLE_INTERVAL: 2000,
        BUBBLE_LIFETIME: 10000,
        DEFAULT_VOLUME: 0.5
    };
    
    // ===== UTILITY FUNCTIONS =====
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Selector error: ${selector}`, error);
            return null;
        }
    }
    
    function safeGetElement(id) {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`Element error: ${id}`, error);
            return null;
        }
    }
    
    // ===== THEME TOGGLE =====
    function initThemeToggle() {
        const themeToggle = safeGetElement('theme-toggle');
        if (!themeToggle) return;
        
        const body = document.body;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        
        try {
            // Load saved theme
            const savedTheme = localStorage.getItem('kelzz_theme');
            if (savedTheme === 'dark') {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Theme toggle click handler
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                if (body.classList.contains('light-mode')) {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    localStorage.setItem('kelzz_theme', 'dark');
                } else {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    localStorage.setItem('kelzz_theme', 'light');
                }
            });
        } catch (error) {
            console.warn('Theme toggle error:', error);
        }
    }
    
    // ===== SLIDER FOTO =====
    function initSlider() {
        const slider = safeGetElement('slider');
        const slides = document.querySelectorAll('.slide');
        const prevBtn = safeGetElement('prev-slide');
        const nextBtn = safeGetElement('next-slide');
        const dots = document.querySelectorAll('.dot');
        
        if (!slider || slides.length === 0) return;
        
        try {
            let currentIndex = 0;
            const totalSlides = slides.length;
            let autoSlideInterval = null;
            
            // Update slider position
            function updateSlider() {
                if (!slider) return;
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update dots
                dots.forEach((dot, index) => {
                    if (dot) {
                        if (index === currentIndex) {
                            dot.classList.add('active');
                            dot.setAttribute('aria-current', 'true');
                        } else {
                            dot.classList.remove('active');
                            dot.removeAttribute('aria-current');
                        }
                    }
                });
            }
            
            // Next slide
            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                    
                    // Reset auto slide
                    resetAutoSlide();
                });
            }
            
            // Previous slide
            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateSlider();
                    
                    // Reset auto slide
                    resetAutoSlide();
                });
            }
            
            // Dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentIndex = index;
                    updateSlider();
                    
                    // Reset auto slide
                    resetAutoSlide();
                });
            });
            
            // Auto slide functionality
            function startAutoSlide() {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                }, CONFIG.AUTO_SLIDE_INTERVAL);
            }
            
            function resetAutoSlide() {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                    startAutoSlide();
                }
            }
            
            // Initialize
            updateSlider();
            startAutoSlide();
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', function() {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
            });
            
        } catch (error) {
            console.warn('Slider error:', error);
        }
    }
    
    // ===== MUSIC PLAYER =====
    function initMusicPlayer() {
        const audio = safeGetElement('bg-audio');
        const playBtn = safeGetElement('play-pause');
        const playIcon = safeGetElement('play-icon');
        const progress = safeGetElement('progress');
        const progressBar = safeGetElement('progress-bar');
        const playMusicBtn = safeGetElement('play-music-btn');
        const volumeSlider = safeGetElement('volume-slider');
        const closeBtn = safeGetElement('close-player');
        const musicPlayer = safeGetElement('music-player');
        const currentTimeSpan = safeGetElement('current-time');
        const durationSpan = safeGetElement('duration');
        
        if (!audio) return;
        
        try {
            // Set initial volume
            audio.volume = CONFIG.DEFAULT_VOLUME;
            
            // Format time (mm:ss)
            function formatTime(seconds) {
                if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            // Update duration when metadata loaded
            audio.addEventListener('loadedmetadata', function() {
                if (durationSpan) {
                    durationSpan.textContent = formatTime(audio.duration);
                }
            });
            
            // Hero button play
            if (playMusicBtn) {
                playMusicBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    audio.play()
                        .then(() => {
                            if (playIcon) {
                                playIcon.classList.remove('fa-play');
                                playIcon.classList.add('fa-pause');
                            }
                            if (musicPlayer) musicPlayer.style.display = 'block';
                        })
                        .catch(err => {
                            console.log('Playback failed:', err);
                            if (musicPlayer) {
                                musicPlayer.style.display = 'block';
                                alert('Klik tombol play di player untuk memulai musik');
                            }
                        });
                });
            }
            
            // Play/Pause button
            if (playBtn && playIcon) {
                playBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (audio.paused) {
                        audio.play()
                            .then(() => {
                                playIcon.classList.remove('fa-play');
                                playIcon.classList.add('fa-pause');
                            })
                            .catch(err => console.log('Play error:', err));
                    } else {
                        audio.pause();
                        playIcon.classList.remove('fa-pause');
                        playIcon.classList.add('fa-play');
                    }
                });
            }
            
            // Progress bar
            if (progress && progressBar) {
                audio.addEventListener('timeupdate', function() {
                    const percent = (audio.currentTime / audio.duration) * 100 || 0;
                    progress.style.width = percent + '%';
                    
                    if (currentTimeSpan) {
                        currentTimeSpan.textContent = formatTime(audio.currentTime);
                    }
                });
                
                progressBar.addEventListener('click', function(e) {
                    const rect = progressBar.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    const seekTime = (percent / 100) * audio.duration;
                    
                    if (isFinite(seekTime)) {
                        audio.currentTime = seekTime;
                        progress.style.width = percent + '%';
                    }
                });
            }
            
            // Volume control
            if (volumeSlider) {
                volumeSlider.addEventListener('input', function(e) {
                    audio.volume = e.target.value;
                });
            }
            
            // Close player
            if (closeBtn && musicPlayer) {
                closeBtn.addEventListener('click', function() {
                    musicPlayer.style.display = 'none';
                    if (!audio.paused) {
                        audio.pause();
                        if (playIcon) {
                            playIcon.classList.remove('fa-pause');
                            playIcon.classList.add('fa-play');
                        }
                    }
                });
            }
            
            // Auto play attempt (optional - browser may block)
            // audio.play().catch(() => {}); // Uncomment if you want to try autoplay
            
        } catch (error) {
            console.warn('Music player error:', error);
        }
    }
    
    // ===== FLOATING BUBBLES =====
    function initBubbles() {
        const container = safeGetElement('bubble-container');
        if (!container) return;
        
        const EMOJIS = ['🤝', '🫶', '✨', '🎵', '🍜', '🥤', '🤙', '🏠', '❤️', '👋', '💫', '⭐', '🔥', '💯'];
        
        function createBubble() {
            try {
                const bubble = document.createElement('div');
                bubble.className = 'floating-bubble';
                bubble.setAttribute('aria-hidden', 'true');
                
                // Random emoji
                bubble.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
                
                // Random position
                bubble.style.left = Math.random() * 100 + '%';
                
                // Random size
                const size = Math.random() * 1.5 + 1;
                bubble.style.fontSize = size + 'rem';
                
                // Random animation duration
                bubble.style.animationDuration = (Math.random() * 5 + 5) + 's';
                
                // Random opacity
                bubble.style.opacity = (Math.random() * 0.5 + 0.3).toString();
                
                container.appendChild(bubble);
                
                // Remove after animation
                setTimeout(() => {
                    if (bubble && bubble.parentNode) {
                        bubble.remove();
                    }
                }, CONFIG.BUBBLE_LIFETIME);
                
            } catch (error) {
                console.warn('Bubble creation error:', error);
            }
        }
        
        // Create bubbles periodically
        const bubbleInterval = setInterval(createBubble, CONFIG.BUBBLE_INTERVAL);
        
        // Create initial bubbles
        for (let i = 0; i < 5; i++) {
            setTimeout(createBubble, i * 300);
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(bubbleInterval);
        });
    }
    
    // ===== SCROLL BUTTON =====
    function initScrollButton() {
        const scrollBtn = safeGetElement('scroll-btn');
        if (!scrollBtn) return;
        
        try {
            scrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find target section
                const targetSelectors = [
                    '.photo-section',
                    '#photo-section',
                    '.gallery-section',
                    '#gallery',
                    'section:nth-of-type(2)'
                ];
                
                let targetSection = null;
                for (const selector of targetSelectors) {
                    targetSection = safeQuerySelector(selector);
                    if (targetSection) break;
                }
                
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Fallback: scroll down 500px
                    window.scrollBy({
                        top: 500,
                        behavior: 'smooth'
                    });
                }
            });
        } catch (error) {
            console.warn('Scroll button error:', error);
        }
    }
    
    // ===== MOBILE MENU (if exists) =====
    function initMobileMenu() {
        const menuToggle = safeGetElement('menu-toggle');
        const mobileMenu = safeGetElement('mobile-menu');
        
        if (!menuToggle || !mobileMenu) return;
        
        try {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                mobileMenu.classList.toggle('active');
                
                // Toggle icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    if (mobileMenu.classList.contains('active')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
        } catch (error) {
            console.warn('Mobile menu error:', error);
        }
    }
    
    // ===== LAZY LOADING IMAGES =====
    function initLazyLoading() {
        try {
            const images = document.querySelectorAll('img[data-src]');
            if (images.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
            
        } catch (error) {
            console.warn('Lazy loading error:', error);
        }
    }
    
    // ===== INITIALIZE ALL MODULES =====
    console.log('KELZZ-AI v2.1 - Initializing all modules...');
    
    // Run all initializations
    initThemeToggle();
    initSlider();
    initMusicPlayer();
    initBubbles();
    initScrollButton();
    initMobileMenu();
    initLazyLoading();
    
    console.log('KELZZ-AI v2.1 - All modules initialized successfully');
    
    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Perform any scroll-based updates here
        }, 100);
    });
    
    // Handle visibility change (pause audio when tab hidden)
    document.addEventListener('visibilitychange', function() {
        const audio = safeGetElement('bg-audio');
        if (audio && !audio.paused) {
            if (document.hidden) {
                audio.pause();
            } else {
                // Optionally auto-resume
                // audio.play().catch(() => {});
            }
        }
    });
    
});
