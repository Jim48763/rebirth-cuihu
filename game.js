'use strict';
const VERSION = 'ver0.5.1';
/* ========== 工具 ========== */
const $ = s => document.querySelector(s);
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const chance = p => Math.random() < p;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = n => Math.round(n).toLocaleString('zh-TW');
const pick = a => a[Math.floor(Math.random() * a.length)];
const WD = ['日', '一', '二', '三', '四', '五', '六'];

/* ========== 資料 ========== */
const HER = {
  su: { name: '蘇晴', role: '仁心醫院急診護理師・青梅竹馬', ally: '每回合替你回復 6 HP，醫療包效果 +15' },
  ye: { name: '葉凜', role: '第六分局刑警', ally: '每回合追加一次攻擊，基地防禦 +10' },
  shen: { name: '沈語桐', role: '中興生醫所研究生・8樓住戶', ally: '無視敵人防禦、傷害 +15%，有機會讓敵人失衡' }
};
const PM = () => (S && S.phase === 'prep' && S.day >= 23 ? 1.3 : 1);
const price = k => Math.round(ITEMS[k].price * PM());
const ITEMS = {
  food: { name: '糧食', unit: '份', price: 1200, desc: '一人一週份：米、罐頭、泡麵、乾糧', bulk: 1 },
  water: { name: '飲水', unit: '箱', price: 450, desc: '一人一週份瓶裝水（第 2 週起停水）', bulk: 1 },
  fuel: { name: '柴油', unit: '桶', price: 2200, desc: '發電機一週用量；開車遠征每趟 1 桶', bulk: 1 },
  med: { name: '醫療包', unit: '個', price: 3000, desc: '抗生素、繃帶、止痛藥。戰鬥中可用', bulk: 0 },
  ammo: { name: '弩箭', unit: '支', price: 300, desc: '十字弓專用，無視防禦', bulk: 0 },
  bullet: { name: '子彈', unit: '發', price: 2000, desc: '阿彪黑市貨，手槍／步槍通用', bulk: 0 }
};
const WEAPONS = {
  fist: { name: '空手', atk: 0 },
  bat: { name: '鋁製球棒', atk: 9, price: 1500, desc: '五金行就買得到，聲音很響' },
  machete: { name: '開山刀', atk: 16, price: 4200, desc: '登山用品店，砍得斷骨頭' },
  katana: { name: '開鋒武士刀', atk: 21, price: 18000, desc: '刀劍專賣店的實戰款，一刀斷頸' },
  axe: { name: '消防斧', atk: 25, price: 9800, desc: '工業用品行訂貨，又重又狠' },
  baton: { name: '警用伸縮棍', atk: 14 },
  bayonet: { name: '軍用刺刀', atk: 30 }
};
const GUNS = {
  pistol: { name: 'T75 手槍', dmg: [38, 50] },
  bmpistol: { name: '黑市改造手槍', dmg: [32, 44] },
  rifle: { name: 'T91 步槍', dmg: [58, 75] }
};
const ARMORS = {
  none: { name: '便服', def: 0 },
  jacket: { name: '防割機車夾克', def: 3, price: 6500, desc: '咬不太穿的厚皮革' },
  riot: { name: '防暴護具', def: 7 }
};
const BASE_UP = [
  { id: 'door', name: '防盜鋼門', price: 68000, desc: '基地防禦 +20' },
  { id: 'window', name: '鐵窗加固＋防颱板', price: 45000, desc: '基地防禦 +12，颱風不受損' },
  { id: 'cam', name: '走廊監視器＋警報器', price: 18000, load: 1, desc: '基地防禦 +6，夜襲時提早預警' },
  { id: 'gen', name: '柴油發電機', price: 85000, desc: '第 4 週停電後供電 5 單位，每桶柴油可撐 5 單位的一週負載' },
  { id: 'gen2', name: '變頻靜音發電機', price: 150000, need: 'gen', desc: '供電 10 單位，每桶柴油可撐 8 單位，更省油' },
  { id: 'gen3', name: '工業級發電機組', price: 320000, need: 'gen2', desc: '供電 20 單位，每桶柴油可撐 12 單位，帶得動 AI 伺服器' },
  { id: 'solar', name: '太陽能板＋儲電組', price: 180000, desc: '停電後免燃料供電 5 單位' },
  { id: 'solar2', name: '擴充太陽能陣列＋鋰電儲能櫃', price: 420000, need: 'solar', desc: '免燃料供電提升到 12 單位，不夠的部分才補柴油' },
  { id: 'ai', name: 'AI 大型伺服器（GPU 機櫃）', price: 980000, desc: '離線大型語言模型＋醫療／農業／軍事知識庫。運轉耗電 8 單位，解鎖專屬劇情與加成' },
  { id: 'pc', name: '高階電腦工作站（RTX 顯卡）', price: 128000, load: 2, desc: '供電時：可打遊戲，每週士氣 +3；沈語桐能拿來跑分子模擬，血清研究醫療包需求減半，解鎖專屬劇情。耗電 2' },
  { id: 'battery', name: '儲電電池組', price: 110000, desc: '供電正常時每週充電。電力不足時可放電撐過最多 2 週，不扣士氣' },
  { id: 'well', name: '水井＋加壓幫浦', price: 68000, load: 1, desc: '供電時每週飲水 +3。耗電 1' },
  { id: 'fridge', name: '冷藏冷凍設備', price: 52000, load: 1, desc: '倉儲上限 +100；供電時每週糧食消耗 -1。耗電 1' },
  { id: 'hydro', name: '水耕 LED 植栽櫃', price: 78000, load: 2, desc: '供電時每週糧食 +3，不受季節影響。耗電 2' },
  { id: 'radio', name: '衛星電話＋業餘無線電台', price: 58000, load: 1, desc: '供電時搜刮遭遇率 -10%，解鎖電台劇情。耗電 1' },
  { id: 'drone', name: '無人機偵察站', price: 150000, need: 'ai', load: 1, desc: '小翠運轉時搜刮遭遇率 -20%，解鎖偵察劇情。需要 AI 伺服器，耗電 1' },
  { id: 'clinic', name: '醫療室（病床＋無菌設備）', price: 92000, load: 1, desc: '供電時每週 HP +10，蘇晴同住再 +4，解鎖看診劇情。耗電 1' },
  { id: 'fence', name: '電網圍欄', price: 72000, load: 2, desc: '供電時基地防禦 +12。耗電 2' },
  { id: 'traps', name: '探照燈＋陷阱組', price: 36000, desc: '基地防禦 +6（不需用電）' },
  { id: 'cellar', name: '隱藏地下室', price: 50000, desc: '物資分藏暗室：夜襲與住戶搶劫的損失大幅減少' },
  { id: 'quarantine', name: '防疫隔離室', price: 42000, desc: '新來的倖存者先隔離觀察：內鬼無所遁形，解鎖隔離劇情' },
  { id: 'comfort', name: '娛樂室（投影機＋遊戲機＋小酒吧）', price: 65000, load: 1, desc: '供電時每週士氣 +4，解鎖電影夜劇情。耗電 1' },
  { id: 'purifier', name: '雨水淨水系統', price: 28000, load: 1, desc: '飲水消耗減半' },
  { id: 'garden', name: '頂樓菜園組', price: 32000, load: 1, desc: '第 8 週起每週產出 2 份糧食' },
  { id: 'room', name: '租下對門空屋 1201', price: 36000, desc: '倉儲上限 +250（屋主在加拿大，只收現金）' },
  { id: 'car', name: '二手休旅車', price: 380000, desc: '解鎖遠距離搜刮、收穫 +30%、撤退率提升' }
];
/* 電力：停電後（第 4 週起）每週結算。負載 = 基本設備 +（AI 伺服器 8）；先用太陽能，缺口由發電機補，依缺口耗柴油 */
const GENS = { gen: { out: 5, eff: 5 }, gen2: { out: 10, eff: 8 }, gen3: { out: 20, eff: 12 } };
const AI_LOAD = 8;
const LOANS = {
  card: { name: '信用卡預借現金', max: 200000, desc: '三張卡額度合計，立即入帳' },
  bank: { name: '銀行個人信貸', amount: 800000, delay: 5, desc: '需在職證明（辭職後無法申請），審核 5 天' },
  house: { name: '大里老家房屋增貸', amount: 2400000, delay: 9, desc: '需親自到銀行對保（消耗 1 行動），9 天後撥款，第 20 天後不受理' },
  shark: { name: '阿彪財務', amount: 300000, desc: '免保人當天撥款。月息一成，逾期「上門關心」' }
};
const LOCS = {
  conv: { name: '樓下全家便利商店', risk: .35, danger: 1, loot: { food: [1, 4], water: [1, 3] }, desc: '距離近、危險低，貨架快見底了' },
  mart: { name: '文心路家樂福', risk: .6, danger: 2, loot: { food: [3, 8], water: [2, 6], med: [0, 1] }, desc: '物資多，屍群也多' },
  hosp: { name: '仁心醫院', risk: .75, danger: 3, loot: { med: [2, 5] }, desc: '藥品集中地，感染的醫護人員徘徊' },
  police: { name: '第六分局', risk: .75, danger: 3, loot: { bullet: [6, 14], ammo: [3, 8], med: [0, 2] }, desc: '槍械、子彈與警用裝備', minW: 3 },
  nchu: { name: '中興大學生醫大樓', risk: .7, danger: 3, loot: { med: [1, 3], fuel: [0, 2] }, car: true, desc: '沈語桐的實驗室', req: () => S.h.shen.joined && S.h.shen.alive },
  dakeng: { name: '大坑山泉', risk: .5, danger: 2, loot: { water: [6, 12], food: [0, 3] }, desc: '山區的乾淨泉水和野菜', req: () => S.flags.dakeng },
  dali: { name: '大里老家', risk: .55, danger: 2, loot: {}, car: true, desc: '取回末日前藏在老家的物資', req: () => S.stash && (S.stash.food + S.stash.water) > 0 },
  base: { name: '清泉崗基地', risk: .9, danger: 4, loot: { food: [6, 12], water: [4, 10], ammo: [8, 16], bullet: [12, 24], med: [2, 4], fuel: [2, 4] }, car: true, desc: '軍方物資庫，最危險的地方', req: () => S.flags.radio }
};
const ENEMY = {
  walker: { n: '行屍', hp: 22, atk: 6, def: 0 },
  dog: { n: '感染野犬', hp: 18, atk: 8, def: 0 },
  nurse: { n: '感染的醫護', hp: 26, atk: 7, def: 0 },
  cop: { n: '腐爛的員警', hp: 34, atk: 9, def: 2 },
  runner: { n: '跑者', hp: 42, atk: 13, def: 0 },
  brute: { n: '巨屍', hp: 130, atk: 18, def: 4 },
  thug: { n: '暴徒', hp: 38, atk: 9, def: 1 },
  crow: { n: '黑鴉打手', hp: 65, atk: 13, def: 2 },
  resident: { n: '持刀住戶', hp: 32, atk: 8, def: 0 },
  guard: { n: '據點守衛', hp: 48, atk: 11, def: 2 },
  crowboss: { n: '黑鴉幹部「禿鷹」', hp: 140, atk: 17, def: 4 },
  early: { n: '發狂的男子', hp: 20, atk: 5, def: 0 }
};
const ENDINGS = {
  death: '重蹈覆轍', lone: '一個人的黎明', su: '晴空之下', ye: '凜冬守望', shen: '桐花再開',
  harem: '三人份的明天', king: '翠湖苑之王', tyrant: '血色王座', true: '黎明之後',
  ai: '不眠的小翠', army: '軍旗下的黎明', merchant: '末日商會', fortress: '鋼鐵翠湖', lighthouse: '翠湖的燈塔',
  starve: '空空的櫥櫃', surrender: '末日沒有俘虜', infected: '紅色的黎明', betrayed: '笑臉迎人', reckless: '做死大賞'
};

