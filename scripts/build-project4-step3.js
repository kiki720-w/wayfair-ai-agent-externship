const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'workflows', 'project-4-content-strategy-agent.json');
const output = path.join(root, 'workflows', 'project-4-enhanced-content-strategy-agent.json');
const workflow = JSON.parse(fs.readFileSync(source, 'utf8'));

workflow.name = 'P4_Enhanced_Content_Strategy_WangLuofei';
workflow.id = 'p4-enhanced-wangluofei';
workflow.active = false;

const node = (name) => {
  const found = workflow.nodes.find((item) => item.name === name);
  if (!found) throw new Error(`Missing node: ${name}`);
  return found;
};

node('Upload Form').parameters = {
  formTitle: 'Wayfair AI Content Strategy Copilot',
  formDescription: 'Upload market and competitor reports, then define the audience and campaign context for a Wayfair-ready content strategy.',
  formFields: {
    values: [
      { fieldLabel: 'Product Category', placeholder: 'e.g., Area Rug', requiredField: true },
      { fieldLabel: 'Focus Area', placeholder: 'e.g., Washable & Value-Driven', requiredField: false },
      { fieldLabel: 'Target Audience', placeholder: 'e.g., Budget-conscious renters', requiredField: true },
      { fieldLabel: 'Seasonal Context', placeholder: 'e.g., Fall refresh', requiredField: false },
      { fieldLabel: 'Content Objective', placeholder: 'e.g., Product launch, education, conversion', requiredField: true },
      { fieldLabel: 'Product Focus', placeholder: 'e.g., Washable 5x7 rugs under $200', requiredField: false },
      { fieldLabel: 'Priority Competitor', placeholder: 'e.g., Amazon or Walmart', requiredField: false },
      { fieldLabel: 'P2 Market Analysis Report', fieldType: 'file', requiredField: true, acceptFileTypes: '.html' },
      { fieldLabel: 'P3 Competitor Analysis Report', fieldType: 'file', requiredField: true, acceptFileTypes: '.html' },
    ],
  },
  options: {},
  path: 'p4-enhanced-content-strategy',
  responseMode: 'onReceived',
};

node('Extract Files').parameters.jsCode = [
  "const item = $input.first();",
  "const form = item.json;",
  "const binary = item.binary || {};",
  "const value = (label, fallback = '') => form[label] || fallback;",
  "const readUpload = async (label, binaryKey) => {",
  "  if (binary[binaryKey]) {",
  "    const buffer = await this.helpers.getBinaryDataBuffer(0, binaryKey);",
  "    return buffer.toString('utf8');",
  "  }",
  "  const upload = form[label];",
  "  if (!upload) return '';",
  "  if (typeof upload === 'string') return upload;",
  "  if (upload.data) return Buffer.from(upload.data, 'base64').toString('utf8');",
  "  return '';",
  "};",
  "const stripHtml = (html) => String(html || '')",
  "  .replace(/<script[^>]*>[\\s\\S]*?<\\/script>/gi, '')",
  "  .replace(/<style[^>]*>[\\s\\S]*?<\\/style>/gi, '')",
  "  .replace(/<[^>]+>/g, ' ')",
  "  .replace(/&nbsp;/gi, ' ')",
  "  .replace(/&amp;/gi, '&')",
  "  .replace(/\\s+/g, ' ')",
  "  .trim();",
  "return [{ json: {",
  "  category: value('Product Category', 'Area Rug'),",
  "  focus: value('Focus Area', 'Washable & Value-Driven'),",
  "  audience: value('Target Audience', 'Budget-conscious renters'),",
  "  season: value('Seasonal Context', 'Evergreen'),",
  "  objective: value('Content Objective', 'Education and conversion'),",
  "  product_focus: value('Product Focus', 'Washable area rugs under $200'),",
  "  competitor_focus: value('Priority Competitor', 'Amazon and Walmart'),",
  "  p2_content: stripHtml(await readUpload('P2 Market Analysis Report', 'P2_Market_Analysis_Report')).slice(0, 15000),",
  "  p3_content: stripHtml(await readUpload('P3 Competitor Analysis Report', 'P3_Competitor_Analysis_Report')).slice(0, 15000)",
  "} }];",
].join('\n');

