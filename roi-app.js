function number(v) {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatPrice(input) {
  const raw = input.value.replace(/[^0-9]/g, "");
  const pos = input.selectionStart;
  const oldLen = input.value.length;
  input.value = raw ? Number(raw).toLocaleString("ko-KR") : "";
  const newLen = input.value.length;
  try { input.setSelectionRange(pos + (newLen - oldLen), pos + (newLen - oldLen)); } catch (_) {}
}

function bindPriceInputs() {
  document.querySelectorAll("input[data-price]").forEach((el) => {
    if (el.readOnly) return;
    el.addEventListener("input", () => formatPrice(el));
  });
}

function won(v) {
  const lang = window.CURRENT_LANG || "ko";
  return (TRANSLATIONS[lang] || TRANSLATIONS.ko).fmt_won(v);
}

function day(v) {
  const lang = window.CURRENT_LANG || "ko";
  const ui   = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  if (!Number.isFinite(v) || v <= 0) return ui.fmt_impossible;
  return ui.fmt_days(v);
}

function times(v) {
  const lang = window.CURRENT_LANG || "ko";
  return (TRANSLATIONS[lang] || TRANSLATIONS.ko).fmt_times(v);
}

function monthlyNetProfit(monthlyRevenue, monthlyCost) {
  return monthlyRevenue - monthlyCost;
}

const RF_PACKAGE_DATA = {
  "Oligio X/Kiss": [
    {
      packageName: "4,400 패키지",
      packagePrice: 44000000,
      consumableCount: 90,
      shotsPerTreatment: 600,
      tipShots: 900,
      defaultPricePerTreatment: 1200000,
      defaultTreatmentsPerDay: 3
    },
    {
      packageName: "6,600 패키지",
      packagePrice: 66000000,
      consumableCount: 170,
      shotsPerTreatment: 600,
      tipShots: 900,
      defaultPricePerTreatment: 1200000,
      defaultTreatmentsPerDay: 3
    },
    {
      packageName: "8,800 패키지",
      packagePrice: 88000000,
      consumableCount: 250,
      shotsPerTreatment: 600,
      tipShots: 900,
      defaultPricePerTreatment: 1200000,
      defaultTreatmentsPerDay: 3
    }
  ],
  Tightan: [
    {
      packageName: "550 패키지",
      packagePrice: 5500000,
      consumableCount: 5,
      shotsPerTreatment: 300,
      tipShots: 15000,
      defaultPricePerTreatment: 300000,
      defaultTreatmentsPerDay: 3
    },
    {
      packageName: "1,100 패키지",
      packagePrice: 11000000,
      consumableCount: 10,
      shotsPerTreatment: 300,
      tipShots: 15000,
      defaultPricePerTreatment: 300000,
      defaultTreatmentsPerDay: 1
    }
  ]
};

function setRFDefaults(pkg) {
  const form = document.getElementById("rf-form");

  if (pkg.isCustom) {
    form.packagePrice.readOnly = false;
    form.consumableCount.readOnly = false;
    form.shotsPerTreatment.readOnly = false;
    form.tipShots.readOnly = false;
    calcRF();
    return;
  }

  form.packagePrice.readOnly = true;
  form.consumableCount.readOnly = true;
  form.shotsPerTreatment.readOnly = true;
  form.tipShots.readOnly = true;
  form.packagePrice.value = pkg.packagePrice.toLocaleString("ko-KR");
  form.consumableCount.value = pkg.consumableCount;
  form.shotsPerTreatment.value = pkg.shotsPerTreatment;
  form.tipShots.value = pkg.tipShots;
  if (pkg.defaultPricePerTreatment) {
    form.pricePerTreatment.value = pkg.defaultPricePerTreatment.toLocaleString("ko-KR");
  }
  if (pkg.defaultTreatmentsPerDay) {
    form.treatmentsPerDay.value = pkg.defaultTreatmentsPerDay;
  }
  calcRF();
}

function populateRFPackageOptions() {
  const equipmentSelect = document.getElementById("rf-equipment");
  const packageSelect = document.getElementById("rf-package");
  const packages = RF_PACKAGE_DATA[equipmentSelect.value] || [];

  packageSelect.innerHTML = "";
  packages.forEach((pkg, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = pkg.packageName;
    packageSelect.appendChild(option);
  });

  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "직접 입력";
  packageSelect.appendChild(customOption);

  if (packages.length > 0) {
    setRFDefaults(packages[0]);
  }
}

function setAllRFFieldsEditable() {
  const form = document.getElementById("rf-form");
  const packageRow = document.getElementById("rf-package-row");

  packageRow.style.display = "none";
  ["packagePrice", "consumableCount", "shotsPerTreatment", "tipShots", "pricePerTreatment", "treatmentsPerDay"].forEach((name) => {
    form[name].readOnly = false;
    form[name].value = "";
  });
  calcRF();
}

function bindRFPackageSelection() {
  const equipmentSelect = document.getElementById("rf-equipment");
  const packageSelect = document.getElementById("rf-package");
  const packageRow = document.getElementById("rf-package-row");

  equipmentSelect.innerHTML = "";
  Object.keys(RF_PACKAGE_DATA).forEach((equipmentName) => {
    const option = document.createElement("option");
    option.value = equipmentName;
    option.textContent = equipmentName;
    equipmentSelect.appendChild(option);
  });

  const customEquipOption = document.createElement("option");
  customEquipOption.value = "custom";
  customEquipOption.textContent = "직접 입력";
  equipmentSelect.appendChild(customEquipOption);

  equipmentSelect.addEventListener("change", () => {
    if (equipmentSelect.value === "custom") {
      setAllRFFieldsEditable();
    } else {
      packageRow.style.display = "";
      populateRFPackageOptions();
    }
  });

  packageSelect.addEventListener("change", () => {
    const packages = RF_PACKAGE_DATA[equipmentSelect.value] || [];
    if (packageSelect.value === "custom") {
      setRFDefaults({ isCustom: true });
      return;
    }
    const selectedPackage = packages[number(packageSelect.value)] || packages[0];
    if (selectedPackage) {
      setRFDefaults(selectedPackage);
    }
  });

  populateRFPackageOptions();
}

function renderResult(target, title, lines, error) {
  if (error) {
    target.innerHTML = `<div class="error-box">${error}</div>`;
    return;
  }

  const cards = lines
    .map((line) => `
      <div class="result-kpi${line.primary ? " is-primary" : ""}">
        <div class="kpi-label">${line.label}</div>
        <div class="kpi-value">${line.value}</div>
      </div>`)
    .join("");

  target.innerHTML = `
    <div class="result-inner">
      <div class="result-title">${title}</div>
      <div class="result-grid">${cards}</div>
    </div>`;
}

function calcRF() {
  const form = document.getElementById("rf-form");
  const result = document.getElementById("rf-result");

  const packagePrice = number(form.packagePrice.value);
  const consumableCount = number(form.consumableCount.value);
  const shotsPerTreatment = number(form.shotsPerTreatment.value);
  const pricePerTreatment = number(form.pricePerTreatment.value);
  const treatmentsPerDay = number(form.treatmentsPerDay.value);
  const tipShots = number(form.tipShots.value);

  if (packagePrice <= 0) {
    renderResult(result, t("res_rf_title"), [], t("err_packagePrice"));
    return;
  }

  if (consumableCount <= 0 || shotsPerTreatment <= 0 || pricePerTreatment <= 0 || treatmentsPerDay <= 0 || tipShots <= 0) {
    renderResult(result, t("res_rf_title"), [], t("err_allPositive"));
    return;
  }

  const totalTreatments = (tipShots / shotsPerTreatment) * consumableCount;
  const totalRevenue = totalTreatments * pricePerTreatment;
  const pureProfit = totalRevenue - packagePrice;
  const paybackDays = packagePrice / (pricePerTreatment * treatmentsPerDay);

  const dailyRevenue = pricePerTreatment * treatmentsPerDay;

  result.innerHTML = `
    <div class="rf-story">

      <div class="rf-card rf-card--payback">
        <div class="rf-card-header">
          <span class="rf-card-badge rf-card-badge--green">원금 회수</span>
        </div>
        <div class="rf-inputs-row">
          <div class="rf-input-chip">
            <span class="rf-chip-label">패키지 가격</span>
            <span class="rf-chip-value">${won(packagePrice)}</span>
          </div>
          <span class="rf-op">÷</span>
          <div class="rf-input-chip">
            <span class="rf-chip-label">1회 시술단가</span>
            <span class="rf-chip-value">${won(pricePerTreatment)}</span>
          </div>
          <span class="rf-op">÷</span>
          <div class="rf-input-chip">
            <span class="rf-chip-label">일 시술 횟수</span>
            <span class="rf-chip-value">${treatmentsPerDay}회</span>
          </div>
        </div>
        <div class="rf-arrow">▼</div>
        <div class="rf-conclusion rf-conclusion--green">
          <span class="rf-conclusion-pre">패키지 구매 후</span>
          <span class="rf-conclusion-big">${day(paybackDays)}</span>
          <span class="rf-conclusion-post">만에 원금 회수</span>
        </div>
        <div class="rf-daily-note">하루 매출 ${won(dailyRevenue)} 기준</div>
      </div>

      <div class="rf-divider">
        <span>이 패키지, 끝까지 쓰면?</span>
      </div>

      <div class="rf-card rf-card--profit">
        <div class="rf-card-header">
          <span class="rf-card-badge rf-card-badge--orange">총 수익 구조</span>
        </div>
        <div class="rf-inputs-row">
          <div class="rf-input-chip">
            <span class="rf-chip-label">소모품</span>
            <span class="rf-chip-value">${consumableCount}개</span>
          </div>
          <span class="rf-op">×</span>
          <div class="rf-input-chip">
            <span class="rf-chip-label">팁 총 샷수 ÷ 시술샷수</span>
            <span class="rf-chip-value">${Math.round(tipShots / shotsPerTreatment)}회/개</span>
          </div>
          <span class="rf-op">=</span>
          <div class="rf-input-chip rf-input-chip--accent">
            <span class="rf-chip-label">총 시술 횟수</span>
            <span class="rf-chip-value">${times(totalTreatments)}</span>
          </div>
        </div>
        <div class="rf-profit-breakdown">
          <div class="rf-breakdown-row">
            <span>총 매출 (${times(totalTreatments)} × ${won(pricePerTreatment)})</span>
            <span>${won(totalRevenue)}</span>
          </div>
          <div class="rf-breakdown-row rf-breakdown-minus">
            <span>패키지 비용</span>
            <span>− ${won(packagePrice)}</span>
          </div>
        </div>
        <div class="rf-arrow">▼</div>
        <div class="rf-conclusion rf-conclusion--orange">
          <span class="rf-conclusion-pre">이 패키지로 총</span>
          <span class="rf-conclusion-big">${won(pureProfit)}</span>
          <span class="rf-conclusion-post">수익</span>
        </div>
      </div>

    </div>
  `;
}

function calcLaser() {
  const form = document.getElementById("laser-form");
  const result = document.getElementById("laser-result");

  const equipmentPrice = number(form.equipmentPrice.value);
  const sessionUnitPrice = number(form.sessionUnitPrice.value);
  const ticketingCount = number(form.ticketingCount.value);
  const customerCount = number(form.customerCount.value);

  const packagePrice = sessionUnitPrice * ticketingCount * customerCount;
  const paybackDays = equipmentPrice / packagePrice;

  if (equipmentPrice <= 0) {
    renderResult(result, t("res_laser_title"), [], t("err_equipmentPrice"));
    return;
  }

  if (sessionUnitPrice <= 0 || ticketingCount <= 0 || customerCount <= 0) {
    renderResult(result, t("res_laser_title"), [], t("err_laserInputs"));
    return;
  }

  result.innerHTML = `
    <div class="rf-story">

      <div class="rf-card rf-card--laser-daily">
        <div class="rf-card-header">
          <span class="rf-card-badge rf-card-badge--blue">하루 매출 계산</span>
        </div>
        <div class="rf-inputs-row">
          <div class="rf-input-chip">
            <span class="rf-chip-label">1회 시술단가</span>
            <span class="rf-chip-value">${won(sessionUnitPrice)}</span>
          </div>
          <span class="rf-op">×</span>
          <div class="rf-input-chip">
            <span class="rf-chip-label">티케팅수</span>
            <span class="rf-chip-value">${ticketingCount}회</span>
          </div>
          <span class="rf-op">×</span>
          <div class="rf-input-chip">
            <span class="rf-chip-label">고객수</span>
            <span class="rf-chip-value">${customerCount}명/일</span>
          </div>
        </div>
        <div class="rf-arrow">▼</div>
        <div class="rf-conclusion rf-conclusion--blue">
          <span class="rf-conclusion-pre">하루 매출</span>
          <span class="rf-conclusion-big">${won(packagePrice)}</span>
        </div>
      </div>

      <div class="rf-divider">
        <span>이 매출로 장비값 회수하면?</span>
      </div>

      <div class="rf-card rf-card--payback">
        <div class="rf-card-header">
          <span class="rf-card-badge rf-card-badge--green">원금 회수</span>
        </div>
        <div class="rf-inputs-row">
          <div class="rf-input-chip">
            <span class="rf-chip-label">장비 가격</span>
            <span class="rf-chip-value">${won(equipmentPrice)}</span>
          </div>
          <span class="rf-op">÷</span>
          <div class="rf-input-chip">
            <span class="rf-chip-label">하루 매출</span>
            <span class="rf-chip-value">${won(packagePrice)}</span>
          </div>
        </div>
        <div class="rf-arrow">▼</div>
        <div class="rf-conclusion rf-conclusion--green">
          <span class="rf-conclusion-big">${day(paybackDays)}</span>
          <span class="rf-conclusion-post">만에 원금 회수</span>
        </div>
      </div>

    </div>
  `;
}

function calcInstallment() {
  const form = document.getElementById("installment-form");
  const result = document.getElementById("installment-result");

  const equipmentPrice = number(form.equipmentPrice.value);
  const installmentMonths = number(form.installmentMonths.value);
  const annualRate = number(form.annualRate.value);
  const pricePerTreatment = number(form.pricePerTreatment.value);
  const workingDays = number(form.workingDays.value);

  if (equipmentPrice <= 0 || pricePerTreatment <= 0 || workingDays <= 0) {
    renderResult(result, "할부/리스 결과", [], "장비 가격, 시술단가, 영업일수는 0보다 커야 합니다.");
    return;
  }

  let monthlyPayment;
  if (annualRate <= 0) {
    monthlyPayment = equipmentPrice / installmentMonths;
  } else {
    const r = annualRate / 100 / 12;
    monthlyPayment = equipmentPrice * r / (1 - Math.pow(1 + r, -installmentMonths));
  }

  const totalRepayment = monthlyPayment * installmentMonths;
  const monthlyTreatmentsNeeded = Math.ceil(monthlyPayment / pricePerTreatment);
  const dailyTreatmentsNeeded = Math.ceil(monthlyTreatmentsNeeded / workingDays);

  renderResult(result, "할부/리스 결과", [
    { label: "월 할부금", value: won(monthlyPayment), primary: true },
    { label: "하루 필요 시술 횟수", value: `${dailyTreatmentsNeeded}회`, primary: true },
    { label: "월 필요 시술 횟수", value: `${monthlyTreatmentsNeeded}회` },
    { label: "총 상환액", value: won(totalRepayment) }
  ], "");
}

function bindTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = {
    rf: document.getElementById("panel-rf"),
    laser: document.getElementById("panel-laser"),
    speech: document.getElementById("panel-speech")
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      Object.entries(panels).forEach(([key, panel]) => {
        panel.classList.toggle("is-active", key === target);
      });
    });
  });
}

function bindInputs() {
  document.getElementById("rf-form").addEventListener("input", calcRF);
  document.getElementById("laser-form").addEventListener("input", calcLaser);
}

bindTabs();
bindRFPackageSelection();
bindInputs();
bindPriceInputs();
calcRF();
calcLaser();
