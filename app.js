// ════════════════════════════════════════════════════
// メインアプリロジック
// ════════════════════════════════════════════════════

let currentEra='all';
let currentRankMetric='psa10';
let currentBoxEra='all';

function fmtJPY(n){return '¥'+n.toLocaleString();}
function fmtUSD(n){return '$'+n.toLocaleString();}

function showMain(tab){
  document.querySelectorAll('.hnav-item').forEach(t=>t.classList.toggle('active', t.dataset.main===tab));
  ['search','ranking','box','oripa','shop'].forEach(t=>{
    document.getElementById('main-'+t+'-section').style.display = (t===tab)?'block':'none';
  });
  document.getElementById('hero-section').style.display = (tab==='search')?'block':'none';
  document.getElementById('trending-section').style.display = (tab==='search')?'block':'none';
}

function showRTab(tab){
  document.querySelectorAll('#main-ranking-section .maintab').forEach(t=>t.classList.toggle('active', t.dataset.rtab===tab));
  document.getElementById('r-rank').style.display = tab==='rank'?'block':'none';
  document.getElementById('r-market').style.display = tab==='market'?'block':'none';
  document.getElementById('r-era').style.display = tab==='era'?'block':'none';
}

// ── HERO BACKGROUND (real card art) ──
async function loadHeroBg(){
  try {
    const names = ['Charizard','Rayquaza','Pikachu','Lugia'];
    const promises = names.map(name =>
      fetch(`https://api.pokemontcg.io/v2/cards?q=name:${name}&pageSize=1&orderBy=-set.releaseDate`)
        .then(r => r.ok ? r.json() : {data:[]}).catch(() => ({data:[]}))
    );
    const resultsArr = await Promise.all(promises);
    const imgs = resultsArr.map(r => r.data && r.data[0] && r.data[0].images ? r.data[0].images.small : null).filter(Boolean);
    if(imgs.length === 0) return;
    const classes = ['b1','b2','b3','b4'];
    document.getElementById('hero-bg-images').innerHTML = imgs.map((src,i) =>
      `<img class="${classes[i]||''}" src="${src}" alt="">`
    ).join('');
  } catch(e){ console.error('Hero bg load error:', e); }
}

// ── TRENDING CAROUSEL ──
const trendingNames = ['Charizard','Pikachu','Mewtwo','Rayquaza','Umbreon','Gardevoir','Lugia','Eevee','Greninja','Snorlax'];

async function loadTrending(){
  const track = document.getElementById('trending-track');
  track.innerHTML = '<div class="trending-loading">人気カードを読み込み中...</div>';
  try {
    const promises = trendingNames.map(name =>
      fetch(`https://api.pokemontcg.io/v2/cards?q=name:${name}&pageSize=3&orderBy=-set.releaseDate`)
        .then(r => r.ok ? r.json() : {data:[]})
        .catch(() => ({data:[]}))
    );
    const resultsArr = await Promise.all(promises);
    let allCards = [];
    resultsArr.forEach(r => { if(r.data && r.data.length) allCards.push(r.data[0]); });

    if(allCards.length === 0){
      document.getElementById('trending-section').style.display = 'none';
      return;
    }

    window._trendingCache = allCards;
    const doubled = [...allCards, ...allCards];
    track.innerHTML = doubled.map((c, i) => {
      const img = c.images && c.images.small ? c.images.small : '';
      const realIdx = i % allCards.length;
      return `<div class="trending-card" onclick="openTrendingDetail(${realIdx})">
        <img src="${img}" alt="${c.name}" loading="lazy">
        <div class="trending-card-name">${c.name}</div>
      </div>`;
    }).join('');
  } catch(e){
    console.error('Trending load error:', e);
    document.getElementById('trending-section').style.display = 'none';
  }
}

function openTrendingDetail(idx){
  window._searchCache = window._trendingCache;
  openRealCardDetail(idx);
}

async function quickSearch(name){
  document.getElementById('main-search').value = name;
  doRealSearch();
}

