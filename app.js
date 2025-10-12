// Fouquet's Stock & Pertes v10.2 — Frontend

// ===== Lang & état =====
const STATE = { lang: localStorage.getItem('lang') || 'fr' };
const modal = document.getElementById('modal');
const toastEl = document.getElementById('toast');
const goldSwipe = document.getElementById('gold-swipe');
const sndClick = document.getElementById('sndClick');
const sndOk = document.getElementById('sndOk');

// ===== i18n minimal (FR/EN/ES/IT) =====
const I18N = {
  fr: {
    tab_dashboard: "Dashboard",
    tab_losses: "Pertes",
    tab_daily: "Journalier",
    tab_monthly: "Mensuel",
    tab_recipes: "Recettes",
    h_dashboard: "Tableau de bord (stock réel)",
    h_losses: "Pertes journalières",
    h_daily: "Inventaire journalier",
    h_monthly: "Inventaire mensuel",
    h_recipes: "Recettes",
    btn_refresh: "Rafraîchir",
    h_prod_value: "Poids (kg) par produit (Top 20)",
    h_stock_zone: "Stock par zone",
    btn_export_csv: "Exporter CSV",
    h_stock_detail: "Détail stock",
    ph_stock_search: "Rechercher un produit ou une zone…",
    btn_save_loss: "Enregistrer la perte",
    lbl_flux: "Flux",
    lbl_product: "Produit",
    lbl_qty: "Quantité",
    lbl_unit: "Unité",
    lbl_reason: "Motif",
    lbl_zone: "Zone",
    btn_save_move: "Enregistrer le mouvement",
    lbl_month: "Mois (AAAA-MM)",
    btn_gen_sheet: "Générer la feuille de zone",
    btn_load: "Charger",
    btn_add_row: "Ajouter une ligne",
    btn_save_inv: "Enregistrer",
    kpi_total_stock: "Total stock",
    kpi_mv7: "Mouvements 7j",
    kpi_loss7: "Pertes 7j",
    kpi_top_loss: "Top perte",
    delta_day: "Δ jour : ",
    chart_x_product: "Produit",
    chart_y_kg: "kg",
    cfg_title: "Configuration API",
    cfg_url: "API URL (WebApp /exec)",
    cfg_key: "API Key",
    btn_cfg_save: "Enregistrer",
    btn_cfg_close: "Fermer",
    lang_applied: "🌐 Langue appliquée"
  },
  en: {
    tab_dashboard: "Dashboard",
    tab_losses: "Losses",
    tab_daily: "Daily",
    tab_monthly: "Monthly",
    tab_recipes: "Recipes",
    h_dashboard: "Dashboard (live stock)",
    h_losses: "Daily losses",
    h_daily: "Daily inventory",
    h_monthly: "Monthly inventory",
    h_recipes: "Recipes",
    btn_refresh: "Refresh",
    h_prod_value: "Weight (kg) by product (Top 20)",
    h_stock_zone: "Stock by zone",
    btn_export_csv: "Export CSV",
    h_stock_detail: "Stock detail",
    ph_stock_search: "Search a product or zone…",
    btn_save_loss: "Save loss",
    lbl_flux: "Flow",
    lbl_product: "Product",
    lbl_qty: "Quantity",
    lbl_unit: "Unit",
    lbl_reason: "Reason",
    lbl_zone: "Zone",
    btn_save_move: "Save movement",
    lbl_month: "Month (YYYY-MM)",
    btn_gen_sheet: "Generate zone sheet",
    btn_load: "Load",
    btn_add_row: "Add row",
    btn_save_inv: "Save",
    kpi_total_stock: "Total stock",
    kpi_mv7: "Moves 7d",
    kpi_loss7: "Losses 7d",
    kpi_top_loss: "Top loss",
    delta_day: "Δ day: ",
    chart_x_product: "Product",
    chart_y_kg: "kg",
    cfg_title: "API Configuration",
    cfg_url: "API URL (WebApp /exec)",
    cfg_key: "API Key",
    btn_cfg_save: "Save",
    btn_cfg_close: "Close",
    lang_applied: "🌐 Language applied"
  },
  es: {
    tab_dashboard: "Panel",
    tab_losses: "Pérdidas",
    tab_daily: "Diario",
    tab_monthly: "Mensual",
    tab_recipes: "Recetas",
    h_dashboard: "Panel (stock real)",
    h_losses: "Pérdidas diarias",
    h_daily: "Inventario diario",
    h_monthly: "Inventario mensual",
    h_recipes: "Recetas",
    btn_refresh: "Actualizar",
    h_prod_value: "Peso (kg) por producto (Top 20)",
    h_stock_zone: "Stock por zona",
    btn_export_csv: "Exportar CSV",
    h_stock_detail: "Detalle de stock",
    ph_stock_search: "Buscar un producto o zona…",
    btn_save_loss: "Guardar pérdida",
    lbl_flux: "Flujo",
    lbl_product: "Producto",
    lbl_qty: "Cantidad",
    lbl_unit: "Unidad",
    lbl_reason: "Motivo",
    lbl_zone: "Zona",
    btn_save_move: "Guardar movimiento",
    lbl_month: "Mes (AAAA-MM)",
    btn_gen_sheet: "Generar hoja de zona",
    btn_load: "Cargar",
    btn_add_row: "Añadir línea",
    btn_save_inv: "Guardar",
    kpi_total_stock: "Stock total",
    kpi_mv7: "Movimientos 7d",
    kpi_loss7: "Pérdidas 7d",
    kpi_top_loss: "Pérdida top",
    delta_day: "Δ día: ",
    chart_x_product: "Producto",
    chart_y_kg: "kg",
    cfg_title: "Configuración API",
    cfg_url: "URL API (WebApp /exec)",
    cfg_key: "Clave API",
    btn_cfg_save: "Guardar",
    btn_cfg_close: "Cerrar",
    lang_applied: "🌐 Idioma aplicado"
  },
  it: {
    tab_dashboard: "Dashboard",
    tab_losses: "Perdite",
    tab_daily: "Giornaliero",
    tab_monthly: "Mensile",
    tab_recipes: "Ricette",
    h_dashboard: "Dashboard (stock reale)",
    h_losses: "Perdite giornaliere",
    h_daily: "Inventario giornaliero",
    h_monthly: "Inventario mensile",
    h_recipes: "Ricette",
    btn_refresh: "Aggiorna",
    h_prod_value: "Peso (kg) per prodotto (Top 20)",
    h_stock_zone: "Stock per zona",
    btn_export_csv: "Esporta CSV",
    h_stock_detail: "Dettaglio stock",
    ph_stock_search: "Cerca prodotto o zona…",
    btn_save_loss: "Registra perdita",
    lbl_flux: "Flusso",
    lbl_product: "Prodotto",
    lbl_qty: "Quantità",
    lbl_unit: "Unità",
    lbl_reason: "Motivo",
    lbl_zone: "Zona",
    btn_save_move: "Registra movimento",
    lbl_month: "Mese (AAAA-MM)",
    btn_gen_sheet: "Genera foglio zona",
    btn_load: "Carica",
    btn_add_row: "Aggiungi riga",
    btn_save_inv: "Salva",
    kpi_total_stock: "Stock totale",
    kpi_mv7: "Movimenti 7g",
    kpi_loss7: "Perdite 7g",
    kpi_top_loss: "Perdita top",
    delta_day: "Δ giorno: ",
    chart_x_product: "Prodotto",
    chart_y_kg: "kg",
    cfg_title: "Configurazione API",
    cfg_url: "URL API (WebApp /exec)",
    cfg_key: "Chiave API",
    btn_cfg_save: "Salva",
    btn_cfg_close: "Chiudi",
    lang_applied: "🌐 Lingua applicata"
  }
};