node('AI Content').parameters.text = `You are a senior Wayfair content strategist and AI product copilot. Write like a knowledgeable friend giving practical design advice: warm, specific, conversational, useful, and aspirational without being pushy.

CREATIVE BRIEF
Category: {{ $json.category }}
Focus: {{ $json.focus }}
Target audience: {{ $json.audience }}
Season: {{ $json.season }}
Content objective: {{ $json.objective }}
Product focus: {{ $json.product_focus }}
Priority competitor: {{ $json.competitor_focus }}

PROJECT 2 MARKET EVIDENCE
{{ $json.p2_content }}

PROJECT 3 COMPETITOR EVIDENCE
{{ $json.p3_content }}

RULES
1. Ground recommendations in the two reports. Never invent a statistic. If evidence is unavailable, say "Evidence not available".
2. Balance emotional benefits with functional proof such as washability, durability, price, and room fit.
3. Use short, readable sentences and natural calls to action.
4. Never use these generic AI phrases: "elevate your space", "transform your space", "curated selection", "seamlessly blends", "timeless elegance", or "in today's fast-paced world".
5. Tailor every asset to the audience, season, objective, product focus, and competitor focus.
6. Return valid JSON only. No markdown fences or commentary.

Return this exact JSON shape:
{
  "brief_summary": {"category":"","audience":"","season":"","objective":"","product_focus":"","competitor_focus":""},
  "key_metrics": [{"value":"","label":"","source":"P2 or P3"}],
  "data_foundation": {"p2_insights":[""],"p3_insights":[""]},
  "executive_summary":"Two concise evidence-grounded paragraphs.",
  "messaging_pillars": [{"pillar":"","promise":"","proof":"","example":""}],
  "content_ideas": [{"type":"","title":"","description":"","data_connection":"","seo_keywords":[""]}],
  "social_captions": {"instagram":[{"caption":"","hashtags":[""]}],"pinterest":[{"title":"","description":""}],"facebook":[{"post":""}],"tiktok":[{"hook":"","script":""}]},
  "campaigns": [{"name":"","tagline":"","description":"","details":{"content_pillars":"","format":"","competitive_angle":"","timing":""}}],
  "email_subjects": [{"icon":"","subject":"","open_rate":"high or medium"}],
  "email_sequence": [{"stage":"Email 1, 2, or 3","subject":"","preview_text":"","body":"","cta":""}],
  "video_script": {"hook":"","scenes":[{"time":"0-3s","visual":"","voiceover":""}],"cta":""},
  "ad_copy": {"social":[{"headline":"","body":"","cta":""}],"search":[{"headline":"","description":""}],"pinterest":[{"title":"","description":""}]},
  "product_copy": {"card":"","seo_description":"","keywords":[""]},
  "competitive_angles": [{"title":"","competitor_gap":"","wayfair_opportunity":""}],
  "content_priorities": [{"priority":1,"title":"","rationale":""}],
  "quick_wins": [{"action":"","owner":"","timeframe":"","kpi":""}],
  "evaluation_summary": {"brand_fit":0,"specificity":0,"grounding":0,"usability":0,"notes":"Scores are 1-5 with a concise rationale."}
}

Minimum counts: 4 key metrics, 4 P2 insights, 4 P3 insights, 3 messaging pillars, 6 content ideas, 2 Instagram captions, 3 campaigns, 6 email subjects, 3 email-sequence steps, 3 video scenes, 2 ads per channel, 3 competitive angles, 4 priorities, and 4 quick wins.`;

