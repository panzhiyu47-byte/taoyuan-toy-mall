/* ============================================================
   陶元的玩具商城 · 公共逻辑
   购物车 / 订单 / 会员积分 / 优惠券 / 商品卡片渲染器 / TabBar
   数据存 localStorage（key 前缀 ty_），商品与楼层配置来自 data/db.js
   ============================================================ */

/* ---------- 存储 ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

/* ---------- 商品查询 ---------- */
function findProduct(pid) { return DB.products.find(p => p.id === pid); }
function fmtMoney(n) {
  n = Math.round(n * 100) / 100;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}
function fmtSales(s) { return s >= 10000 ? (s / 10000).toFixed(1) + '万' : String(s); }

/* ---------- 优惠券 ---------- */
/* 券折扣计算：满减券直减；折扣券按「符合类目的小计」打折 */
function couponDiscount(c, items) {
  if (!c) return 0;
  const scopeItems = c.scopeCat ? items.filter(it => findProduct(it.pid) && findProduct(it.pid).cat === c.scopeCat) : items;
  const scopeTotal = scopeItems.reduce((s, it) => s + it.price * it.qty, 0);
  if (scopeTotal < c.min) return 0; // 未达门槛不可用
  return c.rate ? Math.round(scopeTotal * (1 - c.rate) * 100) / 100 : c.off;
}
function userCoupons() { const u = userGet(); return u ? u.coupons || [] : []; }
function couponById(cid) { return DB.coupons.find(c => c.id === cid); }
function grantNewUserCoupons(u) {
  u.coupons = [{ cid: 'c_new', used: false }, { cid: 'c_99', used: false }];
}

/* ---------- 会员 ---------- */
function userGet() { return store.get('ty_user', null); }
function userSave(u) { store.set('ty_user', u); }
function isMember() { const u = userGet(); return !!(u && u.logged); }
function levelOf(totalSpent) {
  if (totalSpent >= 1000) return 'V3 · 钻石奶爸';
  if (totalSpent >= 500) return 'V2 · 育儿高手';
  if (totalSpent >= 200) return 'V1 · 玩具达人';
  return 'V0 · 萌新宝爸宝妈';
}
/* 注册（演示）：一键注册，送 500 积分 + 新人券 */
function userRegister() {
  const u = {
    logged: true, name: '陶元家长', points: 500, totalSpent: 0,
    addresses: [Object.assign({}, DB.defaultAddress)], coupons: []
  };
  grantNewUserCoupons(u);
  userSave(u);
  return u;
}
/* 消费返积分：支付金额的 10%（照抄华为会员权益） */
function addPointsFromSpend(paid) {
  const u = userGet(); if (!u) return;
  u.points = (u.points || 0) + Math.floor(paid * 0.1);
  u.totalSpent = Math.round(((u.totalSpent || 0) + paid) * 100) / 100;
  userSave(u);
}

/* ---------- 购物车 ---------- */
function cartAll() { return store.get('ty_cart', []); }
function cartSave(list) { store.set('ty_cart', list); updateBadges(); }
function cartCount() { return cartAll().reduce((s, i) => s + i.qty, 0); }
function cartKeyOf(pid, sku) { return pid + '|' + sku; }
function cartAdd(pid, sku, qty, opts) {
  opts = opts || {};
  const list = cartAll();
  const key = cartKeyOf(pid, sku);
  const hit = list.find(i => i.key === key);
  if (hit) { hit.qty += qty; hit.selected = true; }
  else list.push({ key, pid, sku, qty, selected: true, ts: Date.now() });
  cartSave(list);
}
function cartSetQty(key, qty) {
  const list = cartAll(); const it = list.find(i => i.key === key); if (!it) return;
  it.qty = qty; if (qty <= 0) list.splice(list.indexOf(it), 1);
  cartSave(list);
}
function cartSetSelected(key, sel) {
  const list = cartAll(); const it = list.find(i => i.key === key); if (it) { it.selected = sel; cartSave(list); }
}
function cartSelectAll(sel) { const list = cartAll(); list.forEach(i => i.selected = sel); cartSave(list); }
function cartRemove(key) { const list = cartAll(); const idx = list.findIndex(i => i.key === key); if (idx > -1) { list.splice(idx, 1); cartSave(list); } }
function cartSelectedItems() { return cartAll().filter(i => i.selected); }
function cartClearSelected() { cartSave(cartAll().filter(i => !i.selected)); }