async function doRealSearch(){
  const rawQ = document.getElementById('main-search').value.trim();
  if(!rawQ){ document.getElementById('search-results').innerHTML = '<div class="no-result">カード名を入力してください</div>'; return; }

  const q = translateQuery(rawQ);
  document.getElementById('search-results').innerHTML = '<div class="loading-inline"><div class="spinner"></div>カードデータベースを検索中...</div>';
  document.getElementById('search-upd').textContent = '';
  document.getElementById('search-results').scrollIntoView({behavior:'smooth', block:'start'});

  try {
    const url = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(q)}*&pageSize=60&orderBy=-set.releaseDate`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    let results = data.data || [];
    if(results.length === 0){
      const url2 = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(q)}&pageSize=60`;
      const res2 = await fetch(url2);
      if(res2.ok){
        const data2 = await res2.json();
        results = data2.data || [];
      }
    }
    renderSearchResults(results, rawQ, q);
  } catch(e){
    console.error('Search error:', e);
    document.getElementById('search-results').innerHTML = `<div class="no-result">検索中にエラーが発生しました。少し時間をおいて再度お試しください。<br><span style="font-size:0.72rem;color:#666">(${e.message})</span></div>`;
  }
}

function renderSearchResults(results, query){
  if(results.length===0){
    document.getElementById('search-results').innerHTML = `<div class="no-result">「${query}」に一致するカードが見つかりませんでした。英語名（例：Charizard, Pikachu, Rayquaza）でお試しください。</div>`;
    return;
  }
  document.getElementById('search-upd').textContent = `${results.length}件のカードが見つかりました`;
  window._searchCache = results;
  document.getElementById('search-results').innerHTML = `<div class="card-grid">` + results.map((c,i)=>{
    const img = c.images && c.images.small ? c.images.small : '';
    const setName = c.set ? c.set.name : '';
    const rarity = c.rarity || '';
    const imgHtml = img
      ? `<img src="${img}" alt="${c.name}" loading="lazy" onerror="this.parentElement.querySelector('.tile-placeholder').style.display='flex';this.style.display='none'">`
      : '';
    return `<div class="card-tile" onclick="openRealCardDetail(${i})">
      <div class="card-tile-imgwrap">
        ${imgHtml}
        <div class="tile-placeholder" style="display:${img?'none':'flex'}">🎴</div>
      </div>
      <div class="card-tile-name">${c.name}</div>
      <div class="card-tile-set">${setName}</div>
      ${rarity?`<div class="card-tile-rarity">${rarity}</div>`:''}
    </div>`;
  }).join('') + `</div>`;
}

function openRealCardDetail(idx){
  const c = window._searchCache[idx];
  if(!c)return;
  const img = c.images ? (c.images.large || c.images.small) : '';
  document.getElementById('d-img').src = img;
  document.getElementById('d-img').style.display='inline';
  document.getElementById('d-title').textContent = c.name;
  document.getElementById('d-sub').textContent = (c.set?c.set.name:'') + (c.number?` ・ No.${c.number}`:'') + (c.rarity?` ・ ${c.rarity}`:'');

  let gridHtml='';
  if(c.set && c.set.releaseDate) gridHtml += `<div class="detail-stat"><div class="detail-stat-label">発売日</div><div class="detail-stat-val">${c.set.releaseDate}</div></div>`;
  if(c.hp) gridHtml += `<div class="detail-stat"><div class="detail-stat-label">HP</div><div class="detail-stat-val">${c.hp}</div></div>`;
  if(c.types) gridHtml += `<div class="detail-stat"><div class="detail-stat-label">タイプ</div><div class="detail-stat-val">${c.types.join('・')}</div></div>`;
  if(c.artist) gridHtml += `<div class="detail-stat"><div class="detail-stat-label">イラストレーター</div><div class="detail-stat-val" style="font-size:0.85rem">${c.artist}</div></div>`;
  document.getElementById('d-grid').innerHTML = gridHtml;
  document.getElementById('d-note').style.display='none';

  const q = encodeURIComponent(c.name);
  document.getElementById('d-affiliate').innerHTML = buildAffiliateLinks(q);
  document.getElementById('detail-overlay').classList.add('active');
}