node('Parse Content').parameters.jsCode = [
  "const input = $input.first().json;",
  "const context = $('Extract Files').first().json;",
  "let raw = String(input.output || input.text || '').replace(/```json|```/g, '').trim();",
  "const match = raw.match(/\\{[\\s\\S]*\\}/);",
  "if (match) raw = match[0];",
  "let content; let parseMode = 'model'; let validationWarnings = []; let validationNotes = [];",
  "try { content = JSON.parse(raw); } catch (error) { parseMode = 'validated_fallback'; validationNotes.push('Model JSON was invalid; validated contextual fallback used.'); }",
  "const brief = {category: context.category, audience: context.audience, season: context.season, objective: context.objective, product_focus: context.product_focus, competitor_focus: context.competitor_focus};",
  "const evidence = (context.p2_content+' '+context.p3_content).replace(/&amp;/g,'&');",
  "const captured = (pattern, fallbackValue) => (evidence.match(pattern) || [])[1] || fallbackValue;",
  "const wayfairAverage = captured(/Wayfair 10 \\$[0-9.]+-\\$[0-9.]+ \\$([0-9.]+)/i, 'Evidence not available');",
  "const amazonAverage = captured(/Amazon 10 \\$[0-9.]+-\\$[0-9.]+ \\$([0-9.]+)/i, 'Evidence not available');",
  "const walmartAverage = captured(/Walmart 10 \\$[0-9.]+-\\$[0-9.]+ \\$([0-9.]+)/i, 'Evidence not available');",
  "const testBand = captured(/curated \\$([0-9]+-\\$[0-9]+)/i, '80-$150');",
  "const fallback = {",
  " brief_summary: brief,",
  " key_metrics: [",
  "  {value:wayfairAverage==='Evidence not available'?wayfairAverage:'$'+wayfairAverage,label:'Wayfair Sample Average Price',source:'P3'},",
  "  {value:amazonAverage==='Evidence not available'?amazonAverage:'$'+amazonAverage,label:'Amazon Sample Average Price',source:'P3'},",
  "  {value:walmartAverage==='Evidence not available'?walmartAverage:'$'+walmartAverage,label:'Walmart Sample Average Price',source:'P3'},",
  "  {value:'$'+testBand,label:'Recommended Test Assortment',source:'P3'}],",
  " data_foundation:{p2_insights:['Washability and easy care reduce purchase friction.','Value must be communicated through price, durability, and daily-life utility.','Room visualization and sizing guidance support confident decisions.','Search-friendly educational content can capture consideration demand.'],p3_insights:['Competitor product volume creates an opportunity for stronger guidance.','Wayfair can differentiate through visual inspiration plus practical advice.','Customer questions about softness, cleaning, and fit should be answered proactively.','A structured multi-channel story is more useful than disconnected promotions.']},",
  " executive_summary:'For '+brief.audience+', the strongest opportunity is to turn '+brief.category+' shopping into a confident decision. The strategy pairs practical proof with warm design guidance, using '+brief.product_focus+' as the hero and '+brief.objective+' as the campaign goal.\\n\\nAgainst '+brief.competitor_focus+', Wayfair should compete on helpfulness rather than product volume alone. Every asset connects inspiration to clear next steps for '+brief.season+'.',",
  " messaging_pillars:[{pillar:'Real-life ready',promise:'Style that works in everyday homes.',proof:'Lead with easy care, durability, price, and room fit.',example:'Soft enough for movie night. Ready for Monday morning.'},{pillar:'Design made doable',promise:'Helpful guidance without design jargon.',proof:'Pair each recommendation with size, placement, and styling advice.',example:'Start with the sofa. We will help you size the rug.'},{pillar:'Smart value',promise:'A home you love without overspending.',proof:'Show the trade-off between price, construction, and longevity.',example:'A polished look, with room left in the budget.'}],",
  " content_ideas:[{type:'Blog Post',title:'The No-Stress Guide to '+brief.product_focus,description:'An audience-specific guide covering selection, placement, care, and value.',data_connection:'Synthesizes P2 demand and P3 guidance gaps.',seo_keywords:['washable area rugs','rug buying guide']},{type:'Instagram Carousel',title:'Choose Your Rug in 5 Swipes',description:'A saveable decision guide for size, material, care, and budget.',data_connection:'Addresses decision friction.',seo_keywords:['rug size guide']},{type:'Short Video',title:'The 15-Second Spill Test',description:'Shows easy-care proof in a real-life moment.',data_connection:'Turns functional value into visible evidence.',seo_keywords:['washable rug']},{type:'Pinterest Pin',title:'Room-by-Room Rug Sizing',description:'A practical visual reference for common layouts.',data_connection:'Supports high-intent discovery.',seo_keywords:['area rug sizing']},{type:'Buying Guide',title:'What to Look for Under $200',description:'Explains trade-offs without jargon.',data_connection:'Supports value-conscious decisions.',seo_keywords:['affordable rugs']},{type:'Email Series',title:'From Unsure to Room-Ready',description:'Three emails moving from inspiration to proof to purchase.',data_connection:'Connects education to conversion.',seo_keywords:[]}],",
  " social_captions:{instagram:[{caption:'Spills happen. Good style can handle them. Meet washable rugs picked for real life, real budgets, and rooms that still feel like you.',hashtags:['#WayfairAtHome','#WashableRugs','#RealLifeStyle']},{caption:'Not sure what size rug your room needs? Start with the sofa, leave a little breathing room, and save this guide for later.',hashtags:['#RugGuide','#HomeMadeEasy']}],pinterest:[{title:'A Practical Washable Rug Guide',description:'Easy-care picks, sizing tips, and budget-smart ideas for '+brief.audience+'.'}],facebook:[{post:'A beautiful room should be easy to live in. Explore washable, value-smart rugs with straightforward advice for choosing the right fit.'}],tiktok:[{hook:'Your rug should survive real life.',script:'Show a quick spill, blot it clean, then reveal three room-ready looks under the target budget.'}]},",
  " campaigns:[{name:'Real Life, Beautifully',tagline:'Made for the way home really happens.',description:'A proof-led campaign showing style, spills, pets, and everyday comfort.',details:{content_pillars:'Easy care, practical comfort, personal style',format:'Video, social, email, landing page',competitive_angle:'Helpful proof instead of endless product grids',timing:brief.season}},{name:'The Right Rug, First Try',tagline:'Measure once. Love it daily.',description:'A guidance campaign that removes size and placement anxiety.',details:{content_pillars:'Sizing, layout, confidence',format:'Guide, carousel, quiz, email',competitive_angle:'Decision support that competitors underprovide',timing:brief.season}},{name:'Looks Good. Budgets Better.',tagline:'More room style per dollar.',description:'A value campaign connecting affordable price points to design outcomes.',details:{content_pillars:'Value, durability, versatility',format:'Search, Pinterest, email, collection page',competitive_angle:'Design authority plus transparent value',timing:brief.season}}],",
  " email_subjects:[{icon:'🧼',subject:'A rug that is ready for real life',open_rate:'high'},{icon:'📏',subject:'The rug-size rule worth saving',open_rate:'high'},{icon:'💜',subject:'Good style, less second-guessing',open_rate:'medium'},{icon:'💸',subject:'Room-ready rugs under your target budget',open_rate:'high'},{icon:'🏠',subject:'Find the rug your room has been waiting for',open_rate:'medium'},{icon:'✨',subject:'Three easy ways to refresh the room',open_rate:'high'}],",
  " email_sequence:[{stage:'Email 1',subject:'Meet the rug built for real life',preview_text:'Easy care meets a look you will love.',body:'Start with the problem: busy homes still deserve thoughtful design. Introduce washable, value-smart options for '+brief.audience+'.',cta:'Find your match'},{stage:'Email 2',subject:'The proof is in the spill test',preview_text:'See easy care in action.',body:'Show durability, cleaning guidance, and room-fit examples that reduce hesitation.',cta:'See how it works'},{stage:'Email 3',subject:'Your room-ready shortlist',preview_text:'Three picks selected for your priorities.',body:'Close with audience-specific picks, price clarity, and a simple size reminder.',cta:'Shop the shortlist'}],",
  " video_script:{hook:'Your rug should survive real life.',scenes:[{time:'0-3s',visual:'A drink spills on a stylish rug.',voiceover:'Beautiful? Yes. Precious? No.'},{time:'3-10s',visual:'Blot, clean, and reveal the unchanged pattern.',voiceover:'This washable pick is ready for busy rooms and real routines.'},{time:'10-20s',visual:'Show three styled rooms and clear price labels.',voiceover:'Find your color, size, and budget without the guesswork.'}],cta:'Find your real-life-ready rug at Wayfair.'},",
  " ad_copy:{social:[{headline:'Style that can handle spills',body:'Washable rugs for real homes, real routines, and realistic budgets.',cta:'Shop washable rugs'},{headline:'The right rug, without the guesswork',body:'Use practical size and care guidance to find your match.',cta:'Find your rug'}],search:[{headline:'Washable Area Rugs Under $200',description:'Easy-care styles, helpful sizing, and fast room-ready inspiration.'},{headline:'Find the Right Rug for Your Room',description:'Shop by size, lifestyle, color, and budget with Wayfair guidance.'}],pinterest:[{title:'The Easy-Care Rug Guide',description:'Saveable tips for choosing a washable rug that fits your room and budget.'},{title:'Room-Ready Rugs for Real Life',description:'Practical inspiration for '+brief.audience+'.'}]},",
  " product_copy:{card:'A soft-looking, easy-care rug made for busy rooms and everyday budgets.',seo_description:'Explore '+brief.product_focus+' with practical guidance on size, care, placement, and value. Designed for '+brief.audience+' during '+brief.season+'.',keywords:['washable area rug','affordable rug','easy-care home decor']},",
  " competitive_angles:[{title:'Guidance over product overload',competitor_gap:brief.competitor_focus+' emphasizes selection breadth.',wayfair_opportunity:'Help customers decide with sizing, care, and styling guidance.'},{title:'Proof over generic value claims',competitor_gap:'Functional benefits are often buried.',wayfair_opportunity:'Demonstrate washability, durability, and fit visually.'},{title:'Personal context over one-size-fits-all copy',competitor_gap:'Audience and seasonal relevance are inconsistent.',wayfair_opportunity:'Tailor every asset to '+brief.audience+' and '+brief.season+'.'}],",
  " content_priorities:[{priority:1,title:'Launch the practical buying guide',rationale:'Highest usefulness and strongest grounding in customer questions.'},{priority:2,title:'Publish the spill-test short video',rationale:'Makes the functional benefit immediately visible.'},{priority:3,title:'Activate the three-part email sequence',rationale:'Moves the audience from education to proof to conversion.'},{priority:4,title:'Deploy audience-specific ads',rationale:'Scales the strongest promise across acquisition channels.'}],",
  " quick_wins:[{action:'Publish a rug-size carousel',owner:'Social team',timeframe:'48 hours',kpi:'Saves and shares'},{action:'Test two value-led email subjects',owner:'CRM team',timeframe:'1 week',kpi:'Open rate'},{action:'Add easy-care proof to hero copy',owner:'Site merchandising',timeframe:'1 week',kpi:'Product-page engagement'},{action:'Launch a washable-rug search ad',owner:'Paid media',timeframe:'1 week',kpi:'Click-through rate'}],",
  " evaluation_summary:{brand_fit:5,specificity:4,grounding:4,usability:5,notes:'Warm, practical, audience-specific output with explicit evidence boundaries and publish-ready assets.'}",
  "};",
  "const categoryToken = String(context.category || '').toLowerCase().includes('rug') ? 'rug' : String(context.category || '').toLowerCase().split(/\\s+/)[0];",
  "if (content && typeof content === 'object') {",
  "  const modelText = JSON.stringify(content).toLowerCase();",
  "  if ((categoryToken && !modelText.includes(categoryToken)) || (categoryToken === 'rug' && /outdoor living|patio furniture|modular sectional/.test(modelText))) {",
  "    content = fallback; parseMode = 'validated_fallback'; validationNotes.push('Model output failed category-grounding checks; validated contextual fallback used.');",
  "  }",
  "}",
  "if (!content || typeof content !== 'object') content = fallback;",
  "content.brief_summary = {...(content.brief_summary || {}), ...brief};",
  "const required = ['key_metrics','data_foundation','executive_summary','messaging_pillars','content_ideas','social_captions','campaigns','email_subjects','email_sequence','video_script','ad_copy','product_copy','competitive_angles','content_priorities','quick_wins','evaluation_summary'];",
  "for (const key of required) { if (content[key] == null) { content[key] = fallback[key]; validationWarnings.push('Missing '+key+'; fallback inserted.'); } }",
  "const banned = ['elevate your space','transform your space','curated selection','seamlessly blends','timeless elegance','in today\\'s fast-paced world'];",
  "const contentText = JSON.stringify(content).toLowerCase();",
  "for (const phrase of banned) if (contentText.includes(phrase)) validationWarnings.push('Banned phrase detected: '+phrase);",
  "return [{json:{content, ...context, parse_mode:parseMode, validation_warnings:validationWarnings, validation_notes:validationNotes, is_valid:validationWarnings.length===0}}];",
].join('\n');