/* ---------- 订单 ---------- */
function ordersAll() { return store.get('ty_orders', []); }
function ordersSave(o) { store.set('ty_orders', o); }
/* status: 待付款 / 待发货 / 待收货 / 已完成 */
function createOrder(items, opts) {
  opts = opts || {};
  const goodsTotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const freight = goodsTotal - opts.discount >= 48 ? 0 : 8; // 满48包邮（照抄华为门槛）
  const total = Math.max(0, Math.round((goodsTotal - opts.discount + freight) * 100) / 100);
  const order = {
    id: 'TY' + Date.now().toString().slice(-9),
    items, goodsTotal, discount: opts.discount || 0, couponId: opts.couponId || null,
    pointsUsed: opts.pointsUsed || 0, freight, total,
    address: opts.address || DB.defaultAddress,
    status: '待付款', created: Date.now()
  };
  const list = ordersAll(); list.unshift(order); ordersSave(list);
  return order;
}
function orderUpdate(id, patch) {
  const list = ordersAll(); const o = list.find(x => x.id === id);
  if (o) { Object.assign(o, patch); ordersSave(list); }
}
function orderPay(id) {
  const list = ordersAll(); const o = list.find(x => x.id === id); if (!o) return;
  o.status = '待发货';
  /* 券核销、积分扣减、消费返积分 */
  if (o.couponId) {
    const u = userGet();
    if (u) { const uc = (u.coupons || []).find(c => c.cid === o.couponId && !c.used); if (uc) uc.used = true; userSave(u); }
  }
  if (o.pointsUsed > 0) {
    const u = userGet();
    if (u) { u.points = Math.max(0, (u.points || 0) - o.pointsUsed); userSave(u); }
  }
  addPointsFromSpend(o.total);
  ordersSave(list);
  updateBadges();
}

/* ---------- 渲染：标签 / 价格 / 商品卡片 ---------- */
function tagHtml(t) { return `<span class="tag tag-${t[0]}">${t[1]}</span>`; }
function priceHtml(p, big) {
  return `<span class="price" ${big ? 'style="font-size:inherit"' : ''}><em>¥</em>${fmtMoney(p.price)}</span>` +
    (p.line ? `<span class="p-line">¥${fmtMoney(p.line)}</span>` : '');
}
/* 商品卡片：图 + 名称 + 卖点 + 促销标签（前置）+ 价格 —— 华为卡片信息结构 */
function cardHtml(p) {
  return `<a class="pcard" href="detail.html?pid=${p.id}">
    <div class="p-imgwrap">
      <img class="p-img" src="${p.img}" alt="${p.name}" loading="lazy">
      <button class="p-quick" data-add="${p.id}" aria-label="加入购物车">+</button>
    </div>
    <div class="p-body">
      <div class="p-name">${p.name}</div>
      <div class="p-point">${p.point}</div>
      <div class="p-tags">${(p.tags || []).slice(0, 3).map(tagHtml).join('')}</div>
      <div class="p-price">${priceHtml(p)}<span class="p-sales">${fmtSales(p.sales)}人已买</span></div>
    </div>
  </a>`;
}