function getFiltered(){ return cards.filter(c => currentEra==='all'||c.era===currentEra); }

const metricConfig = {
  psa10: {label:'PSA10鑑定数', sortKey:'psa10', fmt:v=>v.toLocaleString()+'枚'},
  trades: {label:'直近30日取引数', sortKey:'trades_30d', fmt:v=>v.toLocaleString()+'件'},
  gem: {label:'Gem率(PSA10達成率)', sortKey:'gem_rate', fmt:v=>v.toFixed(1)+'%'},
  bad: {label:'Bad率(PSA6以下率)', sortKey:'bad_rate', fmt:v=>v.toFixed(1)+'%'},
};

function setRankMetric(metric){
  currentRankMetric = metric;
  document.querySelectorAll('.chip[data-metric]').forEach(c=>c.classList.toggle('active', c.dataset.metric===metric));
  renderRanking();
}

function renderRanking(){
  const filtered = getFiltered();
  const cfg = metricConfig[currentRankMetric];
  const sorted=[...filtered].sort((a,b)=> currentRankMetric==='bad' ? a[cfg.sortKey]-b[cfg.sortKey] : b[cfg.sortKey]-a[cfg.sortKey] );
  // for bad rate, lower is "better" (safer) so we show highest bad rate as caution list — actually show as ranking of highest risk
  document.getElementById('upd-rank').textContent='最終更新: '+UPDATE_DATE+' ・ '+cfg.label+'順';
  if(sorted.length===0){ document.getElementById('ranking-list').innerHTML = '<div class="no-result">該当するカードが見つかりませんでした</div>'; return; }

  let displaySorted = sorted;
  if(currentRankMetric==='bad'){
    displaySorted = [...filtered].sort((a,b)=>b.bad_rate-a.bad_rate);
  }

  document.getElementById('ranking-list').innerHTML = displaySorted.map((c,i)=>{
    const rankClass = i===0?'top1':i===1?'top2':i===2?'top3':'';
    const trendClass = c.trend==='up'?'trend-up':c.trend==='down'?'trend-down':'';
    const trendIcon = c.trend==='up'?'▲':c.trend==='down'?'▼':'–';
    const mainVal = cfg.fmt(c[cfg.sortKey]);
    return `<div class="rank-row" onclick="openCuratedDetail(${c.id})">
      <div class="rank-num ${rankClass}">${i+1}</div>
      <div class="rank-thumb">${c.emoji}</div>
      <div class="rank-info">
        <div class="rank-name">${c.name}</div>
        <div class="rank-meta">${c.set}<span class="era-tag">${eraNames[c.era].split('（')[0]}</span></div>
      </div>
      <div class="rank-stats">
        <div class="stat-block"><div class="stat-val">${mainVal}</div><div class="stat-label">${cfg.label}</div></div>
        <div class="stat-block"><div class="stat-val ${trendClass}">${trendIcon} ${c.trend_pct}</div><div class="stat-label">価格推移</div></div>
      </div>
    </div>`;
  }).join('');
}

function renderEra(){
  let html='';
  Object.keys(eraNames).forEach(eraKey=>{
    const top5 = cards.filter(c=>c.era===eraKey).sort((a,b)=>b.jp_price-a.jp_price).slice(0,5);
    if(top5.length===0)return;
    html += `<div class="era-block"><div class="era-block-title">${eraNames[eraKey]}</div>`;
    html += top5.map((c,i)=>`<div class="rank-row" onclick="openCuratedDetail(${c.id})">
      <div class="rank-num ${i===0?'top1':''}">${i+1}</div>
      <div class="rank-thumb">${c.emoji}</div>
      <div class="rank-info"><div class="rank-name">${c.name}</div><div class="rank-meta">${c.set}</div></div>
      <div class="rank-stats"><div class="stat-block"><div class="stat-val">${fmtJPY(c.jp_price)}</div><div class="stat-label">国内相場</div></div></div>
    </div>`).join('');
    html += `</div>`;
  });
  document.getElementById('era-list').innerHTML = html;
}

