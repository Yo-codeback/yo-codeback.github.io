// GitHub API 配置
const GITHUB_USERNAME = 'Yo-codeback';
const GITHUB_API_BASE = 'https://api.github.com';

// 專案滑動器狀態
let currentSlide = 0;
let totalSlides = 0;
let projects = [];
let autoplayTimer = null;
const AUTOPLAY_INTERVAL_MS = 4000;

// 導航欄功能
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');

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
        if (!navbar) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const lightBg = 'rgba(255, 255, 255, 0.95)';
        const darkBg = 'rgba(21, 27, 35, 0.85)';
        if (window.scrollY > 100) {
            navbar.style.background = isDark ? darkBg : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = isDark ? darkBg : lightBg;
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
            // 添加點擊動畫
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // 檢查是否有有效的 href 屬性
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // 如果有有效連結，允許正常跳轉
                return true;
            } else {
                // 如果沒有有效連結，阻止跳轉並顯示通知
                e.preventDefault();
                const platform = this.classList[1]; // 獲取平台名稱
                showNotification(`即將跳轉到 ${this.querySelector('span').textContent}`, 'info');
            }
        });
    });

    // 技能項目點擊效果
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

    // 主題切換
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        // 觸發一次滾動處理，更新 navbar 背景
        window.dispatchEvent(new Event('scroll'));
    }

    function initTheme() {
        const saved = localStorage.getItem('preferred-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        applyTheme(theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('preferred-theme', next);
            applyTheme(next);
        });
    }

    initTheme();
});

// 輔助函數
function updateProjectStats(totalRepos, filteredRepos) {
    // 更新關於我區域的統計數據
    const stats = document.querySelectorAll('.stat');
    if (stats.length >= 3) {
        // 更新專案數量統計
        stats[1].querySelector('h3').textContent = `${filteredRepos}+`;
        stats[1].querySelector('p').textContent = '完成專案';
        
        // 可以添加更多統計資訊
        console.log(`總倉庫數: ${totalRepos}, 顯示專案數: ${filteredRepos}`);
    }
}