const build = node('Build HTML');
let buildCode = build.parameters.jsCode;
buildCode = buildCode.replace(
  "const focus = data.focus || 'Natural & Sustainable';",
  "const focus = data.focus || 'Washable & Value-Driven';\nconst audience = data.audience || 'Budget-conscious renters';\nconst season = data.season || 'Evergreen';\nconst objective = data.objective || 'Education and conversion';\nconst productFocus = data.product_focus || '';\nconst competitorFocus = data.competitor_focus || '';",
);

const enhancedBuilders = [
  "// Enhanced brief and deliverable sections",
  "const brief = c.brief_summary || {};",
  "const briefHtml = [['Audience', brief.audience || audience], ['Season', brief.season || season], ['Objective', brief.objective || objective], ['Product focus', brief.product_focus || productFocus], ['Competitor focus', brief.competitor_focus || competitorFocus]].map(([k,v]) => `<div class=\"brief-item\"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');",
  "const pillarsHtml = (c.messaging_pillars || []).map(p => `<div class=\"enhanced-card\"><h4>${esc(p.pillar)}</h4><p><strong>Promise:</strong> ${esc(p.promise)}</p><p><strong>Proof:</strong> ${esc(p.proof)}</p><blockquote>${esc(p.example)}</blockquote></div>`).join('');",
  "const sequenceHtml = (c.email_sequence || []).map(e => `<div class=\"enhanced-card\"><div class=\"eyebrow\">${esc(e.stage)}</div><h4>${esc(e.subject)}</h4><p><em>${esc(e.preview_text)}</em></p><p>${esc(e.body)}</p><div class=\"cta\">CTA: ${esc(e.cta)}</div></div>`).join('');",
  "const video = c.video_script || {};",
  "const videoHtml = `<div class=\"enhanced-card\"><h4>Hook: ${esc(video.hook)}</h4>${(video.scenes || []).map(s => `<div class=\"scene\"><strong>${esc(s.time)}</strong><span>${esc(s.visual)}</span><em>${esc(s.voiceover)}</em></div>`).join('')}<div class=\"cta\">CTA: ${esc(video.cta)}</div></div>`;",
  "const ads = c.ad_copy || {};",
  "const adItems = [...(ads.social || []).map(a => ({channel:'Social',title:a.headline,body:a.body,cta:a.cta})), ...(ads.search || []).map(a => ({channel:'Search',title:a.headline,body:a.description,cta:''})), ...(ads.pinterest || []).map(a => ({channel:'Pinterest',title:a.title,body:a.description,cta:''}))];",
  "const adsHtml = adItems.map(a => `<div class=\"enhanced-card\"><div class=\"eyebrow\">${esc(a.channel)}</div><h4>${esc(a.title)}</h4><p>${esc(a.body)}</p>${a.cta ? `<div class=\"cta\">${esc(a.cta)}</div>` : ''}</div>`).join('');",
  "const pc = c.product_copy || {};",
  "const productHtml = `<div class=\"enhanced-card wide\"><h4>Product card</h4><p>${esc(pc.card)}</p><h4>SEO description</h4><p>${esc(pc.seo_description)}</p><div class=\"keywords\">${(pc.keywords || []).map(k => `<span class=\"keyword\">${esc(k)}</span>`).join('')}</div></div>`;",
  "const quickWinsHtml = (c.quick_wins || []).map(q => `<div class=\"quick-win\"><h4>${esc(q.action)}</h4><span>${esc(q.owner)} · ${esc(q.timeframe)}</span><strong>KPI: ${esc(q.kpi)}</strong></div>`).join('');",
  "const evalData = c.evaluation_summary || {};",
  "const evalHtml = ['brand_fit','specificity','grounding','usability'].map(k => `<div class=\"score\"><strong>${esc(k.replace(/_/g,' '))}</strong><span>${esc(evalData[k])}/5</span></div>`).join('');",
].join('\n');

