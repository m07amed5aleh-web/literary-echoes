document.addEventListener('DOMContentLoaded', () => {
    // كود الفايربيز الخاص بمشروع أصداء أدبية لـ مازن
    const firebaseConfig = {
        apiKey: "AIzaSyB0OU03V2uImKXeV78TtvCqNUyNMgkbnkc",
        authDomain: "asdaa-adabia.firebaseapp.com",
        databaseURL: "https://asdaa-adabia-default-rtdb.firebaseio.com/", // تم صياغة رابط قاعدة البيانات ليعمل تلقائياً
        projectId: "asdaa-adabia",
        storageBucket: "asdaa-adabia.firebasestorage.app",
        messagingSenderId: "266250125448",
        appId: "1:266250125448:web:15490be2f2171a23f39f3d",
        measurementId: "G-L49TEDQ3E5"
    };
    
    // تهيئة الفايربيز
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // كلمة سر لوحة الإدارة الأساسية الحالية
    const ADMIN_PASSWORD = "saleh_admin_2026";
    
    // عناصر الواجهة
    const themeToggle = document.getElementById('theme-toggle');
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin-btn');
    const closeModal = document.querySelector('.close-modal');
    const worksGrid = document.getElementById('dynamic-works');
    const addForm = document.getElementById('add-article-form');
    const filterButtons = document.querySelectorAll('.tag-btn');
    const readingProgress = document.getElementById('reading-progress');
    const ambientContainer = document.getElementById('ambient-container');

    // 1. تأثير الريش العائم
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

    // 2. أنيميشن الآلة الكاتبة
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

    // 4. شريط تقدم القراءة
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

    // 6. التحكم بالنافذة المنبثقة
    openAdminBtn.addEventListener('click', () => adminModal.classList.add('open'));
    closeModal.addEventListener('click', () => adminModal.classList.remove('open'));
    window.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.classList.remove('open'); });

    // 7. دالة حساب وقت القراءة
    function calculateReadTime(text) {
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / 150) || 1;
    }

    // 8. عرض المقالات مباشرة وجلبها من سيرفر Firebase
    function displayArticles(filterCategory = 'all') {
        worksGrid.innerHTML = `<p style="text-align:center; color:var(--light-text); grid-column: 1/-1; padding: 2rem;">جاري تحميل الكلمات الأدبية...</p>`;
        
        db.ref('articles').once('value', (snapshot) => {
            worksGrid.innerHTML = '';
            let articles = [];
            
            snapshot.forEach((childSnapshot) => {
                articles.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            articles.reverse(); // ترتيب من الأحدث للأقدم

            const filtered = filterCategory === 'all' ? articles : articles.filter(a => a.category === filterCategory);

            if(filtered.length === 0) {
                worksGrid.innerHTML = `<p style="text-align:center; color:var(--light-text); grid-column: 1/-1; padding: 2rem;">لا توجد أعمال في هذا القسم حالياً.</p>`;
                return;
            }

            filtered.forEach((article) => {
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
                    
                    <button onclick="deleteArticle('${article.id}')" style="position: absolute; top: 15px; left: 15px; background: none; border: none; color: var(--accent-color); cursor: pointer; font-size: 0.9rem; opacity: 0.3; transition: 0.3s;"><i class="fas fa-trash"></i></button>
                `;

                card.addEventListener('mouseenter', () => card.querySelector('.fa-trash').parentElement.style.opacity = '1');
                card.addEventListener('mouseleave', () => card.querySelector('.fa-trash').parentElement.style.opacity = '0.3');

                const textEl = card.querySelector('.article-text');
                let currentSize = 15.5;
                card.querySelector('.font-inc').addEventListener('click', () => { if(currentSize < 24) { currentSize += 1.5; textEl.style.fontSize = currentSize + 'px'; } });
                card.querySelector('.font-dec').addEventListener('click', () => { if(currentSize > 12) { currentSize -= 1.5; textEl.style.fontSize = currentSize + 'px'; } });

                worksGrid.appendChild(card);
            });
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

    // 10. نموذج إضافة العمل الجديد ورفعه للسيرفر
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
            
            db.ref('articles').push(newArticle)
                .then(() => {
                    addForm.reset();
                    adminModal.classList.remove('open');
                    alert('تم نشر وتأمين العمل الأدبي الجديد على السيرفر بنجاح فائق! 🎉');
                    document.querySelector('[data-filter="all"]').click();
                })
                .catch((error) => {
                    alert('حدث خطأ أثناء النشر: ' + error.message);
                });
        });
    }

    // 11. دالة الحذف النهائي من سيرفر الفايربيز
    window.deleteArticle = function(id) {
        const pass = prompt('أدخل كلمة المرور لتأكيد حذف هذا العمل نهائياً من السيرفر:');
        if (pass === ADMIN_PASSWORD) {
            db.ref('articles/' + id).remove()
                .then(() => {
                    const activeTag = document.querySelector('.tag-btn.active').getAttribute('data-filter');
                    displayArticles(activeTag);
                });
        } else if (pass !== null) { 
            alert('كلمة المرور خاطئة!'); 
        }
    };

    displayArticles();
});