function renderMarket(){
  document.getElementById('upd-market').textContent='最終更新: '+UPDATE_DATE;
  document.getElementById('market-list').innerHTML = `<div class="box-grid">` + marketCards.map(m=>{
    const maxH = Math.max(...m.history);
    const bars = m.history.map(h=>`<div style="flex:1;background:linear-gradient(to top,rgba(255,200,69,0.15),rgba(255,200,69,0.5));border-radius:2px 2px 0 0;height:${(h/maxH*100)}%"></div>`).join('');
    return `<div class="box-card">
      <div class="box-card-top"><div class="box-emoji">${m.emoji}</div><div><div class="box-name">${m.name}</div></div></div>
      <div class="box-price-row"><span class="box-price-label">国内相場</span><span class="box-price">${fmtJPY(m.jp)}</span></div>
      <div class="box-price-row" style="border-top:none;padding-top:0"><span class="box-price-label">海外相場</span><span class="box-price" style="color:var(--blue);font-size:1.1rem">${fmtUSD(m.us)}</span></div>
      <div style="height:42px;display:flex;align-items:flex-end;gap:3px;margin-top:10px">${bars}</div>
    </div>`;
  }).join('') + `</div>`;
}

function setEra(era){
  currentEra=era;
  document.querySelectorAll('.chip[data-era]').forEach(c=>c.classList.toggle('active',c.dataset.era===era));
  renderRanking();
}

function openCuratedDetail(id){
  const c = cards.find(x=>x.id===id);
  if(!c)return;
  document.getElementById('d-img').style.display='none';
  document.getElementById('d-title').textContent=c.name;
  document.getElementById('d-sub').textContent=c.set+' ・ '+eraNames[c.era];
  document.getElementById('d-grid').innerHTML = `
    <div class="detail-stat"><div class="detail-stat-label">PSA10鑑定数</div><div class="detail-stat-val">${c.psa10.toLocaleString()}枚</div></div>
    <div class="detail-stat"><div class="detail-stat-label">PSA9鑑定数</div><div class="detail-stat-val">${c.psa9.toLocaleString()}枚</div></div>
    <div class="detail-stat"><div class="detail-stat-label">Gem率 (PSA10達成率)</div><div class="detail-stat-val" style="color:var(--green)">${c.gem_rate.toFixed(1)}%</div></div>
    <div class="detail-stat"><div class="detail-stat-label">Bad率 (PSA6以下率)</div><div class="detail-stat-val" style="color:var(--red)">${c.bad_rate.toFixed(1)}%</div></div>
    <div class="detail-stat"><div class="detail-stat-label">直近30日取引数</div><div class="detail-stat-val">${c.trades_30d.toLocaleString()}件</div></div>
    <div class="detail-stat"><div class="detail-stat-label">国内相場（参考）</div><div class="detail-stat-val">${fmtJPY(c.jp_price)}</div></div>`;
  document.getElementById('d-note').style.display='block';
  document.getElementById('d-note').textContent=c.note;
  const q = encodeURIComponent(c.name.replace(/\(.+?\)/g,'').trim());
  document.getElementById('d-affiliate').innerHTML = buildAffiliateLinks(q);
  document.getElementById('detail-overlay').classList.add('active');
}

function closeDetail(){
  document.getElementById('detail-overlay').classList.remove('active');
  document.getElementById('d-img').style.display='inline';
}