async function fetchDetailedStats() {
    try {
        // 獲取用戶詳細資訊
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        if (userResponse.ok) {
            const userData = await userResponse.json();
            
            // 更新統計數據
            const stats = document.querySelectorAll('.stat');
            if (stats.length >= 3) {
                // 更新年開發經驗（從2021年開始）
                const currentYear = new Date().getFullYear();
                const startYear = 2021;
                const yearsOfExperience = currentYear - startYear;
                stats[0].querySelector('h3').textContent = `${yearsOfExperience}+`;
                stats[0].querySelector('p').textContent = '年開發經驗';
                
                // 更新技術棧數量（基於使用的語言）
                const languagesResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`);
                if (languagesResponse.ok) {
                    const allRepos = await languagesResponse.json();
                    const languageCounts = {};
                    
                    // 統計每種語言的使用次數
                    allRepos.forEach(repo => {
                        if (repo.language) {
                            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
                        }
                    });
                    
                    // 只計算使用次數大於1的語言（表示真正掌握的技術）
                    const significantLanguages = Object.keys(languageCounts).filter(lang => languageCounts[lang] > 1);
                    
                    stats[2].querySelector('h3').textContent = `${significantLanguages.length}+`;
                    stats[2].querySelector('p').textContent = '技術棧';
                    
                    console.log('語言統計:', languageCounts);
                    console.log('主要技術棧:', significantLanguages);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching detailed stats:', error);
    }
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

    // 載入 MC 插件資料
    initPlugins();
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
        
        // 過濾掉 fork 的倉庫和特定倉庫
        const filteredRepos = repos.filter(repo => {
            return !repo.fork && 
                   !repo.name.includes('yo-codeback.github.io') && // 排除這個網站本身
                   repo.name !== '.github' && // 排除 GitHub 配置倉庫
                   repo.description; // 只顯示有描述的專案
        });
        
        // 按星數、更新時間和大小排序
        filteredRepos.sort((a, b) => {
            const scoreA = (a.stargazers_count * 3) + 
                          (a.forks_count * 2) + 
                          (new Date(a.updated_at).getTime() / 1000000) +
                          (a.size / 1000); // 專案大小作為加分項
            const scoreB = (b.stargazers_count * 3) + 
                          (b.forks_count * 2) + 
                          (new Date(b.updated_at).getTime() / 1000000) +
                          (b.size / 1000);
            return scoreB - scoreA;
        });
        
        projects = filteredRepos.slice(0, 12); // 顯示前12個專案
        if (projects.length === 0) {
            showEmptyState();
            return;
        }
        totalSlides = Math.ceil(projects.length / getSlidesPerView());
        
        // 更新統計數據
        updateProjectStats(repos.length, filteredRepos.length);
        
        // 獲取更詳細的統計資訊
        fetchDetailedStats();
        
        renderProjects();
        setupSliderControls();
        hideLoadingState();
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        showErrorState();
    }
}

function getSlidesPerView() {
    // 每頁顯示一個
    return 1;
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
    
    // 格式化更新時間
    const updatedDate = new Date(repo.updated_at);
    const timeAgo = getTimeAgo(updatedDate);
    
    // 獲取專案大小
    const sizeKB = Math.round(repo.size / 1024);
    const sizeText = sizeKB > 1024 ? `${Math.round(sizeKB / 1024)}MB` : `${sizeKB}KB`;
    
    // 檢查是否有 GitHub Pages
    const hasPages = repo.has_pages;
    const liveUrl = hasPages ? `https://${GITHUB_USERNAME}.github.io/${repo.name}` : null;
    
    const homepageBadge = repo.homepage ? `<span class="meta-badge"><i class='fas fa-home'></i> 首頁</span>` : '';
    const licenseBadge = repo.license && repo.license.spdx_id ? `<span class="meta-badge"><i class='fas fa-scale-balanced'></i> ${repo.license.spdx_id}</span>` : '';
    const topicsHtml = repo.topics ? repo.topics.slice(0, 4).map(topic => `<span>${topic}</span>`).join('') : '';
    const stars = formatNumber(repo.stargazers_count);
    const forks = formatNumber(repo.forks_count);
    const watchers = formatNumber(repo.watchers_count);

    card.innerHTML = `
        <div class="project-image" style="background: ${languageColor}">
            <div class="project-icon">
                <i class="fab fa-github"></i>
            </div>
            ${repo.language ? `<div class="language-badge">${repo.language}</div>` : ''}
        </div>
        <div class="project-content">
            <div class="project-header">
                <img class="owner-avatar" src="https://avatars.githubusercontent.com/u/${repo.owner?.id || ''}?s=64" alt="avatar" loading="lazy" />
                <h3>
                    <i class="fab fa-github repo-icon"></i>
                    ${repo.name}
                </h3>
            </div>
            <div class="meta-badges">${homepageBadge}${licenseBadge}</div>
            <p class="project-description">
                ${repo.description || '沒有描述'}
            </p>
            <div class="project-stats">
                <div class="project-stat" title="星數">
                    <i class="fas fa-star"></i>
                    <span>${stars}</span>
                </div>
                <div class="project-stat" title="分支數">
                    <i class="fas fa-code-branch"></i>
                    <span>${forks}</span>
                </div>
                <div class="project-stat" title="觀看數">
                    <i class="fas fa-eye"></i>
                    <span>${watchers}</span>
                </div>
                <div class="project-stat" title="專案大小">
                    <i class="fas fa-weight"></i>
                    <span>${sizeText}</span>
                </div>
            </div>
            <div class="project-meta">
                <span class="update-time">
                    <i class="fas fa-clock"></i>
                    更新於 ${timeAgo}
                </span>
            </div>
            <div class="project-tech">
                ${repo.language ? `<span class="main-language">${repo.language}</span>` : ''}
                ${topicsHtml}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> 程式碼
                </a>
                ${liveUrl ? `
                    <a href="${liveUrl}" target="_blank" class="project-link live-btn">
                        <i class="fas fa-external-link-alt"></i> 預覽
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return '剛剛';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} 分鐘前`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} 小時前`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} 天前`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} 個月前`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} 年前`;
    }
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

    // 懸停暫停/離開繼續
    const slider = document.querySelector('.projects-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
    }
}

function goToSlide(slideIndex) {
    // 循環
    if (slideIndex < 0) {
        currentSlide = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
        currentSlide = 0;
    } else {
        currentSlide = slideIndex;
    }
    updateSliderPosition();
    updateSliderControls();
}

function updateSliderPosition() {
    const track = document.getElementById('projects-track');
    const slider = document.querySelector('.projects-slider');
    const sliderWidth = slider ? slider.clientWidth : window.innerWidth;
    const translateX = -currentSlide * sliderWidth;
    
    track.style.transform = `translateX(${translateX}px)`;
}

function updateSliderControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.slider-dot');
    
    // 循環播放：按鈕永遠可用
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // 更新點狀態
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}




// 狀態管理
function showLoadingState() {
    document.getElementById('projects-loading').style.display = 'block';
    document.getElementById('projects-error').style.display = 'none';
    document.getElementById('projects-empty').style.display = 'none';
    document.getElementById('projects-container').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('projects-loading').style.display = 'none';
    document.getElementById('projects-container').style.display = 'block';
}

function showErrorState() {
    document.getElementById('projects-loading').style.display = 'none';
    document.getElementById('projects-error').style.display = 'block';
    document.getElementById('projects-empty').style.display = 'none';
    document.getElementById('projects-container').style.display = 'none';
}

function showEmptyState() {
    document.getElementById('projects-loading').style.display = 'none';
    document.getElementById('projects-error').style.display = 'none';
    document.getElementById('projects-empty').style.display = 'block';
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
    setupRetryButton();
    fetchGitHubRepos();
}

// 在頁面載入完成後初始化 GitHub 功能
window.addEventListener('load', initGitHubFeatures);

// 工具：數字縮寫
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(num);
}

// 自動輪播
function startAutoplay() {
    stopAutoplay();
    if (totalSlides <= 1) return;
    autoplayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, AUTOPLAY_INTERVAL_MS);
}

function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

// 在專案渲染完成後啟動
const originalRenderProjects = renderProjects;
renderProjects = function() {
    originalRenderProjects();
    totalSlides = Math.ceil(projects.length / getSlidesPerView());
    startAutoplay();
};

// 頁面可見性改變時暫停/恢復
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
});

// ======================
// MC 插件：載入與渲染
// ======================
async function fetchPlugins() {
    const res = await fetch('plugins.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

function showPluginsLoading() {
    const l = document.getElementById('plugins-loading');
    const e = document.getElementById('plugins-error');
    const n = document.getElementById('plugins-empty');
    const g = document.getElementById('plugins-grid');
    if (l) l.style.display = 'block';
    if (e) e.style.display = 'none';
    if (n) n.style.display = 'none';
    if (g) g.style.display = 'none';
}

function showPluginsError() {
    const l = document.getElementById('plugins-loading');
    const e = document.getElementById('plugins-error');
    const n = document.getElementById('plugins-empty');
    const g = document.getElementById('plugins-grid');
    if (l) l.style.display = 'none';
    if (e) e.style.display = 'block';
    if (n) n.style.display = 'none';
    if (g) g.style.display = 'none';
}

function showPluginsEmpty() {
    const l = document.getElementById('plugins-loading');
    const e = document.getElementById('plugins-error');
    const n = document.getElementById('plugins-empty');
    const g = document.getElementById('plugins-grid');
    if (l) l.style.display = 'none';
    if (e) e.style.display = 'none';
    if (n) n.style.display = 'block';
    if (g) g.style.display = 'none';
}

function showPluginsGrid() {
    const l = document.getElementById('plugins-loading');
    const e = document.getElementById('plugins-error');
    const n = document.getElementById('plugins-empty');
    const g = document.getElementById('plugins-grid');
    if (l) l.style.display = 'none';
    if (e) e.style.display = 'none';
    if (n) n.style.display = 'none';
    if (g) g.style.display = 'grid';
}

function createPluginCard(p) {
    const card = document.createElement('article');
    card.className = 'plugin-card';
    const badges = (p.badges || []).map(b => `<span><i class="fas fa-circle-notch"></i> ${b}</span>`).join('');
    const links = `
        ${p.links?.repo ? `<a class="plugin-link" href="${p.links.repo}" target="_blank"><i class="fab fa-github"></i> 程式碼</a>` : ''}
        ${p.links?.download ? `<a class="plugin-link live-btn" href="${p.links.download}" target="_blank"><i class="fas fa-download"></i> 下載</a>` : ''}
        ${p.links?.docs ? `<a class="plugin-link" href="${p.links.docs}" target="_blank"><i class="fas fa-file-alt"></i> 文件</a>` : ''}
    `;
    card.innerHTML = `
        <div class="plugin-header">
            <h3><i class="fas fa-cube"></i> ${p.name}</h3>
            <span class="plugin-tag">${p.platform || ''}</span>
        </div>
        <p class="plugin-desc">${p.description || ''}</p>
        <div class="plugin-meta">${badges}</div>
        <div class="plugin-links">${links}</div>
    `;
    return card;
}

async function initPlugins() {
    try {
        showPluginsLoading();
        const list = await fetchPlugins();
        if (!Array.isArray(list) || list.length === 0) {
            showPluginsEmpty();
            return;
        }
        const grid = document.getElementById('plugins-grid');
        grid.innerHTML = '';
        list.forEach(p => grid.appendChild(createPluginCard(p)));
        showPluginsGrid();
    } catch (err) {
        console.error('載入 plugins.json 失敗:', err);
        showPluginsError();
    }
}
