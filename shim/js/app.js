/**
 * 봄날의 디지털 동행 - 메인 인터랙션 스크립트 (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 벚꽃잎 흩날림 엔진 초기화
    let petalsInstance = null;
    if (window.SpringPetals && document.getElementById('petalsCanvas')) {
        petalsInstance = new SpringPetals('petalsCanvas');
    }

    const togglePetalsBtn = document.getElementById('togglePetalsBtn');
    if (togglePetalsBtn && petalsInstance) {
        togglePetalsBtn.addEventListener('click', () => {
            const isRunning = petalsInstance.toggle();
            togglePetalsBtn.innerHTML = isRunning 
                ? '🌸 <span>꽃잎 끄기</span>' 
                : '🌱 <span>꽃잎 켜기</span>';
            showToast(isRunning ? '따스한 봄꽃잎이 다시 흩날립니다 🌸' : '꽃잎 효과가 잠시 멈췄습니다 🍃');
        });
    }

    // 2. 시니어 접근성 글자 크기 조절 기능 (Font Zoom)
    const zoomButtons = document.querySelectorAll('.btn-zoom');
    const savedZoom = localStorage.getItem('senior_font_zoom') || 'standard';

    function setFontZoom(zoomLevel) {
        document.body.classList.remove('font-zoom-1', 'font-zoom-2', 'font-zoom-3');
        zoomButtons.forEach(btn => btn.classList.remove('active'));

        if (zoomLevel === '1') {
            document.body.classList.add('font-zoom-1');
        } else if (zoomLevel === '2') {
            document.body.classList.add('font-zoom-2');
        } else if (zoomLevel === '3') {
            document.body.classList.add('font-zoom-3');
        }

        const activeBtn = document.querySelector(`.btn-zoom[data-zoom="${zoomLevel}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        localStorage.setItem('senior_font_zoom', zoomLevel);
    }

    // 초기 글자 크기 로드
    setFontZoom(savedZoom);

    zoomButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.getAttribute('data-zoom');
            setFontZoom(level);
            
            const messages = {
                'standard': '글자 크기가 [기본]으로 설정되었습니다.',
                '1': '글자 크기가 [크게] 확대되었습니다.',
                '2': '글자 크기가 [더 크게] 확대되었습니다.',
                '3': '글자 크기가 [아주 크게] 확대되었습니다.'
            };
            showToast(messages[level] || '글자 크기가 변경되었습니다.');
        });
    });

    // 3. 헤더 스크롤 효과 & 맨 위로 가기 버튼
    const header = document.querySelector('.site-header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. 활약상 갤러리 카테고리 필터링
    const filterBtns = document.querySelectorAll('.filter-btn');
    const activityCards = document.querySelectorAll('.activity-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            activityCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. 강의 문의 모달 팝업 제어
    const inquiryModal = document.getElementById('inquiryModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const currInquiryBtns = document.querySelectorAll('.btn-curr-inquiry');
    const modalCourseTitle = document.getElementById('modalCourseTitle');

    function openModal(courseName = '') {
        if (inquiryModal) {
            if (modalCourseTitle && courseName) {
                modalCourseTitle.textContent = `[${courseName}] 과정 문의`;
                const courseSelect = document.getElementById('inquiryCourseSelect');
                if (courseSelect) {
                    for (let i = 0; i < courseSelect.options.length; i++) {
                        if (courseSelect.options[i].text.includes(courseName)) {
                            courseSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
            inquiryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (inquiryModal) {
            inquiryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    currInquiryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const courseName = btn.getAttribute('data-course') || '';
            openModal(courseName);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (inquiryModal) {
        inquiryModal.addEventListener('click', (e) => {
            if (e.target === inquiryModal) {
                closeModal();
            }
        });
    }

    // 6. 강의 의뢰 폼 전송 핸들러
    const contactForm = document.getElementById('mainContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const org = document.getElementById('contactOrg').value.trim();
            
            showToast(`🌸 ${name}님, 소중한 강의 문의가 따뜻하게 접수되었습니다.`);
            contactForm.reset();
        });
    }

    const modalForm = document.getElementById('modalContactForm');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal();
            showToast('🌸 강의 문의가 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.');
            modalForm.reset();
        });
    }

    // 7. 봄날 방명록 (LocalStorage 기반 실시간 등록 및 공감)
    const initialGuestbook = [
        {
            id: 1,
            name: '박옥순 어르신 (74세)',
            role: '복지관 스마트폰반 수료생',
            msg: '선생님 덕분에 손주 녀석한테 예쁜 꽃사진이랑 이모티콘 매일 보냅니다. 제 노년에 찾아온 따뜻한 봄날입니다!',
            date: '2026.04.12',
            likes: 12
        },
        {
            id: 2,
            name: '김영수 평생학습관 팀장',
            role: '강의 의뢰 기관 담당자',
            msg: '어르신들이 가장 기다리시는 최고의 명강사님이십니다. 귀에 쏙쏙 들어오는 설명과 다정함에 항상 감동받습니다.',
            date: '2026.05.03',
            likes: 19
        },
        {
            id: 3,
            name: '이종철 어르신 (81세)',
            role: 'AI 디지털 친구반 수료생',
            msg: '챗GPT로 손주에게 들려줄 옛날이야기를 써보았네요. 세상이 이렇게 재미있는 줄 80 넘어 알았습니다.',
            date: '2026.06.18',
            likes: 15
        }
    ];

    let guestbookData = JSON.parse(localStorage.getItem('spring_guestbook_items')) || initialGuestbook;

    function renderGuestbook() {
        const listEl = document.getElementById('guestbookList');
        if (!listEl) return;

        listEl.innerHTML = '';
        guestbookData.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'guestbook-item';
            itemEl.innerHTML = `
                <div class="guestbook-meta">
                    <span class="guestbook-author">${escapeHtml(item.name)} <small style="color:#888; font-weight:normal;">(${escapeHtml(item.role)})</small></span>
                    <span class="guestbook-date">${item.date}</span>
                </div>
                <div class="guestbook-msg">${escapeHtml(item.msg)}</div>
                <div style="margin-top:8px; display:flex; justify-content:flex-end;">
                    <button class="btn-like-guestbook" data-idx="${index}" style="font-size:0.85rem; color:#ff7e67; font-weight:600; display:flex; align-items:center; gap:4px;">
                        💖 응원해요 <span>${item.likes || 0}</span>
                    </button>
                </div>
            `;
            listEl.appendChild(itemEl);
        });

        // 공감 버튼 이벤트
        document.querySelectorAll('.btn-like-guestbook').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                guestbookData[idx].likes = (guestbookData[idx].likes || 0) + 1;
                saveAndRenderGuestbook();
                showToast('🌸 따뜻한 응원을 전했습니다!');
            });
        });
    }

    function saveAndRenderGuestbook() {
        localStorage.setItem('spring_guestbook_items', JSON.stringify(guestbookData));
        renderGuestbook();
    }

    const guestbookForm = document.getElementById('guestbookForm');
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('gbName');
            const roleInput = document.getElementById('gbRole');
            const msgInput = document.getElementById('gbMsg');

            if (!nameInput.value.trim() || !msgInput.value.trim()) {
                alert('이름과 따뜻한 한마디를 입력해주세요.');
                return;
            }

            const today = new Date();
            const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

            const newEntry = {
                id: Date.now(),
                name: nameInput.value.trim(),
                role: roleInput.value.trim() || '소중한 방문객',
                msg: msgInput.value.trim(),
                date: dateStr,
                likes: 1
            };

            guestbookData.unshift(newEntry);
            saveAndRenderGuestbook();

            nameInput.value = '';
            roleInput.value = '';
            msgInput.value = '';

            showToast('🌸 소중한 방명록이 따뜻하게 등록되었습니다!');
        });
    }

    renderGuestbook();

    // 8. 모바일 네비게이션 드로어 토글
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');

    if (mobileMenuToggle && mobileNavDrawer) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNavDrawer.classList.add('open');
        });
    }

    if (mobileDrawerClose && mobileNavDrawer) {
        mobileDrawerClose.addEventListener('click', () => {
            mobileNavDrawer.classList.remove('open');
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
        });
    });

    // 유틸리티 함수: 토스트 알림창
    function showToast(message) {
        let toast = document.getElementById('springToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'springToast';
            toast.className = 'spring-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
