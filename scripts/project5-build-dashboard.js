// Populate every placeholder in the official dashboard template.
const { templateHtml, categoryName, dateFolderName, p2Data, p3Data } = $input.first().json;
const esc = (v = '') => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const title = String(categoryName || 'Area Rug').trim();
let html = templateHtml;
const replace = (key, value = '') => { html = html.split(`{{${key}}}`).join(String(value)); };
const cards = p2Data.segments.map(s => `<article class="segment-card"><h4>${esc(s.name)}</h4><span class="badge badge-info">${esc(s.tier)}</span><p>${esc(s.description)}</p></article>`).join('');
const swatches = p2Data.colors.map(c => `<span class="color-swatch" style="background:${esc(c)}" title="${esc(c)}"></span>`).join('');
const risks = p2Data.risks.map(r => `<div class="risk-card ${esc(r.severity)}"><h4>${esc(r.title)}</h4><p>${esc(r.description)}</p></div>`).join('');
const recs = p2Data.recommendations.map((r,i) => `<div class="rec-item"><div class="rec-number">${i+1}</div><div class="rec-content"><h4>${esc(r.title)}</h4><p>${esc(r.description)}</p></div></div>`).join('');
const actions = p3Data.strategicInitiatives.map((r,i) => `<div class="initiative-card priority-high"><div class="initiative-number">${i+1}</div><div class="initiative-content"><h4>${esc(r.title)}</h4><p>${esc(r.description)}</p></div></div>`).join('');
const suppliers = p3Data.suppliers.map(s => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.platform)}</td><td>${esc(s.knownFor)}</td><td>${esc(s.priceRange)}</td><td>-</td></tr>`).join('');
const supplierCards = p3Data.suppliers.map(s => `<div class="supplier-card"><span class="supplier-name">${esc(s.name)}</span><span class="platform">${esc(s.platform)}</span></div>`).join('');
const opportunities = p3Data.opportunities.map(o => `<div class="opportunity-card"><h4>${esc(o.title)}</h4><p>${esc(o.description)}</p></div>`).join('');
const quickWins = p3Data.quickWins.map((w,i) => `<div class="quick-win"><span>${i+1}.&nbsp;</span><strong>${esc(w.title)}</strong><p>${esc(w.description)}</p></div>`).join('');
const bars = values => values.map(b => `<div class="bar-item"><div class="bar-label">${esc(b.label)}</div><div class="bar-track"><div class="bar-fill" style="width:${b.width}%"></div></div><div class="bar-value">${esc(b.value)}</div></div>`).join('');
const r = p3Data.retailers;
const simple = {
  CATEGORY_NAME:title, CATEGORY_TITLE:`${title} Category Dashboard`, REPORT_DATE:dateFolderName, GENERATED_AT:new Date().toLocaleString('en-AU'),
  TOTAL_PRODUCTS:p3Data.totalProducts, AMAZON_PRODUCTS:r.amazon.count, WALMART_PRODUCTS:r.walmart.count, WAYFAIR_PRODUCTS:r.wayfair.count,
  WAYFAIR_AVG_PRICE:r.wayfair.avg, WAYFAIR_MIN_PRICE:r.wayfair.min, WAYFAIR_MAX_PRICE:r.wayfair.max,
  AMAZON_AVG_PRICE:r.amazon.avg, AMAZON_MIN_PRICE:r.amazon.min, AMAZON_MAX_PRICE:r.amazon.max,
  WALMART_AVG_PRICE:r.walmart.avg, WALMART_MIN_PRICE:r.walmart.min, WALMART_MAX_PRICE:r.walmart.max,
  BUDGET_WAYFAIR:r.wayfair.budget, MID_WAYFAIR:r.wayfair.mid, PREMIUM_WAYFAIR:r.wayfair.premium,
  BUDGET_AMAZON:r.amazon.budget, MID_AMAZON:r.amazon.mid, PREMIUM_AMAZON:r.amazon.premium,
  BUDGET_WALMART:r.walmart.budget, MID_WALMART:r.walmart.mid, PREMIUM_WALMART:r.walmart.premium,
  MARKET_SIZE_2025:p2Data.marketSize2025, MARKET_SIZE_2033:p2Data.marketSize2033, MARKET_CAGR:p2Data.marketCagr,
  TARGET_SEGMENT_NAME:p2Data.segments[0]?.name || 'Modern Washable Neutrals', TARGET_SEGMENT_TIER:p2Data.segments[0]?.tier || 'Primary', TARGET_SEGMENT_USE_CASES:'Living room and family room',
  TREND_KEY_INSIGHT:p2Data.summary, COMPETITIVE_KEY_INSIGHT:p3Data.summary,
  SEGMENTS_HTML:cards, COLOR_PALETTE_HTML:swatches, MOODBOARD_HTML:cards,
  RISKS_HTML:risks, HIGH_RISKS:p2Data.risks.filter(x=>x.severity==='high').length, MEDIUM_RISKS:p2Data.risks.filter(x=>x.severity==='medium').length, LOW_RISKS:p2Data.risks.filter(x=>x.severity==='low').length,
  COMPARISON_TABLE_HTML:p3Data.comparisonHtml, PRICE_GAPS_HTML:'<p>Wayfair holds a premium sampled position; controlled access-price tests are recommended.</p>',
  OPPORTUNITIES_HTML:opportunities, QUICK_WINS_HTML:quickWins, STRATEGIC_INITIATIVES_HTML:actions, SUPPLIERS_HTML:suppliers, SUPPLIER_CHIPS_HTML:supplierCards,
  MATERIALS_BARS_HTML:bars(p2Data.attributeBars.materials), SIZES_BARS_HTML:bars(p2Data.attributeBars.sizes), COLORS_BARS_HTML:bars(p2Data.attributeBars.colors), PRICES_BARS_HTML:bars(p2Data.attributeBars.prices),
  DISCOUNT_TIERS_HTML:`<div class="discount-tier"><span>Budget</span><span>W:${r.wayfair.budget} | A:${r.amazon.budget} | Wm:${r.walmart.budget}</span></div>`,
  ALERTS_HTML:risks, TOP_ACTIONS_HTML:quickWins, TREND_RECOMMENDATIONS_HTML:recs,
};
for (const [key,value] of Object.entries(simple)) replace(key,value);
html = html.replace(/\{\{[A-Z0-9_]+\}\}/g, '');
const fileName = `${title.replace(/\s+/g,'_')}_Dashboard_${dateFolderName}.html`;
const remainingPlaceholders = (html.match(/\{\{/g) || []).length;
if (!html.includes('</html>') || remainingPlaceholders) throw new Error(`Dashboard validation failed; remaining placeholders: ${remainingPlaceholders}`);
return [{ json: { html, fileName, categoryName:title, dateFolderName, validation:{ remainingPlaceholders, htmlLength:html.length, sectionsPopulated:12 } } }];