/* ---------- TabBar ---------- */
function renderTabbar(active) {
  const el = document.getElementById('tabbar');
  if (!el) return;
  const tabs = [
    { key: 'home', icon: '🏠', label: '首页', href: 'index.html' },
    { key: 'cat', icon: '🗂️', label: '分类', href: 'category.html' },
    { key: 'cart', icon: '🛒', label: '购物车', href: 'cart.html' },
    { key: 'me', icon: '🧸', label: '我的', href: 'member.html' }
  ];
  el.innerHTML = tabs.map(t => `
    <a class="tab-item ${t.key === active ? 'active' : ''}" href="${t.href}">
      <span class="tab-icon">${t.icon}</span>
      <span>${t.label}</span>
      ${t.key === 'cart' ? '<span class="tab-badge" id="tabCartBadge"></span>' : ''}
    </a>`).join('');
  updateBadges();
}
function updateBadges() {
  const b = document.getElementById('tabCartBadge');
  if (b) {
    const n = cartCount();
    b.textContent = n > 99 ? '99+' : n;
    b.classList.toggle('show', n > 0);
  }
  document.querySelectorAll('[data-cart-badge]').forEach(el => {
    const n = cartCount();
    el.textContent = n > 99 ? '99+' : n;
    el.style.display = n > 0 ? 'inline-flex' : 'none';
  });
}

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(msg) {
  let t = document.getElementById('tyToast');
  if (!t) {
    t = document.createElement('div'); t.id = 'tyToast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

/* ---------- 加购飞入动画（小熊抱着的商品飞进购物车） ---------- */
function flyToCart(imgSrc, fromEl) {
  const cartTab = document.querySelector('.tab-item[href="cart.html"]') || document.querySelector('#tabCartBadge');
  if (!cartTab || !fromEl) return;
  const img = document.createElement('img');
  img.className = 'fly-img'; img.src = imgSrc;
  const fr = fromEl.getBoundingClientRect(), tr = cartTab.getBoundingClientRect();
  img.style.left = (fr.left + fr.width / 2 - 22) + 'px';
  img.style.top = (fr.top + fr.height / 2 - 22) + 'px';
  document.body.appendChild(img);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    img.style.left = (tr.left + tr.width / 2 - 22) + 'px';
    img.style.top = (tr.top + tr.height / 2 - 22) + 'px';
    img.style.transform = 'scale(.35)'; img.style.opacity = '.4';
  }));
  setTimeout(() => img.remove(), 750);
}

/* ---------- 全局事件委托：卡片上的 + 号快捷加购 ---------- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-add]');
  if (btn) {
    e.preventDefault(); e.stopPropagation();
    const p = findProduct(btn.dataset.add);
    if (!p) return;
    const sku = (p.opts && p.opts.length) ? p.opts.map(o => o.values[0]).join('/') : '默认';
    cartAdd(p.id, sku, 1);
    flyToCart(p.img, btn);
    toast('已加入购物车 🧸');
  }
});

/* ---------- 工具：URL 参数 ---------- */
function qs(name) {
  const m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
  return m ? decodeURIComponent(m[1]) : '';
}

/* ---------- 工具：秒杀倒计时 ---------- */
function startCountdown(el, msLeft) {
  const end = Date.now() + msLeft;
  function tick() {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    el.innerHTML = `<span class="sk-cell">${h}</span>:<span class="sk-cell">${m}</span>:<span class="sk-cell">${ss}</span>`;
  }
  tick(); setInterval(tick, 1000);
}

/* ---------- 工具：图片轮播圆点同步 ---------- */
function bindDots(scrollEl, dotsEl) {
  scrollEl.addEventListener('scroll', () => {
    const i = Math.round(scrollEl.scrollLeft / scrollEl.clientWidth);
    dotsEl.querySelectorAll('i').forEach((d, j) => d.classList.toggle('on', j === i));
  }, { passive: true });
}

/* ---------- 工具：手风琴金额（订单总览） ---------- */
function calcTotals(items, coupon, usePoints) {
  const goodsTotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const couponOff = couponDiscount(coupon, items);
  const afterCoupon = Math.max(0, goodsTotal - couponOff);
  /* 积分抵现：100积分=1元，最多抵结算额一半（会员专享，照抄华为积分规则） */
  let pointsUsed = 0, pointsOff = 0;
  const u = userGet();
  if (usePoints && u) {
    const maxByHalf = Math.floor(afterCoupon / 2);
    pointsOff = Math.min(Math.floor((u.points || 0) / 100), maxByHalf);
    pointsUsed = pointsOff * 100;
  }
  const freight = (afterCoupon - pointsOff) >= 48 ? 0 : 8;
  const total = Math.max(0, Math.round((goodsTotal - couponOff - pointsOff + freight) * 100) / 100);
  return { goodsTotal, couponOff, pointsUsed, pointsOff, freight, total };
}