function t(key){
  const lang = STATE.lang in I18N ? STATE.lang : 'fr';
  return I18N[lang][key] ?? I18N['fr'][key] ?? key;
}

function applyI18n(){
  const setAll = (selector, txt) =>
    document.querySelectorAll(selector).forEach(el => el.textContent = txt);

  // onglets (nav + hero)
  setAll('[data-route-link="dashboard"]', t('tab_dashboard'));
  setAll('[data-route-link="losses"]',    t('tab_losses'));
  setAll('[data-route-link="daily"]',     t('tab_daily'));
  setAll('[data-route-link="monthly"]',   t('tab_monthly'));
  setAll('[data-route-link="recipes"]',   t('tab_recipes'));

  // titres sections
  const hd = document.querySelector('#route-dashboard h2'); if(hd) hd.textContent = t('h_dashboard');
  const hl = document.querySelector('#route-losses h2');    if(hl) hl.textContent = t('h_losses');
  const hj = document.querySelector('#route-daily h2');     if(hj) hj.textContent = t('h_daily');
  const hm = document.querySelector('#route-monthly h2');   if(hm) hm.textContent = t('h_monthly');
  const hr = document.querySelector('#route-recipes h2');   if(hr) hr.textContent = t('h_recipes');

  // dashboard : titre du graphique devient "par produit"
  const s1 = document.querySelector('#route-dashboard .card.mt .row h3');
  if(s1) s1.textContent = t('h_prod_value');
  const btnRefresh = document.getElementById('btnRefreshDash'); if(btnRefresh) btnRefresh.textContent = t('btn_refresh');

  const h3s = document.querySelectorAll('#route-dashboard .card.mt h3');
  if(h3s[1]) h3s[1].textContent = t('h_stock_zone');
  if(h3s[2]) h3s[2].textContent = t('h_stock_detail');

  const stockSearch = document.getElementById('stockSearch');
  if(stockSearch) stockSearch.placeholder = t('ph_stock_search');

  const btnExp = document.getElementById('btnExportZone');
  if(btnExp) btnExp.textContent = t('btn_export_csv');

  // pertes
  const btnLoss = document.getElementById('btnPerteSave'); if(btnLoss) btnLoss.textContent = t('btn_save_loss');
  const lblsLoss = document.querySelectorAll('#formPerte label');
  if(lblsLoss.length >= 5){
    lblsLoss[0].childNodes[0].nodeValue = t('lbl_product');
    lblsLoss[1].childNodes[0].nodeValue = t('lbl_qty');
    lblsLoss[2].childNodes[0].nodeValue = t('lbl_unit');
    lblsLoss[3].childNodes[0].nodeValue = t('lbl_reason');
    lblsLoss[4].childNodes[0].nodeValue = t('lbl_zone');
  }

  // journalier
  const btnMv = document.getElementById('btnJSave'); if(btnMv) btnMv.textContent = t('btn_save_move');
  const lblsDaily = document.querySelectorAll('#formDaily label');
  if(lblsDaily.length >= 5){
    lblsDaily[0].childNodes[0].nodeValue = t('lbl_flux');
    lblsDaily[1].childNodes[0].nodeValue = t('lbl_product');
    lblsDaily[2].childNodes[0].nodeValue = t('lbl_qty');
    lblsDaily[3].childNodes[0].nodeValue = t('lbl_unit');
    lblsDaily[4].childNodes[0].nodeValue = t('lbl_zone');
  }

  // mensuel
  const lblMonth = document.querySelector('#route-monthly .grid-2 label:first-child');
  if(lblMonth){ lblMonth.childNodes[0].nodeValue = t('lbl_month'); }
  const btnGen = document.getElementById('btnGenZone');   if(btnGen)  btnGen.textContent  = t('btn_gen_sheet');
  const btnLoad = document.getElementById('btnLoadZone'); if(btnLoad) btnLoad.textContent = t('btn_load');
  const btnAdd  = document.getElementById('btnAddInvRow');if(btnAdd)  btnAdd.textContent  = t('btn_add_row');
  const btnSave = document.getElementById('btnSaveInv');  if(btnSave) btnSave.textContent = t('btn_save_inv');

  // modal config
  const panel = document.querySelector('#modal .panel h3'); if(panel) panel.textContent = t('cfg_title');
  const cfgUrlLbl = document.querySelector('#modal .panel label:nth-of-type(1)');
  if(cfgUrlLbl){ cfgUrlLbl.childNodes[0].nodeValue = t('cfg_url') + "\n"; }
  const cfgKeyLbl = document.querySelector('#modal .panel label:nth-of-type(2)');
  if(cfgKeyLbl){ cfgKeyLbl.childNodes[0].nodeValue = t('cfg_key') + "\n"; }
  const cfgBtns = document.querySelectorAll('#modal .panel .row button');
  if(cfgBtns[0]) cfgBtns[0].textContent = t('btn_cfg_save');
  if(cfgBtns[1]) cfgBtns[1].textContent = t('btn_cfg_close');
}

