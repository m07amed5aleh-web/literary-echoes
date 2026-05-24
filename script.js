document.addEventListener('DOMContentLoaded', () => {
    // الرقم السري الأساسي الجديد لـ لوحة التحكم (تقدر تغيره من هنا علطول)
    const ADMIN_PASSWORD = "saleh_admin_2026";
    
    // الأقسام وعناصر واجهة المستخدم
    const themeToggle = document.getElementById('theme-toggle');
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin-btn');
    const closeModal = document.querySelector('.close-modal');
    const worksGrid = document.getElementById('dynamic-works');
    const addForm = document.getElementById('add-article-form');
    const filterButtons = document.querySelectorAll('.tag-btn');
    const readingProgress = document.getElementById('reading-progress');
    const ambientContainer = document.getElementById('ambient-container');

    // ==========================================
    // 1. تأثير الريش العائم الشاعري في الخلفية
    // ==========================================
    const icons = ['fa-feather', 'fa-leaf', 'fa-pen-nib'];
    function createAmbientItem() {
        if (ambientContainer.childElementCount > 15) return; 
        const item = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        item.className = `fas ${randomIcon} ambient-item`;
        
        item.style.left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 8 + 6; 
        item.style.animationDuration = duration + 's';
        item.style.fontSize = Math.random() * 15 + 10 + 'px';
        
        ambientContainer.appendChild(item);
        setTimeout(() => { item.remove(); }, duration * 1000);
    }
    setInterval(createAmbientItem, 1200);

    // ==========================================
    // 2. أنيميشن الآلة الكاتبة الذكي (Typewriter)
    // ==========================================
    const heroTitle = "مرحباً بك في أصداء أدبية ✒️";
    const typewriterEl = document.getElementById('typewriter-text');
    let charIndex = 0;
    function typeEffect() {
        if (charIndex < heroTitle.length) {
            typewriterEl.textContent += heroTitle.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, 90); 
        }
    }
    typeEffect();

    // 3. حماية المحتوى الفكرية والأدبية ضد النسخ والسرقة
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert('حقوق الكاتب محفوظة ومؤمنة تماماً ضد النسخ والسرقة 🔒');
    });
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
        }
    });

    // 4. شريط تقدم القراءة في أعلى المتصفح
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        readingProgress.style.width = scrolled + '%';
    });

    // 5. تبديل الوضع الليلي والنهاري
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // 6. التحكم بالنافذة المنبثقة للوحة الإدارة
    openAdminBtn.addEventListener('click', () => adminModal.classList.add('open'));
    closeModal.addEventListener('click', () => adminModal.classList.remove('open'));
    window.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.classList.remove('open'); });

    // 7. دالة حساب وقت القراءة المتوقع
    function calculateReadTime(text) {
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / 150) || 1;
    }

    // 8. عرض المقالات بشكل كروت زجاجية (تبدأ نظيفة وفارغة في أول إطلاق للموقع الفعلي)
    function displayArticles(filterCategory = 'all') {
        let articles = JSON.parse(localStorage.getItem('asdaa_articles')) || [];

        worksGrid.innerHTML = '';
        const filtered = filterCategory === 'all' ? articles : articles.filter(a => a.category === filterCategory);

        if(filtered.length === 0) {
            worksGrid.innerHTML = `<p style="text-align:center; color:var(--light-text); grid-column: 1/-1; padding: 2rem;">لا توجد أعمال في هذا القسم حالياً.</p>`;
            return;
        }

        filtered.forEach((article, index) => {
            const readTime = calculateReadTime(article.content);
            const card = document.createElement('article');
            card.className = 'work-card glass-effect';
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; color: var(--light-text); font-size: 0.8rem; margin-bottom: 12px;">
                    <span><i class="fas fa-bookmark"></i> ${article.category}</span>
                    <span><i class="far fa-clock"></i> قراءة: ${readTime} د</span>
                </div>
                <h3>${article.title}</h3>
                <p class="article-text">${article.content}</p>
                
                <div class="card-tools">
                    <div class="font-tools">
                        <button class="font-inc" title="تكبير الخط"><i class="fas fa-plus"></i></button>
                        <button class="font-dec" title="تصغير الخط"><i class="fas fa-minus"></i></button>
                    </div>
                    <span style="font-size:0.8rem; color:var(--light-text); font-weight: 600;">${article.date}</span>
                </div>
                
                <button onclick="deleteArticle(${index})" style="position: absolute; top: 15px; left: 15px; background: none; border: none; color: var(--accent-color); cursor: pointer; font-size: 0.9rem; opacity: 0.3; transition: 0.3s;"><i class="fas fa-trash"></i></button>
            `;

            // تفاعل زر السلة عند تمرير الماوس
            card.addEventListener('mouseenter', () => card.querySelector('.fa-trash').parentElement.style.opacity = '1');
            card.addEventListener('mouseleave', () => card.querySelector('.fa-trash').parentElement.style.opacity = '0.3');

            // التحكم الذكي بحجم خط قراءة النصوص
            const textEl = card.querySelector('.article-text');
            let currentSize = 15.5;
            card.querySelector('.font-inc').addEventListener('click', () => { if(currentSize < 24) { currentSize += 1.5; textEl.style.fontSize = currentSize + 'px'; } });
            card.querySelector('.font-dec').addEventListener('click', () => { if(currentSize > 12) { currentSize -= 1.5; textEl.style.fontSize = currentSize + 'px'; } });

            worksGrid.appendChild(card);
        });
    }

    // 9. أزرار الفلترة والتصنيف للزوار
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayArticles(btn.getAttribute('data-filter'));
        });
    });

    // 10. نموذج إضافة وتأمين العمل الجديد للكاتب
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const passwordInput = document.getElementById('admin-pass').value;
            const categoryInput = document.getElementById('article-category').value;
            const titleInput = document.getElementById('article-title').value;
            const contentInput = document.getElementById('article-content').value;

            if (passwordInput !== ADMIN_PASSWORD) {
                alert('عذراً، كلمة المرور خاطئة!');
                return;
            }

            const newArticle = { 
                title: titleInput, 
                content: contentInput, 
                category: categoryInput, 
                date: new Date().toLocaleDateString('ar-EG') 
            };
            
            let articles = JSON.parse(localStorage.getItem('asdaa_articles')) || [];
            articles.unshift(newArticle);
            localStorage.setItem('asdaa_articles', JSON.stringify(articles));

            addForm.reset();
            adminModal.classList.remove('open');
            alert('تم نشر وتأمين العمل الأدبي الجديد بنجاح فائق! 🎉');
            document.querySelector('[data-filter="all"]').click();
        });
    }

    // 11. دالة الحذف الآمن للمشرف
    window.deleteArticle = function(index) {
        const pass = prompt('أدخل كلمة المرور لتأكيد حذف هذا العمل نهائياً:');
        if (pass === ADMIN_PASSWORD) {
            let articles = JSON.parse(localStorage.getItem('asdaa_articles'));
            articles.splice(index, 1);
            localStorage.setItem('asdaa_articles', JSON.stringify(articles));
            const activeTag = document.querySelector('.tag-btn.active').getAttribute('data-filter');
            displayArticles(activeTag);
        } else if (pass !== null) { 
            alert('كلمة المرور خاطئة!'); 
        }
    };

    displayArticles();
});