/* ========== 狀態 ========== */
let S = null, lock = false, atHub = false, onSheetClose = null;
function newState(name) {
  return {
    v: 1, name: name || '林昊', phase: 'prep', day: 1, week: 0, ap: 1, quit: false,
    money: 120000, debt: { card: 0, bank: 0, house: 0, shark: 0 }, pending: [], applied: {},
    crypto: 0, inv: { food: 4, water: 2, med: 0, fuel: 0, ammo: 0, bullet: 0 }, cap: 150,
    weapon: 'fist', armor: 'none', crossbow: false, base: {},
    hp: 100, maxhp: 100, str: 0, aid: 0, morale: 70, dark: 0, gun: null, raided: {},
    h: {
      su: { met: true, aff: 15, joined: false, alive: true },
      ye: { met: false, aff: 0, joined: false, alive: true },
      shen: { met: false, aff: 0, joined: false, alive: true }
    },
    zhao: { status: 'free', hate: 0, inv: 0 },
    flags: {}, fired: {}, survivors: 0, rep: 0, research: 0, fort: 0,
    log: [], romance: null
  };
}

/* ========== 衍生數值 ========== */
const atk = () => Math.round(6 + S.str * 2 + WEAPONS[S.weapon].atk - (S.morale < 30 ? 3 : 0));
const def = () => ARMORS[S.armor].def + (S.str >= 6 ? 1 : 0);
const party = () => ['su', 'ye', 'shen'].filter(k => S.h[k].joined && S.h[k].alive);
const stored = () => S.inv.food + S.inv.water + S.inv.fuel;
const capacity = () => S.cap + (S.base.room ? 250 : 0) + (S.base.fridge ? 100 : 0);
const debtTotal = () => Object.values(S.debt).reduce((a, b) => a + b, 0);
function baseDef() {
  let d = 10;
  if (S.base.door) d += 20; if (S.base.window) d += 12; if (S.base.cam) d += 6;
  d += Math.min(S.survivors, 15) * 2 + S.fort;
  if (S.h.ye.joined && S.h.ye.alive) d += 10;
  if (S.flags.chen) d += 5;
  if (aiMod('tac')) d += 8;
  if (fx('fence')) d += 12;
  if (S.base.traps) d += 6;
  return d;
}
const powered = () => S.week < 4 || S.flags.pwOn !== false;
const fx = id => !!(S.base[id] && powered());
const elder = () => S.flags.chen ? '陳伯' : '一位老住戶';
const tech = () => S.flags.chen ? '阿忠' : '一位會電焊的倖存者';
const aiMod = k => !!(S.flags.aiOn && S.flags.aiMods && S.flags.aiMods[k]);
const genTier = () => S.base.gen3 ? GENS.gen3 : S.base.gen2 ? GENS.gen2 : S.base.gen ? GENS.gen : null;
const solarOut = () => S.base.solar2 ? 12 : S.base.solar ? 5 : 0;
function powerLoad() {
  let d = 3;
  BASE_UP.forEach(b => { if (b.load && S.base[b.id] && !(b.id === 'garden' && S.week < 8)) d += b.load; });
  d += Math.ceil(S.survivors / 5);
  if (S.h.shen.joined && S.h.shen.alive && S.research >= 1 && !S.flags.cure) d += 2;
  return d;
}
function powerPlan() {
  const base = powerLoad(), aiL = S.base.ai ? AI_LOAD : 0, sol = solarOut(), g = genTier();
  const cap = sol + (g ? g.out : 0);
  const run = need => {
    const gap = Math.max(0, need - sol);
    if (!gap) return 0;
    return g && g.out >= gap ? Math.ceil(gap / g.eff) : -1;
  };
  const fFull = run(base + aiL), fBase = run(base);
  const ok = f => f >= 0 && f <= S.inv.fuel;
  const res = { base, cap, load: base, on: false, ai: false, fuel: 0, why: '' };
  if (aiL && ok(fFull)) { res.on = res.ai = true; res.fuel = fFull; res.load = base + aiL; }
  else if (ok(fBase)) { res.on = true; res.fuel = fBase; }
  else res.why = !g && !sol ? '沒有發電設備' : fBase < 0 ? '發電能力不足' : '柴油不足';
  return res;
}
function powerText() {
  if (S.week < 4) return '';
  if (!genTier() && !solarOut()) return '・沒有電';
  const p = powerPlan();
  return `・電力 ${p.load}/${p.cap}${p.on ? (p.fuel ? `（柴油 ${p.fuel}）` : '（免燃料）') : `（${p.why}）`}${S.base.ai ? (p.ai ? '・小翠運轉中' : '・AI 離線') : ''}${S.base.battery ? `・電池 ${S.flags.bat || 0}/2` : ''}`;
}
function dateObj() { return S.phase === 'prep' ? new Date(2026, 11, S.day) : new Date(2027, 0, 1 + 7 * (Math.max(1, S.week) - 1)); }
function dateLabel() { const d = dateObj(); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; }
function shortDate() { const d = dateObj(); return `${d.getMonth() + 1}/${d.getDate()}`; }
function needs() {
  const m = 1 + party().length, sv = Math.ceil(S.survivors * .5);
  const food = Math.max(1, m + sv - (fx('fridge') ? 1 : 0));
  const water = S.week >= 2 ? Math.ceil((m + sv) * (S.base.purifier ? .5 : 1)) : 0;
  return { food, water };
}

/* ========== 文字顯示 ========== */
const SPK = { '蘇晴': 'su', '葉凜': 'ye', '沈語桐': 'shen', '趙德凱': 'zhao', '小翠': 'ai' };
function T(s) { return String(s).replace(/\{N\}/g, S ? S.name : '林昊'); }
function lineHTML(l) {
  if (Array.isArray(l)) return `<p class="say ${SPK[l[0]] || ''}"><b>${T(l[0])}</b><span>${T(l[1])}</span></p>`;
  if (l.startsWith('<')) return l;
  if (l.startsWith('＊')) return `<p class="sys">${T(l.slice(1))}</p>`;
  if (l.startsWith('#')) return `<h2>${T(l.slice(1))}</h2>`;
  return `<p>${T(l)}</p>`;
}
function ask(lines, choices) {
  atHub = false; lock = false;
  const t = $('#text');
  t.innerHTML = lines.filter(Boolean).map(lineHTML).join('');
  t.classList.remove('in'); void t.offsetWidth; t.classList.add('in');
  $('#choices').classList.remove('grid');
  renderChoices(choices);
  render();
  window.scrollTo({ top: 0 });
}
function say(lines, next, label) { ask(lines, [{ t: label || '繼續', do: next }]); }
function renderChoices(ch) {
  const c = $('#choices'); c.innerHTML = '';
  ch.forEach(o => {
    if (o.if && !o.if()) return;
    const b = document.createElement('button');
    b.className = 'choice' + (o.cls ? ' ' + o.cls : '');
    if (o.fool) b.dataset.fool = '1';
    const ok = !o.req || o.req();
    b.disabled = !ok;
    const sub = typeof o.sub === 'function' ? o.sub() : o.sub;
    b.innerHTML = `<span>${T(o.t)}</span>` + (sub ? `<small>${T(sub)}</small>` : '') + (!ok && o.why ? `<small class="why">${o.why}</small>` : '');
    b.onclick = () => {
      if (lock) return; lock = true;
      c.querySelectorAll('button').forEach(x => x.disabled = true);
      try { o.do(); } catch (e) { console.error(e); lock = false; toast('發生錯誤：' + e.message, 'red'); }
    };
    c.appendChild(b);
  });
}
function toast(msg, kind) {
  const el = document.createElement('div'); el.className = 'toast ' + (kind || ''); el.textContent = msg;
  const box = $('#toasts'); box.appendChild(el);
  while (box.children.length > 5) box.firstChild.remove();
  setTimeout(() => el.remove(), 2600);
}
function log(s) { S.log.push([shortDate(), s]); if (S.log.length > 160) S.log.shift(); }