// branche le select langue (sans reload)
const langSel = document.getElementById('langSel');
if (langSel) {
  langSel.value = STATE.lang;
  langSel.addEventListener('change', e=>{
    STATE.lang = e.target.value || 'fr';
    localStorage.setItem('lang', STATE.lang);
    applyI18n();
    loadDashboard();
    loadRecipes();
    toast(t('lang_applied'));
  });
}

// ===== Config API =====
document.getElementById('btnSettings').onclick=()=> openModal();
document.getElementById('btnCfgClose').onclick=()=> modal.classList.add('hidden');
document.getElementById('btnCfgSave').onclick=()=>{
  localStorage.setItem('apiUrl', document.getElementById('cfgApiUrl').value.trim());
  localStorage.setItem('apiKey', document.getElementById('cfgApiKey').value.trim());
  toast('✅ Config enregistrée'); modal.classList.add('hidden');
  loadDashboard(); loadLookups(); loadRecipes();
  sndOk.play();
};
function openModal(){
  modal.classList.remove('hidden');
  document.getElementById('cfgApiUrl').value=localStorage.getItem('apiUrl')||'';
  document.getElementById('cfgApiKey').value=localStorage.getItem('apiKey')||'';
}

function ENDPOINT(){ return (localStorage.getItem('apiUrl')||'').replace(/\/$/,'') }
function APIKEY(){ return localStorage.getItem('apiKey')||'' }
async function apiGET(path, params={}){
  const base=ENDPOINT(); if(!base) return {ok:false,error:'Endpoint manquant'};
  const qs=new URLSearchParams({ path, apiKey:APIKEY(), lang:STATE.lang, ...params }).toString();
  const r = await fetch(`${base}?${qs}`); return await r.json();
}

