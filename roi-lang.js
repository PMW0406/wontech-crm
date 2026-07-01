window.CURRENT_LANG = "ko";

const TRANSLATIONS = {
  ko: {
    appTitle: "ROI Simulator",
    tab_rf: "RF/HIFU",
    tab_laser: "Laser",
    tab_sales: "Sales",

    rf_title: "RF/HIFU ROI 분석",
    rf_sub: '장비와 패키지를 선택하면 검증된 기준값이 자동 입력됩니다. 예외 케이스는 "직접 입력"으로 조정하세요.',
    rf_equipment: "장비명",
    rf_package: "패키지명",
    rf_packagePrice: "패키지 가격(원)",
    rf_consumableCount: "제공 소모품수(개)",
    rf_shotsPerTreatment: "시술샷수(샷/회)",
    rf_pricePerTreatment: "1회 시술단가(원)",
    rf_treatmentsPerDay: "일 시술 횟수(회/일)",
    rf_tipShots: "팁/카트리지 샷수(총 샷)",
    rf_custom: "직접 입력",

    res_paybackDays: "원금회수일",
    res_totalTreatments: "총 시술 횟수",
    res_totalRevenue: "총 매출",
    res_pureProfit: "순수익",
    res_rf_title: "RF/HIFU 결과",

    laser_title: "Laser ROI 분석",
    laser_sub: "일 고객 유입을 반영한 패키지 매출 기준으로 투자 회수일을 계산합니다.",
    laser_equipmentPrice: "장비 가격(원)",
    laser_sessionUnitPrice: "1회 시술단가(원)",
    laser_ticketingCount: "티케팅수(회)",
    laser_customerCount: "고객수(명/일)",
    res_dailyRevenue: "일 패키지 매출",
    res_laser_title: "Laser 결과",

    sales_title: "세일즈 스피치",
    sales_sub: "장비를 선택하면 경쟁사 비교표와 세일즈 멘트를 확인할 수 있습니다.",
    sales_back: "← 장비 목록",
    sales_cmp: "경쟁사 비교",
    sales_speech: "세일즈 멘트",
    sales_closing_name: "원장님 클로징",
    sales_closing_tag: "마무리 세일즈 멘트",

    tbl_item: "항목",

    err_packagePrice: "패키지 가격이 0보다 커야 합니다.",
    err_allPositive: "모든 입력값은 0보다 커야 합니다.",
    err_equipmentPrice: "장비 가격이 0보다 커야 합니다.",
    err_laserInputs: "시술단가, 티케팅수, 고객수는 0보다 커야 합니다.",

    fmt_days: (v) => `${v.toFixed(1)}일`,
    fmt_times: (v) => `${Math.round(v).toLocaleString("ko-KR")}회`,
    fmt_won: (v) => Math.round(v).toLocaleString("ko-KR"),
    fmt_impossible: "회수 불가",
  },

  en: {
    appTitle: "ROI Simulator",
    tab_rf: "RF/HIFU",
    tab_laser: "Laser",
    tab_sales: "Sales",

    rf_title: "RF/HIFU ROI Analysis",
    rf_sub: 'Select a device and package to auto-fill verified defaults. Use "Custom" for special cases.',
    rf_equipment: "Device",
    rf_package: "Package",
    rf_packagePrice: "Package Price (KRW)",
    rf_consumableCount: "Consumables Included",
    rf_shotsPerTreatment: "Shots / Treatment",
    rf_pricePerTreatment: "Price / Treatment (KRW)",
    rf_treatmentsPerDay: "Treatments / Day",
    rf_tipShots: "Tip / Cartridge Total Shots",
    rf_custom: "Custom",

    res_paybackDays: "Payback Period",
    res_totalTreatments: "Total Treatments",
    res_totalRevenue: "Total Revenue",
    res_pureProfit: "Net Profit",
    res_rf_title: "RF/HIFU Results",

    laser_title: "Laser ROI Analysis",
    laser_sub: "Calculates payback period based on daily package revenue.",
    laser_equipmentPrice: "Equipment Price (KRW)",
    laser_sessionUnitPrice: "Price / Session (KRW)",
    laser_ticketingCount: "Sessions / Package",
    laser_customerCount: "Patients / Day",
    res_dailyRevenue: "Daily Package Revenue",
    res_laser_title: "Laser Results",

    sales_title: "Sales Speech",
    sales_sub: "Select a device to view competitor comparison and sales pitch.",
    sales_back: "← Device List",
    sales_cmp: "Competitor Comparison",
    sales_speech: "Sales Pitch",
    sales_closing_name: "Closing Statement",
    sales_closing_tag: "Final Sales Message",

    tbl_item: "Item",

    err_packagePrice: "Package price must be greater than 0.",
    err_allPositive: "All values must be greater than 0.",
    err_equipmentPrice: "Equipment price must be greater than 0.",
    err_laserInputs: "Session price, package count and patient count must be greater than 0.",

    fmt_days: (v) => `${v.toFixed(1)} days`,
    fmt_times: (v) => `${Math.round(v).toLocaleString("en-US")} sessions`,
    fmt_won: (v) => Math.round(v).toLocaleString("en-US"),
    fmt_impossible: "Not recoverable",
  },

  zh: {
    appTitle: "ROI 模拟器",
    tab_rf: "RF/HIFU",
    tab_laser: "激光",
    tab_sales: "销售话术",

    rf_title: "RF/HIFU ROI 分析",
    rf_sub: '选择设备和套餐后，系统将自动填入验证基准值。特殊情况请选择"手动输入"。',
    rf_equipment: "设备名称",
    rf_package: "套餐名称",
    rf_packagePrice: "套餐价格（韩元）",
    rf_consumableCount: "耗材数量（个）",
    rf_shotsPerTreatment: "单次发数",
    rf_pricePerTreatment: "单次治疗价格（韩元）",
    rf_treatmentsPerDay: "每日治疗次数",
    rf_tipShots: "头/弹夹总发数",
    rf_custom: "手动输入",

    res_paybackDays: "回本周期",
    res_totalTreatments: "总治疗次数",
    res_totalRevenue: "总营收",
    res_pureProfit: "纯利润",
    res_rf_title: "RF/HIFU 结果",

    laser_title: "激光 ROI 分析",
    laser_sub: "基于每日患者套餐营收计算投资回收期。",
    laser_equipmentPrice: "设备价格（韩元）",
    laser_sessionUnitPrice: "单次治疗价格（韩元）",
    laser_ticketingCount: "套餐次数",
    laser_customerCount: "每日患者数",
    res_dailyRevenue: "日套餐营收",
    res_laser_title: "激光结果",

    sales_title: "销售话术",
    sales_sub: "选择设备后，查看竞品对比和销售话术。",
    sales_back: "← 设备列表",
    sales_cmp: "竞品对比",
    sales_speech: "销售话术",
    sales_closing_name: "院长总结话术",
    sales_closing_tag: "最终销售话术",

    tbl_item: "项目",

    err_packagePrice: "套餐价格必须大于0。",
    err_allPositive: "所有输入值必须大于0。",
    err_equipmentPrice: "设备价格必须大于0。",
    err_laserInputs: "治疗价格、套餐次数和患者数必须大于0。",

    fmt_days: (v) => `${v.toFixed(1)}天`,
    fmt_times: (v) => `${Math.round(v).toLocaleString("zh-CN")}次`,
    fmt_won: (v) => Math.round(v).toLocaleString("zh-CN"),
    fmt_impossible: "无法回收",
  }
};

function t(key) {
  return (TRANSLATIONS[window.CURRENT_LANG] || TRANSLATIONS.ko)[key] || key;
}

function applyLang() {
  const lang = window.CURRENT_LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = (TRANSLATIONS[lang] || TRANSLATIONS.ko)[key];
    if (!val) return;
    // label 안의 input/select를 보존하기 위해 첫 번째 텍스트 노드만 교체
    const textNode = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = val + "\n            ";
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

function setLanguage(lang) {
  window.CURRENT_LANG = lang;
  applyLang();
  if (typeof calcRF === "function") calcRF();
  if (typeof calcLaser === "function") calcLaser();
  if (typeof buildDeviceGrid === "function") buildDeviceGrid();
  const detailView = document.getElementById("speech-detail-view");
  if (detailView && !detailView.classList.contains("hidden")) {
    document.getElementById("speech-grid-view").classList.remove("hidden");
    detailView.classList.add("hidden");
  }
}

function bindLangBtns() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
}