/* ========== 效果 ========== */
function aff(k, n) {
  const h = S.h[k]; if (!h.alive || !n) return;
  h.aff = clamp(h.aff + n, 0, 100);
  toast(`${HER[k].name} 好感 ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'pink' : 'red');
}
function gain(k, n, quiet) {
  if (!n) return;
  S.inv[k] = Math.max(0, S.inv[k] + n);
  if (!quiet) toast(`${ITEMS[k].name} ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'ok' : 'red');
}
function mor(n) { if (!n) return; S.morale = clamp(S.morale + n, 0, 100); toast(`士氣 ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'amber' : 'red'); }
function hpc(n) { if (!n) return; S.hp = clamp(S.hp + n, 0, S.maxhp); toast(`HP ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'ok' : 'red'); }
function rep(n) { if (!n) return; S.rep = clamp(S.rep + n, 0, 100); toast(`聲望 ${n > 0 ? '+' : ''}${n}`, 'amber'); }
function surv(n) { if (!n) return; S.survivors = Math.max(0, S.survivors + n); toast(`倖存者 ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'ok' : 'red'); }
function cash(n) { if (!n) return; S.money += n; toast(`資金 ${n > 0 ? '+' : ''}${fmt(n)}`, n > 0 ? 'ok' : 'red'); }
function dark(n) { if (!n) return; S.dark = clamp(S.dark + n, 0, 100); toast(`惡名 +${n}`, 'red'); }
function join(k) { const h = S.h[k]; if (!h.alive || h.joined) return; h.joined = true; h.met = true; toast(`${HER[k].name} 加入了`, 'pink'); log(`${HER[k].name} 加入隊伍`); }

/* ========== HUD ========== */
function render() {
  if (!S) { $('#hudIn').innerHTML = `<div class="hud-top"><div class="date">重生末日<small>翠湖苑</small></div></div>`; tabs(); return; }
  const prep = S.phase === 'prep';
  const d = dateObj();
  const cnt = prep ? `末日倒數 ${31 - S.day} 天` : S.phase === 'end' ? '終' : `末日第 ${S.week} 週 / 52`;
  const n = needs();
  const chip = (lb, v, low) => `<span class="${low ? 'low' : ''}">${lb}<b>${v}</b></span>`;
  let chips = '';
  if (prep) chips += chip('資金', fmt(S.money)) + chip('負債', fmt(debtTotal())) + chip('倉儲', `${stored()}/${capacity()}`) + chip('行動', S.ap);
  chips += chip('糧', S.inv.food, !prep && S.inv.food < n.food * 2) + chip('水', S.inv.water, !prep && S.week >= 2 && S.inv.water < n.water * 2) +
    chip('藥', S.inv.med) + chip('油', S.inv.fuel) + (S.crossbow ? chip('箭', S.inv.ammo) : '') + (S.gun ? chip('彈', S.inv.bullet) : '');
  if (!prep) chips += chip('士氣', S.morale, S.morale < 30) + chip('防禦', baseDef()) + chip('倖存者', S.survivors) + (S.dark ? chip('惡名', S.dark) : '');
  if (!prep && S.week >= 4 && (genTier() || solarOut())) { const p = powerPlan(); chips += chip('電力', `${p.load}/${p.cap}`, !p.on); }
  $('#hudIn').innerHTML = `
   <div class="hud-top"><div class="date">${dateLabel()}<small>星期${WD[d.getDay()]}</small></div><div class="count">${cnt}</div></div>
   <div class="hud-top"><div class="hpbar">HP <div class="bar ${S.hp < 35 ? 'red' : ''}"><i style="width:${S.hp / S.maxhp * 100}%"></i></div><span style="font-family:var(--f-num)">${S.hp}/${S.maxhp}</span></div></div>
   <div class="chips">${chips}</div>`;
  tabs();
}
function tabs() {
  const ph = $('#tPhone');
  ph.disabled = !(S && S.phase === 'prep' && atHub);
  ph.classList.toggle('phone', !!(S && S.phase === 'prep'));
  document.querySelectorAll('.tab:not(#tPhone)').forEach(b => b.disabled = !S);
}

/* ========== 存檔 ========== */
const SKEY = 'rebirth-cuihu-v1';
/* 存檔：本機 localStorage ＋ 雲端（登入者私人資料，跨裝置） */
const SLOT_IDS = ['1', '2', '3', 'auto'];
let CLOUD = null, cloudState = 'connecting', cloudWarned = false;
const SLOTS = {}, wPend = {}, wBusy = {};
let ENDS = null;
function store(k, v) { try { if (v === undefined) return localStorage.getItem(SKEY + k); localStorage.setItem(SKEY + k, v); return true; } catch (e) { return null; } }
function localSlot(slot) { try { return JSON.parse(store(':' + slot) || 'null'); } catch (e) { return null; } }
function snapLabel() { return S.phase === 'prep' ? `準備期 第 ${S.day} 天` : `末日 第 ${S.week} 週`; }
function readSlot(slot) { if (!(slot in SLOTS)) SLOTS[slot] = localSlot(slot); return SLOTS[slot]; }
function save(slot, quiet) {
  const d = { S: JSON.parse(JSON.stringify(S)), at: Date.now(), label: snapLabel(), name: S.name };
  SLOTS[slot] = d;
  const ok = store(':' + slot, JSON.stringify(d));
  cloudPut('save_' + slot, { json: JSON.stringify(d), at: d.at });
  if (!quiet) toast(CLOUD ? '已存檔，雲端同步中' : ok ? '已存檔（僅限這個瀏覽器）' : '這個瀏覽器無法存檔', CLOUD || ok ? 'ok' : 'red');
}
function load(slot) {
  const d = readSlot(slot); if (!d) return toast('沒有存檔', 'red');
  S = JSON.parse(JSON.stringify(d.S)); closeSheet(true); toast('已讀取：' + d.label, 'ok'); resume();
}
function fixState() { if (!S) return; S.inv.bullet = S.inv.bullet || 0; S.dark = S.dark || 0; S.raided = S.raided || {}; if (S.gun === undefined) S.gun = null; }
function resume() {
  fixState(); if (S.phase === 'prep') prepHub(); else if (S.phase === 'apoc') apocHub(); else title(); }
function endingsSeen() {
  if (!ENDS) { try { ENDS = JSON.parse(store(':endings') || '[]'); } catch (e) { ENDS = []; } }
  return ENDS.slice();
}
function addEnding(k) {
  const seen = endingsSeen(); if (seen.includes(k)) return seen;
  ENDS.push(k); store(':endings', JSON.stringify(ENDS)); cloudPut('endings', { list: ENDS.slice() });
  return ENDS.slice();
}
function cloudPut(id, data) {
  if (!CLOUD) return;
  wPend[id] = data;
  if (!wBusy[id]) cloudFlush(id);
}
async function cloudFlush(id) {
  wBusy[id] = true;
  while (wPend[id]) {
    const d = wPend[id]; wPend[id] = null;
    try { await CLOUD.col.doc(id).set(d); }
    catch (e) {
      if (e && e.code === 'unavailable') {
        await new Promise(r => setTimeout(r, 700 + Math.random() * 900));
        try { await CLOUD.col.doc(id).set(d); } catch (e2) { cloudFail(e2); }
      } else cloudFail(e);
    }
  }
  wBusy[id] = false;
}
function cloudFail(e) {
  if (e && (e.code === 'revoked' || e.code === 'not_granted' || e.code === 'capability_disabled' || e.code === 'capability_removed')) { CLOUD = null; cloudState = 'off'; }
  if (!cloudWarned) { cloudWarned = true; toast('雲端存檔失敗，這次先存在這個瀏覽器', 'red'); }
}
async function cloudPull() {
  if (!CLOUD) return false;
  const ids = [...SLOT_IDS.map(i => 'save_' + i), 'endings'];
  const snaps = await Promise.all(ids.map(id => CLOUD.col.doc(id).get().catch(() => null)));
  snaps.forEach((sn, i) => {
    if (!sn || !sn.exists) return;
    const v = sn.data(), id = ids[i];
    if (id === 'endings') {
      const merged = Array.from(new Set([...endingsSeen(), ...((v && v.list) || [])]));
      ENDS = merged; store(':endings', JSON.stringify(merged));
      return;
    }
    const slot = id.slice(5);
    let d = null; try { d = JSON.parse(v.json); } catch (e) { return; }
    const cur = readSlot(slot);
    if (!cur || (d.at || 0) > (cur.at || 0)) { SLOTS[slot] = d; store(':' + slot, v.json); }
    else if (cur && (cur.at || 0) > (d.at || 0)) cloudPut(id, { json: JSON.stringify(cur), at: cur.at });
  });
  // 本機有、雲端沒有的存檔也補上去
  SLOT_IDS.forEach((slot, i) => { const cur = readSlot(slot); if (cur && !(snaps[i] && snaps[i].exists)) cloudPut('save_' + slot, { json: JSON.stringify(cur), at: cur.at }); });
  if (ENDS && ENDS.length) cloudPut('endings', { list: ENDS.slice() });
  return true;
}
async function cloudInit() {
  try {
    if (!window.claude || !window.claude.use) { cloudState = 'off'; return; }
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user) { cloudState = 'off'; return; }
    const id = await user.id();
    if (!id) { cloudState = 'off'; return; }
    CLOUD = { col: db.collection('data/users/' + id) };
    await cloudPull();
    cloudState = 'on';
    if (!S) title();
    toast('雲端存檔已連線', 'ok');
  } catch (e) { CLOUD = null; cloudState = 'off'; }
  finally { if (cloudState === 'connecting') cloudState = 'off'; if (cloudState === 'off' && !S) title(); }
}
function cloudText() {
  return cloudState === 'on' ? '雲端存檔：已連線。存檔跟著你的 Claude 帳號，換手機或電腦都能接著玩。'
    : cloudState === 'connecting' ? '雲端存檔：連線中……'
    : '存檔會留在這個瀏覽器裡（換瀏覽器或清除網站資料就會消失）。';
}

/* ========== 分頁面板 ========== */
function openSheet(title, html, after) {
  $('#sheetT').textContent = title; $('#sheetB').innerHTML = html; $('#sheet').hidden = false;
  if (after) after($('#sheetB'));
}
function closeSheet(silent) {
  $('#sheet').hidden = true;
  const f = onSheetClose; onSheetClose = null;
  if (f && !silent) f();
}
function panel(p) {
  if (!S) return;
  if (p === 'phone') return phone('supply');
  if (p === 'me') return panelMe();
  if (p === 'bag') return panelBag();
  if (p === 'log') return openSheet('日誌', `<ul class="logl">${S.log.slice().reverse().map(l => `<li><em>${l[0]}</em>${T(l[1])}</li>`).join('') || '<li>還沒有紀錄。</li>'}</ul>`);
  if (p === 'sys') return panelSys();
}
function heartBar(h) { return `<div class="bar pink"><i style="width:${h.aff}%"></i></div>`; }
function panelMe() {
  const hz = ['su', 'ye', 'shen'].map(k => {
    const h = S.h[k];
    if (!h.met) return `<div class="her"><div class="top"><b>？？？</b><small>尚未相遇</small></div></div>`;
    const st = !h.alive ? '已逝' : h.fall === 'left' ? '已離開你' : (h.joined ? '同住・可同行' : '尚未同住') + (h.fall === 'fallen' ? '・與你一同墮落' : h.fall === 'held' ? '・對你有所保留' : '');
    return `<div class="her"><div class="top"><b>${HER[k].name}</b><small>${HER[k].role}</small></div>${heartBar(h)}<div class="st">好感 ${h.aff} / 100・${st}${h.joined && h.alive ? '<br>同行效果：' + HER[k].ally : ''}</div></div>`;
  }).join('');
  const zs = { free: '住在 1203，笑臉迎人', arrested: '因通緝被逮捕', expelled: '被逐出大樓，下落不明', crow: '成為黑鴉幫首領', dead: '已死' }[S.zhao.status] || '';
  openSheet(`${S.name} 的狀態`, `
    <div class="kv"><span>生命</span><b>${S.hp} / ${S.maxhp}</b><span>攻擊</span><b>${atk()}</b><span>防禦</span><b>${def()}</b>
    <span>力量</span><b>${S.str}</b><span>急救知識</span><b>${S.aid} / 3</b><span>士氣</span><b>${S.morale}</b>
    <span>武器</span><span>${WEAPONS[S.weapon].name}${S.crossbow ? '＋十字弓' : ''}${S.gun ? '＋' + GUNS[S.gun].name : ''}</span><span>護具</span><span>${ARMORS[S.armor].name}</span>
    ${S.phase !== 'prep' ? `<span>基地防禦</span><b>${baseDef()}</b><span>倖存者</span><b>${S.survivors}</b><span>聲望</span><b>${S.rep}</b><span>惡名</span><b>${S.dark}</b><span>血清研究</span><b>${S.research} / 4</b>` : ''}</div>
    <div class="lbl">她們</div>${hz}
    <div class="lbl">仇人</div><div class="her"><div class="top"><b>趙德凱</b><small>1203 住戶・上一世殺了你的人</small></div><div class="st">${zs}${S.zhao.inv && S.zhao.status === 'free' && !S.flags.evidence ? `・調查進度 ${S.zhao.inv}/3` : ''}</div></div>`);
}
function panelBag() {
  const n = needs();
  const rows = Object.entries(ITEMS).map(([k, it]) => `<span>${it.name}</span><b>${S.inv[k]} ${it.unit}</b>`).join('');
  const bases = BASE_UP.filter(b => S.base[b.id]).map(b => b.name).join('、') || '無';
  openSheet('物資與基地', `
    <div class="kv">${rows}<span>倉儲</span><b>${stored()} / ${capacity()}</b></div>
    ${S.phase === 'apoc' ? `<div class="kv"><span>每週糧食消耗</span><b>${n.food}</b><span>每週飲水消耗</span><b>${n.water}</b><span>存糧可撐</span><b>${Math.floor(S.inv.food / Math.max(1, n.food))} 週</b></div>` : ''}
    <div class="kv"><span>基地設施</span><span>${bases}</span></div>
    ${S.phase === 'apoc' && S.week >= 4 && (genTier() || solarOut()) ? (p => `<div class="kv"><span>電力負載／供給</span><b>${p.load} / ${p.cap}</b><span>本週柴油</span><b>${p.on ? p.fuel : '—'}</b>${S.base.ai ? `<span>小翠</span><span>${p.ai ? '運轉中' : '離線（' + (p.why || '電力吃緊') + '）'}</span>` : ''}</div>`)(powerPlan()) : ''}
    ${S.base.ai && S.flags.aiMods ? `<div class="kv"><span>AI 模組</span><span>${Object.keys(S.flags.aiMods).map(k => AI_MODS[k].name).join('、') || '尚未啟用'}</span></div>` : ''}
    <button class="sbtn" id="useMed" ${S.inv.med > 0 && S.hp < S.maxhp ? '' : 'disabled'}>使用醫療包（回復 ${30 + S.aid * 8} HP）</button>`,
    b => { const u = b.querySelector('#useMed'); if (u) u.onclick = () => { gain('med', -1, true); hpc(30 + S.aid * 8); render(); panelBag(); }; });
}
function ver(el) { const v = document.createElement('small'); v.className = 'ver'; v.textContent = VERSION; el.appendChild(v); }
function panelSys() {
  const slots = [1, 2, 3].map(i => { const d = readSlot(i); return `<div class="row"><div class="nm">存檔 ${i}</div><div class="pr" style="font-size:12px">${d ? d.label : '空'}</div><div class="ds">${d ? d.name + '・' + new Date(d.at).toLocaleString('zh-TW') : '—'}</div><div class="bt"><button data-s="${i}" ${atHub ? '' : 'disabled'}>存檔</button><button data-l="${i}" ${d ? '' : 'disabled'}>讀取</button></div></div>`; }).join('');
  const au = readSlot('auto');
  openSheet('系統', `<div class="ds" style="font-size:13px;line-height:1.6">${cloudText()}</div>${cloudState === 'on' ? '<button class="sbtn" id="resync">從雲端重新同步存檔</button>' : ''}${atHub ? '' : '<div class="ds" style="color:var(--muted);font-size:13px">只能在每日／每週的行動選單存檔。</div>'}
    ${slots}<div class="row"><div class="nm">自動存檔</div><div class="pr" style="font-size:12px">${au ? au.label : '空'}</div><div class="bt"><button data-l="auto" ${au ? '' : 'disabled'}>讀取</button></div></div>
    <button class="sbtn" id="toTitle">回到標題畫面</button>`, b => {
    ver($('#sheetT'));
    b.querySelectorAll('[data-s]').forEach(x => x.onclick = () => { save(x.dataset.s); panelSys(); });
    b.querySelectorAll('[data-l]').forEach(x => x.onclick = () => load(x.dataset.l));
    b.querySelector('#toTitle').onclick = () => { closeSheet(true); title(); };
    const rs = b.querySelector('#resync'); if (rs) rs.onclick = async () => { rs.disabled = true; rs.textContent = '同步中…'; await cloudPull(); toast('已同步', 'ok'); panelSys(); };
  });
}

/* ========== 手機：網購・貸款・投資 ========== */
let phoneTab = 'supply';
function phone(tab) {
  phoneTab = tab || phoneTab;
  onSheetClose = prepHub;
  const tabsH = [['supply', '物資'], ['gear', '裝備'], ['base', '基地'], ['loan', '貸款'], ['coin', '投資']].map(([k, n]) => `<button data-t="${k}" class="${k === phoneTab ? 'on' : ''}">${n}</button>`).join('');
  const head = `<div class="kv"><span>現金</span><b>${fmt(S.money)} 元</b><span>負債</span><b>${fmt(debtTotal())} 元</b><span>倉儲</span><b>${stored()} / ${capacity()}</b></div><div class="seg">${tabsH}</div>`;
  let body = '';
  if (phoneTab === 'supply') {
    body = Object.entries(ITEMS).map(([k, it]) => `<div class="row"><div class="nm">${it.name}<span style="color:var(--muted);font-weight:400">（持有 ${S.inv[k]}）</span></div><div class="pr">${fmt(price(k))}／${it.unit}${PM() > 1 ? '（漲價）' : ''}</div><div class="ds">${it.desc}${k === 'ammo' && !S.crossbow ? '・需要十字弓' : ''}${k === 'bullet' && !S.gun ? '・需要槍' : ''}</div><div class="bt">${[1, 5, 20, 50].map(q => `<button data-buy="${k}" data-q="${q}" ${canBuy(k, q) ? '' : 'disabled'}>+${q}</button>`).join('')}</div></div>`).join('');
  } else if (phoneTab === 'gear') {
    body = ['bat', 'machete', 'katana', 'axe'].map(k => { const w = WEAPONS[k], own = S.weapon === k || (S.flags['own_' + k]); return `<div class="row ${own ? 'owned' : ''}"><div class="nm">${w.name}</div><div class="pr">${fmt(w.price)}</div><div class="ds">攻擊 +${w.atk}・${w.desc}</div><div class="bt"><button data-w="${k}" ${!own && S.money >= w.price ? '' : 'disabled'}>${own ? '已擁有' : '購買並裝備'}</button></div></div>`; }).join('')
      + `<div class="row ${S.armor !== 'none' ? 'owned' : ''}"><div class="nm">${ARMORS.jacket.name}</div><div class="pr">${fmt(ARMORS.jacket.price)}</div><div class="ds">防禦 +3・${ARMORS.jacket.desc}</div><div class="bt"><button data-a="jacket" ${S.armor === 'none' && S.money >= 6500 ? '' : 'disabled'}>${S.armor !== 'none' ? '已擁有' : '購買'}</button></div></div>`
      + (S.flags.flyer ? `<div class="row ${S.gun ? 'owned' : ''}"><div class="nm">阿彪的黑市改造手槍</div><div class="pr">150,000</div><div class="ds">戰鬥中開槍 32～44 傷害、無視防禦。附 12 發子彈，之後子彈可在「物資」補貨</div><div class="bt"><button data-gun="1" ${!S.gun && S.money >= 150000 ? '' : 'disabled'}>${S.gun ? '已擁有' : '私下交易'}</button></div></div>` : '')
      + `<div class="row ${S.crossbow ? 'owned' : ''}"><div class="nm">複合十字弓</div><div class="pr">32,000</div><div class="ds">戰鬥中可射擊，35～45 傷害且無視防禦。附 10 支弩箭</div><div class="bt"><button data-x="1" ${!S.crossbow && S.money >= 32000 ? '' : 'disabled'}>${S.crossbow ? '已擁有' : '購買'}</button></div></div>`;
  } else if (phoneTab === 'base') {
    const lockedBy = b => b.need && !S.base[b.need] ? BASE_UP.find(z => z.id === b.need).name : '';
    const supply = solarOut() + (genTier() ? genTier().out : 0), want = powerLoad() + (S.base.ai ? AI_LOAD : 0);
    body = `<div class="kv"><span>停電後供電能力</span><b>${supply} 單位</b><span>預估負載（初期）</span><b>${want} 單位</b></div>`
      + BASE_UP.map(b => `<div class="row ${S.base[b.id] ? 'owned' : ''}"><div class="nm">${b.name}</div><div class="pr">${fmt(b.price)}</div><div class="ds">${b.desc}${lockedBy(b) ? `・需先購買「${lockedBy(b)}」` : ''}</div><div class="bt"><button data-b="${b.id}" ${!S.base[b.id] && !lockedBy(b) && S.money >= b.price ? '' : 'disabled'}>${S.base[b.id] ? '已完成' : '購買'}</button></div></div>`).join('');
  } else if (phoneTab === 'loan') {
    const pend = t => S.pending.find(p => p.type === t);
    const cardLeft = LOANS.card.max - S.debt.card;
    body = `<div class="row"><div class="nm">${LOANS.card.name}</div><div class="pr">剩 ${fmt(cardLeft)}</div><div class="ds">${LOANS.card.desc}</div><div class="bt"><button data-card="50000" ${cardLeft >= 50000 ? '' : 'disabled'}>借 5 萬</button><button data-card="${cardLeft}" ${cardLeft > 0 ? '' : 'disabled'}>全部借出</button></div></div>`
      + `<div class="row"><div class="nm">${LOANS.bank.name}</div><div class="pr">${fmt(LOANS.bank.amount)}</div><div class="ds">${LOANS.bank.desc}${pend('bank') ? `<br>審核中，預計 12/${pend('bank').day} 撥款` : ''}${S.debt.bank ? '<br>已撥款' : ''}</div><div class="bt"><button data-bank="1" ${!S.applied.bank && !S.quit ? '' : 'disabled'}>${S.applied.bank ? '已申請' : S.quit ? '已辭職，無法申請' : '線上申請'}</button></div></div>`
      + `<div class="row"><div class="nm">${LOANS.house.name}</div><div class="pr">${fmt(LOANS.house.amount)}</div><div class="ds">${LOANS.house.desc}${pend('house') ? `<br>對保完成，預計 12/${pend('house').day} 撥款` : ''}${S.debt.house ? '<br>已撥款' : ''}</div><div class="bt"><button disabled>${S.applied.house ? '已對保' : '請在每日行動選擇「到銀行對保」'}</button></div></div>`
      + (S.flags.flyer ? `<div class="row"><div class="nm">${LOANS.shark.name}</div><div class="pr">${fmt(LOANS.shark.amount)}</div><div class="ds">${LOANS.shark.desc}</div><div class="bt"><button data-shark="1" ${S.debt.shark ? 'disabled' : ''}>${S.debt.shark ? '已借款' : '撥電話借錢'}</button></div></div>` : '')
      + `<div class="ds" style="font-size:12.5px;color:var(--muted);line-height:1.6">上一世的經驗：末日之後，銀行、催收、法院都不存在了。</div>`;
  } else if (phoneTab === 'coin') {
    const open = S.day <= 12;
    body = `<div class="row"><div class="nm">迷因幣 TAIPEI</div><div class="pr">${S.crypto ? '持有 ' + fmt(S.crypto) : '未持有'}</div><div class="ds">你記得 12 月 20 日它會暴漲四倍，然後在月底歸零。<br>${open ? `買入期限：12/12（剩 ${12 - S.day} 天）` : S.flags.coinSold ? '已在高點賣出' : S.crypto ? '等待 12/20 自動在高點賣出' : '已錯過買點'}</div><div class="bt">${[50000, 200000, 500000].map(v => `<button data-coin="${v}" ${open && S.money >= v ? '' : 'disabled'}>投入 ${fmt(v)}</button>`).join('')}<button data-coin="all" ${open && S.money > 0 ? '' : 'disabled'}>全部投入</button></div></div>`;
  }
  openSheet('手機', head + body, b => {
    b.querySelectorAll('[data-t]').forEach(x => x.onclick = () => phone(x.dataset.t));
    b.querySelectorAll('[data-buy]').forEach(x => x.onclick = () => { const k = x.dataset.buy, q = +x.dataset.q; S.money -= price(k) * q; S.inv[k] += q; toast(`${ITEMS[k].name} +${q}`, 'ok'); render(); phone(); });
    b.querySelectorAll('[data-w]').forEach(x => x.onclick = () => { const k = x.dataset.w; S.money -= WEAPONS[k].price; S.flags['own_' + k] = 1; if (WEAPONS[k].atk > WEAPONS[S.weapon].atk) S.weapon = k; toast(`取得 ${WEAPONS[k].name}`, 'ok'); render(); phone(); });
    b.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { S.money -= 6500; S.armor = 'jacket'; toast('取得防割夾克', 'ok'); render(); phone(); });
    b.querySelectorAll('[data-gun]').forEach(x => x.onclick = () => { S.money -= 150000; S.gun = 'bmpistol'; S.inv.bullet += 12; log('向阿彪買了黑市手槍'); toast('取得黑市改造手槍', 'ok'); render(); phone(); });
    b.querySelectorAll('[data-x]').forEach(x => x.onclick = () => { S.money -= 32000; S.crossbow = true; S.inv.ammo += 10; toast('取得十字弓', 'ok'); render(); phone(); });
    b.querySelectorAll('[data-b]').forEach(x => x.onclick = () => { const u = BASE_UP.find(z => z.id === x.dataset.b); S.money -= u.price; S.base[u.id] = true; toast(`完成：${u.name}`, 'ok'); log(`購入 ${u.name}`); render(); if (u.id === 'battery') S.flags.bat = 2; const st = { ai: aiDelivery, pc: pcDelivery, radio: radioDelivery }[u.id]; if (st) { closeSheet(true); return st(); } phone(); });
    b.querySelectorAll('[data-card]').forEach(x => x.onclick = () => { const v = +x.dataset.card; S.debt.card += v; S.money += v; toast(`預借現金 +${fmt(v)}`, 'ok'); render(); phone(); });
    b.querySelectorAll('[data-bank]').forEach(x => x.onclick = () => { S.applied.bank = true; S.pending.push({ type: 'bank', amount: LOANS.bank.amount, day: S.day + 5 }); toast('信貸申請送出', 'amber'); log('申請銀行信貸 80 萬'); phone(); });
    b.querySelectorAll('[data-shark]').forEach(x => x.onclick = () => { S.debt.shark = 300000; S.money += 300000; toast('阿彪財務 +300,000', 'ok'); log('向阿彪財務借款 30 萬'); render(); phone(); });
    b.querySelectorAll('[data-coin]').forEach(x => x.onclick = () => { const v = x.dataset.coin === 'all' ? S.money : +x.dataset.coin; S.money -= v; S.crypto += v; toast(`買入 TAIPEI ${fmt(v)}`, 'amber'); render(); phone(); });
  });
}
function canBuy(k, q) {
  if (S.money < price(k) * q) return false;
  if (k === 'ammo' && !S.crossbow) return false;
  if (k === 'bullet' && !S.gun) return false;
  if (ITEMS[k].bulk && stored() + q > capacity()) return false;
  return true;
}

/* ========== 準備期 ========== */
function startDay() {
  S.ap = S.quit ? 2 : 1;
  const ready = S.pending.filter(p => p.day <= S.day);
  S.pending = S.pending.filter(p => p.day > S.day);
  ready.forEach(p => { S.debt[p.type] += p.amount; S.money += p.amount; toast(`${LOANS[p.type].name} 撥款 ${fmt(p.amount)}`, 'ok'); log(`${LOANS[p.type].name} 撥款 ${fmt(p.amount)}`); });
  runEvent(PREP_EV[S.day], 'd' + S.day, prepHub);
}
function runEvent(fn, key, done) {
  if (fn && !S.fired[key]) { S.fired[key] = 1; fn(done); } else done();
}
function spend() { S.ap--; if (S.ap <= 0) endDay(); else prepHub(); }
function endDay() {
  if (!S.quit) { S.money += 2500; }
  S.day++;
  render();
  startDay();
}
function prepHub() {
  if (S.phase !== 'prep') return resume();
  const left = 31 - S.day;
  const lines = [`#12月${S.day}日・剩餘行動 ${S.ap}`];
  lines.push(pick(PREP_MOOD)(left));
  if (S.pending.length) lines.push('＊等待撥款：' + S.pending.map(p => `${LOANS[p.type].name} 12/${p.day}`).join('、'));
  if (!S.quit) lines.push('＊你還在上班，每天只有 1 次行動（日薪 2,500）。可隨時辭職。');
  const H = S.h;
  const acts = [
    { t: '打開手機', sub: '網購物資、辦貸款、投資（不消耗行動）', do: () => { lock = false; phone(); } },
    { t: '鍛鍊身體', sub: `力量 ${S.str} → ${S.str + 1}，生命上限 +4`, req: () => S.str < 8, why: '已經練到極限', do: () => { S.str++; S.maxhp += 4; S.hp = S.maxhp; toast('力量 +1', 'ok'); log('鍛鍊身體'); spend(); } },
    { t: '上急救與求生課程', sub: `急救知識 ${S.aid}/3：醫療包效果提升`, req: () => S.aid < 3, why: '已經學滿', do: () => { S.aid++; toast('急救知識 +1', 'ok'); log('參加紅十字會急救課'); spend(); } },
    { t: '回大里找蘇晴', cls: 'love', do: () => visit('su', spend) },
    { t: '去分局找葉凜', cls: 'love', if: () => H.ye.met, do: () => visit('ye', spend) },
    { t: '到 8 樓找沈語桐', cls: 'love', if: () => H.shen.met, do: () => visit('shen', spend) },
    { t: '暗中調查趙德凱', sub: `進度 ${S.zhao.inv}/3`, if: () => S.zhao.status === 'free' && !S.flags.evidence, do: investigate },
    { t: '到銀行對保（房屋增貸）', sub: '240 萬，9 天後撥款', if: () => !S.applied.house && S.day <= 20, do: () => { S.applied.house = true; S.pending.push({ type: 'house', amount: LOANS.house.amount, day: S.day + 9 }); log('辦理老家房屋增貸'); say(['你帶著權狀到大里的銀行。行員看著你簽下一張又一張文件，笑著說：「林先生要裝潢嗎？」', '你也笑：「對，大裝潢。」', '＊房屋增貸 2,400,000 元，預計 9 天後撥款。'], spend); } },
    { t: '在家休息', sub: '士氣 +8，生命全滿', do: () => { S.morale = clamp(S.morale + 8, 0, 100); S.hp = S.maxhp; log('在家休息'); spend(); } },
    { t: '遞出辭呈', cls: 'hot', sub: '之後每天 2 次行動，但無法再申請信貸', if: () => !S.quit, do: () => { S.quit = true; S.ap++; mor(8); log('辭職'); say(['你把辭呈放在主管桌上。他還在念叨年終考績，你已經走到電梯口。', '一個月後，這棟辦公大樓會是一座墳。'], prepHub); } }
  ];
  ask(lines, acts);
  atHub = true; tabs();
  save('auto', true);
}
const PREP_MOOD = [
  l => `窗外台灣大道車流不斷，沒有人知道，${l} 天後這條路會塞滿燒焦的車殼。`,
  l => `新聞在播跨年晚會的卡司。你關掉電視。距離那一晚還有 ${l} 天。`,
  l => `樓下早餐店老闆娘喊你「帥哥」，你多買了一份蘿蔔糕。還有 ${l} 天。`,
  l => `手機裡的倒數計時器：${l} 天。你每天都會看它好幾次。`,
  l => `你在筆記本上列清單，上一世缺過的東西，一樣一樣補齊。剩 ${l} 天。`
];
function investigate() {
  S.zhao.inv++; log('調查趙德凱');
  const notes = [
    ['你趁趙德凱出門，翻了他丟在回收區的紙袋。裡面有好幾張不同名字的手機門號申請書。', '上一世他就是用這些人頭帳戶，在末日前捲走了一筆錢。'],
    ['你跟著他到逢甲附近的一間網咖。他跟兩個年輕人交頭接耳，對方叫他「凱哥」。', '你用手機遠遠拍下了照片。'],
    ['你在警政署網站的通緝名單上，找到了那張臉。', '本名趙凱，詐欺集團幹部，通緝中。翠湖苑的「趙德凱」，只是他租屋用的假名。']
  ][S.zhao.inv - 1];
  if (S.zhao.inv >= 3) { S.flags.evidence = true; return say(notes, () => PREP_EV.evidence(spend)); }
  say(notes, spend);
}
function visit(k, next) {
  const pool = (S.phase === 'prep' ? VISIT_PREP : VISIT_APOC)[k];
  const line = pick(pool);
  const g = S.phase === 'prep' ? 6 : 8;
  log(`陪伴 ${HER[k].name}`);
  say(line, () => { aff(k, g); if (S.phase === 'apoc') mor(5); next(); });
}

/* ========== 末日期 ========== */
function startApoc() {
  S.phase = 'apoc'; S.week = 1; S.fired = Object.assign(S.fired, {});
  S.flags.aiOn = !!S.base.ai;
  log('紅眼病爆發');
  startWeek();
}
function startWeek() {
  render();
  const hq = HEROINE_Q.concat(AI_Q, NEW_Q).find(e => !S.fired[e.id] && e.if());
  const fn = APOC_EV[S.week];
  if (fn && !S.fired['w' + S.week]) { S.fired['w' + S.week] = 1; return fn(apocHub); }
  if (hq && !(fn && !S.fired['w' + S.week])) { S.fired[hq.id] = 1; return hq.run(apocHub); }
  if (S.week >= 2 && chance(.55)) return pick(RANDOM_EV.filter(e => !e.if || e.if()))(apocHub);
  apocHub();
}
function apocHub() {
  if (S.phase !== 'apoc') return resume();
  const n = needs(), p = party();
  const lines = [`#第 ${S.week} 週・${shortDate()} 起`];
  lines.push(`<p class="mono">每週消耗：糧食 ${n.food}、飲水 ${n.water}${powerText()}。存糧可撐 ${Math.floor(S.inv.food / Math.max(1, n.food))} 週。</p>`);
  lines.push(p.length ? `同住的人：${p.map(k => HER[k].name).join('、')}${S.survivors ? `，還有 ${S.survivors} 位倖存者` : ''}。` : S.survivors ? `大樓裡和你一起守著的倖存者有 ${S.survivors} 位。` : '這間屋子裡，只有你一個人的呼吸聲。');
  const acts = [
    { t: '外出搜刮', sub: '選擇地點與同行者，可能遭遇戰鬥', do: scavMenu },
    { t: '加固基地', sub: `基地防禦 ${baseDef()}（加固 ${S.fort}/30）`, req: () => S.fort < 30, why: '已經加固到極限', do: () => { S.fort = Math.min(30, S.fort + 6); log('加固基地'); say([party().length || S.survivors ? '你和大家把樓梯間的鐵櫃、沙包、拆下來的門板一層層堆起來。' : '你一個人把樓梯間的鐵櫃、沙包、拆下來的門板一層層堆起來，累到手指都握不緊。', '＊基地防禦 +6'], endWeek); } },
    { t: '訓練', sub: `力量 ${S.str}，生命上限 +4`, req: () => S.str < 12, why: '已到極限', do: () => { S.str++; S.maxhp += 4; toast('力量 +1', 'ok'); log('訓練'); say(['你在頂樓用水桶和槓鈴片做重量訓練，直到手臂發抖。'], endWeek); } },
    { t: '陪伴', cls: 'love', sub: '與同住的她共度一週', if: () => p.length > 0, do: () => ask(['要陪誰？'], [...p.map(k => ({ t: HER[k].name, sub: `好感 ${S.h[k].aff}`, cls: 'love', do: () => visit(k, endWeek) })), { t: '返回', do: apocHub }]) },
    { t: '協助血清研究', sub: `研究進度 ${S.research}/4（需要醫療包 ${S.base.pc && powered() ? 1 : 2}）`, if: () => S.h.shen.joined && S.h.shen.alive && S.research >= 1 && S.research < 3, req: () => S.inv.med >= (S.base.pc && powered() ? 1 : 2), why: '醫療包不足', do: () => { gain('med', S.base.pc && powered() ? -1 : -2); S.research++; aff('shen', 4); log('協助血清研究'); say(['沈語桐在書房裡架起臨時實驗台，你負責消毒器材、記錄數據。', ['沈語桐', '再一點點……抑制劑的穩定性又提高了。謝謝你，{N}。'], `＊血清研究 ${S.research}/4`], endWeek); } },
    { t: '掠奪', cls: 'hot', sub: '襲擊其他住戶與據點，搶走他們的物資（惡名上升）', if: () => S.week >= 2 && RAIDS.some(r => !S.raided[r.id] && (!r.req || r.req())), do: raidMenu },
    { t: '在頂樓放鞭炮慶祝', cls: 'hot', sub: '士氣大幅提升，但聲音傳得很遠', if: () => S.week >= 3 && !S.flags.fireDone, do: fireworks },
    { t: '偷偷注射沈語桐那管「還沒測試」的血清', cls: 'hot', sub: '也許你會變強，也許……', if: () => S.h.shen.joined && S.h.shen.alive && S.research >= 2 && !S.flags.serumTried, do: serumGamble },
    { t: '休養', sub: '生命 +40，士氣 +5', do: () => { log('休養'); S.hp = Math.min(S.maxhp, S.hp + 40); S.morale = clamp(S.morale + 5, 0, 100); say(['你難得睡了整整一天。夢裡沒有紅眼睛。'], endWeek); } }
  ];
  ask(lines, acts);
  atHub = true; tabs();
  save('auto', true);
}
function scavMenu() {
  ask(['#外出搜刮', '越遠越危險，收穫也越多。遠征需要休旅車與 1 桶柴油。'], [
    ...Object.entries(LOCS).map(([k, L]) => ({
      t: L.name, sub: `${L.desc}・危險 ${'▮'.repeat(L.danger)}${'▯'.repeat(4 - L.danger)}`,
      if: () => !L.req || L.req(),
      req: () => (!L.car || (S.base.car && S.inv.fuel > 0)) && (!L.minW || S.week >= L.minW),
      why: L.car ? '需要休旅車與柴油' : `第 ${L.minW} 週後`,
      do: () => compMenu(k)
    })),
    { t: '返回', do: apocHub }
  ]);
}
function compMenu(k) {
  const p = party();
  if (!p.length) return scav(k, null);
  ask([`要帶誰一起去${LOCS[k].name}？`], [...p.map(h => { const hint = ((ALLY_LOC[h] || {})[k] || {}).hint; return { t: HER[h].name, sub: HER[h].ally + (hint ? '｜' + hint : ''), cls: 'love', do: () => scav(k, h) }; }), { t: '獨自前往', do: () => scav(k, null) }]);
}
function allyFight(a) {
  const fz = S.h[a].fall === 'fallen';
  return pick((fz ? ALLY_FIGHT_FZ : ALLY_FIGHT)[a]);
}
function allyScav(a, k, lines) {
  const fz = S.h[a].fall === 'fallen', t = (ALLY_LOC[a] || {})[k];
  if (t) {
    lines.push(...(fz && t.fz ? t.fz : t.n));
    if (t.fx) { const m = t.fx(); if (m) lines.push(`＊${m}`); }
    aff(a, t.aff === undefined ? 2 : t.aff);
    if (chance(.3)) lines.push(pick(ALLY_AFTER[a]));
  } else lines.push(pick(ALLY_AFTER[a]));
}
function encounter(dg) {
  const w = S.week, pool = ['walker', 'walker', 'dog'];
  if (dg >= 2) pool.push('walker', 'thug');
  if (dg >= 3) pool.push('cop', 'nurse');
  if (w >= 18) pool.push('runner', 'runner');
  if (dg >= 4 || w >= 30) pool.push('brute');
  const n = clamp(R(1, dg) + (w >= 26 ? 1 : 0), 1, 4);
  return Array.from({ length: n }, () => pick(pool));
}
function scav(k, ally) {
  const L = LOCS[k];
  if (L.car) S.inv.fuel--;
  log(`前往${L.name}搜刮`);
  const after = () => {
    const mult = (S.base.car ? 1.3 : 1) * (S.morale < 30 ? .7 : 1);
    const got = [];
    Object.entries(L.loot).forEach(([it, [a, b]]) => { const q = Math.round(R(a, b) * mult); if (q > 0) { S.inv[it] += q; got.push(`${ITEMS[it].name} ${q}`); } });
    if (k === 'dali') { got.push(`糧食 ${S.stash.food}`, `飲水 ${S.stash.water}`); S.inv.food += S.stash.food; S.inv.water += S.stash.water; S.stash = { food: 0, water: 0 }; }
    const lines = [`#${L.name}`, pick(SCAV_TXT[k]), got.length ? `＊帶回：${got.join('、')}` : '＊什麼都沒找到。'];
    if (k === 'police' && !S.flags.pistol) { S.flags.pistol = 1; if (S.gun !== 'rifle') S.gun = 'pistol'; S.inv.bullet += 20; lines.push('軍械室的槍櫃被撬開過，但最底層還鎖著兩把 T75 手槍和一盒子彈。', '＊取得 T75 手槍、子彈 20 發'); }
    if (k === 'police' && !S.flags.riot) { S.flags.riot = 1; S.armor = 'riot'; if (WEAPONS[S.weapon].atk < 10) S.weapon = 'baton'; lines.push('你在裝備室找到一套完整的防暴護具和伸縮警棍。', '＊取得防暴護具（防禦 7）、警用伸縮棍'); }
    if (k === 'hosp' && S.h.shen.joined && S.research >= 1 && !S.flags.sampleH) { S.flags.sampleH = 1; S.research = Math.min(4, S.research + 1); lines.push('你照沈語桐交代的，從病理科冰櫃帶回了一盒早期感染者的組織切片。', `＊血清研究 ${S.research}/4`); }
    if (k === 'nchu' && S.research < 1) { S.research = 1; lines.push('沈語桐從實驗室搬回了她的離心機和病毒株。研究可以開始了。', '＊血清研究 1/4'); }
    if (k === 'base' && S.flags.retryCure && !S.flags.cure && S.research >= 3 && S.h.shen.joined && S.h.shen.alive) { S.research = 4; S.flags.cure = 1; aff('shen', 10); lines.push('這一次，你們護著沈語桐衝進了生化實驗室。黎明時，第一管血清完成了。', '＊血清完成'); }
    if (k === 'base' && !S.flags.rifle) { S.flags.rifle = 1; S.gun = 'rifle'; S.inv.bullet += 30; lines.push('＊取得 T91 步槍、子彈 30 發'); }
    if (k === 'base' && !S.flags.milLink) { S.flags.milLink = 1; lines.push('在地下指揮所，你找到仍在運作的軍用無線電，和一群還活著的士兵。他們願意與翠湖苑合作。', '＊與國軍殘部建立聯繫'); if (WEAPONS[S.weapon].atk < 16) { S.weapon = 'bayonet'; lines.push('＊取得軍用刺刀'); } }
    if (ally) allyScav(ally, k, lines);
    if (LOC_EV[k] && !S.flags['loc_' + k] && chance(.45)) { S.flags['loc_' + k] = 1; return say(lines, () => LOC_EV[k](endWeek)); }
    say(lines, endWeek);
  };
  if (chance(L.risk * (fx('radio') ? .9 : 1) * (S.base.drone && S.flags.aiOn ? .8 : 1))) {
    combat(encounter(L.danger), {
      ally, intro: [`你在${L.name}被盯上了。`, ally ? allyFight(ally) : ''], noDeath: true, win: after,
      flee: () => say(['你拉著同伴從後門撤退，空手回到翠湖苑。'], endWeek),
      surrender: () => say(['你交出了身上帶的東西，空手回到翠湖苑。'], endWeek),
      lose: () => { hpc(-0); S.morale = clamp(S.morale - 15, 0, 100); say(['你倒在血泊裡，是同行的人和樓下的倖存者把你拖回來的。', '＊重傷，士氣 -15'], endWeek); }
    });
  } else after();
}
function endWeek() {
  const n = needs(), rows = [];
  // 生產
  let fp = 0, wp = 0;
  if (S.base.garden && S.week >= 8) fp += 2;
  let xf = 0, xw = 0;
  if (aiMod('farm')) { xf += 2; rows.push(['小翠農業排程 糧食', '+2', 'pos']); }
  if (fx('hydro')) { xf += 3; rows.push(['水耕植栽櫃 糧食', '+3', 'pos']); }
  if (fx('well')) { xw += 3; rows.push(['水井 飲水', '+3', 'pos']); }
  if (S.survivors >= 3) { fp += Math.floor(S.survivors / 3); wp += Math.floor(S.survivors / 3); }
  if (fp) rows.push(['菜園／倖存者採集 糧食', '+' + fp, 'pos']);
  if (wp) rows.push(['倖存者採集 飲水', '+' + wp, 'pos']);
  S.inv.food += fp + xf; S.inv.water += wp + xw;
  rows.push(['糧食消耗', '-' + n.food, 'neg']);
  if (n.water) rows.push(['飲水消耗', '-' + n.water, 'neg']);
  const msgs = [];
  if (S.inv.food >= n.food) S.inv.food -= n.food;
  else { S.inv.food = 0; S.hp -= 15; S.morale -= 12; party().forEach(k => S.h[k].aff = Math.max(0, S.h[k].aff - 3)); msgs.push('糧食不夠了。大家餓著肚子過了這一週。（HP -15、士氣 -12）'); }
  if (S.inv.water >= n.water) S.inv.water -= n.water;
  else { S.inv.water = 0; S.hp -= 20; S.morale -= 15; msgs.push('沒有乾淨的水。嘴唇乾裂，有人開始喝浴缸裡的積水。（HP -20、士氣 -15）'); }
  const aiHeal = aiMod('med') ? 6 : 0, clHeal = fx('clinic') ? 10 + (S.h.su.joined && S.h.su.alive ? 4 : 0) : 0;
  const mx = (fx('comfort') ? 4 : 0) + (fx('pc') ? 3 : 0);
  if (mx) { S.morale += mx; rows.push(['娛樂設備 士氣', '+' + mx, 'pos']); }
  S.flags.aiOn = !!S.base.ai;
  if (S.week >= 4) {
    const pw = powerPlan();
    S.flags.aiOn = pw.ai;
    S.flags.pwOn = true;
    if (pw.on) {
      if (pw.fuel) { S.inv.fuel -= pw.fuel; rows.push(['發電機柴油', '-' + pw.fuel, 'neg']); }
      else rows.push(['太陽能供電', '正常', 'pos']);
      rows.push(['電力 負載／供給', `${pw.load}／${pw.cap}`, '']);
      if (S.base.battery) S.flags.bat = Math.min(2, (S.flags.bat || 0) + 1);
    } else if (S.base.battery && S.flags.bat > 0) {
      S.flags.bat--; rows.push(['儲電電池放電', `剩 ${S.flags.bat} 週`, 'neg']);
      msgs.push(`發電撐不住，電池組接手供電（${pw.why}）。`);
    } else { S.flags.pwOn = false; S.morale -= 6; msgs.push(`又是摸黑的一週（${pw.why}）。（士氣 -6）`); }
    if (S.base.ai && !pw.ai) msgs.push('小翠因電力不足自動關機，AI 加成與專屬劇情暫停。');
  }
  if (aiHeal) rows.push(['小翠醫療診斷 HP', '+' + aiHeal, 'pos']);
  if (clHeal) rows.push(['醫療室 HP', '+' + clHeal, 'pos']);
  if (S.morale <= 0) { S.hp -= 10; msgs.push('你已經撐不太下去了。（HP -10）'); }
  S.hp = Math.min(S.maxhp, S.hp + 8 + aiHeal + clHeal);
  S.morale = clamp(S.morale, 0, 100);
  // 夜襲
  if (S.week >= 3 && chance((.2 + S.week * .006) * (S.flags.fear ? .6 : 1) * (S.flags.aiNet && S.flags.aiOn ? .7 : 1))) {
    const str = Math.round(10 + S.week * 1.3 + R(0, 10)), d = baseDef() + (S.base.cam ? 8 : 0);
    if (d >= str) { S.morale = clamp(S.morale + 3, 0, 100); msgs.push(`深夜，屍群撞上了翠湖苑的防線（強度 ${str}）。${S.base.cam ? '警報器提早響起，' : ''}防線守住了。（防禦 ${d}，士氣 +3）`); }
    else { const cl = S.base.cellar, lf = Math.min(S.inv.food, cl ? R(0, 1) : R(1, 4)); S.inv.food -= lf; S.hp -= Math.round(R(10, 20) * (cl ? .6 : 1)); S.morale = clamp(S.morale - 8, 0, 100); S.fort = Math.max(0, S.fort - 6); msgs.push(`深夜，屍群衝破了樓梯間的路障（強度 ${str}，你的防禦 ${d}）。混戰到天亮，丟了 ${lf} 份糧食。`); }
  }
  log(`第 ${S.week} 週結束`);
  if (S.hp <= 0) return ending('starve');
  const tbl = `<div class="tbl">${rows.map(r => `<span>${r[0]}</span><span class="${r[2]}">${r[1]}</span>`).join('')}<span>剩餘 糧食／飲水／柴油</span><span>${S.inv.food}／${S.inv.water}／${S.inv.fuel}</span></div>`;
  S.week++;
  if (S.week > 52) return say([`#第 52 週結束`, tbl, ...msgs, '2027 年的最後一個夜晚。一年前的這個時候，世界在你眼前碎掉。'], finalEnding, '迎接結局');
  say([`#週末結算`, tbl, ...msgs], startWeek, '進入下一週');
}

/* ========== 掠奪（惡人線） ========== */
const RAIDS = [
  { id: 'wang', name: '10 樓王董家', desc: '末日前的建商老闆，家裡藏貨最多', foes: ['resident', 'resident'], loot: { food: [6, 10], water: [3, 6], med: [1, 2] }, dk: 8, req: () => !S.flags.wangGone },
  { id: 'gym', name: '7 樓健身教練一家', desc: '兩個壯漢守著一屋子高蛋白和罐頭', foes: ['thug', 'thug'], loot: { food: [5, 9], med: [1, 2] }, dk: 8 },
  { id: 'huizhong', name: '隔壁惠中大廈倖存者據點', desc: '二十幾個人共用的倉庫', foes: ['guard', 'guard', 'guard'], loot: { food: [10, 16], water: [6, 12], fuel: [2, 4] }, dk: 15 },
  { id: 'gas', name: '大墩路加油站', desc: '被一群人佔據的油庫', foes: ['thug', 'guard'], loot: { fuel: [6, 10], food: [2, 4] }, dk: 10 },
  { id: 'nest', name: '黑鴉幫據點・文心森林公園', desc: '黑鴉的軍火庫和糧倉，守備最嚴', foes: ['crow', 'crow', 'crowboss'], loot: { food: [12, 20], water: [8, 12], bullet: [15, 30], med: [3, 5], fuel: [3, 6] }, dk: 5, req: () => S.flags.nest }
];
const RAID_TXT = {
  wang: ['王董跪在地上抱著你的腿求饒，說床底下的東西全給你。', '你全拿走了。'],
  gym: ['教練的老婆抱著孩子縮在浴室裡。你沒碰她們，只搬空了廚房和儲藏室。'],
  huizhong: ['惠中大廈的倉庫裡堆滿了他們一家家湊出來的物資。', '從今天起，那是你的了。'],
  gas: ['你把佔據油庫的人趕走，灌滿了每一個油桶。'],
  nest: ['黑鴉的軍火庫被你搬空了一半，剩下的你一把火燒掉。', '火光照亮了整個文心森林公園。從今天起，黑鴉幫元氣大傷。']
};
function raidMenu() {
  ask(['#掠奪', '末日裡沒有法律。活下來的人，就是規矩。', S.dark >= 30 ? '翠湖苑附近的人已經開始叫你「12 樓的屠夫」。' : ''], [
    ...RAIDS.filter(r => !S.raided[r.id] && (!r.req || r.req())).map(r => ({ t: r.name, cls: 'hot', sub: `${r.desc}・惡名 +${r.dk}`, do: () => raidGo(r) })),
    { t: '返回', do: apocHub }
  ]);
}
function raidGo(r) {
  const p = party();
  const go = ally => combat(r.foes, {
    ally, noDeath: true, intro: `你帶著武器闖進了${r.name}。`,
    flee: () => say(['你判斷打不下來，先撤了。'], endWeek),
    surrender: () => { S.rep = clamp(S.rep - 3, 0, 100); say(['你跪在地上，對方沒有殺你，只把你從大門扔了出去。', '消息很快傳遍附近的據點：12 樓的人，其實不怎麼能打。', '＊聲望 -3'], endWeek); },
    win: () => {
      S.raided[r.id] = 1; if (r.id === 'nest') S.flags.nestDone = 1; if (r.id === 'wang') S.flags.wangGone = 1;
      const got = [];
      Object.entries(r.loot).forEach(([it, [a, b]]) => { const q = R(a, b); S.inv[it] += q; got.push(`${ITEMS[it].name} ${q}`); });
      if (r.loot.bullet && !S.gun) { S.gun = 'pistol'; got.push('T75 手槍'); }
      dark(r.dk); S.rep = clamp(S.rep - 5, 0, 100); mor(8); S.flags.fear = 1; log(`掠奪${r.name}`);
      const ra = ally ? RAID_ALLY[ally] : null, rf = ally && S.h[ally].fall === 'fallen';
      say([`#${r.name}`, ...RAID_TXT[r.id], ...(ra ? (rf ? ra.fz : ra.n) : []), `＊搶到：${got.join('、')}`], () => { if (ra) aff(ally, rf ? ra.afz : ra.aff); endWeek(); });
    },
    lose: () => { S.morale = clamp(S.morale - 10, 0, 100); say(['你被打了出來，狼狽地爬回翠湖苑。', '＊士氣 -10'], endWeek); }
  });
  if (!p.length) return go(null);
  ask([`要帶誰一起去${r.name}？`], [...p.map(h => ({ t: HER[h].name, cls: 'love', sub: HER[h].ally, do: () => go(h) })), { t: '獨自前往', do: () => go(null) }]);
}

/* ========== 戰鬥 ========== */
function mkEnemy(type) {
  const e = typeof type === 'string' ? ENEMY[type] : type;
  const w = S.week || 0, sc = e.boss ? 1 : 1 + w / 70;
  const hp = Math.round(e.hp * sc);
  return { n: e.n, hp, max: hp, atk: Math.round(e.atk * (e.boss ? 1 : 1 + w / 110)), def: e.def || 0, boss: e.boss };
}
function combat(list, o) {
  const C = { es: list.map(mkEnemy), i: 0, log: [], ally: o.ally || null, stun: false };
  [].concat(o.intro || []).filter(Boolean).forEach(x => C.log.push(T(x)));
  C.log.push(`敵人：${C.es.map(e => e.n).join('、')}${C.ally ? `｜同行：${HER[C.ally].name}` : ''}`);
  drawCombat(C, o);
}
function drawCombat(C, o) {
  atHub = false; lock = false;
  const e = C.es[C.i];
  $('#text').innerHTML = `<div class="fight">
   <div class="foe"><div class="foe-n">${e.n}<small>${C.i + 1} / ${C.es.length}</small></div><div class="bar red"><i style="width:${e.hp / e.max * 100}%"></i></div><div class="stat">HP ${e.hp}/${e.max}・攻擊 ${e.atk}${e.def ? '・防禦 ' + e.def : ''}</div></div>
   <div class="me"><div class="stat">${T('{N}')}・攻擊 ${atk()}・防禦 ${def()}${C.ally ? '・同行 ' + HER[C.ally].name : ''}</div><div class="bar ${S.hp < 35 ? 'red' : ''}"><i style="width:${S.hp / S.maxhp * 100}%"></i></div><div class="stat">HP ${S.hp}/${S.maxhp}</div></div>
   <ol class="flog">${C.log.slice(-8).map(x => `<li>${x}</li>`).join('')}</ol></div>`;
  const fl = $('.flog'); if (fl) fl.scrollTop = fl.scrollHeight;
  renderChoices([
    { t: '攻擊', sub: `約 ${atk()} 傷害`, do: () => act(C, o, 'hit') },
    { t: '重擊', sub: '65% 命中・雙倍', do: () => act(C, o, 'heavy') },
    { t: '防禦反擊', sub: '受傷減六成', do: () => act(C, o, 'guard') },
    { t: `開槍（${S.inv.bullet}）`, if: () => !!S.gun, sub: () => `${GUNS[S.gun].dmg[0]}～${GUNS[S.gun].dmg[1]}・無視防禦`, req: () => S.inv.bullet > 0, why: '沒有子彈', do: () => act(C, o, 'gun') },
    { t: `十字弓（${S.inv.ammo}）`, if: () => S.crossbow, sub: '35～45・無視防禦', req: () => S.inv.ammo > 0, why: '沒有弩箭', do: () => act(C, o, 'bow') },
    { t: `醫療包（${S.inv.med}）`, sub: `回復 ${30 + S.aid * 8 + (C.ally === 'su' ? 15 : 0)}`, req: () => S.inv.med > 0 && S.hp < S.maxhp, why: '無法使用', do: () => act(C, o, 'med') },
    { t: '撤退', if: () => o.flee !== false && !!o.flee, sub: '約五成機率', do: () => act(C, o, 'flee') },
    { t: '投降', cls: 'hot', if: () => canSurrender(C, o), sub: () => `${surrenderOdds(C) >= .5 ? '對方可能會手下留情' : '對方多半不會理你'}・失敗就是結局`, do: () => surrender(C, o) }
  ]);
  $('#choices').classList.add('grid');
  render();
}
function act(C, o, a) {
  const e = C.es[C.i], L = C.log, sh = C.ally === 'shen';
  const fz = C.ally && S.h[C.ally].fall === 'fallen';
  const mult = sh ? (fz ? 1.25 : 1.15) : 1, ed = sh ? 0 : e.def;
  let guard = false;
  const wn = S.weapon === 'fist' ? '拳頭' : WEAPONS[S.weapon].name;
  if (a === 'hit') { const d = Math.max(1, Math.round((atk() + R(-2, 3)) * mult) - ed); e.hp -= d; L.push(`你揮出${wn}，造成 <b>${d}</b> 傷害。`); }
  else if (a === 'heavy') { if (chance(.65)) { const d = Math.max(1, Math.round((atk() * 2 + R(0, 4)) * mult) - ed); e.hp -= d; L.push(`重擊命中！<b>${d}</b> 傷害。`); } else L.push('重擊落空，你踉蹌了一下。'); }
  else if (a === 'guard') { guard = true; const d = Math.max(1, Math.round(atk() * .5) - ed); e.hp -= d; L.push(`你架開攻勢反擊，<b>${d}</b> 傷害。`); }
  else if (a === 'gun') { S.inv.bullet--; const g = GUNS[S.gun]; const d = Math.round(R(g.dmg[0], g.dmg[1]) * mult); e.hp -= d; L.push(`砰！${g.name}擊中${e.n}，<b>${d}</b> 傷害。`); }
  else if (a === 'bow') { S.inv.ammo--; const d = Math.round((35 + R(0, 10)) * mult); e.hp -= d; L.push(`弩箭貫穿${e.n}，<b>${d}</b> 傷害。`); }
  else if (a === 'med') { S.inv.med--; const h = 30 + S.aid * 8 + (C.ally === 'su' ? 15 : 0); S.hp = Math.min(S.maxhp, S.hp + h); L.push(`你用了醫療包，回復 <b>${h}</b> HP。`); }
  else if (a === 'flee') {
    if (!e.boss && chance(.5 + (S.base.car ? .12 : 0))) { return o.flee(); }
    L.push(e.boss ? '牠擋住了唯一的出口，逃不掉！' : '撤退失敗！');
  }
  if (e.hp > 0 && C.ally === 'ye') { const d = Math.round((8 + R(0, 6) + Math.floor((S.week || 0) / 5)) * (fz ? 1.6 : 1)); e.hp -= d; L.push(`葉凜補上一擊，<b>${d}</b> 傷害。`); }
  if (e.hp > 0 && sh && !C.stun && chance(fz ? .3 : .18)) { C.stun = true; L.push('沈語桐：「打膝蓋！牠的平衡神經已經壞死了！」'); }
  if (e.hp <= 0) {
    e.hp = 0; L.push(`${e.n} 倒下了。`); C.i++;
    if (C.i >= C.es.length) return endCombat(C, o, true);
    return drawCombat(C, o);
  }
  if (C.stun) { C.stun = false; L.push(`${e.n} 失去平衡，沒能出手。`); }
  else {
    let d = Math.max(1, e.atk + R(-2, 2) - def());
    if (guard) d = Math.max(1, Math.round(d * .4));
    S.hp -= d; L.push(`<span class="hurt">${e.n} 攻擊你，受到 ${d} 傷害。</span>`);
  }
  if (C.ally === 'su' && S.hp > 0 && S.hp < S.maxhp) { const hh = fz ? 12 : 6; S.hp = Math.min(S.maxhp, S.hp + hh); L.push(`蘇晴替你止血，回復 ${hh} HP。`); }
  if (S.hp <= 0) { S.hp = 0; return endCombat(C, o, false); }
  drawCombat(C, o);
}
/* 投降：人類對手有機會放過你（交出物資），怪物幾乎不可能；同伴在場時機率較高。首領戰不能投降 */
const ZOMBIE_NAMES = ['行屍', '感染野犬', '感染的醫護', '腐爛的員警', '跑者', '巨屍', '屍王', '發狂的男子'];
const isZombie = e => ZOMBIE_NAMES.includes(e.n) || e.n.includes('變異');
const canSurrender = (C, o) => !o.noSurrender && !C.es.some(e => e.boss);
function surrenderOdds(C) {
  const alive = C.es.slice(C.i), human = !isZombie(alive[0]);
  return clamp((human ? .5 : .1) + (C.ally ? .2 : 0) - (S.dark >= 50 && human ? .15 : 0), .05, .85);
}
/* 投降的差分：依對手種類、同伴、惡名決定結果與文字 */
const SURR_H = {
  '暴徒': ['「算你識相。」領頭的啐了一口。', '暴徒笑著用你的武器敲了敲你的頭。「下次見面，別再擋路。」'],
  '黑鴉打手': ['「黑鴉收稅，從來不開收據。」', '面具後面傳來一聲悶笑。「回去告訴你們老大，這是學費。」'],
  '黑鴉幹部「禿鷹」': ['禿鷹用槍管挑起你的下巴。「翠湖苑的王？原來也會跪。」'],
  '據點守衛': ['「規矩你懂的。留下東西，滾。」', '守衛們面無表情地搜身，像是在處理一批入庫的貨。'],
  '持刀住戶': ['他握刀的手一直在抖，與其說兇狠，不如說他自己也怕得要命。', '「我、我只是想活下去……」他一邊哭一邊搜你的口袋。'],
  '阿彪': ['「林先生～早這樣不就好了？」阿彪笑得露出金牙。'],
  '趙德凱': ['趙德凱笑得跟上一世一模一樣，連彎腰撿你武器的姿勢都一樣。'],
  '阿傑': ['阿傑看著你，握著鐵管的手遲遲沒有落下。「……快走。我只放你這一次。」'],
  '被你放走的殺人犯': ['「我說過你會後悔。」他把你的武器踢進陰溝，笑得很開心。'],
  '王董': ['王董的笑很勉強：「林、林老弟，大家鄰居一場……東西留下就好。」']
};
const SURR_DIE_H = {
  '暴徒': '暴徒聽完你的求饒，大笑著把鐵棍敲在你後腦。「誰跟你講道理？」',
  '黑鴉打手': '黑鴉打手連看都沒看你一眼。「首領說，翠湖苑的人，一個都不留。」',
  '黑鴉幹部「禿鷹」': '禿鷹蹲下來，替你把眼睛闔上。「別怕，你的物資我們會好好使用。」',
  '據點守衛': '守衛看了看你，又看了看身後的同伴。「活口會報信。」',
  '持刀住戶': '他哭著把刀捅進去的時候，嘴裡一直重複：「對不起、對不起……」',
  '阿彪': '阿彪嘆了口氣。「林先生，欠錢的人投降沒有用啦。」',
  '趙德凱': '趙德凱笑著把你推向樓梯口。和上一世一模一樣的角度、一模一樣的笑。',
  '阿傑': '阿傑閉上眼睛，扣下了扳機。他在黑鴉那邊，沒有第二次選擇。',
  '被你放走的殺人犯': '「我上次放過你嗎？沒有？」他的刀已經在你肚子裡了。',
  '王董': '王董的聲音發著抖：「對不起了，林老弟，我家也有人要吃飯。」'
};
const SURR_Z = {
  distract: n => `${n}的動作忽然停住，歪頭轉向遠處突然響起的玻璃碎裂聲，搖搖晃晃地走了。你癱坐在地，過了很久才敢喘氣。`,
  bait: n => `${n}撲向你的瞬間，被旁邊一具倒下的屍體絆了一跤。你連滾帶爬鑽進縫隙，躲到牠離開為止。`,
  hide: n => `你滾進最近的櫃子，屏住呼吸。${n}在外面轉了一個小時，才拖著腳步離開。`
};
const SURR_ALLY_Z = {
  su: ['蘇晴硬是把你從牠的爪下拖了出去，一路退到安全的地方，雙手一直在抖。', ['蘇晴', '不准再這樣了……你聽到沒有。']],
  ye: ['葉凜朝天花板連開三槍，把牠引向另一頭，抓著你的後領撤退。', ['葉凜', '下次想投降之前，先想想我的子彈。']],
  shen: ['沈語桐一邊拖你一邊大喊：「打膝蓋！牠的平衡神經壞死了！」她用實驗室的酒精燈點燃了抹布，丟向牠的腳邊。', ['沈語桐', '對、對不起我丟太用力了……']]
};
const SURR_ALLY_Z_FALLEN = {
  su: ['蘇晴面無表情地把手術刀插進牠的眼窩，拖著你離開。', ['蘇晴', '我說過，我只救你一個人。所以，你不准死。']],
  ye: ['葉凜冷冷地補上最後一槍，把你從地上拎起來。', ['葉凜', '投降？那是給弱者用的詞。你不是。']],
  shen: ['沈語桐推了推眼鏡，把一管不知名的藥劑扎進牠的脖子。牠抽搐了兩下，倒下了。', ['沈語桐', '實驗成功。……不好意思，我分心了。']]
};
const SURR_ALLY_H = {
  su: e => [`蘇晴張開雙手擋在你前面：「我是護理師，你們有人受傷的話，我可以治！」`, `${e}猶豫了很久。最後他們只搜走一半的東西，把你們放走了。`],
  ye: e => ['葉凜亮出證件和手槍：「第六分局。放下武器，我當沒看到。」', `雙方僵持了整整一分鐘。${e}先退了半步，你們各退一步，各走各的。`],
  shen: e => ['沈語桐結結巴巴地報出一串座標：「我、我知道哪裡還有一整倉庫的罐頭！」', `${e}半信半疑，但那確實是真的。你們用情報換了一條命。`]
};
const SURR_ALLY_H_FALLEN = {
  su: e => [`蘇晴冷冷地把手搭在槍上：「碰他一下試試看。」`, `${e}被她的眼神嚇得退了半步。你們就這樣走了出去。`],
  ye: e => [`葉凜拔槍，槍口穩穩對準領頭的眉心。「三秒。」`, `${e}連一秒都沒撐到，丟下武器跑了。`],
  shen: e => ['沈語桐輕聲說：「你們身上的傷，有一半是感染初期。要不要我順便幫你們驗一下？」', `${e}臉色大變，一路退到巷口才敢轉身逃跑。`]
};
function surrender(C, o) {
  const alive = C.es.slice(C.i), e = alive[0], human = !isZombie(e), ally = C.ally;
  const fz = ally && S.h[ally].fall === 'fallen';
  if (!chance(surrenderOdds(C))) {
    return ending('surrender', `${human ? 'h' : 'z'}:${e.n}:${ally || ''}`);
  }
  let f = Math.floor(S.inv.food / 3), w = Math.floor(S.inv.water / 3), m = S.phase === 'prep' ? Math.round(S.money * .2) : 0, mo = 10, hurt = 0, extra = '';
  const lines = ['你把手裡的武器放在地上，慢慢舉起雙手。'];
  if (human) {
    const known = S.dark >= 30 && chance(.6);
    if (known) lines.push('他們認出了你的臉。「12 樓的屠夫……」有人低聲說，氣氛變得很微妙。');
    if (ally && chance(.6)) {
      const tx = (fz ? SURR_ALLY_H_FALLEN : SURR_ALLY_H)[ally](e.n);
      lines.push(...tx); f = Math.floor(f / 2); w = Math.floor(w / 2); m = Math.floor(m / 2); mo = 5;
      if (!fz) aff(ally, 2);
    } else {
      const kind = pick(['rob', 'labor', 'gap']);
      lines.push(pick(SURR_H[e.n] || ['對方盯著你看了很久。']));
      if (kind === 'rob') lines.push('他們搜光了你身上能拿的東西，把你踹了出去。');
      else if (kind === 'labor') { f = w = m = 0; mo = 15; hurt = 15; lines.push('他們沒拿走東西，反而把你押去搬了一整天的貨。入夜才放你回去，渾身痠痛。'); extra = '，HP -15'; }
      else { f = Math.floor(f / 2); w = Math.floor(w / 2); mo = 6; lines.push('他們正要動手，遠處傳來屍群的嚎叫。所有人臉色一變，你趁亂撿起半袋東西，頭也不回地逃了。'); }
    }
  } else if (ally) {
    const tx = (fz ? SURR_ALLY_Z_FALLEN : SURR_ALLY_Z)[ally];
    lines.push('你腿一軟，坐在地上。', ...tx); f = w = m = 0; mo = 5;
    if (ally === 'ye' && !fz) aff('ye', -3); else if (ally === 'su' || ally === 'shen') aff(ally, 2);
  } else {
    f = w = m = 0; mo = 8;
    lines.push(pick(Object.values(SURR_Z).filter((_, i) => !(['跑者', '巨屍'].includes(e.n) && i === 0)))(e.n));
  }
  S.inv.food -= f; S.inv.water -= w; S.money -= m; S.hp = Math.max(1, S.hp - hurt);
  S.morale = clamp(S.morale - mo, 0, 100);
  log('戰鬥中投降，保住一命');
  lines.push(`＊士氣 -${mo}${f + w ? `，糧食 -${f}、飲水 -${w}` : ''}${m ? `，資金 -${fmt(m)}` : ''}${extra}`);
  say(lines, () => (o.surrender || o.lose || o.flee || (S.phase === 'prep' ? prepHub : endWeek))());
}
function endCombat(C, o, won) {
  $('#choices').classList.remove('grid');
  if (won) { log('戰鬥勝利'); return o.win(); }
  if (o.noDeath) { S.hp = 1; return o.lose ? o.lose() : endWeek(); }
  ending('death', 'combat');
}

/* 做死選項：選了就直接進入對應的壞結局 */
const FOOL = (t, sub, k, cause) => ({ t, cls: 'hot', sub, fool: 1, do: () => ending(k, cause) });

/* ========== 結局 ========== */
function finalEnding() {
  let k;
  const okH = x => S.h[x].joined && S.h[x].alive && S.h[x].fall !== 'left';
  if (S.romance === 'all' && !['su', 'ye', 'shen'].every(okH)) S.romance = ['su', 'ye', 'shen'].filter(okH).sort((a, b) => S.h[b].aff - S.h[a].aff)[0] || null;
  else if (S.romance && S.romance !== 'all' && !okH(S.romance)) S.romance = null;
  const mods = Object.keys(S.flags.aiMods || {}).length, built = BASE_UP.filter(b => S.base[b.id]).length;
  if (S.flags.cure && S.flags.milLink && S.flags.fateWon && S.survivors >= 8 && S.dark < 70) k = 'true';
  else if (S.dark >= 70 && S.flags.fateWon) k = 'tyrant';
  else if (S.base.ai && S.flags.aiNet && S.flags.aiOn && mods >= 3 && S.dark < 50) k = 'ai';
  else if (S.romance === 'all') k = 'harem';
  else if (S.romance) k = S.romance;
  else if (S.flags.milLink && S.flags.fateWon && S.dark < 70 && S.survivors >= 5) k = 'army';
  else if (S.flags.biaoJoin && S.base.radio && S.survivors >= 8 && S.dark < 40) k = 'merchant';
  else if (built >= 16 && baseDef() >= 85) k = 'fortress';
  else if (S.dark === 0 && S.rep >= 70 && S.survivors >= 10) k = 'lighthouse';
  else if (S.survivors >= 15 && S.rep >= 60) k = 'king';
  else k = 'lone';
  ending(k);
}
function ending(k, cause) {
  S.phase = 'end';
  const seen = addEnding(k);
  const body = ENDING_TXT[k](cause);
  const all = Object.keys(ENDINGS);
  ask([`<div class="end-card"><div class="k">ENDING ${all.indexOf(k) + 1} / ${all.length}</div><h2>${ENDINGS[k]}</h2></div>`, ...body,
    `＊已解鎖結局 ${seen.length} / ${all.length}。自動存檔保留在本輪最後一次行動選單，可以讀取後改變選擇。`], [
    { t: '回到標題畫面', do: title },
    { t: '讀取自動存檔', if: () => !!readSlot('auto'), do: () => load('auto') }
  ]);
}

/* ========== 標題 ========== */
function title() {
  S = null; atHub = false; render();
  const au = readSlot('auto'), seen = endingsSeen();
  $('#text').innerHTML = `<div class="title">
    <div class="tag">2026.12.01 — 2027.12.31 <span class="ver">${VERSION}</span></div>
    <h1>重生末日<br><em>翠湖苑</em></h1>
    <p>上一世，你在臺中這棟老大樓的樓梯間，被笑臉迎人的鄰居推進屍群。<br>睜開眼，回到紅眼病爆發前 31 天。<br>刷爆信用卡、貸光所有能貸的錢，末日之後沒有人會來討債。這一次，換你來決定誰活下去。</p>
    <p style="font-family:var(--f-ui);font-size:13px">${cloudText()}</p>
    <label for="pname">主角名字<input id="pname" maxlength="6" value="林昊"></label>
    <div class="lbl">結局收藏 ${seen.length} / ${Object.keys(ENDINGS).length}</div>
    <div class="gal">${Object.entries(ENDINGS).map(([k, n]) => `<div class="${seen.includes(k) ? '' : 'lock'}"><b>${seen.includes(k) ? n : '？？？'}</b>${seen.includes(k) ? '已達成' : '未解鎖'}</div>`).join('')}</div>
  </div>`;
  $('#text').classList.remove('in');
  renderChoices([
    { t: '重生', sub: '開始新遊戲（約 2 小時以上）', cls: 'hot', do: () => { const nm = ($('#pname').value || '').trim() || '林昊'; S = newState(nm); PROLOGUE(); } },
    { t: '繼續', if: () => !!au, sub: au ? `自動存檔・${au.name}・${au.label}` : '', do: () => load('auto') },
    { t: '讀取存檔', if: () => [1, 2, 3].some(i => readSlot(i)), do: () => { lock = false; S = S || newState(); panelSysTitle(); } }
  ]);
}
function panelSysTitle() {
  const slots = [1, 2, 3].map(i => { const d = readSlot(i); return `<div class="row"><div class="nm">存檔 ${i}</div><div class="pr" style="font-size:12px">${d ? d.label : '空'}</div><div class="bt"><button data-l="${i}" ${d ? '' : 'disabled'}>讀取</button></div></div>`; }).join('');
  S = null;
  openSheet('讀取存檔', slots, b => b.querySelectorAll('[data-l]').forEach(x => x.onclick = () => load(x.dataset.l)));
  lock = false; title();
}

function boot() {
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => panel(b.dataset.p));
  $('#sheetX').onclick = () => closeSheet();
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') closeSheet(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });
  title();
  cloudInit();
}
