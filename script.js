// GitHub API 配置
const GITHUB_USERNAME = 'Yo-codeback';
const GITHUB_API_BASE = 'https://api.github.com';

// 專案滑動器狀態
let currentSlide = 0;
let totalSlides = 0;
let projects = [];

// 導航欄功能
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 手機版選單切換
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // 點擊導航連結時關閉手機版選單
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // 滾動時導航欄效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // 平滑滾動到指定區域
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考慮導航欄高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滾動動畫效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // 為需要動畫的元素添加觀察
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .about-stats, .contact-method');
    animateElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });

    // 技能項目動畫
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // 表單提交處理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 獲取表單數據
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelectorAll('input[type="text"]')[1].value;
            const message = this.querySelector('textarea').value;

            // 簡單驗證
            if (!name || !email || !subject || !message) {
                showNotification('請填寫所有必填欄位', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('請輸入有效的電子郵件地址', 'error');
                return;
            }

            // 模擬發送（實際應用中需要連接到後端）
            showNotification('訊息發送成功！我會盡快回覆您。', 'success');
            this.reset();
        });
    }

    // 專案卡片懸停效果
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 社交連結點擊效果
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 添加點擊動畫
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // 這裡可以添加實際的連結跳轉邏輯
            const platform = this.classList[1]; // 獲取平台名稱
            showNotification(`即將跳轉到 ${this.querySelector('span').textContent}`, 'info');
        });
    });

    // 技能項目點擊效果
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = '#e74c3c';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.background = '#3498db';
            }, 200);
        });
    });

    // 統計數字動畫
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // 打字機效果（可選）
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // 延遲開始打字機效果
        setTimeout(typeWriter, 1000);
    }
});

// 輔助函數
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加樣式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 根據類型設置背景色
    switch(type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        case 'info':
            notification.style.background = '#3498db';
            break;
        default:
            notification.style.background = '#95a5a6';
    }
    
    // 添加到頁面
    document.body.appendChild(notification);
    
    // 顯示動畫
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function animateNumber(element) {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2秒
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }, 16);
}

// 頁面載入完成後的初始化
window.addEventListener('load', function() {
    // 添加載入完成的動畫
    document.body.classList.add('loaded');
    
    // 預載入圖片（如果有）
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// 滾動到頂部按鈕
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    `;
    
    document.body.appendChild(button);
    
    // 滾動顯示/隱藏按鈕
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // 點擊滾動到頂部
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 懸停效果
    button.addEventListener('mouseenter', function() {
        this.style.background = '#2980b9';
        this.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.background = '#3498db';
        this.style.transform = 'scale(1)';
    });
}

// 創建滾動到頂部按鈕
createScrollToTopButton();

// 鍵盤導航支持
document.addEventListener('keydown', function(e) {
    // ESC 鍵關閉手機版選單
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// 性能優化：防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 優化滾動事件
const optimizedScrollHandler = debounce(function() {
    // 滾動相關的處理邏輯
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// GitHub API 功能
async function fetchGitHubRepos() {
    try {
        showLoadingState();
        
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // 過濾掉 fork 的倉庫（可選）
        const filteredRepos = repos.filter(repo => !repo.fork);
        
        // 按星數和更新時間排序
        filteredRepos.sort((a, b) => {
            const scoreA = a.stargazers_count * 2 + (new Date(a.updated_at).getTime() / 1000000);
            const scoreB = b.stargazers_count * 2 + (new Date(b.updated_at).getTime() / 1000000);
            return scoreB - scoreA;
        });
        
        projects = filteredRepos.slice(0, 10); // 只顯示前10個專案
        totalSlides = Math.ceil(projects.length / getSlidesPerView());
        
        renderProjects();
        setupSliderControls();
        hideLoadingState();
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        showErrorState();
    }
}

function getSlidesPerView() {
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
}

function renderProjects() {
    const track = document.getElementById('projects-track');
    track.innerHTML = '';
    
    projects.forEach((repo, index) => {
        const projectCard = createProjectCard(repo, index);
        track.appendChild(projectCard);
    });
    
    updateSliderPosition();
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.index = index;
    
    // 獲取語言顏色
    const languageColor = getLanguageColor(repo.language);
    
    card.innerHTML = `
        <div class="project-image" style="background: ${languageColor}">
            <div class="project-icon">
                <i class="fab fa-github"></i>
            </div>
        </div>
        <div class="project-content">
            <h3>
                <i class="fab fa-github repo-icon"></i>
                ${repo.name}
            </h3>
            <p class="project-description">
                ${repo.description || '沒有描述'}
            </p>
            <div class="project-stats">
                <div class="project-stat">
                    <i class="fas fa-star"></i>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="project-stat">
                    <i class="fas fa-code-branch"></i>
                    <span>${repo.forks_count}</span>
                </div>
                <div class="project-stat">
                    <i class="fas fa-eye"></i>
                    <span>${repo.watchers_count}</span>
                </div>
            </div>
            <div class="project-tech">
                ${repo.language ? `<span>${repo.language}</span>` : ''}
                ${repo.topics ? repo.topics.slice(0, 3).map(topic => `<span>${topic}</span>`).join('') : ''}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> 程式碼
                </a>
                <button class="project-link readme-btn" onclick="showReadme('${repo.name}')">
                    <i class="fas fa-book"></i> README
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': 'linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%)',
        'TypeScript': 'linear-gradient(135deg, #3178c6 0%, #4d7cff 100%)',
        'Python': 'linear-gradient(135deg, #3776ab 0%, #4b8bbe 100%)',
        'Java': 'linear-gradient(135deg, #ed8b00 0%, #f89820 100%)',
        'C++': 'linear-gradient(135deg, #00599c 0%, #004482 100%)',
        'C#': 'linear-gradient(135deg, #239120 0%, #2d9a2d 100%)',
        'PHP': 'linear-gradient(135deg, #777bb4 0%, #8892be 100%)',
        'Ruby': 'linear-gradient(135deg, #cc342d 0%, #e74c3c 100%)',
        'Go': 'linear-gradient(135deg, #00add8 0%, #00d4aa 100%)',
        'Rust': 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        'HTML': 'linear-gradient(135deg, #e34f26 0%, #f16529 100%)',
        'CSS': 'linear-gradient(135deg, #1572b6 0%, #33a9dc 100%)',
        'Vue': 'linear-gradient(135deg, #4fc08d 0%, #42b883 100%)',
        'React': 'linear-gradient(135deg, #61dafb 0%, #21d4fd 100%)',
        'Angular': 'linear-gradient(135deg, #dd0031 0%, #c3002f 100%)',
        'Node.js': 'linear-gradient(135deg, #339933 0%, #68a063 100%)',
        'Swift': 'linear-gradient(135deg, #fa7343 0%, #ff6b35 100%)',
        'Kotlin': 'linear-gradient(135deg, #7f52ff 0%, #9c88ff 100%)',
        'Dart': 'linear-gradient(135deg, #0175c2 0%, #02569b 100%)',
        'Shell': 'linear-gradient(135deg, #89e051 0%, #7cb342 100%)',
        'Dockerfile': 'linear-gradient(135deg, #2496ed 0%, #0db7ed 100%)',
        'YAML': 'linear-gradient(135deg, #cb171e 0%, #e53935 100%)',
        'JSON': 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        'Markdown': 'linear-gradient(135deg, #083fa1 0%, #1976d2 100%)'
    };
    
    return colors[language] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

function setupSliderControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');
    
    // 清空現有的點
    dotsContainer.innerHTML = '';
    
    // 創建滑動點
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // 設置按鈕事件
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    // 觸控支持
    let startX = 0;
    let isDragging = false;
    const track = document.getElementById('projects-track');
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
        }
    });
    
    // 鍵盤支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
        }
    });
}

function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    
    currentSlide = slideIndex;
    updateSliderPosition();
    updateSliderControls();
}

function updateSliderPosition() {
    const track = document.getElementById('projects-track');
    const slidesPerView = getSlidesPerView();
    const cardWidth = 350 + 32; // 卡片寬度 + gap
    const translateX = -currentSlide * slidesPerView * cardWidth;
    
    track.style.transform = `translateX(${translateX}px)`;
}

function updateSliderControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.slider-dot');
    
    // 更新按鈕狀態
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
    
    // 更新點狀態
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// README 查看器功能
async function showReadme(repoName) {
    try {
        const modal = document.getElementById('readme-modal');
        const modalTitle = document.getElementById('modal-title');
        const readmeContent = document.getElementById('readme-content');
        
        modalTitle.textContent = `${repoName} - README`;
        readmeContent.innerHTML = '<div class="loading-spinner"></div><p>正在載入 README...</p>';
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 獲取 README 內容
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const readmeData = await response.json();
        const readmeText = atob(readmeData.content);
        
        // 將 Markdown 轉換為 HTML
        const htmlContent = convertMarkdownToHtml(readmeText);
        readmeContent.innerHTML = htmlContent;
        
    } catch (error) {
        console.error('Error fetching README:', error);
        document.getElementById('readme-content').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>無法載入 README 內容</p>
            </div>
        `;
    }
}

function convertMarkdownToHtml(markdown) {
    // 簡單的 Markdown 轉 HTML 轉換器
    let html = markdown
        // 標題
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // 粗體和斜體
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        
        // 程式碼塊
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        
        // 連結
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
        
        // 圖片
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
        
        // 列表
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        
        // 引用
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        
        // 水平線
        .replace(/^---$/gim, '<hr>')
        
        // 段落
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<[h|p|l|b|d|i|s|h])(.*$)/gim, '<p>$1</p>');
    
    // 包裝列表項目
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    
    return html;
}

// 模態框控制
function setupModalControls() {
    const modal = document.getElementById('readme-modal');
    const closeBtn = document.getElementById('close-modal');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 鍵關閉模態框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('readme-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 狀態管理
function showLoadingState() {
    document.getElementById('projects-loading').style.display = 'block';
    document.getElementById('projects-error').style.display = 'none';
    document.getElementById('projects-container').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('projects-loading').style.display = 'none';
    document.getElementById('projects-container').style.display = 'block';
}

function showErrorState() {
    document.getElementById('projects-loading').style.display = 'none';
    document.getElementById('projects-error').style.display = 'block';
    document.getElementById('projects-container').style.display = 'none';
}

// 重新載入功能
function setupRetryButton() {
    const retryBtn = document.getElementById('retry-loading');
    retryBtn.addEventListener('click', fetchGitHubRepos);
}

// 視窗大小改變時重新計算
window.addEventListener('resize', debounce(() => {
    if (projects.length > 0) {
        totalSlides = Math.ceil(projects.length / getSlidesPerView());
        currentSlide = Math.min(currentSlide, totalSlides - 1);
        updateSliderPosition();
        setupSliderControls();
    }
}, 250));

// 初始化 GitHub 功能
function initGitHubFeatures() {
    setupModalControls();
    setupRetryButton();
    fetchGitHubRepos();
}

// 在頁面載入完成後初始化 GitHub 功能
window.addEventListener('load', initGitHubFeatures);