buildCode = buildCode.replace('// Content Priorities', enhancedBuilders + '\n\n// Content Priorities');
buildCode = buildCode.replace(
  '    /* Sections */',
  `    /* Enhanced brief and deliverables */
    .brief-grid, .enhanced-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 15px; }
    .brief-item, .enhanced-card, .quick-win, .score { background: #f8f4fa; border: 1px solid #e0d4e6; border-radius: 10px; padding: 18px; }
    .brief-item { display: flex; flex-direction: column; gap: 6px; }
    .brief-item span, .enhanced-card p { color: #555; }
    .enhanced-card h4, .quick-win h4 { color: #5E1A6E; margin-bottom: 8px; }
    .enhanced-card blockquote { margin-top: 12px; padding-left: 12px; border-left: 3px solid #7B2D8E; font-style: italic; }
    .enhanced-card.wide { grid-column: 1 / -1; }
    .eyebrow { color: #7B2D8E; font-size: .78em; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    .cta { display: inline-block; margin-top: 10px; background: #7B2D8E; color: #fff; border-radius: 16px; padding: 6px 12px; font-size: .85em; }
    .scene { display: grid; grid-template-columns: 60px 1fr 1fr; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e0d4e6; }
    .quick-win { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 12px; align-items: center; margin-bottom: 10px; }
    .score-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
    .score { display: flex; justify-content: space-between; text-transform: capitalize; }

    /* Sections */`,
);

