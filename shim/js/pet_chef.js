/* ==========================================================================
   🐾 펫 셰프 & 펫 헬스케어 다이닝 스크립트 (pet_chef.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCalorieCalculator();
  initTabNavigation();
  initVaccinationTracker();
  initFoodSearchFilter();
  initCustomRecipeForm();
});

/* --------------------------------------------------------------------------
   1. 칼로리 및 급여량 계산기 (RER / MER Calculator)
   -------------------------------------------------------------------------- */
function initCalorieCalculator() {
  const speciesInputs = document.querySelectorAll('input[name="calc_species"]');
  const weightInput = document.getElementById('calc_weight');
  const factorSelect = document.getElementById('calc_factor');
  const mealsSelect = document.getElementById('calc_meals');
  
  const rerDisplay = document.getElementById('res_rer');
  const merDisplay = document.getElementById('res_mer');
  const dailyGramDisplay = document.getElementById('res_daily_gram');
  const perMealGramDisplay = document.getElementById('res_per_meal_gram');

  function calculate() {
    const weight = parseFloat(weightInput.value);
    if (!weight || weight <= 0) return;

    const factor = parseFloat(factorSelect.value);
    const meals = parseInt(mealsSelect.value, 10);

    // RER (기초 대사량) = 70 * (체중)^0.75
    const rer = Math.round(70 * Math.pow(weight, 0.75));
    // MER (1일 권장 열량) = RER * Factor
    const mer = Math.round(rer * factor);

    // 표준 자연식 칼로리 밀도 132 kcal / 100g (1g당 1.32 kcal)
    const dailyGram = Math.round(mer / 1.32);
    const perMealGram = Math.round(dailyGram / meals);

    rerDisplay.textContent = `${rer} kcal`;
    merDisplay.textContent = `${mer} kcal`;
    dailyGramDisplay.textContent = `${dailyGram}g`;
    perMealGramDisplay.textContent = `${perMealGram}g`;
  }

  // 종 변경 시 계수 옵션 업데이트
  speciesInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isDog = input.value === 'dog';
      factorSelect.innerHTML = isDog ? `
        <option value="1.6">중성화 완료 성견 (보통 활동량)</option>
        <option value="1.8">미중성화 성견 (기초대사량 높음)</option>
        <option value="1.1">체중 감량 / 다이어트견</option>
        <option value="2.5">성장기 퍼피 (자견 4개월~1년)</option>
        <option value="2.0">활동량 매우 많은 운동/어질리티견</option>
      ` : `
        <option value="1.2">중성화 완료 실내 성묘</option>
        <option value="1.4">미중성화 / 활발한 성묘</option>
        <option value="0.9">체중 감량 / 다이어트묘</option>
        <option value="2.5">성장기 키튼 (자묘 ~1년)</option>
      `;
      calculate();
    });
  });

  weightInput.addEventListener('input', calculate);
  factorSelect.addEventListener('change', calculate);
  mealsSelect.addEventListener('change', calculate);

  calculate();
}

/* --------------------------------------------------------------------------
   2. 탭 네비게이션
   -------------------------------------------------------------------------- */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   3. 동물병원 예방접종 및 목욕 상태 토글 (로컬스토리지 저장)
   -------------------------------------------------------------------------- */
function initVaccinationTracker() {
  const statusBadges = document.querySelectorAll('.status-toggle');

  statusBadges.forEach((badge, index) => {
    const savedState = localStorage.getItem(`pet_health_item_${index}`);
    if (savedState === 'done') {
      badge.textContent = '✅ 완료';
      badge.className = 'status-badge status-done status-toggle';
    }

    badge.addEventListener('click', () => {
      const isDone = badge.classList.contains('status-done');
      if (isDone) {
        badge.textContent = '⏳ 예정';
        badge.className = 'status-badge status-pending status-toggle';
        localStorage.setItem(`pet_health_item_${index}`, 'pending');
      } else {
        badge.textContent = '✅ 완료';
        badge.className = 'status-badge status-done status-toggle';
        localStorage.setItem(`pet_health_item_${index}`, 'done');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. 알레르기 및 위험 식재료 실시간 검색 필터
   -------------------------------------------------------------------------- */
function initFoodSearchFilter() {
  const searchInput = document.getElementById('foodSearchInput');
  const filterBtns = document.querySelectorAll('.food-filter-btn');
  const foodCards = document.querySelectorAll('.food-card');

  if (!searchInput) return;

  function filterCards() {
    const query = searchInput.value.toLowerCase().trim();
    const activeCategory = document.querySelector('.food-filter-btn.active')?.dataset.filter || 'all';

    foodCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const desc = card.textContent.toLowerCase();
      const type = card.dataset.type;

      const matchesQuery = name.includes(query) || desc.includes(query);
      const matchesCategory = activeCategory === 'all' || type.includes(activeCategory);

      if (matchesQuery && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', filterCards);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
  });
}

/* --------------------------------------------------------------------------
   5. 1:1 맞춤 식단 상담 카드 및 레시피 자동 처방전 렌더링
   -------------------------------------------------------------------------- */
function initCustomRecipeForm() {
  const form = document.getElementById('customConsultForm');
  if (!form) return;

  const previewName = document.getElementById('pv_name');
  const previewSpecies = document.getElementById('pv_species');
  const previewWeight = document.getElementById('pv_weight');
  const previewGoal = document.getElementById('pv_goal');
  const previewProteins = document.getElementById('pv_proteins');
  const previewAllergies = document.getElementById('pv_allergies');
  const previewKcal = document.getElementById('pv_kcal');
  const previewGram = document.getElementById('pv_gram');

  function updatePreview() {
    const petName = form.pet_name.value || '소중한 우리 아이';
    const species = form.pet_type.value === 'dog' ? '반려견 (Puppy/Dog)' : '반려묘 (Kitten/Cat)';
    const weight = parseFloat(form.pet_weight.value) || 4.5;
    const goal = form.pet_goal.value || '맞춤 알레르기 & 밸런스 영양';
    const proteins = form.pet_protein.value || '오리 안심, 닭가슴살, 연어';
    const allergies = form.pet_allergies.value || '없음 (특이 알레르겐 미발견)';

    const rer = Math.round(70 * Math.pow(weight, 0.75));
    const factor = form.pet_type.value === 'dog' ? 1.6 : 1.2;
    const mer = Math.round(rer * factor);
    const dailyGram = Math.round(mer / 1.32);

    previewName.textContent = petName;
    previewSpecies.textContent = species;
    previewWeight.textContent = `${weight} kg`;
    previewGoal.textContent = goal;
    previewProteins.textContent = proteins;
    previewAllergies.textContent = allergies;
    previewKcal.textContent = `${mer} kcal / 일`;
    previewGram.textContent = `${dailyGram}g / 일 (끼당 약 ${Math.round(dailyGram / 2)}g)`;
  }

  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);

  const printBtn = document.getElementById('btnPrintPrescription');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  updatePreview();
}
