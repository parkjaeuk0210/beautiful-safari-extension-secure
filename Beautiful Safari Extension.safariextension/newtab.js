class ElegantSpace {
    constructor() {
        this.currentBackground = null;
        this.userName = localStorage.getItem('elegant-space-username') || '';
        this.lastBackgroundChange = localStorage.getItem('elegant-space-last-bg') || 0;
        this.animationTimeline = null;
        
        // Settings
        this.settings = {
            showQuoteCard: localStorage.getItem('elegant-space-show-quote') !== 'false',
            showMoodCard: localStorage.getItem('elegant-space-show-mood') !== 'false',
            showCalendar: localStorage.getItem('elegant-space-show-calendar') === 'true',
            useCustomPhotos: localStorage.getItem('elegant-space-use-custom-photos') === 'true'
        };
        
        // Custom photos management
        this.customPhotos = JSON.parse(localStorage.getItem('elegant-space-custom-photos') || '[]');
        
        // Initialize memo storage
        this.memos = JSON.parse(localStorage.getItem('elegant-space-memos') || '{}');
        
        // Memo management mode
        this.memoManagementMode = false;
        
        // Chat functionality
        this.chatPanel = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.chatSendBtn = null;
        this.chatReset = null;
        this.chatUpload = null;
        this.chatFileInput = null;
        this.isChatOpen = false;
        this.isTyping = false;
        this.chatUploadedFiles = [];
        
        // Chat history management - pure token-based sliding window
        this.chatHistory = JSON.parse(localStorage.getItem('elegant-space-chat-history') || '[]');
        this.maxTokens = 900000; // Gemini 1M 토큰 한도 활용 (여유분 남겨둠) - 이것만으로 관리
        this.sessionId = this.generateSessionId();
        
        // Backend API configuration
        this.apiEndpoint = 'https://backend-3k8vu7b0e-feras-projects-59a977f0.vercel.app/api';
        
        // Initialize Google Generative AI (will be set after import)
        this.genAI = null;
        
        this.quotes = [
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
            { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
            { text: "Excellence is not a skill, it's an attitude.", author: "Ralph Marston" },
            { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
            { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" }
        ];

        this.moodStates = [
            { icon: "☀️", text: "Bright & Inspiring", color: "#f59e0b" },
            { icon: "🌙", text: "Calm & Peaceful", color: "#6366f1" },
            { icon: "⭐", text: "Creative & Focused", color: "#8b5cf6" },
            { icon: "🌸", text: "Fresh & Optimistic", color: "#ec4899" },
            { icon: "🍃", text: "Natural & Serene", color: "#10b981" },
            { icon: "🔥", text: "Energetic & Bold", color: "#ef4444" },
            { icon: "🎨", text: "Artistic & Inspired", color: "#f97316" }
        ];
        
        this.init();
    }

    async init() {
        this.preloadCriticalElements();
        this.setupTimeDisplay();
        this.setupGreeting();
        this.setupEventListeners();
        this.setupPhotoUpload();
        await this.initializeGoogleAI(); // Google AI 초기화
        this.setupChatUpload(); // 새로 추가!
        this.loadBackgroundImage();
        this.displayQuote();
        this.updateMood();
        this.setupMessageHandler();
        this.initializeInteractions();
        this.setupCalendar();
        this.applySettings();
    }

    async initializeGoogleAI() {
        try {
            console.log('🚀 Initializing Google Generative AI...');
            console.log('🔍 Testing ES Module import in Safari Extension...');
            console.log('🔍 User Agent:', navigator.userAgent);
            console.log('🔍 Window location:', window.location.href);
            
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            console.log('✅ ES Module import successful!');
            
            // API will be called through secure backend
            console.log('✅ Google Generative AI initialized successfully');
            console.log('✅ genAI object:', !!this.genAI);
        } catch (error) {
            console.error('❌ Failed to initialize Google Generative AI:', error);
            console.error('❌ Error details:', error.message, error.stack);
            
            // Check if it's an import error specifically
            if (error.message.includes('import') || error.message.includes('module')) {
                console.warn('🚨 ES Module import not supported in Safari Extension environment');
                console.log('🔄 Falling back to direct script approach...');
                this.initializeFallbackGoogleAI();
            } else {
                this.genAI = null;
            }
        }
    }

    initializeFallbackGoogleAI() {
        console.log('🔄 Initializing fallback Google AI (REST API mode)...');
        // Set a flag to indicate we're using REST API instead of SDK
        this.genAI = 'REST_API_MODE';
        console.log('✅ Fallback Google AI initialized (REST API mode)');
    }

    preloadCriticalElements() {
        console.log('🔍 [DEBUG] Preloading critical elements...');
        console.log('🔍 [DEBUG] Current URL:', window.location.href);
        console.log('🔍 [DEBUG] Document ready state:', document.readyState);
        
        this.timeElement = document.getElementById('current-time');
        this.dateElement = document.getElementById('current-date');
        this.greetingElement = document.getElementById('greeting');
        this.nameInputWrapper = document.getElementById('name-input-wrapper');
        this.nameInput = document.getElementById('name-input');
        this.bgElement = document.getElementById('background-image');
        this.photoInfo = document.getElementById('photo-info');
        this.miniCalendar = document.getElementById('mini-calendar');
        this.quoteCard = document.getElementById('quote-card');
        this.moodCard = document.getElementById('mood-card');
        
        // Chat elements - with debugging
        this.chatPanel = document.getElementById('chat-panel');
        console.log('🎯 Chat panel found:', !!this.chatPanel);
        
        this.chatMessages = document.getElementById('chat-messages');
        console.log('🎯 Chat messages found:', !!this.chatMessages);
        
        this.chatInput = document.getElementById('chat-input');
        console.log('🎯 Chat input found:', !!this.chatInput);
        
        this.chatSendBtn = document.getElementById('chat-send');
        console.log('🎯 Chat send button found:', !!this.chatSendBtn);
        
        this.chatReset = document.getElementById('chat-reset');
        console.log('🎯 Chat reset found:', !!this.chatReset);
        
        this.chatUpload = document.getElementById('chat-upload');
        console.log('🎯 Chat upload button found:', !!this.chatUpload);
        
        this.chatFileInput = document.getElementById('chat-file-input');
        console.log('🎯 Chat file input found:', !!this.chatFileInput);
        
        this.fileNamesSpan = document.getElementById('file-names');
        console.log('🎯 File names span found:', !!this.fileNamesSpan);
        
        // 배경사진 업로드 요소도 확인해보자
        const photoUpload = document.getElementById('photo-upload');
        console.log('🎯 Photo upload (working) found:', !!photoUpload);
        
        console.log('🔍 Element preload complete');
    }

    setupTimeDisplay() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (this.timeElement) this.timeElement.textContent = timeString;
        if (this.dateElement) this.dateElement.textContent = dateString;
    }

    setupGreeting() {
        this.updateGreetingDisplay();

        this.nameInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.nameInput.value.trim()) {
                this.handleNameSubmit();
            }
        });

        this.nameInput?.addEventListener('blur', () => {
            if (this.nameInput.value.trim()) {
                this.handleNameSubmit();
            } else if (this.userName) {
                this.hideNameInput();
            }
        });

        this.greetingElement?.addEventListener('click', () => {
            this.showNameInput();
        });
    }

    handleNameSubmit() {
        const newName = this.nameInput.value.trim();
        if (newName) {
            this.userName = newName;
            localStorage.setItem('elegant-space-username', this.userName);
            this.animateGreetingChange();
        }
    }

    animateGreetingChange() {
        if (!this.greetingElement) return;
        
        this.greetingElement.style.transform = 'scale(0.95)';
        this.greetingElement.style.opacity = '0.7';
        
        setTimeout(() => {
            this.updateGreetingDisplay();
            this.hideNameInput();
            this.greetingElement.style.transform = 'scale(1)';
            this.greetingElement.style.opacity = '1';
        }, 200);
    }

    updateGreetingDisplay() {
        if (!this.greetingElement) return;
        
        if (this.userName) {
            this.greetingElement.textContent = this.getGreetingMessage(this.userName);
            this.hideNameInput();
        } else {
            this.greetingElement.textContent = 'Welcome';
            this.showNameInput();
        }
    }

    showNameInput() {
        if (!this.nameInputWrapper) return;
        
        this.nameInputWrapper.style.display = 'block';
        this.nameInput.value = this.userName;
        setTimeout(() => {
            this.nameInput?.focus();
            this.nameInput?.select();
        }, 100);
    }

    hideNameInput() {
        if (!this.nameInputWrapper) return;
        this.nameInputWrapper.style.display = 'none';
    }

    getGreetingMessage(name) {
        const hour = new Date().getHours();
        const greetings = [
            { time: [5, 12], message: "Good morning" },
            { time: [12, 17], message: "Good afternoon" },
            { time: [17, 22], message: "Good evening" },
            { time: [22, 5], message: "Good night" }
        ];

        const currentGreeting = greetings.find(g => 
            (g.time[0] <= g.time[1] && hour >= g.time[0] && hour < g.time[1]) ||
            (g.time[0] > g.time[1] && (hour >= g.time[0] || hour < g.time[1]))
        ) || greetings[0];

        return `${currentGreeting.message}, ${name}`;
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-bg');
        const settingsBtn = document.getElementById('settings');
        const uploadBtn = document.getElementById('upload-photo');
        const chatToggleBtn = document.getElementById('chat-toggle');
        const chatCloseBtn = document.getElementById('chat-close');

        refreshBtn?.addEventListener('click', (e) => {
            this.animateButtonClick(e.target);
            this.loadBackgroundImage(true);
        });

        settingsBtn?.addEventListener('click', (e) => {
            this.animateButtonClick(e.target);
            this.showSettings();
        });

        uploadBtn?.addEventListener('click', (e) => {
            this.animateButtonClick(e.target);
            document.getElementById('photo-upload').click();
        });

        // Chat event listeners
        chatToggleBtn?.addEventListener('click', (e) => {
            this.animateButtonClick(e.target);
            this.toggleChat();
        });

        chatCloseBtn?.addEventListener('click', () => {
            this.closeChat();
        });

        // Chat reset functionality
        this.chatReset?.addEventListener('click', () => {
            this.resetChat();
        });

        // Chat upload functionality now handled in setupChatUpload()
        console.log('ℹ️ Chat upload event listeners moved to setupChatUpload() method');

        this.chatSendBtn?.addEventListener('click', () => {
            this.sendMessage();
        });

        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Close chat on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isChatOpen) {
                this.closeChat();
            } else if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.loadBackgroundImage(true);
            }
        });
    }

    animateButtonClick(button) {
        if (!button) return;
        
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    loadBackgroundImage(forceRefresh = false) {
        localStorage.setItem('elegant-space-last-bg', Date.now().toString());

        // Check if should use custom photos
        if (this.settings.useCustomPhotos && this.customPhotos.length > 0) {
            const customPhoto = this.getRandomCustomPhoto();
            if (customPhoto) {
                this.setBackgroundImage(customPhoto);
                return;
            }
        }

        if (typeof safari !== 'undefined' && safari.self && safari.self.tab) {
            safari.self.tab.dispatchMessage("getBackgroundImage");
        } else {
            this.loadFallbackImage();
        }
    }

    setupMessageHandler() {
        if (typeof safari !== 'undefined' && safari.self && safari.self.addEventListener) {
            safari.self.addEventListener("message", (event) => {
                if (event.name === "backgroundImage") {
                    this.setBackgroundImage(event.message);
                }
            });
        }
    }

    loadFallbackImage() {
        const fallbackImages = [
            {
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
                photographer: 'Jeremy Bishop',
                location: 'Milford Sound, New Zealand',
                description: 'Misty mountains reflection'
            },
            {
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
                photographer: 'Casey Horner',
                location: 'Forest Trail',
                description: 'Ethereal forest pathway'
            },
            {
                url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
                photographer: 'David Marcu',
                location: 'Lake Como, Italy',
                description: 'Serene lake at sunset'
            },
            {
                url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
                photographer: 'Casey Horner',
                location: 'Northern Lights',
                description: 'Aurora over snowy landscape'
            },
            {
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
                photographer: 'eberhard grossgasteiger',
                location: 'Swiss Alps',
                description: 'Alpine morning light'
            }
        ];

        const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        this.setBackgroundImage(randomImage);
    }

    setBackgroundImage(imageData) {
        this.currentBackground = imageData;
        
        if (!this.bgElement) return;

        this.bgElement.style.backgroundImage = `url(${imageData.url})`;
        
        setTimeout(() => {
            this.bgElement.classList.add('loaded');
        }, 100);

        this.updatePhotoCredit(imageData);
    }

    updatePhotoCredit(imageData) {
        if (!this.photoInfo) return;
        
        let creditText = imageData.photographer;
        if (imageData.location) {
            creditText += ` • ${imageData.location}`;
        }
        this.photoInfo.textContent = creditText;
    }

    displayQuote() {
        const quoteElement = document.querySelector('.quote-text');
        const authorElement = document.querySelector('.quote-author');
        
        if (!quoteElement || !authorElement) return;
        
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        
        quoteElement.textContent = `"${randomQuote.text}"`;
        authorElement.textContent = `— ${randomQuote.author}`;
    }

    updateMood() {
        const weatherText = document.getElementById('weather-info');
        if (!weatherText) return;
        
        const randomMood = this.moodStates[Math.floor(Math.random() * this.moodStates.length)];
        weatherText.textContent = `${randomMood.icon} ${randomMood.text}`;
    }

    showSettings() {
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        
        // Add click-outside-to-close functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    applySettings() {
        if (this.quoteCard) {
            this.quoteCard.style.display = this.settings.showQuoteCard ? 'block' : 'none';
        }
        
        if (this.moodCard) {
            this.moodCard.style.display = this.settings.showMoodCard ? 'block' : 'none';
        }
        
        // Show/hide mini calendar
        if (this.miniCalendar) {
            if (this.settings.showCalendar) {
                this.miniCalendar.classList.remove('hidden');
                this.miniCalendar.classList.add('show');
            } else {
                this.miniCalendar.classList.add('hidden');
                this.miniCalendar.classList.remove('show');
            }
        }
    }

    setupCalendar() {
        if (!this.miniCalendar) return;
        
        const now = new Date();
        this.currentCalendarYear = now.getFullYear();
        this.currentCalendarMonth = now.getMonth();
        
        // Calendar navigation buttons
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateMonth(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateMonth(1);
            });
        }
        
        // Add long press for memo management mode
        let longPressTimer;
        this.miniCalendar.addEventListener('mousedown', (e) => {
            // Don't trigger long press on navigation buttons
            if (e.target.closest('.calendar-nav-btn')) return;
            
            longPressTimer = setTimeout(() => {
                this.toggleMemoManagementMode();
            }, 800);
        });

        this.miniCalendar.addEventListener('mouseup', (e) => {
            clearTimeout(longPressTimer);
        });

        this.miniCalendar.addEventListener('mouseleave', (e) => {
            clearTimeout(longPressTimer);
        });
        
        this.renderMiniCalendar(this.currentCalendarYear, this.currentCalendarMonth);
    }

    navigateMonth(direction) {
        this.currentCalendarMonth += direction;
        
        if (this.currentCalendarMonth > 11) {
            this.currentCalendarMonth = 0;
            this.currentCalendarYear++;
        } else if (this.currentCalendarMonth < 0) {
            this.currentCalendarMonth = 11;
            this.currentCalendarYear--;
        }
        
        this.renderMiniCalendar(this.currentCalendarYear, this.currentCalendarMonth);
    }

    renderMiniCalendar(year, month) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const monthElement = document.getElementById('mini-calendar-month');
        const yearElement = document.getElementById('mini-calendar-year');
        const daysElement = document.getElementById('mini-calendar-days');
        
        if (!monthElement || !yearElement || !daysElement) return;
        
        monthElement.textContent = monthNames[month];
        yearElement.textContent = year;
        
        daysElement.innerHTML = '';
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const numberOfDays = lastDay.getDate();
        
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        const isCurrentMonth = year === todayYear && month === todayMonth;
        
        // Add previous month's trailing days
        for (let i = 0; i < startingDayOfWeek; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'mini-calendar-day other-month';
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            dayElement.textContent = prevMonthLastDay - startingDayOfWeek + i + 1;
            daysElement.appendChild(dayElement);
        }
        
        // Add current month's days
        for (let day = 1; day <= numberOfDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'mini-calendar-day';
            dayElement.textContent = day;
            
            if (isCurrentMonth && day === todayDate) {
                dayElement.classList.add('today');
            }
            
            // Add memo indicator if memo exists for this date
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (this.memos[dateKey]) {
                dayElement.classList.add('has-memo');
                const indicator = document.createElement('div');
                indicator.className = 'memo-indicator';
                dayElement.appendChild(indicator);
                
                // Add memo preview in management mode
                if (this.memoManagementMode) {
                    const preview = document.createElement('div');
                    preview.className = 'memo-preview';
                    preview.textContent = this.memos[dateKey].substring(0, 20) + (this.memos[dateKey].length > 20 ? '...' : '');
                    dayElement.appendChild(preview);
                }
            }
            
            // Add management mode styling
            if (this.memoManagementMode) {
                dayElement.classList.add('management-mode');
            }
            
            // Add click handler for memo functionality
            dayElement.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.memoManagementMode && this.memos[dateKey]) {
                    this.showMemoManagementModal(year, month, day, dayElement);
                } else {
                    this.showMemoModal(year, month, day, dayElement);
                }
            });
            
            daysElement.appendChild(dayElement);
        }
        
        // Fill remaining cells with next month's days (only if needed for a complete week)
        const cellsUsed = startingDayOfWeek + numberOfDays;
        const remainingCells = cellsUsed % 7;
        if (remainingCells !== 0) {
            for (let i = 1; i <= 7 - remainingCells; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'mini-calendar-day other-month';
                dayElement.textContent = i;
                daysElement.appendChild(dayElement);
            }
        }
    }

    setupPhotoUpload() {
        const photoUploadInput = document.getElementById('photo-upload');
        if (!photoUploadInput) return;

        photoUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.processCustomPhoto(file);
            }
            // Reset input value to allow same file selection
            e.target.value = '';
        });
    }

    setupChatUpload() {
        console.log('🚀 Setting up chat upload system...');
        
        // 직접 DOM에서 요소들을 찾음 (캐싱 의존하지 않음)
        const chatUploadBtn = document.getElementById('chat-upload');
        const chatFileInput = document.getElementById('chat-file-input');
        
        console.log('🎯 Chat upload button found:', !!chatUploadBtn);
        console.log('🎯 Chat file input found:', !!chatFileInput);
        
        if (!chatUploadBtn || !chatFileInput) {
            console.error('❌ Chat upload elements not found! Retrying in 500ms...');
            // DOM이 아직 준비되지 않았다면 잠시 후 재시도
            setTimeout(() => this.setupChatUpload(), 500);
            return;
        }

        // 업로드 버튼 클릭 → 파일 선택 창 열기
        chatUploadBtn.addEventListener('click', () => {
            console.log('🖱️ Chat upload button clicked!');
            chatFileInput.click();
        });

        // 파일 선택 완료 → 파일 처리
        chatFileInput.addEventListener('change', (e) => {
            console.log('📁 Chat file input change event fired!');
            this.handleFileUpload(e);
        });

        // 캐싱 업데이트 (나중에 사용할 수 있도록)
        this.chatUpload = chatUploadBtn;
        this.chatFileInput = chatFileInput;
        
        console.log('✅ Chat upload system setup complete!');
    }

    processCustomPhoto(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.compressAndSavePhoto(img, file.name);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    compressAndSavePhoto(img, filename) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Target dimensions optimized for Mac Retina displays
        const maxWidth = 2880;  // 맥북 프로 14인치 기본 해상도
        const maxHeight = 1800; // 16:10 비율 유지
        
        let { width, height } = img;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 고품질 렌더링 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw image with high quality
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert with lossless quality
        const highQualityDataUrl = canvas.toDataURL('image/png');
        
        // 더 관대한 파일 크기 제한 (2MB까지 허용)
        if (highQualityDataUrl.length > 2600000) { // ~2MB in base64
            // 크기가 너무 큰 경우에만 압축
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            this.saveCustomPhoto(compressedDataUrl, filename);
        } else {
            this.saveCustomPhoto(highQualityDataUrl, filename);
        }
    }

    saveCustomPhoto(dataUrl, filename) {
        const photoData = {
            id: Date.now(),
            name: filename,
            data: dataUrl,
            uploadDate: new Date().toISOString()
        };

        // Add to custom photos array
        this.customPhotos.unshift(photoData);
        
        // Limit to 5 photos to manage storage
        if (this.customPhotos.length > 5) {
            this.customPhotos = this.customPhotos.slice(0, 5);
        }
        
        // Save to localStorage
        localStorage.setItem('elegant-space-custom-photos', JSON.stringify(this.customPhotos));
        
        // Immediately use the new photo as background
        this.setBackgroundImage({
            url: dataUrl,
            photographer: 'Your Photo',
            location: filename.replace(/\.[^/.]+$/, '') // Remove file extension
        });
        
        // Enable custom photos if not already
        if (!this.settings.useCustomPhotos) {
            this.settings.useCustomPhotos = true;
            localStorage.setItem('elegant-space-use-custom-photos', 'true');
        }
    }

    getRandomCustomPhoto() {
        if (this.customPhotos.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * this.customPhotos.length);
        const photo = this.customPhotos[randomIndex];
        
        return {
            url: photo.data,
            photographer: 'Your Photo',
            location: photo.name.replace(/\.[^/.]+$/, '')
        };
    }

    deleteCustomPhoto(photoId) {
        this.customPhotos = this.customPhotos.filter(photo => photo.id !== photoId);
        localStorage.setItem('elegant-space-custom-photos', JSON.stringify(this.customPhotos));
        
        // If no custom photos left, disable custom photos
        if (this.customPhotos.length === 0 && this.settings.useCustomPhotos) {
            this.settings.useCustomPhotos = false;
            localStorage.setItem('elegant-space-use-custom-photos', 'false');
            this.loadBackgroundImage(true); // Load fallback image
        }
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <div class="settings-title">
                        <div class="settings-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <h2>Settings</h2>
                    </div>
                    <button class="close-btn" onclick="this.closest('.settings-modal').remove()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="settings-body">
                    <div class="setting-group">
                        <label class="setting-label">Display Name</label>
                        <p class="setting-description">Choose how you'd like to be greeted</p>
                        <input type="text" value="${this.userName}" class="setting-input" placeholder="Enter your name">
                    </div>
                    
                    <div class="setting-group">
                        <label class="setting-label">Display Options</label>
                        <p class="setting-description">Customize what appears on your new tab page</p>
                        
                        <div class="setting-item toggle-item">
                            <label class="toggle-label">
                                <span>Daily Inspiration Card</span>
                                <div class="toggle-switch">
                                    <input type="checkbox" ${this.settings.showQuoteCard ? 'checked' : ''} class="quote-toggle">
                                    <span class="toggle-slider"></span>
                                </div>
                            </label>
                        </div>
                        
                        <div class="setting-item toggle-item">
                            <label class="toggle-label">
                                <span>Today's Mood Card</span>
                                <div class="toggle-switch">
                                    <input type="checkbox" ${this.settings.showMoodCard ? 'checked' : ''} class="mood-toggle">
                                    <span class="toggle-slider"></span>
                                </div>
                            </label>
                        </div>
                        
                        <div class="setting-item toggle-item">
                            <label class="toggle-label">
                                <span>Calendar Widget</span>
                                <div class="toggle-switch">
                                    <input type="checkbox" ${this.settings.showCalendar ? 'checked' : ''} class="calendar-toggle">
                                    <span class="toggle-slider"></span>
                                </div>
                            </label>
                        </div>
                        
                        <div class="setting-item toggle-item">
                            <label class="toggle-label">
                                <span>Use Custom Photos</span>
                                <div class="toggle-switch">
                                    <input type="checkbox" ${this.settings.useCustomPhotos ? 'checked' : ''} class="custom-photos-toggle">
                                    <span class="toggle-slider"></span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <label class="setting-label">Custom Photos (${this.customPhotos.length}/5)</label>
                        <p class="setting-description">Manage your uploaded background images</p>
                        <div class="custom-photos-list" id="custom-photos-list">
                            ${this.customPhotos.map(photo => `
                                <div class="photo-item" data-photo-id="${photo.id}">
                                    <div class="photo-thumbnail" style="background-image: url(${photo.data})"></div>
                                    <div class="photo-info">
                                        <span class="photo-name">${photo.name}</span>
                                        <span class="photo-date">${new Date(photo.uploadDate).toLocaleDateString()}</span>
                                    </div>
                                    <button class="delete-photo-btn" data-photo-id="${photo.id}">×</button>
                                </div>
                            `).join('')}
                            ${this.customPhotos.length === 0 ? '<p class="no-photos">No custom photos uploaded yet. Use the camera button to add photos.</p>' : ''}
                        </div>
                    </div>
                    
                </div>
                <button class="save-btn save-settings">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17,21 17,13 7,13 7,21"/>
                        <polyline points="7,3 7,8 15,8"/>
                    </svg>
                </button>
            </div>
        `;

        const styles = document.createElement('style');
        styles.textContent = `
            .setting-item {
                margin-bottom: 1.5rem;
            }
            .setting-item label {
                display: block;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 0.5rem;
                font-weight: 500;
            }
            .name-setting {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 0.75rem 1rem;
                color: white;
                font-size: 1rem;
                outline: none;
                transition: all 0.2s ease;
            }
            .name-setting:focus { border-color: #6366f1; background: rgba(255, 255, 255, 0.15); }
            
            .setting-section {
                margin: 1.5rem 0;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .section-title {
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 1rem;
            }
            
            .custom-photos-list {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 0.5rem;
            }
            
            .photo-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                margin-bottom: 0.5rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s var(--animation-smooth);
            }
            
            .photo-item:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            .photo-thumbnail {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                background-size: cover;
                background-position: center;
                flex-shrink: 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .photo-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .photo-name {
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--text-primary);
                word-break: break-all;
            }
            
            .photo-date {
                font-size: 0.75rem;
                color: var(--text-tertiary);
            }
            
            .delete-photo-btn {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s var(--animation-smooth);
                flex-shrink: 0;
            }
            
            .delete-photo-btn:hover {
                background: rgba(239, 68, 68, 0.3);
                border-color: rgba(239, 68, 68, 0.5);
                transform: scale(1.1);
            }
            
            .no-photos {
                text-align: center;
                color: var(--text-tertiary);
                font-size: 0.875rem;
                padding: 2rem 1rem;
                font-style: italic;
            }
            
            .toggle-item {
                margin-bottom: 1rem;
            }
            
            .toggle-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 400;
                cursor: pointer;
            }
            
            .toggle-switch {
                position: relative;
                width: 48px;
                height: 24px;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.2);
                transition: 0.3s;
                border-radius: 24px;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }
            
            .toggle-switch input:checked + .toggle-slider {
                background: #6366f1;
            }
            
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(24px);
            }
        `;
        modal.appendChild(styles);
        
        // Add event listeners
        setTimeout(() => {
            const saveBtn = modal.querySelector('.save-settings');
            const nameInput = modal.querySelector('.name-setting');
            const quoteToggle = modal.querySelector('.quote-toggle');
            const moodToggle = modal.querySelector('.mood-toggle');
            const calendarToggle = modal.querySelector('.calendar-toggle');
            const customPhotosToggle = modal.querySelector('.custom-photos-toggle');
            
            // Handle photo deletion
            modal.querySelectorAll('.delete-photo-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const photoId = parseInt(e.target.getAttribute('data-photo-id'));
                    this.deleteCustomPhoto(photoId);
                    modal.remove();
                    setTimeout(() => this.showSettings(), 100); // Refresh settings modal
                });
            });
            
            saveBtn?.addEventListener('click', () => {
                // Save name
                if (nameInput?.value.trim()) {
                    this.userName = nameInput.value.trim();
                    localStorage.setItem('elegant-space-username', this.userName);
                    this.updateGreetingDisplay();
                }
                
                // Save settings
                this.settings.showQuoteCard = quoteToggle?.checked ?? true;
                this.settings.showMoodCard = moodToggle?.checked ?? true;
                this.settings.showCalendar = calendarToggle?.checked ?? false;
                this.settings.useCustomPhotos = customPhotosToggle?.checked ?? false;
                
                localStorage.setItem('elegant-space-show-quote', this.settings.showQuoteCard);
                localStorage.setItem('elegant-space-show-mood', this.settings.showMoodCard);
                localStorage.setItem('elegant-space-show-calendar', this.settings.showCalendar);
                localStorage.setItem('elegant-space-use-custom-photos', this.settings.useCustomPhotos);
                
                this.applySettings();
                modal.remove();
                
                // Refresh background if custom photos setting changed
                this.loadBackgroundImage(true);
            });
        }, 100);

        return modal;
    }

    showMemoModal(year, month, day, dayElement) {
        // Close any existing memo popup first
        const existingPopup = document.querySelector('.memo-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const existingMemo = this.memos[dateKey] || '';
        
        const modal = document.createElement('div');
        modal.className = 'memo-popup';
        modal.innerHTML = `
            <div class="memo-popup-arrow"></div>
            <div class="memo-popup-content">
                <div class="memo-header">
                    <span class="memo-date">${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month]}</span>
                    <button class="memo-close" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="memo-input-container">
                    <textarea 
                        class="memo-input" 
                        placeholder="Write a memo..."
                        maxlength="150"
                        rows="2"
                    >${existingMemo}</textarea>
                </div>
                <div class="memo-actions">
                    <span class="memo-count">${existingMemo.length}/150</span>
                    <div class="memo-buttons">
                        ${existingMemo ? '<button class="memo-delete" type="button">Delete</button>' : ''}
                        <button class="memo-save" type="button">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        // Position popup directly above the clicked date
        const rect = dayElement.getBoundingClientRect();
        document.body.appendChild(modal);
        
        const popupRect = modal.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - popupRect.width / 2;
        let top = rect.top - popupRect.height - 8;
        
        // Adjust horizontal position if goes off screen
        if (left < 8) {
            left = 8;
            modal.querySelector('.memo-popup-arrow').style.left = (rect.left + rect.width / 2 - 8) + 'px';
        } else if (left + popupRect.width > window.innerWidth - 8) {
            left = window.innerWidth - popupRect.width - 8;
            modal.querySelector('.memo-popup-arrow').style.left = (rect.left + rect.width / 2 - left - 8) + 'px';
        }
        
        // If popup goes above viewport, show below date
        if (top < 8) {
            top = rect.bottom + 8;
            modal.classList.add('below');
        }
        
        modal.style.left = left + 'px';
        modal.style.top = top + 'px';
        
        // Focus textarea
        const textarea = modal.querySelector('.memo-input');
        setTimeout(() => textarea.focus(), 100);
        
        // Character counter and input enhancements
        const charCount = modal.querySelector('.memo-count');
        const inputContainer = modal.querySelector('.memo-input-container');
        const inputBorder = modal.querySelector('.memo-input-border');
        
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length + '/300';
            
            // Auto-resize textarea
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
        });
        
        textarea.addEventListener('focus', () => {
            inputContainer.classList.add('focused');
        });
        
        textarea.addEventListener('blur', () => {
            inputContainer.classList.remove('focused');
        });
        
        // Event listeners
        const closeBtn = modal.querySelector('.memo-close');
        const saveBtn = modal.querySelector('.memo-save');
        const deleteBtn = modal.querySelector('.memo-delete');
        
        closeBtn?.addEventListener('click', () => modal.remove());
        
        // Close on clicking header or actions area (but not input)
        const header = modal.querySelector('.memo-header');
        const actions = modal.querySelector('.memo-actions');
        
        header?.addEventListener('click', (e) => {
            if (e.target === header || e.target.closest('.memo-date')) {
                modal.remove();
            }
        });
        
        actions?.addEventListener('click', (e) => {
            if (e.target === actions || e.target.closest('.memo-count')) {
                modal.remove();
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!modal.contains(e.target) && e.target !== dayElement) {
                modal.remove();
            }
        }, { once: true });
        
        // Save memo
        saveBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const memoText = textarea.value.trim();
            if (memoText) {
                this.memos[dateKey] = memoText;
            } else {
                delete this.memos[dateKey];
            }
            localStorage.setItem('elegant-space-memos', JSON.stringify(this.memos));
            
            // Update calendar display
            this.renderMiniCalendar(year, month);
            modal.remove();
        });
        
        // Delete memo
        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            delete this.memos[dateKey];
            localStorage.setItem('elegant-space-memos', JSON.stringify(this.memos));
            
            // Update calendar display
            this.renderMiniCalendar(year, month);
            modal.remove();
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.parentNode) {
                modal.remove();
            }
        }, { once: true });
        
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    toggleMemoManagementMode() {
        this.memoManagementMode = !this.memoManagementMode;
        
        if (this.memoManagementMode) {
            this.miniCalendar.style.border = '2px solid rgba(239, 68, 68, 0.5)';
            this.miniCalendar.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            // Add visual feedback
            const tooltip = document.createElement('div');
            tooltip.className = 'management-tooltip';
            tooltip.textContent = '메모 관리 모드 ON - 캘린더를 다시 길게 눌러서 해제';
            document.body.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 3000);
        } else {
            this.miniCalendar.style.border = '';
            this.miniCalendar.style.backgroundColor = '';
        }
        
        // Re-render calendar to update display
        const now = new Date();
        this.renderMiniCalendar(now.getFullYear(), now.getMonth());
    }

    showMemoManagementModal(year, month, day, dayElement) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const memo = this.memos[dateKey];
        if (!memo) return;

        // Remove any existing modals
        const existingModal = document.querySelector('.memo-popup');
        if (existingModal) {
            existingModal.remove();
        }

        // Create management modal
        const modal = document.createElement('div');
        modal.className = 'memo-popup management-popup';
        
        // Calculate position
        const dayRect = dayElement.getBoundingClientRect();
        const modalWidth = 250;
        const modalHeight = 180;
        
        let left = dayRect.left + (dayRect.width / 2) - (modalWidth / 2);
        let top = dayRect.top - modalHeight - 10;
        
        // Adjust if modal goes off screen
        if (left < 10) left = 10;
        if (left + modalWidth > window.innerWidth - 10) left = window.innerWidth - modalWidth - 10;
        if (top < 10) top = dayRect.bottom + 10;
        
        modal.style.left = `${left}px`;
        modal.style.top = `${top}px`;

        const modalContent = `
            <div class="memo-popup-content management-content">
                <div class="memo-header">
                    <span class="memo-date">${month + 1}/${day} 메모</span>
                </div>
                <div class="memo-preview-full">${memo}</div>
                <div class="memo-actions management-actions">
                    <button class="memo-btn edit-btn">편집</button>
                    <button class="memo-btn delete-btn">삭제</button>
                    <button class="memo-btn export-btn">내보내기</button>
                </div>
            </div>
        `;

        modal.innerHTML = modalContent;
        document.body.appendChild(modal);

        // Event handlers
        const editBtn = modal.querySelector('.edit-btn');
        const deleteBtn = modal.querySelector('.delete-btn');
        const exportBtn = modal.querySelector('.export-btn');

        editBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.remove();
            this.showMemoModal(year, month, day, dayElement);
        });

        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`${month + 1}/${day} 메모를 삭제하시겠습니까?`)) {
                delete this.memos[dateKey];
                localStorage.setItem('elegant-space-memos', JSON.stringify(this.memos));
                this.renderMiniCalendar(year, month);
            }
            modal.remove();
        });

        exportBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}: ${memo}`;
            navigator.clipboard.writeText(text).then(() => {
                const toast = document.createElement('div');
                toast.className = 'management-tooltip';
                toast.textContent = '메모가 클립보드에 복사되었습니다';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            });
        });

        // Close modal when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!modal.contains(e.target)) {
                    modal.remove();
                }
            }, { once: true });
        }, 100);

        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    initializeInteractions() {
        const cards = document.querySelectorAll('.info-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${0.6 + index * 0.1}s`;
        });

        window.elegantSpace = this;
    }

    // Chat functionality methods
    toggleChat() {
        if (this.isChatOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        if (!this.chatPanel) return;
        
        this.isChatOpen = true;
        this.chatPanel.classList.add('active');
        
        // Focus on input after animation
        setTimeout(() => {
            if (this.chatInput) {
                this.chatInput.focus();
            }
        }, 200);
    }

    closeChat() {
        if (!this.chatPanel) return;
        
        this.isChatOpen = false;
        this.chatPanel.classList.remove('active');
        
        if (this.chatInput) {
            this.chatInput.blur();
        }
    }

    async sendMessage() {
        if (!this.chatInput || !this.chatMessages) return;
        
        const message = this.chatInput.value.trim();
        
        // Allow sending if there's either a message OR uploaded files
        if (!message && this.chatUploadedFiles.length === 0) {
            return;
        }
        
        // If no text but files exist, use default message
        const finalMessage = message || "Analyze the uploaded file(s).";
        
        // Clear input and disable send button
        this.chatInput.value = '';
        this.chatSendBtn.disabled = true;
        
        // Add user message (show original message or indicate file upload)
        const userDisplayMessage = message || `📁 Uploaded ${this.chatUploadedFiles.length} file(s) for analysis`;
        this.addChatMessage(userDisplayMessage, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to Gemini API (with files and history)
            const response = await this.sendToGeminiWithRetry(finalMessage, 3);
            
            // Save to chat history
            this.addToChatHistory('user', finalMessage, this.chatUploadedFiles.length > 0);
            this.addToChatHistory('model', response, false);
            
            // Clear uploaded files ONLY after successful API call
            this.chatUploadedFiles = [];
            this.updateFileDisplay();
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addChatMessage(response, 'ai');
        } catch (error) {
            console.error('Chat error:', error);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add error message
            this.addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
        } finally {
            // Re-enable send button
            this.chatSendBtn.disabled = false;
        }
    }

    addChatMessage(content, sender) {
        if (!this.chatMessages) return;
        
        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.chat-welcome');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        const avatarSvg = sender === 'user' 
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
        
        messageElement.innerHTML = `
            <div class="message-avatar ${sender}">
                ${avatarSvg}
            </div>
            <div class="message-content">
                ${content}
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (!this.chatMessages) return;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message ai typing-message';
        typingElement.innerHTML = `
            <div class="message-avatar ai">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-typing">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
        this.isTyping = true;
    }

    hideTypingIndicator() {
        if (!this.chatMessages) return;
        
        const typingMessage = this.chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
        this.isTyping = false;
    }

    scrollToBottom() {
        if (!this.chatMessages) return;
        
        requestAnimationFrame(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        });
    }

    resetChat() {
        if (!this.chatMessages) return;
        
        // Clear all messages except welcome
        this.chatMessages.innerHTML = `
            <div class="chat-welcome">
                <div class="welcome-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <h3>Hello! I'm your AI assistant</h3>
                <p>I can help you with questions, searches, and information from the web. What would you like to know?</p>
            </div>
        `;
        
        // Clear uploaded files
        this.chatUploadedFiles = [];
        this.updateFileDisplay();
        
        // Clear chat history when resetting
        this.clearChatHistory();
        
        console.log('Chat messages and history cleared');
    }

    handleFileUpload(event) {
        console.log('🔥 File upload event triggered:', event);
        
        const files = Array.from(event.target.files);
        console.log('📁 Files selected:', files.length, files.map(f => f.name));
        
        if (!files.length) {
            console.log('⚠️ No files selected');
            return;
        }
        
        // Add files to uploaded files array
        files.forEach(file => {
            console.log(`📄 Processing file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type})`);
            
            // Check file size (max 100MB based on Gemini API 2025 limits)
            if (file.size > 100 * 1024 * 1024) {
                console.error(`❌ File too large: ${file.name}`);
                alert(`File ${file.name} is too large (max 100MB)`);
                return;
            }
            
            // Expanded file type support based on Gemini API 2025 capabilities
            const allowedTypes = [
                'image/', 'video/', 'audio/', 
                'application/pdf', 'text/', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
            
            if (!isAllowedType) {
                console.error(`❌ Unsupported file type: ${file.type}`);
                alert(`File type ${file.type} not supported`);
                return;
            }
            
            this.chatUploadedFiles.push(file);
            console.log(`✅ File added: ${file.name}`);
        });
        
        console.log(`📊 Total files now: ${this.chatUploadedFiles.length}`);
        this.updateFileDisplay();
        
        // Auto-open chat if files selected
        if (this.chatUploadedFiles.length > 0 && !this.isChatOpen) {
            console.log('🚀 Auto-opening chat due to file upload');
            this.openChat();
        }
        
        // Clear input
        event.target.value = '';
    }

    updateFileDisplay() {
        console.log('🔄 Updating file display...');
        
        if (!this.fileNamesSpan) {
            console.warn('🔍 File names span element not found, retrying...');
            this.fileNamesSpan = document.getElementById('file-names');
            if (!this.fileNamesSpan) {
                console.error('❌ Could not find file-names element in DOM');
                // Try to inject the element if missing
                const chatInputWrapper = document.querySelector('.chat-input-wrapper');
                if (chatInputWrapper && !chatInputWrapper.querySelector('#file-names')) {
                    const span = document.createElement('span');
                    span.id = 'file-names';
                    span.className = 'file-names';
                    chatInputWrapper.insertBefore(span, chatInputWrapper.querySelector('.chat-send-btn'));
                    this.fileNamesSpan = span;
                    console.log('✅ File names element created dynamically');
                } else {
                    return;
                }
            }
        }
        
        if (this.chatUploadedFiles.length > 0) {
            console.log(`📂 Displaying ${this.chatUploadedFiles.length} files`);
            this.chatUpload?.classList.add('has-files');
            
            const fileNames = this.chatUploadedFiles.map(f => {
                const name = f.name.length > 15 ? f.name.substring(0, 12) + '...' : f.name;
                return name;
            }).join(', ');
            
            const displayText = `${this.chatUploadedFiles.length} file(s): ${fileNames}`;
            this.fileNamesSpan.textContent = displayText;
            console.log(`📝 File display text: ${displayText}`);
        } else {
            console.log('🗑️ Clearing file display');
            this.chatUpload?.classList.remove('has-files');
            this.fileNamesSpan.textContent = '';
        }
    }

    // Remove complex preview system - now just showing file names

    removeFile(index) {
        this.chatUploadedFiles.splice(index, 1);
        this.updateFileDisplay();
    }

    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (result && typeof result === 'string') {
                    const base64Data = result.split(',')[1];
                    console.log(`📊 Base64 conversion success for ${file.name}: ${base64Data.length} chars`);
                    resolve(base64Data);
                } else {
                    console.error('❌ Base64 conversion failed - invalid result type');
                    reject(new Error('Base64 conversion failed'));
                }
            };
            reader.onerror = (error) => {
                console.error('❌ FileReader error:', error);
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    // EXACT copy from working GitHub project
    async fileToGenerativePart(file) {
        console.log(`🔄 Converting file to generative part: ${file.name} (${file.type})`);
        
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        const result = {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type }
        };
        
        console.log(`✅ Generative part created for ${file.name}:`, {
            mimeType: result.inlineData.mimeType,
            dataLength: result.inlineData.data.length
        });
        
        return result;
    }

    addToChatHistory(role, text, hasFiles = false) {
        // Generate unique message ID
        const messageId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Add new message to history with minimal metadata (prevent English contamination)
        const message = {
            id: messageId,
            role: role, // 'user' or 'model'
            text: text,
            timestamp: Date.now(),
            hasFiles: hasFiles,
            토큰수: this.estimateTokenCount(text) // 한국어 필드명 사용
        };
        
        this.chatHistory.push(message);
        
        // Smart context window management - keep important messages
        this.manageContextWindow();
        
        // Save to localStorage
        localStorage.setItem('elegant-space-chat-history', JSON.stringify(this.chatHistory));
        
        console.log('💾 Chat history updated:', this.chatHistory.length, 'messages');
        console.log('📊 Total tokens:', this.getTotalTokens());
    }

    clearChatHistory() {
        this.chatHistory = [];
        localStorage.removeItem('elegant-space-chat-history');
        console.log('🗑️ Chat history cleared');
    }

    loadChatHistory() {
        const stored = localStorage.getItem('elegant-space-chat-history');
        if (stored) {
            this.chatHistory = JSON.parse(stored);
            console.log('📚 Loaded chat history:', this.chatHistory.length, 'messages');
            console.log('📊 Total tokens in history:', this.getTotalTokens());
        }
    }

    // Smart context management functions
    generateSessionId() {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    getSessionId() {
        return this.sessionId;
    }

    estimateTokenCount(text) {
        // 대략적인 토큰 수 추정: 한글-영어 혼합 텍스트 기준
        return Math.ceil(text.length / 3);
    }

    getTotalTokens() {
        return this.chatHistory.reduce((total, msg) => {
            return total + (msg.토큰수 || this.estimateTokenCount(msg.text));
        }, 0);
    }

    manageContextWindow() {
        const totalTokens = this.getTotalTokens();
        
        console.log('🔍 Context window check - Total tokens:', totalTokens, '/ Max:', this.maxTokens);
        
        // Simple token-based sliding window - only remove oldest when exceeding limit
        if (totalTokens > this.maxTokens) {
            console.log('⚡ Applying token-based sliding window...');
            
            // Remove oldest messages until we're under the limit
            while (this.getTotalTokens() > this.maxTokens && this.chatHistory.length > 0) {
                const removedMessage = this.chatHistory.shift(); // Remove oldest
                console.log(`🗑️ Removed message: "${removedMessage.text.substring(0, 50)}..." (${removedMessage.토큰수 || 0} tokens)`);
            }
            
            console.log('✂️ Context trimmed to', this.chatHistory.length, 'messages');
            console.log('📊 New token count:', this.getTotalTokens());
        }
    }

    // Get optimized context for API calls (now just returns full history)
    getOptimizedContext(maxContextTokens = 800000) {
        // With Gemini's 1M token limit, we can use almost full history
        const totalTokens = this.getTotalTokens();
        
        if (totalTokens <= maxContextTokens) {
            console.log('🎯 Using full context:', this.chatHistory.length, 'messages,', totalTokens, 'tokens');
            return this.chatHistory;
        }
        
        // Only trim if we actually exceed limits (rare case)
        let currentTokens = 0;
        const contextMessages = [];
        
        for (let i = this.chatHistory.length - 1; i >= 0; i--) {
            const msg = this.chatHistory[i];
            const msgTokens = msg.토큰수 || this.estimateTokenCount(msg.text);
            
            if (currentTokens + msgTokens > maxContextTokens) {
                break;
            }
            
            currentTokens += msgTokens;
            contextMessages.unshift(msg);
        }
        
        console.log('🎯 Trimmed context:', contextMessages.length, 'messages,', currentTokens, 'tokens');
        return contextMessages;
    }

    // Retry logic for better reliability
    async sendToGeminiWithRetry(message, maxRetries = 3) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt}/${maxRetries} - Sending to Gemini...`);
                const response = await this.sendToGemini(message);
                console.log(`✅ Success on attempt ${attempt}`);
                return response;
            } catch (error) {
                console.error(`❌ Attempt ${attempt} failed:`, error.message);
                lastError = error;
                
                // Don't retry on certain errors
                if (error.message.includes('API key') || error.message.includes('quota')) {
                    console.log('🚨 Non-retryable error detected');
                    throw error;
                }
                
                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        console.error(`❌ All ${maxRetries} attempts failed`);
        throw lastError;
    }

    async sendToGeminiRestAPI(message) {
        console.log('🔄 Sending to Gemini using REST API fallback...');
        
        try {
            // Use full context - Gemini can handle it
            const optimizedContext = this.getOptimizedContext(); // Use default 800k limit
            const contents = [];
            
            // Add previous conversation history (optimized)
            for (const historyItem of optimizedContext) {
                contents.push({
                    role: historyItem.role,
                    parts: [{ text: historyItem.text }]
                });
            }
            
            // Add current user message
            const currentUserParts = [{ text: message }];
            
            // Add files to current message if any
            if (this.chatUploadedFiles.length > 0) {
                console.log('📁 Adding files to current message...');
                
                for (const file of this.chatUploadedFiles) {
                    console.log(`📄 Processing: ${file.name} (${file.type})`);
                    
                    const base64Data = await this.fileToBase64(file);
                    currentUserParts.push({
                        inline_data: {
                            mime_type: file.type,
                            data: base64Data
                        }
                    });
                }
            }
            
            contents.push({
                role: 'user',
                parts: currentUserParts
            });
            
            // Prepare request for secure backend
            const requestBody = {
                message: inputValue,
                history: this.chatHistory.slice(-10).map(msg => ({ // Send last 10 messages for context
                    role: msg.role === 'user' ? 'user' : 'model',
                    text: msg.text
                })),
                files: this.chatUploadedFiles.length > 0 ? this.chatUploadedFiles.map(file => ({
                    inlineData: {
                        data: this.fileToBase64(file),
                        mimeType: file.type
                    }
                })) : undefined
            };

            console.log('🚀 Making REST API request...');
            
            const response = await fetch(`${this.apiEndpoint}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(`API error: ${data.error}`);
            }
            
            const responseText = data.text;
            console.log('✅ Secure backend response received');
            return responseText;

        } catch (error) {
            console.error('❌ REST API request failed:', error);
            throw error;
        }
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async sendToGemini(message) {
        console.log('🤖 Sending to Gemini...');
        console.log('📝 Message:', message);
        console.log('📁 Files to upload:', this.chatUploadedFiles.length);
        
        if (!this.genAI) {
            console.error('❌ Google Generative AI not initialized');
            throw new Error('Google Generative AI not initialized');
        }

        // Check if we're using REST API fallback mode
        if (this.genAI === 'REST_API_MODE') {
            console.log('🔄 Using REST API fallback mode...');
            return await this.sendToGeminiRestAPI(message);
        }

        console.log('🚀 Using Google SDK mode...');
        console.log('📚 Including chat history:', this.chatHistory.length, 'messages');

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            
            // Use full context - Gemini can handle it
            const optimizedContext = this.getOptimizedContext(); // Use default 800k limit
            
            // Build chat using optimized history for multi-turn conversation
            const chat = model.startChat({
                history: optimizedContext.map(item => ({
                    role: item.role,
                    parts: [{ text: item.text }]
                }))
            });
            
            // Prepare current message parts
            let messageParts = [{ text: message }];
            
            // Add files to current message
            if (this.chatUploadedFiles.length > 0) {
                console.log('🔄 Processing uploaded files...');
                
                for (const file of this.chatUploadedFiles) {
                    console.log(`📄 Processing: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                    
                    try {
                        const imageInlineData = await this.fileToGenerativePart(file);
                        messageParts.push(imageInlineData);
                        console.log(`✅ File successfully added: ${file.name}`);
                    } catch (error) {
                        console.error(`❌ Failed to process ${file.name}:`, error);
                        alert(`Failed to process file: ${file.name}. Error: ${error.message}`);
                    }
                }
            }
            
            console.log('🚀 Making Google SDK API call with chat context...');
            
            // Send message in chat context
            const result = await chat.sendMessage(messageParts);
            const response = await result.response;
            const text = response.text();
            
            console.log('✅ Response received successfully');
            console.log('📨 Response text length:', text.length);
            
            return text;
            
        } catch (error) {
            console.error('❌ Google SDK API error:', error);
            throw new Error(`Google SDK Error: ${error.message}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ElegantSpace();
});