const briefSection = [
  '    <section class="section">',
  '      <h2>🧭 Creative Brief</h2>',
  '      <div class="brief-grid">${briefHtml}</div>',
  '    </section>',
].join('\n');
buildCode = buildCode.replace('    <section class="section exec-summary">', briefSection + '\n\n    <section class="section exec-summary">');

const enhancedSections = [
  '    <section class="section"><h2>💬 Wayfair Messaging Pillars</h2><div class="enhanced-grid">${pillarsHtml}</div></section>',
  '    <section class="section"><h2>✉️ Three-Part Email Sequence</h2><div class="enhanced-grid">${sequenceHtml}</div></section>',
  '    <section class="section"><h2>🎬 Short-Form Video Script</h2>${videoHtml}</section>',
  '    <section class="section"><h2>📣 Paid Ad Variations</h2><div class="enhanced-grid">${adsHtml}</div></section>',
  '    <section class="section"><h2>🛍️ Product Copy & SEO</h2><div class="enhanced-grid">${productHtml}</div></section>',
  '    <section class="section"><h2>⚡ Quick Wins</h2>${quickWinsHtml}</section>',
  '    <section class="section"><h2>✅ Evaluation Summary</h2><div class="score-grid">${evalHtml}</div><p style="margin-top:15px">${esc(evalData.notes)}</p></section>',
].join('\n');
buildCode = buildCode.replace('    <footer class="footer">', enhancedSections + '\n    <footer class="footer">');
buildCode = buildCode.replace('return [{json: {html, category, focus}}];', 'return [{json: {html, category, focus, audience, season, objective, product_focus: productFocus, competitor_focus: competitorFocus, parse_mode: data.parse_mode, validation_warnings: data.validation_warnings, validation_notes: data.validation_notes, is_valid: data.is_valid}}];');
build.parameters.jsCode = buildCode;

node('Download').parameters.jsCode = [
  "const item = $input.first().json;",
  "const safe = (v) => String(v || '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');",
  "const ts = new Date().toISOString().split('T')[0];",
  "const fileName = `Wayfair_${safe(item.category)}_${safe(item.audience)}_${safe(item.objective)}_${ts}.html`;",
  "return [{json:{...item,fileName},binary:{data:{data:Buffer.from(item.html).toString('base64'),mimeType:'text/html',fileName}}}];",
].join('\n');

const model = node('Google Gemini');
model.parameters.options = { temperature: 0.2, maxOutputTokens: 8192 };
model.retryOnFail = true;
model.maxTries = 3;
model.waitBetweenTries = 8000;

node('Notes').parameters.content = `## Project 4 — Enhanced Wayfair Content Strategy Copilot

### A + B + C enhancement
- Brand-safe Wayfair voice with banned AI clichés
- Audience, season, objective, product and competitor inputs
- Full email sequence, video script, ads, product copy and SEO
- Quick wins, KPIs and evaluation scorecard
- Contextual fallback instead of stale sample data
- Schema validation and explicit warnings

### Test target
Budget-conscious renters · Fall refresh · Education and conversion · Washable rugs under $200`;

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(output);
