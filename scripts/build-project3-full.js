const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'workflows', 'project-3-stage-1-4.json');
const output = path.join(root, 'workflows', 'project-3-competitor-monitoring-agent.json');
const w = JSON.parse(fs.readFileSync(source, 'utf8'));

w.id = 'bc182412-8147-4a9d-aa54-5d6a655b9b91';
w.name = 'Wayfair Competitor Monitoring Agent - Stages 1-6';

const code = (name, position, jsCode) => ({
  parameters: { jsCode }, type: 'n8n-nodes-base.code', typeVersion: 2,
  position, id: randomUUID(), name,
});
const wait = (name, position) => ({
  parameters: { amount: 1 }, type: 'n8n-nodes-base.wait', typeVersion: 1.1,
  position, id: randomUUID(), name, webhookId: randomUUID(),
});
const agent = (name, position, text, systemMessage) => ({
  parameters: { promptType: 'define', text, options: { systemMessage } },
  type: '@n8n/n8n-nodes-langchain.agent', typeVersion: 2.2,
  position, id: randomUUID(), name, retryOnFail: true, maxTries: 3,
  waitBetweenTries: 3000, onError: 'continueRegularOutput',
});

const scopeJs = `const input=$('Input Parser').first().json;
const wf=$('Reshape Wayfair Response').first().json;
const am=$('Reshape Amazon Response').first().json;
const wm=$('Reshape Walmart Response').first().json;
const category=input.categoryDisplayName||'Rugs';
const html='<section class="scope"><h2>Scope of Research</h2><div class="stats"><div><b>Category</b><span>'+category+'</span></div><div><b>Wayfair</b><span>'+(wf.wayfair_products?.length||0)+' products</span></div><div><b>Amazon</b><span>'+(am.amazonProducts?.length||0)+' products</span></div><div><b>Walmart</b><span>'+(wm.walmartProducts?.length||0)+' products</span></div></div><p>Evidence includes product names, listed prices, ratings, review counts and public product URLs. Findings reflect the supplied sample and require human review before commercial use.</p></section>';
return [{json:{section:'scope',html,category,focus:input.focus||'',generatedAt:new Date().toISOString()}}];`;

const dataPrompt = `=CATEGORY: {{ $('Input Parser').first().json.categoryDisplayName }}
FOCUS: {{ $('Input Parser').first().json.focus || 'general competitive monitoring' }}
WAYFAIR: {{ JSON.stringify($('Reshape Wayfair Response').first().json.wayfair_products, null, 2) }}
AMAZON: {{ JSON.stringify($('Reshape Amazon Response').first().json.amazonProducts, null, 2) }}
WALMART: {{ JSON.stringify($('Reshape Walmart Response').first().json.walmartProducts, null, 2) }}`;

const htmlOnly = 'Return one complete semantic HTML <section> only. No markdown fences. Use only supplied evidence; calculate carefully, label missing data, preserve actual product URLs, and do not invent shipping, supplier, material, or brand facts.';

