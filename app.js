/* ─────────────────────────────────────────────────────
   app.js — متتبع العطاءات الحكومية الليبية
   منطق التطبيق | Application Logic
   ───────────────────────────────────────────────────── */


// ── SVG Icons ─────────────────────────────────────────
const ICONS = {
  // Category icons (16×16)
  monitor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,

  wrench: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,

  zap: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,

  droplet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,

  heartPulse: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,

  truck: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,

  packageBox: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,

  sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>`,

  fileText: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,

  layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,

  // Card meta icons (14×14)
  hash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,

  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,

  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  mapPin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,

  tag: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,

  building: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,

  // Empty state icons (48×48)
  searchLg: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,

  inboxLg: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,

  filterLg: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,

  // UI icons
  arrowUpRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,

  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,

  xClose: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,

  check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,

  // Theme icons
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
};


// ── Categories ────────────────────────────────────────
const CATS = [
  {
    key: 'تقنية',
    icon: 'monitor',
    color: '#3B82F6',
    kw: [
      'حاسوب','حاسبات','كمبيوتر','لابتوب','طابعة','ماسح','سكانر',
      'برمجيات','برنامج','تطبيق','موقع','منصة','نظام معلومات',
      'شبكة','إنترنت','wifi','راوتر','سويتش','كابل',
      'خادم','سيرفر','تخزين','سحابة','cloud',
      'كاميرا مراقبة','cctv','نظام مراقبة','تحكم',
      'اتصالات','هاتف','جوال','مقسم','هواتف',
      'أمن معلومات','سيبراني','جدار ناري','firewall',
      'طباعة','تصوير وثائق','آلة تصوير',
      'تقنية','تكنولوجيا','رقمي','ذكاء اصطناعي',
      'it','ict','software','hardware','server','network','digital'
    ]
  },
  {
    key: 'إنشاء وبناء',
    icon: 'wrench',
    color: '#F97316',
    kw: [
      'إنشاء','بناء','تشييد','ترميم','تشطيب','هدم','حفريات',
      'مبنى','مبانى','منشأة','قاعة','مكتب','مخزن','ورشة',
      'طريق','رصيف','ساحة','ميدان','جسر','نفق','ممر',
      'خرسانة','حديد','بلاط','رخام','أسفلت','طارمة',
      'أرضيات','جدران','سقف','تسقيف','عزل','دهان','صباغة',
      'نجارة','ألومنيوم','زجاج','أبواب','نوافذ','حديد حماية'
    ]
  },
  {
    key: 'كهرباء وطاقة',
    icon: 'zap',
    color: '#FBBF24',
    kw: [
      'كهرباء','كهربائي','كهربائية','أعمال كهربائية',
      'طاقة','محطة كهرباء','مولد','مولدات','جنريتور',
      'أسلاك','كابلات كهرباء','لوحة كهربائية','محول',
      'إنارة','إضاءة','led','طاقة شمسية','ألواح شمسية'
    ]
  },
  {
    key: 'مياه وصرف صحي',
    icon: 'droplet',
    color: '#22D3EE',
    kw: [
      'مياه','ماء','صرف صحي','أنابيب مياه','شبكة مياه',
      'حفر','بئر','آبار','ضخ مياه','خزان مياه',
      'قناة','مجاري','صرف','صرف مياه','معالجة مياه'
    ]
  },
  {
    key: 'طبي وصحة',
    icon: 'heartPulse',
    color: '#22C55E',
    kw: [
      'طبي','طبية','مستشفى','عيادة','صحة','صحي',
      'دواء','أدوية','مستلزمات طبية','معدات طبية',
      'أجهزة طبية','جراحي','تمريض','مختبر','أشعة',
      'صيدلية','مستحضرات','لقاح','لقاحات'
    ]
  },
  {
    key: 'مركبات ونقل',
    icon: 'truck',
    color: '#A78BFA',
    kw: [
      'سيارة','سيارات','مركبة','مركبات','شاحنة','شاحنات',
      'حافلة','حافلات','دراجة','قارب','سفينة',
      'وقود','بنزين','ديزل','زيت محرك','إطارات','قطع غيار'
    ]
  },
  {
    key: 'أثاث ومستلزمات',
    icon: 'packageBox',
    color: '#EC4899',
    kw: [
      'أثاث','كراسي','طاولات','خزائن','مقاعد',
      'مكتبي','مستلزمات مكتبية','قرطاسية','أوراق','أقلام',
      'مفروشات','ستائر','سجاد','مراتب','وسائد'
    ]
  },
  {
    key: 'تنظيف وخدمات',
    icon: 'sparkles',
    color: '#14B8A6',
    kw: [
      'نظافة','تنظيف','مواد تنظيف','خدمات نظافة',
      'حراسة','أمن','حارس','مراقبة أمنية',
      'بستنة','تشجير','خدمات','تموين','وجبات','مطعم','طعام'
    ]
  },
];


// ── State ─────────────────────────────────────────────
let kws = JSON.parse(localStorage.getItem('tKws') || '["صرف صحي","مياه","حفر"]');
let tenders = [];
let activeCat = 'الكل';


// ── Classification ────────────────────────────────────
function classifyTender(t) {
  const txt = (t.title + ' ' + t.description + ' ' + (t.category || '')).toLowerCase();
  for (const cat of CATS) {
    if (cat.kw.some(k => txt.includes(k.toLowerCase()))) return cat.key;
  }
  return 'غير مصنف';
}


// ── Keywords Management ───────────────────────────────
const saveKws = () => localStorage.setItem('tKws', JSON.stringify(kws));

function renderChips() {
  const container = document.getElementById('chips');
  container.innerHTML = kws.map((k, i) =>
    `<div class="chip" onclick="rmKw(${i})" title="إزالة">
      ${k}
      <span class="chip-x">${ICONS.xClose}</span>
    </div>`
  ).join('');
}

function addKw() {
  const inp = document.getElementById('kwIn');
  const v = inp.value.trim();
  if (v && !kws.includes(v)) {
    kws.push(v);
    saveKws();
    renderChips();
    if (tenders.length) { updateStats(); render(); }
  }
  inp.value = '';
  inp.focus();
}

function rmKw(i) {
  kws.splice(i, 1);
  saveKws();
  renderChips();
  if (tenders.length) { updateStats(); render(); }
}


// ── Fetch Tenders ─────────────────────────────────────
async function fetchTenders() {
  const btn = document.getElementById('fetchBtn');
  btn.disabled = true;
  setStatus('orange', 'جارٍ جلب العطاءات...');
  setProgress(15);
  hideError();

  try {
    setProgress(35);
    const res = await fetch('http://127.0.0.1:7845/api/tenders');
    setProgress(75);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setProgress(92);

    if (data.error && (!data.tenders || data.tenders.length === 0)) {
      throw new Error(data.error);
    }

    tenders = (data.tenders || []).map(t => ({
      ...t,
      autoCategory: classifyTender(t)
    }));

    document.getElementById('lastUpdate').textContent =
      'مُحدّث: ' + new Date().toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' });

    setStatus('green', `تم جلب ${tenders.length} عطاء`);
    updateStats();
    renderCatTabs();
    render();
    setProgress(100);
    setTimeout(() => hideProgress(), 800);

  } catch (e) {
    setStatus('', 'خطأ في الجلب');
    if (e.message.includes('fetch') || e.message.includes('Failed')) {
      showError('تعذّر الاتصال بالخادم المحلي.\n\nتأكد أن:\n1. ملف tenders_server.py يعمل (python3 tenders_server.py)\n2. المتصفح مفتوح على http://127.0.0.1:7845');
    } else {
      showError('خطأ: ' + e.message);
    }
    hideProgress();
  } finally {
    btn.disabled = false;
  }
}


// ── Matching & Highlighting ───────────────────────────
function match(t) {
  if (!kws.length) return { ok: false, hits: [] };
  const txt = [t.title, t.description, t.category, t.entity, t.autoCategory].join(' ').toLowerCase();
  const hits = kws.filter(k => txt.includes(k.toLowerCase()));
  return { ok: hits.length > 0, hits };
}

function hl(text, hits) {
  if (!text) return '';
  let r = text;
  hits.forEach(k => {
    r = r.replace(
      new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      `<span class="hl">${k}</span>`
    );
  });
  return r;
}


// ── Category Tabs ─────────────────────────────────────
function getCatDef(catKey) {
  return CATS.find(c => c.key === catKey);
}

function catColorStyle(color, isActive) {
  if (!isActive) return '';
  return `background: ${hexToRgba(color, 0.10)}; border-color: ${hexToRgba(color, 0.30)}; color: ${color};`;
}

function catCountStyle(color, isActive) {
  if (!isActive) return '';
  return `background: ${hexToRgba(color, 0.15)};`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderCatTabs() {
  const counts = {};
  tenders.forEach(t => {
    counts[t.autoCategory] = (counts[t.autoCategory] || 0) + 1;
  });

  const accentColor = '#f0a500';
  const isAllActive = activeCat === 'الكل';

  let html = `<div class="cat-tab ${isAllActive ? 'active' : ''}" data-cat="الكل" onclick="setCat('الكل')"
    style="${isAllActive ? catColorStyle(accentColor, true) : ''}">
    <div class="cat-tab-inner">
      <span class="cat-icon">${ICONS.layers}</span>
      الكل
    </div>
    <span class="cat-count" style="${catCountStyle(accentColor, isAllActive)}">${tenders.length}</span>
  </div>`;

  // Tech category first
  const techCount = counts['تقنية'] || 0;
  if (techCount > 0) {
    const techDef = getCatDef('تقنية');
    const isTechActive = activeCat === 'تقنية';
    html += `<div class="cat-tab ${isTechActive ? 'active' : ''}" data-cat="تقنية" onclick="setCat('تقنية')"
      style="${catColorStyle(techDef.color, isTechActive)}">
      <div class="cat-tab-inner">
        <span class="cat-icon">${ICONS[techDef.icon]}</span>
        تقنية
      </div>
      <span class="cat-count" style="${catCountStyle(techDef.color, isTechActive)}">${techCount}</span>
    </div>`;
  }

  // Remaining categories sorted by count
  const otherCats = Object.entries(counts)
    .filter(([k]) => k !== 'تقنية' && k !== 'غير مصنف')
    .sort((a, b) => b[1] - a[1]);

  for (const [cat, cnt] of otherCats) {
    const def = getCatDef(cat);
    const icon = def ? ICONS[def.icon] : ICONS.fileText;
    const color = def ? def.color : '#64748B';
    const isActive = activeCat === cat;
    html += `<div class="cat-tab ${isActive ? 'active' : ''}" data-cat="${cat}" onclick="setCat('${cat}')"
      style="${catColorStyle(color, isActive)}">
      <div class="cat-tab-inner">
        <span class="cat-icon">${icon}</span>
        ${cat}
      </div>
      <span class="cat-count" style="${catCountStyle(color, isActive)}">${cnt}</span>
    </div>`;
  }

  // Uncategorized last
  if (counts['غير مصنف']) {
    const isUncatActive = activeCat === 'غير مصنف';
    const uncatColor = '#64748B';
    html += `<div class="cat-tab ${isUncatActive ? 'active' : ''}" data-cat="غير مصنف" onclick="setCat('غير مصنف')"
      style="${catColorStyle(uncatColor, isUncatActive)}">
      <div class="cat-tab-inner">
        <span class="cat-icon">${ICONS.fileText}</span>
        غير مصنف
      </div>
      <span class="cat-count" style="${catCountStyle(uncatColor, isUncatActive)}">${counts['غير مصنف']}</span>
    </div>`;
  }

  document.getElementById('catTabs').innerHTML = html;
}

function setCat(cat) {
  activeCat = cat;
  renderCatTabs();
  render();
}


// ── Render ────────────────────────────────────────────
function render() {
  const filt = document.getElementById('filt').value;
  const sort = document.getElementById('sort').value;
  const grid = document.getElementById('grid');

  if (!tenders.length) {
    grid.innerHTML = `<div class="empty-state">
      <div class="empty-icon">${ICONS.searchLg}</div>
      <h3>في انتظار الجلب</h3>
      <p>أضف كلماتك المفتاحية واضغط جلب العطاءات</p>
    </div>`;
    return;
  }

  let list = tenders.map(t => ({ ...t, m: match(t) }));

  // Category filter
  if (activeCat !== 'الكل') list = list.filter(t => t.autoCategory === activeCat);

  // Status/match filter
  if (filt === 'match') list = list.filter(t => t.m.ok);
  if (filt === 'open') list = list.filter(t => isOpen(t));

  // Sort
  if (sort === 'match') {
    list.sort((a, b) => {
      const diff = b.m.hits.length - a.m.hits.length;
      if (diff !== 0) return diff;
      if (a.autoCategory === 'تقنية' && b.autoCategory !== 'تقنية') return -1;
      if (b.autoCategory === 'تقنية' && a.autoCategory !== 'تقنية') return 1;
      return 0;
    });
  }
  if (sort === 'date') list.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
  if (sort === 'alpha') list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ar'));

  // Section title
  const secTitle = document.getElementById('secTitle');
  secTitle.textContent = activeCat === 'الكل'
    ? `نتائج العطاءات (${list.length})`
    : `${activeCat} — ${list.length} عطاء`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">
      <div class="empty-icon">${ICONS.filterLg}</div>
      <h3>لا توجد نتائج</h3>
      <p>غيّر الفئة أو الفلتر</p>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(t => {
    const open = isOpen(t);
    const hits = t.m.hits;
    const isTech = t.autoCategory === 'تقنية';
    const def = getCatDef(t.autoCategory);
    const catIcon = def ? ICONS[def.icon] : ICONS.fileText;

    return `
    <div class="card ${t.m.ok ? 'hit' : ''} ${isTech ? 'tech' : ''}">
      <div class="card-top">
        <div class="card-title">${hl(t.title || 'بدون عنوان', hits)}</div>
        <div class="tags">
          ${isTech ? `<span class="tag tag-tech">${ICONS.monitor} تقنية</span>` : ''}
          ${t.m.ok && hits.length ? `<span class="tag tag-match">${ICONS.check} ${hits.length} تطابق</span>` : ''}
          <span class="tag ${open ? 'tag-open' : 'tag-closed'}">${t.status || (open ? 'مفتوح' : 'مغلق')}</span>
          ${t.autoCategory && t.autoCategory !== 'تقنية' ? `<span class="tag tag-cat">${catIcon} ${t.autoCategory}</span>` : ''}
        </div>
      </div>
      ${t.entity ? `<div class="card-entity">${ICONS.building} ${hl(t.entity, hits)}</div>` : ''}
      ${t.description ? `<div class="card-desc">
        <div class="desc-text">${hl(t.description, hits)}</div>
        <button class="read-more-btn" style="display: none;" onclick="toggleDesc(this)">إظهار المزيد</button>
      </div>` : ''}
      <div class="card-meta">
        ${t.biddingNumber ? `<span>${ICONS.hash} ${t.biddingNumber}</span>` : ''}
        ${t.publishDate ? `<span>${ICONS.calendar} نُشر: ${t.publishDate}</span>` : ''}
        ${t.deadline ? `<span>${ICONS.clock} ينتهي: ${t.deadline}</span>` : ''}
        ${t.location ? `<span>${ICONS.mapPin} ${t.location}</span>` : ''}
        ${t.documentPrice ? `<span>${ICONS.tag} ${t.documentPrice} د.ل</span>` : ''}
      </div>
      ${t.url ? `<a class="link-btn" href="${t.url}" target="_blank" rel="noopener">عرض التفاصيل ${ICONS.arrowUpRight}</a>` : ''}
    </div>`;
  }).join('');

  // Check for text overflow to show "Read more" buttons
  setTimeout(() => {
    document.querySelectorAll('.desc-text').forEach(el => {
      if (el.scrollHeight > el.clientHeight) {
        const btn = el.nextElementSibling;
        if (btn && btn.classList.contains('read-more-btn')) {
          btn.style.display = 'inline-block';
        }
      }
    });
  }, 10);
}

function isOpen(t) {
  if (!t.deadline) return true;
  const d = new Date(t.deadline);
  if (isNaN(d)) return true;
  return d >= new Date();
}


// ── Stats ─────────────────────────────────────────────
function updateStats() {
  document.getElementById('sTotal').textContent = tenders.length;
  document.getElementById('sMatch').textContent = tenders.filter(t => match(t).ok).length;
  document.getElementById('sTech').textContent = tenders.filter(t => t.autoCategory === 'تقنية').length;
  document.getElementById('sOpen').textContent = tenders.filter(t => isOpen(t)).length;
}


// ── Helpers ───────────────────────────────────────────
function clearAll() {
  tenders = [];
  activeCat = 'الكل';
  document.getElementById('catTabs').innerHTML = '';
  render();
  ['sTotal', 'sMatch', 'sTech', 'sOpen'].forEach(id =>
    document.getElementById(id).textContent = '—'
  );
  setStatus('', 'تم المسح');
}

function setStatus(type, msg) {
  document.getElementById('dot').className = 'status-dot ' + (type || '');
  document.getElementById('statusTxt').textContent = msg;
}

function setProgress(pct) {
  document.getElementById('prog').style.display = 'block';
  document.getElementById('progFill').style.width = pct + '%';
}

function hideProgress() {
  document.getElementById('prog').style.display = 'none';
}

function hideError() {
  document.getElementById('errBox').style.display = 'none';
}

function showError(msg) {
  const el = document.getElementById('errBox');
  el.style.display = 'block';
  el.textContent = msg;
}

function toggleDesc(btn) {
  const el = btn.previousElementSibling;
  if (el.classList.contains('expanded')) {
    el.classList.remove('expanded');
    btn.textContent = 'إظهار المزيد';
  } else {
    el.classList.add('expanded');
    btn.textContent = 'إظهار أقل';
  }
}


// ── Init ──────────────────────────────────────────────
document.getElementById('kwIn').addEventListener('keydown', e => {
  if (e.key === 'Enter') addKw();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeToggle').innerHTML = ICONS.moon;
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('themeToggle').innerHTML = ICONS.sun;
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    document.getElementById('themeToggle').innerHTML = ICONS.sun;
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    document.getElementById('themeToggle').innerHTML = ICONS.moon;
  }
}

initTheme();
renderChips();