function toast(msg){ toastEl.textContent=msg; toastEl.classList.remove('hidden'); setTimeout(()=>toastEl.classList.add('hidden'),2000); }
function swipe(){ goldSwipe.style.animation='swipe .6s ease'; setTimeout(()=>goldSwipe.style.animation='',700); }

// ===== Router =====
[...document.querySelectorAll('[data-route-link]')].forEach(btn=>btn.addEventListener('click',()=>{sndClick.play(); showRoute(btn.dataset.routeLink);}));
const routes=[...document.querySelectorAll('[data-route]')];
function showRoute(id){
  document.querySelectorAll('nav.tabs .btn, .home-actions .btn').forEach(n=>n.classList.toggle('active', n.dataset.routeLink===id));
  routes.forEach(r=>r.classList.toggle('hidden', r.dataset.route!==id));
  swipe();
  if(id==='dashboard') loadDashboard();
  if(id==='recipes')   loadRecipes();
}

function fillDL(id, items){ const dl=document.getElementById(id); if(!dl) return; dl.innerHTML=(items||[]).map(v=>`<option value="${v}">`).join(''); }
function fillSelectFromList(sel, items){ sel.innerHTML='<option value="">Toutes</option>'+ (items||[]).map(v=>`<option value="${v}">${v}</option>`).join(''); }

async function loadLookups(){
  try {
    const p = await apiGET('produits'); if(p.ok) {
      const produits=[...new Set(p.data.map(x=>x.produit).filter(Boolean))].sort();
      const unites=[...new Set(p.data.map(x=>x.unite).filter(Boolean))].sort();
      fillDL('dlProduits', produits); fillDL('dlUnites', unites);
    }
    const z = await apiGET('zones'); 
    if(z.ok){ 
      fillDL('dlZones', z.data);
      const sel = document.getElementById('zoneFilter'); if(sel) fillSelectFromList(sel, z.data);
    }
  } catch(e){ console.error(e); }
}

// ===== Helpers poids =====
function toKg(q, u){
  const unit = String(u||'').toLowerCase().trim();
  const x = Number(q)||0; if(!x) return 0;
  if (unit==='kg' || unit==='kilogramme' || unit==='kilogrammes') return x;
  if (unit==='g'  || unit==='gramme'     || unit==='grammes')     return x/1000;
  if (unit==='mg' || unit==='milligramme'|| unit==='milligrammes') return x/1e6;
  if (unit==='t'  || unit==='tonne'      || unit==='tonnes')      return x*1000;
  return 0; // on ignore pcs/u/l…
}

// ===== Aggrégations pour le graphique multi-courbes =====
function productZoneKgFromRows(rows){
  // Map produit -> Map zone -> kg
  const m = new Map();
  (rows||[]).forEach(r=>{
    const prod = r.produit || '(Sans nom)';
    const zone = r.zone || '(Sans zone)';
    const kg = toKg(r.qte, r.unite);
    if (!m.has(prod)) m.set(prod, new Map());
    const zm = m.get(prod);
    zm.set(zone, (zm.get(zone)||0) + kg);
  });
  return m;
}

// (conserve pour la table “par zone” existante)
function aggregateZones(data){
  if(Array.isArray(data?.zones) && data.zones.length) {
    return data.zones.map(z=>({ zone:z.zone||'(Sans zone)', valeur:+(z.valeur||0), lignes: z.lignes||null }));
  }
  const map = new Map();
  (data?.rows||[]).forEach(r=>{
    const key = r.zone||'(Sans zone)';
    const cur = map.get(key)||{ zone:key, valeur:0, lignes:0 };
    cur.valeur += +r.valeur||0;
    cur.lignes += 1;
    map.set(key, cur);
  });
  return [...map.values()].sort((a,b)=>b.valeur-a.valeur);
}