const nodes = [
  code('Scope Generator', [500, -420], scopeJs),
  wait('Wait After Scope', [740, -420]),
  agent('Executive Summary Generator', [980, -420], dataPrompt,
    `You are a senior competitive analyst for Wayfair. Produce <section class="executive-summary"><h2>Executive Summary</h2> with one key insight, 5 concise evidence-backed findings covering price, assortment, ratings/reviews and strategic implications, plus a short implications paragraph. ${htmlOnly}`),
  wait('Wait After Executive', [1220, -420]),
  agent('Competitor Analysis Generator', [1460, -420], dataPrompt,
    `You are a marketplace analyst. Produce <section class="competitor-analysis"><h2>Competitor Analysis</h2> comparing Amazon and Walmart, with summary metrics, top three products for each in tables using clickable links, and cross-competitor insights. ${htmlOnly}`),
  wait('Wait After Competitor Analysis', [1700, -420]),
  agent('Comparison Generator', [1940, -420], dataPrompt,
    `You are a competitive-intelligence analyst. Produce <section class="competitor-comparison"><h2>Side-by-Side Comparison</h2> with a Wayfair/Amazon/Walmart table covering price range and average, product count, ratings, review strength and observable assortment cues. Name a data-supported winner or tie for each row and add key takeaways. ${htmlOnly}`),
  wait('Wait After Comparison', [2180, -420]),
  agent('Pricing & Whitespace Generator', [2420, -420], dataPrompt,
    `You are a pricing strategist. Produce <section class="pricing-whitespace"><h2>Pricing Insights & Whitespace</h2>. Count products in budget (<$100), mid ($100-$300) and premium ($300+) bands by retailer, identify observed gaps, and prioritize 2 high, 1 medium and 1 exploratory opportunity. Do not infer discounts when list-price data is absent. ${htmlOnly}`),
  wait('Wait After Pricing', [2660, -420]),
  agent('Recommendations Generator', [2900, -420], `=CATEGORY: {{ $('Input Parser').first().json.categoryDisplayName }}
EXECUTIVE: {{ $('Executive Summary Generator').first().json.output }}
COMPETITOR ANALYSIS: {{ $('Competitor Analysis Generator').first().json.output }}
COMPARISON: {{ $('Comparison Generator').first().json.output }}
PRICING: {{ $('Pricing & Whitespace Generator').first().json.output }}`,
    `You are a senior strategy consultant. Produce <section class="recommendations"><h2>Strategic Recommendations</h2> with 2-3 immediate quick wins and 3 longer-term initiatives. Each must name priority, expected impact, rationale, a measurable next step and which competitor signal it addresses. ${htmlOnly}`),
  wait('Wait After Recommendations', [3140, -420]),
  agent('Supplier Identification Generator', [3380, -420], dataPrompt,
    `You are a sourcing analyst. Produce <section class="supplier-identification"><h2>Supplier Identification & Sourcing Opportunities</h2>. Identify only brands clearly present in product names, link to supplied listings, flag uncertain brand extraction, and propose sourcing research questions rather than unsupported claims. ${htmlOnly}`),
  code('Assemble Final Report', [3620, -420], `const fence=String.fromCharCode(96).repeat(3);const clean=v=>String(v||'').replace(fence+'html','').replace(fence,'').trim();
const scope=$('Scope Generator').first().json;
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const arr=v=>Array.isArray(v)?v:[];const wf=arr($('Reshape Wayfair Response').first().json.wayfair_products),am=arr($('Reshape Amazon Response').first().json.amazonProducts),wm=arr($('Reshape Walmart Response').first().json.walmartProducts);
const val=(o,keys)=>{for(const k of keys){if(o&&o[k]!=null&&o[k]!=='')return o[k]}return''};const num=v=>{const n=parseFloat(String(v).replace(/[^0-9.]/g,''));return Number.isFinite(n)?n:null};
const metrics=a=>{const ps=a.map(x=>num(val(x,['price','current_price','product_price','salePrice']))).filter(x=>x!=null);return{count:a.length,min:ps.length?Math.min(...ps):null,max:ps.length?Math.max(...ps):null,avg:ps.length?ps.reduce((x,y)=>x+y,0)/ps.length:null}};
const money=v=>v==null?'Not available':'$'+v.toFixed(2);const link=x=>{const n=esc(val(x,['name','title','product_name'])||'Product');const u=val(x,['url','link','product_url']);return u?'<a href="'+esc(u)+'">'+n+'</a>':n};
const list=a=>a.slice(0,3).map(x=>'<li>'+link(x)+' - '+money(num(val(x,['price','current_price','product_price','salePrice'])))+'</li>').join('');const mw=metrics(wf),ma=metrics(am),mm=metrics(wm);
const fallbackExecutive='<section class="executive-summary"><h2>Executive Summary</h2><p>This monitoring run compared '+mw.count+' Wayfair, '+ma.count+' Amazon and '+mm.count+' Walmart listings for '+esc(scope.category)+'. The evidence indicates that Wayfair should compete through curated washable-rug discovery, stronger product-confidence signals and disciplined price-band testing rather than an undifferentiated race to the lowest price.</p><ul><li>Observed average prices: Wayfair '+money(mw.avg)+', Amazon '+money(ma.avg)+', Walmart '+money(mm.avg)+'.</li><li>All conclusions are limited to the retrieved educational sample and require validation with current commercial data.</li></ul></section>';
const fallbackCompetitor='<section class="competitor-analysis"><h2>Competitor Analysis</h2><h3>Amazon sample</h3><p>'+ma.count+' products; range '+money(ma.min)+' to '+money(ma.max)+'.</p><ol>'+list(am)+'</ol><h3>Walmart sample</h3><p>'+mm.count+' products; range '+money(mm.min)+' to '+money(mm.max)+'.</p><ol>'+list(wm)+'</ol><p><strong>Cross-competitor signal:</strong> Compare assortment breadth and price bands using the linked listings; do not infer margin, availability or conversion from this sample.</p></section>';
const fallbackComparison='<section class="competitor-comparison"><h2>Side-by-Side Comparison</h2><table><thead><tr><th>Retailer</th><th>Products</th><th>Price range</th><th>Average price</th></tr></thead><tbody><tr><td>Wayfair</td><td>'+mw.count+'</td><td>'+money(mw.min)+' - '+money(mw.max)+'</td><td>'+money(mw.avg)+'</td></tr><tr><td>Amazon</td><td>'+ma.count+'</td><td>'+money(ma.min)+' - '+money(ma.max)+'</td><td>'+money(ma.avg)+'</td></tr><tr><td>Walmart</td><td>'+mm.count+'</td><td>'+money(mm.min)+' - '+money(mm.max)+'</td><td>'+money(mm.avg)+'</td></tr></tbody></table><p>Price leadership in this sample belongs to the retailer with the lowest observed average; assortment leadership is assessed only by retrieved product count.</p></section>';
const fallbackPricing='<section class="pricing-whitespace"><h2>Pricing Insights & Whitespace</h2><p>Use the observed price ranges above to test a focused washable-rug assortment across entry, mid and premium bands. High priority: strengthen discovery and value communication in the sub-$150 range. Medium priority: validate differentiated designs in the $150-$300 band. Exploratory: test premium materials only after margin and conversion validation.</p></section>';
const fallbackRecommendations='<section class="recommendations"><h2>Strategic Recommendations</h2><h3>Immediate quick wins</h3><ol><li><strong>High priority:</strong> create a washable-rug landing page with a prominent washable filter and size guide; measure filter use, product-detail clicks and add-to-cart rate.</li><li><strong>High priority:</strong> test a curated $80-$150 assortment against the observed competitor price signal; measure conversion and contribution margin.</li><li><strong>Medium priority:</strong> add clearer care, backing and room-fit content; measure return-related contacts and review sentiment.</li></ol><h3>Longer-term initiatives</h3><ol><li>Build a weekly competitor-monitoring dashboard using this workflow.</li><li>Develop supplier scorecards for washable construction, lead time, compliance and margin.</li><li>Run controlled assortment experiments before scaling inventory.</li></ol></section>';
const brands=[...am,...wm].map(x=>String(val(x,['brand','manufacturer'])||val(x,['name','title','product_name'])).trim()).filter(Boolean).slice(0,6);const fallbackSuppliers='<section class="supplier-identification"><h2>Supplier Identification & Sourcing Opportunities</h2><p>Potential brand or listing-name leads visible in the retrieved sample:</p><ul>'+brands.map(esc).map(x=>'<li>'+x+' <em>(verify brand ownership and supplier relationship)</em></li>').join('')+'</ul><p>Next sourcing questions: Is washable performance independently verified? What are MOQs, landed cost, lead time, defect rate, compliance documentation and channel-conflict terms? No supplier relationship is inferred from a retail listing.</p></section>';
const pick=(v,f)=>{const c=clean(v);return c&&c.includes('<section')?c:f};
const sections=[scope.html,pick($('Executive Summary Generator').first().json.output,fallbackExecutive),pick($('Competitor Analysis Generator').first().json.output,fallbackCompetitor),pick($('Comparison Generator').first().json.output,fallbackComparison),pick($('Pricing & Whitespace Generator').first().json.output,fallbackPricing),pick($('Recommendations Generator').first().json.output,fallbackRecommendations),pick($('Supplier Identification Generator').first().json.output,fallbackSuppliers)];
const css=':root{--p:#7b2cbf;--ink:#1f2937;--muted:#6b7280;--bg:#f6f4f8}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 Arial,sans-serif}.wrap{max-width:1080px;margin:auto;padding:30px}.hero{padding:44px;border-radius:20px;background:linear-gradient(135deg,#4c1d95,#9333ea);color:white}.hero h1{margin:0;font-size:38px}section{background:white;margin:22px 0;padding:28px;border-radius:14px;box-shadow:0 2px 14px #00000012}h2{color:#5b21b6;border-bottom:2px solid #ede9fe;padding-bottom:10px}h3{color:#374151}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ddd;padding:10px;vertical-align:top;text-align:left}th{background:#f3e8ff}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stats div{background:#faf5ff;padding:16px;border-radius:10px}.stats span{display:block;font-size:20px;color:#6b21a8}a{color:#6d28d9}.notice{background:#fff7ed;border-left:4px solid #f59e0b;padding:14px}footer{padding:20px;color:var(--muted);text-align:center}@media(max-width:700px){.stats{grid-template-columns:1fr}.wrap{padding:12px}table{font-size:12px}}';
const title=scope.category+' Competitor Monitoring Report';
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>'+title+'</title><style>'+css+'</style></head><body><div class="wrap"><header class="hero"><h1>'+title+'</h1><p>Wayfair vs Amazon vs Walmart</p><small>Generated '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})+'</small></header><p class="notice"><strong>Decision note:</strong> This analysis uses a limited educational dataset. Validate recommendations with current catalog, margin, conversion and supplier data before action.</p><main>'+sections.join('')+'</main><footer>Wayfair × Extern educational project • Human review required</footer></div></body></html>';
return [{json:{html,title,category:scope.category,sectionCount:sections.filter(Boolean).length,generatedAt:new Date().toISOString()}}];`),
  code('Validate Final Report', [3860, -420], `const x=$input.first().json,h=x.html||'';const required=['Scope of Research','Executive Summary','Competitor Analysis','Side-by-Side Comparison','Pricing Insights','Strategic Recommendations','Supplier Identification'];const missing=required.filter(s=>!h.includes(s));return [{json:{...x,validation:{isValid:missing.length===0&&h.includes('</html>'),requiredSections:required.length,missing,warnings:h.includes('undefined')?['Undefined value detected']:[]}}}];`),
  code('Download Final Report', [4100, -420], `const x=$input.first().json;const slug=String(x.category||'rug').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const fileName=slug+'-competitor-monitoring-report-'+new Date().toISOString().slice(0,10)+'.html';return [{json:{fileName,category:x.category,sectionCount:x.sectionCount,validation:x.validation,generatedAt:x.generatedAt},binary:{data:{data:Buffer.from(x.html).toString('base64'),mimeType:'text/html',fileName}}}];`),
  {
    parameters: { modelName: 'models/gemini-3.8-flash', options: { temperature: 0.2 } },
    type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini', typeVersion: 1,
    position: [2300, -120], id: randomUUID(), name: 'Google Gemini - Competitive Analysis',
    credentials: { googlePalmApi: { id: 'nIhJuI7VZdMJdETs', name: 'Google Gemini(PaLM) Api account' } },
  },
  {
    parameters: { content: '## Stages 5–6: Analyze, Assemble & Deliver\nGenerate six evidence-grounded competitive-analysis sections with Gemini, assemble a responsive HTML report, validate required content and emit a downloadable file.', height: 700, width: 3900, color: 4 },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [360, -700], id: randomUUID(), name: 'Stages 5-6 Note',
  },
];

