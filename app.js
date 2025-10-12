// Fouquet's Stock & Pertes v10.2 — Frontend
const STATE = { lang: localStorage.getItem('lang')||'fr' };
const modal = document.getElementById('modal');
const toastEl = document.getElementById('toast');
const goldSwipe = document.getElementById('gold-swipe');
const sndClick = document.getElementById('sndClick');
const sndOk = document.getElementById('sndOk');

const langSel = document.getElementById('langSel'); langSel.value = STATE.lang;
langSel.addEventListener('change', e=>{ STATE.lang=e.target.value; localStorage.setItem('lang',STATE.lang); location.reload(); });

document.getElementById('btnSettings').onclick=()=> openModal();
document.getElementById('btnCfgClose').onclick=()=> modal.classList.add('hidden');
document.getElementById('btnCfgSave').onclick=()=>{
  localStorage.setItem('apiUrl', document.getElementById('cfgApiUrl').value.trim());
  localStorage.setItem('apiKey', document.getElementById('cfgApiKey').value.trim());
  toast('✅ Config enregistrée'); modal.classList.add('hidden');
  loadDashboard(); loadLookups(); sndOk.play();
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

[...document.querySelectorAll('[data-route-link]')].forEach(btn=>btn.addEventListener('click',()=>{sndClick.play(); showRoute(btn.dataset.routeLink);}));
const routes=[...document.querySelectorAll('[data-route]')];
function showRoute(id){
  document.querySelectorAll('nav.tabs .btn, .home-actions .btn').forEach(n=>n.classList.toggle('active', n.dataset.routeLink===id));
  routes.forEach(r=>r.classList.toggle('hidden', r.dataset.route!==id));
  swipe();
  if(id==='dashboard') loadDashboard();
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

let CHARTS={};
async function loadDashboard(){
  const sj = await apiGET('stock_journalier');
  if(sj?.ok){
    const d=sj.data||{};
    document.getElementById('kpiStockJour').textContent=(d.totalNow||0).toLocaleString(undefined,{style:'currency',currency:'EUR'});
    const delta=d.deltaToday||0; const sign=delta>0?'+':'';
    document.getElementById('kpiStockDelta').textContent=`Δ jour : ${sign}${(delta||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}`;

    // Bar chart par zone
    if(window.Chart){
      if(CHARTS.stockZones) CHARTS.stockZones.destroy();
      const labels=(d.zones||[]).map(z=>z.zone||'(Sans zone)'); const values=(d.zones||[]).map(z=>Math.round((z.valeur||0)*100)/100);
      CHARTS.stockZones=new Chart(document.getElementById('chartStockZones'),{ type:'bar', data:{labels,datasets:[{label:'€',data:values}]}, options:{responsive:true,maintainAspectRatio:false} });
    }

    // Table agrégée par zone
    renderZonesTable(d);

    // Détail stock
    if(Array.isArray(d.rows)) renderStockTable(d.rows);
  }

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

function aggregateZones(data){
  // Prefer d.zones from API, else aggregate from rows
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

function renderZonesTable(d){
  const wrap = document.getElementById('stockZonesTableWrap'); if(!wrap) return;
  const zoneSel = document.getElementById('zoneFilter');
  const all = aggregateZones(d);
  const zf = (zoneSel && zoneSel.value)||'';
  const rows = (zf? all.filter(x=>x.zone===zf) : all);
  const tr = rows.map(z=>`<tr data-zone="${z.zone}"><td>${z.zone}</td><td>${(z.lignes??'—')}</td><td>${z.valeur.toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td></tr>`).join('');
  wrap.innerHTML = `<table><thead><tr><th>Zone</th><th>Lignes</th><th>Valeur</th></tr></thead><tbody>${tr}</tbody></table>`;
  // click to filter
  wrap.querySelectorAll('tbody tr').forEach(tr=>{
    tr.addEventListener('click', ()=>{
      const z = tr.getAttribute('data-zone');
      if(zoneSel){ zoneSel.value = z; }
      renderStockTable(d.rows||[]);
    });
  });
  // export handler
  const btn = document.getElementById('btnExportZone');
  if(btn){
    btn.onclick = ()=> exportZonesCSV(rows);
  }
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

// Pertes
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

// Journalier
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

// Mensuel
document.getElementById('btnGenZone').onclick = async ()=>{
  const mois=document.getElementById('mMois').value.trim();
  const zone=document.getElementById('mZone').value.trim();
  if(!mois||!zone) return toast('⛔ Mois et Zone requis.');
  const r = await apiGET('inventaire_gen_zone', { mois, zone });
  document.getElementById('monthlyInfo').textContent = r.ok? ('✅ Feuille générée : '+(r.sheetName||'')) : ('⚠️ '+(r.error||'Erreur'));
  if(r.ok) sndOk.play();
};

// Init
function init(){
  showRoute('dashboard'); loadDashboard(); loadLookups();
  setInterval(loadDashboard, 30000);
}
init();

// ====== Recettes ======
async function loadRecettes(){
  const q = (document.getElementById('recSearch')?.value||'').trim().toLowerCase();
  const r = await apiGET('recettes');
  if(!r?.ok){ document.getElementById('recListWrap').innerHTML = '⚠️ '+(r.error||'Erreur'); return; }
  let rows = r.data||[];
  if(q) rows = rows.filter(x => (x.nom||'').toLowerCase().includes(q) || (x.categorie||'').toLowerCase().includes(q));
  const html = rows.map(x => `<div class="list-item" data-id="${x.id||''}" data-name="${escapeHtml(x.nom||'')}">
    <b>${escapeHtml(x.nom||'')}</b><br><small>${escapeHtml(x.categorie||'')}</small>
  </div>`).join('') || '—';
  document.getElementById('recListWrap').innerHTML = html;
  document.querySelectorAll('#recListWrap .list-item').forEach(div=>{
    div.addEventListener('click', ()=>{
      const id = div.getAttribute('data-id');
      const name = div.getAttribute('data-name');
      openRecette(id, name);
    });
  });
}
async function openRecette(id, name){
  document.getElementById('recTitle').textContent = name || 'Recette';
  const r = await apiGET('recette_detail', id? {id} : {nom: name});
  const wrap = document.getElementById('recDetailWrap');
  if(!r?.ok){ wrap.innerHTML = '⚠️ '+(r.error||'Erreur'); return; }
  const d = r.data||{};
  const head = `<div class="hint">Catégorie: ${escapeHtml(d.categorie||'')} · Coût total: ${(d.coutTotal||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</div>`;
  const tbl = (d.ingredients||[]).map(x=>`<tr>
      <td>${escapeHtml(x.produit||'')}</td>
      <td>${(x.qte||0).toLocaleString()}</td>
      <td>${escapeHtml(x.unite||'')}</td>
      <td>${(x.prixUnitaire||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td>
      <td>${(x.cout||0).toLocaleString(undefined,{style:'currency',currency:'EUR'})}</td>
    </tr>`).join('');
  wrap.innerHTML = head + `<table class="mt"><thead><tr><th>Produit</th><th>Qté</th><th>Unité</th><th>PU</th><th>Coût</th></tr></thead><tbody>${tbl||'<tr><td colspan="5">—</td></tr>'}</tbody></table>`;
}

const recSearchEl = document.getElementById('recSearch'); if(recSearchEl){ recSearchEl.addEventListener('input', ()=>loadRecettes()); }
const btnRecRefresh = document.getElementById('btnRecRefresh'); if(btnRecRefresh){ btnRecRefresh.onclick = ()=> loadRecettes(); }// ====== Mensuel (édition) ======
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