function buildAffiliateLinks(q){
  return `
    <a class="aff-link" href="https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFF_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${q}%2F" target="_blank" rel="noopener sponsored">
      <span class="aff-link-shop">楽天市場で探す</span><span class="aff-link-arrow">→</span>
    </a>
    <a class="aff-link" href="https://www.amazon.co.jp/s?k=${q}&tag=${AMAZON_TAG}" target="_blank" rel="noopener sponsored">
      <span class="aff-link-shop">Amazonで探す</span><span class="aff-link-arrow">→</span>
    </a>
    <a class="aff-link" href="https://www.cardrush-pokemon.jp/product-list?keyword=${q}" target="_blank" rel="noopener sponsored">
      <span class="aff-link-shop">カードラッシュで探す</span><span class="aff-link-arrow">→</span>
    </a>`;
}

function setBoxEra(era){
  currentBoxEra=era;
  document.querySelectorAll('.chip[data-boxera]').forEach(c=>c.classList.toggle('active',c.dataset.boxera===era));
  renderBox();
}

function renderBox(){
  document.getElementById('upd-box').textContent='最終更新: '+UPDATE_DATE+` ・ 全${boxes.length}種`;
  const filtered = currentBoxEra==='all' ? boxes : boxes.filter(b=>b.era===currentBoxEra);
  if(filtered.length===0){ document.getElementById('box-list').innerHTML='<div class="no-result">該当するBOXが見つかりませんでした</div>'; return; }
  document.getElementById('box-list').innerHTML = filtered.map(b=>`
    <div class="box-card">
      <div class="box-card-top">
        <div class="box-visual"><span>${b.emoji}</span></div>
        <div><div class="box-name">${b.name}</div><div class="box-release">${b.release}<span class="era-tag">${boxEraNames[b.era]}</span></div></div>
      </div>
      <div class="box-price-row"><span class="box-price-label">参考価格</span><span class="box-price">${fmtJPY(b.price)}</span></div>
      <div class="box-meta-row"><span>${b.perBox}</span></div>
      <a class="box-buy-btn" href="https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFF_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${encodeURIComponent(b.rakutenQ)}%2F" target="_blank" rel="noopener sponsored">楽天市場で探す →</a>
    </div>`).join('');
}

function renderOripa(){
  document.getElementById('upd-oripa').textContent='最終更新: '+UPDATE_DATE;
  document.getElementById('oripa-list').innerHTML = oripas.map(o=>{
    const fullStars = Math.floor(o.rating);
    const starStr = '★'.repeat(fullStars) + '☆'.repeat(5-fullStars);
    return `<div class="oripa-card" style="position:relative">
      <div class="oripa-rank-badge">#${o.rank}</div>
      <div class="oripa-banner">${o.emoji}</div>
      <div class="oripa-body">
        <div class="oripa-name">${o.name}</div>
        <div class="oripa-rating"><span class="stars">${starStr}</span><span class="oripa-rating-num">${o.rating} (${o.reviews})</span></div>
        <div class="oripa-tags">${o.tags.map(t=>`<span class="oripa-tag">${t}</span>`).join('')}</div>
        <div class="oripa-desc">${o.desc}</div>
        ${o.code ? `<div class="oripa-code">🎁 ${o.code}</div>` : ''}
        <a class="oripa-btn" href="${o.url}" target="_blank" rel="noopener sponsored">公式サイトを見る →</a>
      </div>
    </div>`;
  }).join('');
}

function renderShop(){
  document.getElementById('shop-list').innerHTML = shops.map(s=>`
    <div class="shop-card">
      <div class="shop-logo">${s.emoji}</div>
      <div class="shop-name">${s.name}</div>
      <div class="shop-desc">${s.desc}</div>
      <a class="shop-btn" href="${s.url}" target="_blank" rel="noopener sponsored">サイトを見る →</a>
    </div>`).join('');
}

document.getElementById('main-search').addEventListener('keydown', e=>{ if(e.key==='Enter') doRealSearch(); });
document.getElementById('disclaimer-text').innerHTML = disclaimerText;

renderRanking();
renderEra();
renderMarket();
renderBox();
renderOripa();
renderShop();
loadTrending();
loadHeroBg();