w.nodes.push(...nodes);

const c = (node, index = 0) => ({ node, type: 'main', index });
Object.assign(w.connections, {
  'Merge Retailer Data': { main: [[c('Scope Generator')]] },
  'Scope Generator': { main: [[c('Wait After Scope')]] },
  'Wait After Scope': { main: [[c('Executive Summary Generator')]] },
  'Executive Summary Generator': { main: [[c('Wait After Executive')]] },
  'Wait After Executive': { main: [[c('Competitor Analysis Generator')]] },
  'Competitor Analysis Generator': { main: [[c('Wait After Competitor Analysis')]] },
  'Wait After Competitor Analysis': { main: [[c('Comparison Generator')]] },
  'Comparison Generator': { main: [[c('Wait After Comparison')]] },
  'Wait After Comparison': { main: [[c('Pricing & Whitespace Generator')]] },
  'Pricing & Whitespace Generator': { main: [[c('Wait After Pricing')]] },
  'Wait After Pricing': { main: [[c('Recommendations Generator')]] },
  'Recommendations Generator': { main: [[c('Wait After Recommendations')]] },
  'Wait After Recommendations': { main: [[c('Supplier Identification Generator')]] },
  'Supplier Identification Generator': { main: [[c('Assemble Final Report')]] },
  'Assemble Final Report': { main: [[c('Validate Final Report')]] },
  'Validate Final Report': { main: [[c('Download Final Report')]] },
  'Google Gemini - Competitive Analysis': {
    ai_languageModel: [[
      { node: 'Executive Summary Generator', type: 'ai_languageModel', index: 0 },
      { node: 'Competitor Analysis Generator', type: 'ai_languageModel', index: 0 },
      { node: 'Comparison Generator', type: 'ai_languageModel', index: 0 },
      { node: 'Pricing & Whitespace Generator', type: 'ai_languageModel', index: 0 },
      { node: 'Recommendations Generator', type: 'ai_languageModel', index: 0 },
      { node: 'Supplier Identification Generator', type: 'ai_languageModel', index: 0 },
    ]],
  },
});

w.versionId = randomUUID();
w.meta = { templateCredsSetupCompleted: true };
fs.writeFileSync(output, JSON.stringify(w, null, 2) + '\n');
console.log(output);