// ======== CHART STATE (stabilité zones + produits) ========
let CHARTS = {};
const TOP_N = 10; // nb de produits affichés en courbes

// ——> Taille figée du graphe
const CHART_SIZE = { w: 900, h: 340 };
function ensureFixedChartSize() {
  const canvas = document.getElementById('chartStockZones');
  if (!canvas) return;
  if (canvas.width !== CHART_SIZE.w)  canvas.width  = CHART_SIZE.w;
  if (canvas.height !== CHART_SIZE.h) canvas.height = CHART_SIZE.h;
}

const CHART_STATE = {
  labelsZones: null,
  labelsProducts: null
};

async function loadDashboard(){
  const sj = await apiGET('stock_journalier');
  if(sj?.ok){
    const d=sj.data||{};
    document.getElementById('kpiStockJour').textContent=(d.totalNow||0).toLocaleString(undefined,{style:'currency',currency:'EUR'});
    const delta=d.deltaToday||0; const sign=delta>0?'+':'';
    document.getElementById('kpiStockDelta').textContent=`${t('delta_day')}${sign}${(delta||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}`;

    // === Graphique multi-courbes : 1 courbe par produit (Top N) — poids(kg) par zone ===
    if(window.Chart){
      const mProdZone = productZoneKgFromRows(d.rows || []);

      // Figer les ZONES au 1er rendu (ordre = zones les plus lourdes)
      if (!CHART_STATE.labelsZones) {
        const zoneTotals = new Map();
        (d.rows||[]).forEach(r=>{
          const z = r.zone || '(Sans zone)';
          zoneTotals.set(z, (zoneTotals.get(z)||0) + toKg(r.qte, r.unite));
        });
        const zonesSorted = [...zoneTotals.entries()]
          .sort((a,b)=> b[1]-a[1])
          .map(([z])=>z);
        CHART_STATE.labelsZones = zonesSorted.length ? zonesSorted : ['(Sans zone)'];
      }

      // Figer les PRODUITS au 1er rendu (Top N par poids total)
      if (!CHART_STATE.labelsProducts) {
        const prodTotals = [...mProdZone.entries()].map(([p, zm]) => ({
          produit: p,
          kg: [...zm.values()].reduce((t,x)=>t+x,0)
        }));
        CHART_STATE.labelsProducts = prodTotals
          .sort((a,b)=> b.kg - a.kg)
          .slice(0, TOP_N)
          .map(x=>x.produit);
      }

      // Construire datasets (un par produit) alignés sur les zones figées
      const labelsX = CHART_STATE.labelsZones;
      const products = CHART_STATE.labelsProducts;

      const datasets = products.map(prod => {
        const zm = mProdZone.get(prod) || new Map();
        const data = labelsX.map(z => Math.round(((zm.get(z)||0))*1000)/1000);
        return {
          label: prod,
          data,
          fill: false,
          tension: 0.25,
          pointRadius: 2,
          pointHoverRadius: 4
        };
      });

      // ——— Taille figée AVANT création/maj du chart
      ensureFixedChartSize();

      const ctx = document.getElementById('chartStockZones');
      if (!CHARTS.stockZones) {
        CHARTS.stockZones = new Chart(ctx, {
          type: 'line',
          data: { labels: labelsX, datasets },
          options: {
            // ——> taille figée : pas de responsive
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
              y: {
                title: { display: true, text: t('chart_y_kg') },
                ticks: { callback: v => `${v} ${t('chart_y_kg')}` }
              },
              x: { title: { display: true, text: t('h_stock_zone') } }
            },
            plugins: {
              tooltip: {
                animation: false,
                callbacks: {
                  label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString()} ${t('chart_y_kg')}`
                }
              },
              legend: { display: true }
            }
          }
        });
      } else {
        // mise à jour « stable » (même taille, mêmes labels)
        ensureFixedChartSize();
        CHARTS.stockZones.data.labels = labelsX;
        CHARTS.stockZones.data.datasets = datasets;
        CHARTS.stockZones.update('none');
      }
    }

    // Table agrégée par zone (inchangée, valeur €)
    renderZonesTable(d);

    // Détail stock (inchangé)
    if(Array.isArray(d.rows)) renderStockTable(d.rows);
  }

  // KPIs (inchangés)
  const k = await apiGET('dashboard_kpis');
  if(k?.ok){
    const kv = k.data||{};
    document.getElementById('kpiMv7').textContent = (kv.mv7?.total||0).toLocaleString();
    const lossSum = (kv.topLoss7||[]).reduce((t,x)=>t+(x.valeur||0),0);
    document.getElementById('kpiLoss7').textContent = lossSum.toLocaleString(undefined,{style:'currency',currency:'EUR'});
    document.getElementById('kpiTop').textContent = (kv.topLoss7?.[0]?.produit||'—');
  }
}

function renderStockTable(list){
  const wrap=document.getElementById('stockTableWrap'); if(!wrap) return;
  if(!list||!list.length){ wrap.innerHTML='—'; return; }
  const q=document.getElementById('stockSearch').value?.toLowerCase()||'';
  const zoneSel = document.getElementById('zoneFilter'); const zf = (zoneSel && zoneSel.value)||'';
  const filtered = list.filter(r=> (q?`${r.produit||''} ${r.zone||''}`.toLowerCase().includes(q):true) && (zf? (r.zone||'')===zf : true));
  const tr=filtered.map(r=>`<tr><td>${r.produit||''}</td><td>${r.zone||''}</td><td>${(r.qte||0).toLocaleString()}</td><td>${r.unite||''}</td><td>${(r.valeur||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td></tr>`).join('');
  wrap.innerHTML=`<table><thead><tr><th>Produit</th><th>Zone</th><th>Qté</th><th>Unité</th><th>Valeur</th></tr></thead><tbody>${tr}</tbody></table>`;
}

function renderZonesTable(d){
  const wrap = document.getElementById('stockZonesTableWrap'); if(!wrap) return;
  const zoneSel = document.getElementById('zoneFilter');
  const all = aggregateZones(d);
  const zf = (zoneSel && zoneSel.value)||'';
  const rows = (zf? all.filter(x=>x.zone===zf) : all);
  const tr = rows.map(z=>`<tr data-zone="${z.zone}"><td>${z.zone}</td><td>${(z.lignes??'—')}</td><td>${z.valeur.toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td></tr>`).join('');
  wrap.innerHTML = `<table><thead><tr><th>Zone</th><th>Lignes</th><th>Valeur</th></tr></thead><tbody>${tr}</tbody></table>`;
  wrap.querySelectorAll('tbody tr').forEach(tr=>{
    tr.addEventListener('click', ()=>{
      const z = tr.getAttribute('data-zone');
      if(zoneSel){ zoneSel.value = z; }
      renderStockTable(d.rows||[]);
    });
  });
  const btn = document.getElementById('btnExportZone');
  if(btn){ btn.onclick = ()=> exportZonesCSV(rows); }
}

function exportZonesCSV(rows){
  const headers = ['Zone','Lignes','Valeur_EUR'];
  const csv = [headers.join(';')].concat(
    rows.map(r=>[r.zone, r.lignes??'', (Math.round((r.valeur||0)*100)/100).toString().replace('.',',')].join(';'))
  ).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='stock_par_zone.csv'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

document.getElementById('stockSearch').addEventListener('input',()=>loadDashboard());
document.getElementById('btnRefreshDash').onclick=()=>{ sndClick.play(); loadDashboard(); };
const zoneFilterEl = document.getElementById('zoneFilter');
if(zoneFilterEl){ zoneFilterEl.addEventListener('change', ()=>{ loadDashboard(); }); }

function clearForm(sel){ document.querySelectorAll(sel+' input').forEach(i=> i.value=''); const s = document.querySelector(sel+' select'); if(s) s.selectedIndex=0; }

// ===== Pertes =====
document.getElementById('btnPerteSave').onclick = async ()=>{
  const body={ type:'PERTE',
    produit: document.getElementById('perteProduit').value.trim(),
    qte: parseFloat(document.getElementById('perteQte').value)||0,
    unite: document.getElementById('perteUnite').value.trim(),
    motif: document.getElementById('perteMotif').value.trim(),
    zone:  document.getElementById('perteZone').value.trim()
  };
  if(!body.produit || body.qte<=0) return toast('⛔ Produit et quantité requises');
  const r = await apiGET('mouvement', body);
  toast(r.ok? '✅ Perte enregistrée' : ('⚠️ '+(r.error||'Erreur')));
  if(r.ok){ sndOk.play(); clearForm('#formPerte'); } else sndClick.play();
  loadDashboard();
};

// ===== Journalier =====
document.getElementById('btnJSave').onclick = async ()=>{
  const type=(document.getElementById('jFlux').value||'').toUpperCase();
  const body={ type,
    produit: document.getElementById('jProduit').value.trim(),
    qte: parseFloat(document.getElementById('jQte').value)||0,
    unite: document.getElementById('jUnite').value.trim(),
    zone:  document.getElementById('jZone').value.trim()
  };
  if(!body.produit || body.qte<=0 || !['ENTREE','SORTIE'].includes(type)) return toast('⛔ Flux/Produit/Qté');
  const r = await apiGET('mouvement', body);
  toast(r.ok? '✅ Mouvement enregistré' : ('⚠️ '+(r.error||'Erreur')));
  if(r.ok){ sndOk.play(); clearForm('#formDaily'); } else sndClick.play();
  loadDashboard();
};

// ===== Mensuel =====
document.getElementById('btnGenZone').onclick = async ()=>{
  const mois=document.getElementById('mMois').value.trim();
  const zone=document.getElementById('mZone').value.trim();
  if(!mois||!zone) return toast('⛔ Mois et Zone requis.');
  const r = await apiGET('inventaire_gen_zone', { mois, zone });
  document.getElementById('monthlyInfo').textContent = r.ok? ('✅ Feuille générée : '+(r.sheetName||'')) : ('⚠️ '+(r.error||'Erreur'));
  if(r.ok) sndOk.play();
};

// ===== Recettes =====
const RECIPES = { all: [], filtered: [] };

async function loadRecipes(){
  const q = (document.getElementById('rSearch')?.value || '').trim().toLowerCase();
  const res = await apiGET('recettes');
  const wrap = document.getElementById('recipesList');
  if(!res?.ok){ if(wrap) wrap.innerHTML = '⚠️ '+(res?.error||'Erreur'); return; }
  RECIPES.all = Array.isArray(res.data) ? res.data : [];
  RECIPES.filtered = q
    ? RECIPES.all.filter(x => (x.nom||'').toLowerCase().includes(q) || (x.categorie||'').toLowerCase().includes(q))
    : RECIPES.all.slice();
  renderRecipesList(RECIPES.filtered);
}

function renderRecipesList(list){
  const wrap = document.getElementById('recipesList');
  if(!wrap) return;
  if(!list || list.length===0){ wrap.innerHTML = '—'; return; }

  wrap.innerHTML = list.map(r => `
    <div class="rec-card" data-id="${r.id||''}" data-name="${escapeHtml(r.nom||'')}">
      <div class="rec-head">
        <div>
          <div class="rec-name">${escapeHtml(r.nom||'')}</div>
          <div class="rec-meta">Catégorie: ${escapeHtml(r.categorie||'')}</div>
        </div>
        <div class="rec-money">
          <div>Coût/portion: ${(r.coutPortion||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</div>
          <div>Prix vente: ${(r.prixVente||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</div>
        </div>
      </div>
      <div class="rec-detail" hidden>
        <div class="rec-loading">Chargement…</div>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('.rec-card').forEach(card=>{
    card.addEventListener('click', async ()=>{
      const detail = card.querySelector('.rec-detail');
      const isHidden = detail.hasAttribute('hidden');
      wrap.querySelectorAll('.rec-detail').forEach(d=> d.setAttribute('hidden',''));
      if(!isHidden) return;

      detail.innerHTML = `<div class="rec-loading">Chargement…</div>`;
      detail.removeAttribute('hidden');

      const id = card.getAttribute('data-id');
      const name = card.getAttribute('data-name');
      const r = await apiGET('recette_detail', id ? {id} : {nom:name});
      if(!r?.ok){ detail.innerHTML = '⚠️ '+(r?.error||'Erreur'); return; }
      renderRecipeDetail(detail, r.data);
    });
  });
}

function renderRecipeDetail(container, data){
  const mul = parseFloat(document.getElementById('rMul')?.value)||1;
  const ing = (data.ingredients||[]).map(x=>({
    produit: x.produit||'',
    unite: x.unite||'',
    qte: (Number(x.qte||0)*mul),
    prixUnitaire: Number(x.prixUnitaire||0),
    cout: Number(x.cout ?? (Number(x.qte||0)*Number(x.prixUnitaire||0))) * mul
  }));
  const coutTotal = ing.reduce((t,x)=>t+Number(x.cout||0),0);

  container.innerHTML = `
    <div class="hint">x${mul} — Coût total: ${coutTotal.toLocaleString(undefined,{style:'currency',currency:'EUR'})}${data.tva?` · TVA ${Number(data.tva)}%`:''}</div>
    <table class="mt">
      <thead><tr><th>Produit</th><th>Qté</th><th>Unité</th><th>PU</th><th>Coût</th></tr></thead>
      <tbody>
        ${(ing.length?ing:[{produit:'—',qte:'',unite:'',prixUnitaire:'',cout:''}]).map(x=>`
          <tr>
            <td>${escapeHtml(x.produit||'')}</td>
            <td>${(x.qte||0).toLocaleString()}</td>
            <td>${escapeHtml(x.unite||'')}</td>
            <td>${(x.prixUnitaire||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td>
            <td>${(x.cout||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Recherche & multiplicateur (Recettes)
const rSearchEl = document.getElementById('rSearch');
if(rSearchEl){ rSearchEl.addEventListener('input', ()=> loadRecipes()); }
const rMulEl = document.getElementById('rMul');
if(rMulEl){ rMulEl.addEventListener('input', ()=>{
  const open = document.querySelector('#recipesList .rec-detail:not([hidden])');
  if(!open) return;
  const parent = open.closest('.rec-card');
  const id = parent?.getAttribute('data-id');
  const name = parent?.getAttribute('data-name');
  apiGET('recette_detail', id ? {id} : {nom:name}).then(r=>{
    if(r?.ok) renderRecipeDetail(open, r.data);
  });
}); }

// ===== Mensuel (édition) =====
function monthKey(){ return document.getElementById('mMois').value.trim(); }
function zoneKey(){ return document.getElementById('mZone').value.trim(); }

async function loadMonthlyZone(){
  const mois = monthKey(), zone = zoneKey();
  if(!mois || !zone){ toast('⛔ Mois et Zone requis.'); return; }
  document.getElementById('mHeader').textContent = `${mois} — ${zone}`;
  const r = await apiGET('inventaire_zone_rows', { mois, zone });
  if(!r?.ok){ document.getElementById('monthlyInfo').textContent = '⚠️ '+(r?.error||'Impossible de charger la zone'); renderMonthlyTable([]); return; }
  document.getElementById('monthlyInfo').textContent = `✅ ${r.rows?.length||0} lignes`;
  renderMonthlyTable(r.rows||[]);
}

function renderMonthlyTable(rows){
  const wrap = document.getElementById('monthlyTableWrap');
  const tr = (rows||[]).map((x,i)=> rowToTR(i, x.produit||'', x.unite||'', x.qte||0)).join('');
  wrap.innerHTML = `<table id="tblMonthly"><thead><tr><th>Produit</th><th>Unité</th><th>Qté</th><th></th></tr></thead><tbody>${tr}</tbody></table>`;
  bindRowButtons();
}

function rowToTR(i, produit, unite, qte){
  return `<tr>
    <td><input list="dlProduits" value="${escapeHtml(produit||'')}"></td>
    <td><input list="dlUnites" value="${escapeHtml(unite||'')}"></td>
    <td><input type="number" step="any" value="${qte||0}"></td>
    <td><button class="btn btnRowDel">✕</button></td>
  </tr>`;
}

function bindRowButtons(){
  document.querySelectorAll('#tblMonthly .btnRowDel').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.closest('tr').remove();
    });
  });
}

function collectMonthlyRows(){
  const rows = [];
  document.querySelectorAll('#tblMonthly tbody tr').forEach(tr => {
    const tds = tr.querySelectorAll('td');
    const produit = tds[0].querySelector('input').value.trim();
    const unite = tds[1].querySelector('input').value.trim();
    const qte = parseFloat(tds[2].querySelector('input').value)||0;
    if(produit){ rows.push({produit, unite, qte}); }
  });
  return rows;
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

document.getElementById('btnLoadZone').onclick = ()=>{ sndClick.play(); loadMonthlyZone(); };
document.getElementById('btnAddInvRow').onclick = ()=>{
  const tb = document.querySelector('#tblMonthly tbody');
  if(!tb){
    renderMonthlyTable([{produit:'', unite:'', qte:0}]);
  } else {
    tb.insertAdjacentHTML('beforeend', rowToTR(Date.now(), '', '', 0));
    bindRowButtons();
  }
};

document.getElementById('btnSaveInv').onclick = async ()=>{
  const mois = monthKey(), zone = zoneKey();
  if(!mois || !zone) return toast('⛔ Mois et Zone requis.');
  const rows = collectMonthlyRows();
  const r = await apiGET('inventaire_save_zone', { mois, zone, rows: JSON.stringify(rows) });
  toast(r.ok? '✅ Inventaire enregistré' : ('⚠️ '+(r.error||'Erreur')));
  if(r.ok) sndOk.play();
};

// ===== Init =====
function init(){
  showRoute('dashboard');
  applyI18n();
  loadDashboard();
  loadLookups();
  loadRecipes();
  setInterval(loadDashboard, 30000);
}
init();
