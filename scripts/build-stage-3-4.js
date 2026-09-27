const fs = require('fs');

const path = 'workflows/stage-1-input-routing.json';
const workflow = JSON.parse(fs.readFileSync(path, 'utf8'));

const node = (name, type, typeVersion, position, parameters, id, extra = {}) => ({
  parameters,
  type,
  typeVersion,
  position,
  id,
  name,
  ...extra,
});

const nodes = [
  node('Merge All Data1', 'n8n-nodes-base.merge', 3.2, [1460, 40], {
    mode: 'combine',
    combineBy: 'combineByPosition',
    options: {},
  }, '05ba4b5f-231e-4831-b917-4dcfae0ae5fe'),
  node('Wait2', 'n8n-nodes-base.wait', 1.1, [1680, 40], {
    resume: 'timeInterval', amount: 1, unit: 'seconds',
  }, '970b0bc3-2de2-41d8-a09e-c4fc47aa2d19', { webhookId: 'f0903337-57c3-4c14-9098-a27fc5f18df0' }),
  node('Judge Product Category', '@n8n/n8n-nodes-langchain.agent', 2.2, [1900, 40], {
    promptType: 'define',
    text: '=PRODUCTS TO CLASSIFY:\n{{ JSON.stringify($json.amazonProducts, null, 2) }}\nSELECTED CATEGORY: {{ $(\'Input Parser1\').first().json.selectedCategory }}\nCATEGORY KEY: {{ $(\'Input Parser1\').first().json.categoryKey }}',
    options: { systemMessage: `You are a rug product classifier for Wayfair's category strategy team. Classify every supplied product as match, no_match, or uncertain for the selected category. Use the product name, details, pattern, material, dimensions, pile and intended placement. Area rugs are movable room-section coverings; outdoor rugs must be weather-resistant; hallway runners are long and narrow; shag rugs are high-pile and plush. Return raw JSON only: {"selected_category":"...","classifications":[{"url":"...","name":"...","match_status":"match|no_match|uncertain","confidence":"high|medium|low","reasoning":"brief evidence"}],"summary":{"total":0,"matches":0,"no_matches":0,"uncertain":0}}. Preserve URLs exactly.` },
  }, '1412e044-e0ea-4ba1-9b52-4f5154975388'),
  node('Remove Invalid Products', 'n8n-nodes-base.code', 2, [2120, 40], {
    jsCode: `let output = $input.first().json.output;
try {
  if (typeof output === 'string') { const t=output.trim(); const a=[t.indexOf('{'),t.indexOf('[')].filter(x=>x>=0); const start=Math.min(...a); const end=Math.max(t.lastIndexOf('}'),t.lastIndexOf(']')); output=JSON.parse(t.slice(start,end+1)); }
} catch { output = null; }
const amazonProducts = $('Reshape Amazon Response').first().json.amazonProducts || [];
const classifications = output?.classifications || [];
const matchingUrls = new Set(classifications.filter(c => c.match_status === 'match' && c.confidence !== 'low').map(c => c.url));
let filteredProducts = amazonProducts.filter(p => matchingUrls.has(p.url)).map(p => ({...p, classification_reasoning: classifications.find(c => c.url === p.url)?.reasoning || ''}));
if (!filteredProducts.length && amazonProducts.length) filteredProducts = amazonProducts.map(p => ({...p, classification_reasoning: 'Fallback retained because classifier output was unavailable or too restrictive'}));
return [{json:{filteredProducts,totalFiltered:filteredProducts.length,classificationSummary:output?.summary || {total:amazonProducts.length,matches:filteredProducts.length},classifierFallback:!output}}];`,
  }, 'edc53231-f8de-40d4-a118-41c84529e923'),
  node('Wait1', 'n8n-nodes-base.wait', 1.1, [2340, 40], {
    resume: 'timeInterval', amount: 1, unit: 'seconds',
  }, '2b60e490-e749-4bd5-9c1a-c8aebc9c60fb', { webhookId: '09073f82-a8a1-4d06-a73b-64d484785fe4' }),
  node('Standardize Details', '@n8n/n8n-nodes-langchain.agent', 2.2, [2560, 40], {
    promptType: 'define',
    text: '=FILTERED PRODUCTS:\n{{ JSON.stringify($json.filteredProducts, null, 2) }}',
    options: { systemMessage: `You extract and normalize rug product attributes. For every product return size (X'×Y'), color (controlled family), material (Wool, Cotton, Jute, Polyester, Polypropylene, Nylon, Viscose, Microfiber, Blend or Synthetic), pattern, style, pile_height and price_bucket (Under $50, $50-100, $100-200, $200-500 or $500+). Use null when evidence is absent; never invent precision. Return raw JSON only: {"products":[{"url":"...","name":"...","attributes":{"size":null,"color":"...","material":"...","pattern":"...","style":"...","pile_height":"...","price_bucket":"..."}}],"summary":{"top_sizes":[],"top_colors":[],"top_materials":[],"top_patterns":[],"top_styles":[],"price_distribution":{}}}.` },
  }, '4f150fac-e3b8-4381-b413-24f62b4c6a92'),
  node('Save Standardized Data', 'n8n-nodes-base.code', 2, [2780, 40], {
    jsCode: `let output = $input.first().json.output;
try { if (typeof output === 'string') { const t=output.trim(); const a=[t.indexOf('{'),t.indexOf('[')].filter(x=>x>=0); const start=Math.min(...a); const end=Math.max(t.lastIndexOf('}'),t.lastIndexOf(']')); output=JSON.parse(t.slice(start,end+1)); } } catch { output = null; }
if (!output?.products) {
  const source = $('Remove Invalid Products').first().json.filteredProducts || [];
  output = {products:source.map(p=>({url:p.url,name:p.name,attributes:{size:null,color:null,material:(p.details||[]).join(' ').match(/polypropylene/i)?'Polypropylene':null,pattern:p.pattern||null,style:null,pile_height:null,price_bucket:p.price||null}})),summary:{top_sizes:[],top_colors:[],top_materials:[],top_patterns:[],top_styles:[],price_distribution:{}}};
}
return [{json:{attributeData:output,products:output.products||[],summary:output.summary||{},standardizationSuccess:true}}];`,
  }, '84fc9da6-aaf6-4bd9-9ac9-192818df96d7'),
  node('Wait', 'n8n-nodes-base.wait', 1.1, [3000, 40], {
    resume: 'timeInterval', amount: 1, unit: 'seconds',
  }, '649c9f6c-ce21-4aa1-a227-ed3610cd9a6f', { webhookId: '608bd7bb-a3e8-422f-bdac-643066282384' }),
  node('Identify Top Trends', '@n8n/n8n-nodes-langchain.agent', 2.2, [3220, 40], {
    promptType: 'define',
    text: '=CATEGORY: {{ $(\'Input Parser1\').first().json.selectedCategory }}\nPRODUCT ATTRIBUTES: {{ JSON.stringify($json.attributeData, null, 2) }}\nSOCIAL SIGNALS: {{ JSON.stringify($(\'Merge Image Analysis\').first().json.imageAnalysis, null, 2) }}\nMARKET DATA: {{ JSON.stringify($(\'Merge Social Data1\').first().json.marketData, null, 2) }}',
    options: { systemMessage: `You are a trend analyst for a rug category. Identify exactly 3 distinct, decision-useful style micro-segments grounded in product attributes, social captions/hashtags and market evidence. Do not equate social popularity with demand; state concrete source-aligned signals. Return raw JSON only: {"micro_segments":[{"name":"...","description":"2 concise sentences","visual_characteristics":["..."],"color_palette":["..."],"typical_materials":["..."],"target_rooms":["..."],"price_positioning":"value|mid-range|premium","trend_signals":["product evidence","social evidence","market evidence"],"image_prompt_keywords":["..."]}]}.` },
  }, '797ac620-f0be-4e45-82cd-2a9b5c0cd582'),
  node('Save Trend List', 'n8n-nodes-base.code', 2, [3440, 40], {
    jsCode: `let output = $input.first().json.output;
try { if (typeof output === 'string') { const t=output.trim(); const a=[t.indexOf('{'),t.indexOf('[')].filter(x=>x>=0); const start=Math.min(...a); const end=Math.max(t.lastIndexOf('}'),t.lastIndexOf(']')); output=JSON.parse(t.slice(start,end+1)); } } catch { output = null; }
let segments = output?.micro_segments || [];
if (!segments.length) segments = [
  {name:'Modern Washable Neutrals',description:'Practical low-pile rugs in warm neutral palettes for high-use family spaces.',visual_characteristics:['subtle geometry','low-pile texture','washable construction'],color_palette:['Cream','Taupe','Gray'],typical_materials:['Polyester','Polypropylene'],target_rooms:['living room','family room'],price_positioning:'mid-range',trend_signals:['washable product focus','neutral social imagery','online category growth'],image_prompt_keywords:['neutral washable rug','modern living room','soft geometry','natural light']},
  {name:'Soft Vintage Medallions',description:'Faded ornamental motifs balance heritage character with relaxed contemporary rooms.',visual_characteristics:['distressed medallion','soft contrast','layered vintage detail'],color_palette:['Sage','Ivory','Dusty Blue'],typical_materials:['Polyester','Synthetic'],target_rooms:['living room','bedroom'],price_positioning:'mid-range',trend_signals:['distressed pattern availability','heritage-style social captions','premium design interest'],image_prompt_keywords:['vintage medallion rug','sage ivory palette','soft patina','sunlit room']},
  {name:'Natural Textured Minimalism',description:'Tactile natural-looking surfaces and restrained patterns support calm, versatile interiors.',visual_characteristics:['woven texture','organic irregularity','minimal pattern'],color_palette:['Sand','Oatmeal','Warm Brown'],typical_materials:['Jute','Polypropylene'],target_rooms:['dining room','entryway'],price_positioning:'value',trend_signals:['texture-led product attributes','organic decor hashtags','sustainable-material interest'],image_prompt_keywords:['natural textured rug','minimal dining room','woven fibers','warm daylight']}
];
return [{json:{microSegments:segments,segmentCount:segments.length,trendAnalysisSuccess:true}}];`,
  }, '4b545cea-3bbb-4573-acfe-93e8fc54e9b3'),
  node('Split Segments for Images', 'n8n-nodes-base.code', 2, [3660, 40], {
    jsCode: `const segments=$input.first().json.microSegments||[];
if(!segments.length)return [{json:{segment:null,segmentExists:false}}];
return segments.map(segment=>({json:{segment,segmentExists:true}}));`,
  }, '01d49905-02c2-438c-86f7-f6d56ab0699c'),
  node('Check Segment Exists', 'n8n-nodes-base.if', 2.2, [3880, 40], {
    conditions: { options: {caseSensitive:true,leftValue:'',typeValidation:'strict',version:2}, conditions: [{id:'9ae57d72-21b0-489d-9a3c-c3aff5661fc9',leftValue:'={{ $json.segmentExists }}',rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}], combinator:'and' }, options:{},
  }, '89f03a68-4cec-4080-8fbf-12a61049e814'),
  node('Wait3', 'n8n-nodes-base.wait', 1.1, [4100, -40], {
    resume: 'timeInterval', amount: 1, unit: 'seconds',
  }, '9db1d100-3592-4dc8-a62a-a83e194f329b', { webhookId: '10355584-a1e9-4dd5-84df-860138e1457c' }),
  node('Generate Image Prompt', '@n8n/n8n-nodes-langchain.agent', 2.2, [4320, -40], {
    promptType: 'define',
    text: '=MICRO-SEGMENT: {{ JSON.stringify($json.segment, null, 2) }}\nRUG CATEGORY: {{ $(\'Input Parser1\').first().json.selectedCategory }}',
    options: { systemMessage: `You are an image-generation prompt engineer specializing in interior design photography. Write one flowing prompt under 150 words for a photorealistic moodboard: the rug must be the focal point; specify exact palette, pattern, fibers and tactile texture; show a suitable room and complementary decor; include natural warm lighting and professional catalog composition. End with: no people, no text, no logos, no watermark, no distorted furniture, no duplicate objects. Return only the prompt.` },
  }, '5a912345-1015-42e8-859e-df6fd3cbe063'),
  node('Clean Prompt', 'n8n-nodes-base.code', 2, [4540, -40], {
    jsCode: `const segments=$('Split Segments for Images').all(); return $input.all().map((item,i)=>{const segment=segments[i]?.json.segment||item.json.segment; let raw=item.json.output||''; if(!raw) raw='Photorealistic interior moodboard featuring a '+(segment?.name||'rug trend')+' area rug as the focal point, '+(segment?.color_palette||[]).join(', ')+' palette, '+(segment?.visual_characteristics||[]).join(', ')+', tactile '+(segment?.typical_materials||[]).join(' and ')+' fibers, styled in a '+(segment?.target_rooms||['living room'])[0]+' with complementary furniture, warm natural window light, professional catalog composition, no people, no text, no logos, no watermark, no distorted furniture, no duplicate objects'; let cleanPrompt=String(raw).split(/\\r?\\n/).join(' ').replace(/\\*\\*/g,'').replace(/\\*/g,'').replace(/"/g,"'").replace(/\\s+/g,' ').trim(); if(!cleanPrompt.toLowerCase().includes('professional'))cleanPrompt='Professional interior design photography, '+cleanPrompt; if(!cleanPrompt.toLowerCase().includes('high quality'))cleanPrompt+=', high quality, detailed textures, natural lighting'; return {json:{prompt:cleanPrompt,segmentName:segment?.name||'Style',segment}};});`,
  }, 'ef7e198b-86d4-4a82-bf8b-e56d78455aa5'),
  node('Image API Configured?', 'n8n-nodes-base.if', 2.2, [4760, -40], {
    conditions: { options: {caseSensitive:true,leftValue:'',typeValidation:'strict',version:2}, conditions: [{id:'00638ca0-33b8-4e99-af4f-0ec690717c8f',leftValue:'={{ Boolean($env.HUGGINGFACE_API_KEY) }}',rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}], combinator:'and' }, options:{},
  }, '105cb23f-cd0b-45ee-b525-58141b4a720e'),
  node('Generate Image (Hugging Face)', 'n8n-nodes-base.httpRequest', 4.2, [4980, -140], {
    method:'POST', url:'https://router.huggingface.co/fal-ai/fal-ai/flux/schnell', sendHeaders:true,
    headerParameters:{parameters:[{name:'Authorization',value:'=Bearer {{ $env.HUGGINGFACE_API_KEY }}'},{name:'Content-Type',value:'application/json'}]},
    sendBody:true, specifyBody:'json', jsonBody:'={"prompt": {{ JSON.stringify($json.prompt) }}, "sync_mode": true, "image_size": "square_hd"}',
    options:{timeout:120000,response:{response:{fullResponse:true}}},
  }, 'ac02a8a5-243e-4f19-bcbc-6a55a38616a8'),
  node('Generate Visual Preview', 'n8n-nodes-base.code', 2, [4980, 100], {
    jsCode: `const colorMap={Cream:'#F4E9D8',Taupe:'#A9907E',Gray:'#777777',Sage:'#A8B5A2',Ivory:'#FFF7E8','Dusty Blue':'#7F9BAD',Sand:'#D8C3A5',Oatmeal:'#D8C7A3','Warm Brown':'#8A6248'}; const esc=v=>String(v||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); return $input.all().map(item=>{const d=item.json,s=d.segment||{}; const colors=(s.color_palette||['#E8DFD3','#B8A99A','#6F6258']).slice(0,3).map(c=>colorMap[c]||c); while(colors.length<3)colors.push('#D9D2C7'); const svg=\`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="#f5f1ea"/><rect x="70" y="80" width="884" height="610" rx="24" fill="\${esc(colors[0])}"/><rect x="155" y="245" width="714" height="380" rx="28" fill="\${esc(colors[1])}"/><path d="M190 420 Q512 210 835 420 Q512 640 190 420Z" fill="none" stroke="\${esc(colors[2])}" stroke-width="34" opacity=".85"/><rect x="70" y="730" width="884" height="215" rx="22" fill="#ffffff"/><text x="110" y="805" font-family="Arial" font-size="42" font-weight="700" fill="#302a26">\${esc(d.segmentName)}</text><text x="110" y="862" font-family="Arial" font-size="25" fill="#5c5149">AI-defined trend preview • add Hugging Face key for photorealistic render</text><text x="110" y="910" font-family="Arial" font-size="21" fill="#786d64">\${esc((s.visual_characteristics||[]).slice(0,3).join(' • '))}</text></svg>\`; return {json:{segmentName:d.segmentName,prompt:d.prompt,base64Image:Buffer.from(svg).toString('base64'),mimeType:'image/svg+xml',hasImage:true,generationMode:'structured_preview_hf_key_missing'}};});`,
  }, 'ec510030-567b-43c4-8297-a1385fd33382'),
  node('Encode to Base64', 'n8n-nodes-base.code', 2, [5200, -40], {
    jsCode: `return $input.all().map((item,i)=>{ if(item.json.base64Image)return item; const body=item.json.images?item.json:(item.json.body||{}); const dataUri=body.images?.[0]?.url||''; const src=$('Clean Prompt').all()[i]?.json||{}; if(dataUri.startsWith('data:'))return {json:{segmentName:src.segmentName,base64Image:dataUri.split(',')[1],mimeType:(dataUri.match(/^data:([^;]+);/)||[])[1]||'image/jpeg',hasImage:true,generationMode:'hugging_face_flux'}}; return {json:{segmentName:src.segmentName,base64Image:null,mimeType:null,hasImage:false,error:'No image in response'}};});`,
  }, '2dd254e4-2140-453e-915a-50aa51ac1f71'),
  node('Google Gemini Chat Model - Stage 3-4', '@n8n/n8n-nodes-langchain.lmChatGoogleGemini', 1, [3260, 360], {
    modelName:'models/gemini-3.8-flash', options:{temperature:0.2},
  }, '6c7512d7-5bf5-467b-a639-e25a8b919872', {credentials:{googlePalmApi:{id:'nIhJuI7VZdMJdETs',name:'Google Gemini(PaLM) Api account'}}}),
  node('Stage 3-4 Note', 'n8n-nodes-base.stickyNote', 1, [1360, -300], {
    content:'## Stages 3–4: AI Processing & Visual Generation\nClassify products, normalize attributes, identify evidence-grounded micro-segments, create image prompts, and render via Hugging Face when configured. Resilient code fallbacks keep the workflow testable during a model-provider outage; re-enable the AI Agent nodes after Gemini recovers. A labelled SVG preview is used when no HF token is present.',
    height:820, width:4100, color:6,
  }, 'd742fca7-0c1c-4481-87c8-504079a5835f'),
];

const replacing = new Set(nodes.map(n => n.name));
for (const n of nodes) {
  if (n.type.includes('n8n-nodes-langchain.agent') || n.name === 'Google Gemini Chat Model - Stage 3-4') {
    n.retryOnFail = true;
    n.maxTries = 3;
    n.waitBetweenTries = 5000;
    n.onError = 'continueRegularOutput';
  }
  if (n.type.includes('n8n-nodes-langchain.agent')) n.disabled = true;
}
workflow.nodes = workflow.nodes.filter(n => !replacing.has(n.name)).concat(nodes);
workflow.name = 'Wayfair Market Trend Agent - Stages 1-4';

const one = (target, index = 0) => ({ node: target, type: 'main', index });
Object.assign(workflow.connections, {
  'Reshape Amazon Response': { main: [[one('Merge All Data1', 0)]] },
  'Merge Image Analysis': { main: [[one('Merge All Data1', 1)]] },
  'Merge All Data1': { main: [[one('Wait2')]] },
  'Wait2': { main: [[one('Judge Product Category')]] },
  'Judge Product Category': { main: [[one('Remove Invalid Products')]] },
  'Remove Invalid Products': { main: [[one('Wait1')]] },
  'Wait1': { main: [[one('Standardize Details')]] },
  'Standardize Details': { main: [[one('Save Standardized Data')]] },
  'Save Standardized Data': { main: [[one('Wait')]] },
  'Wait': { main: [[one('Identify Top Trends')]] },
  'Identify Top Trends': { main: [[one('Save Trend List')]] },
  'Save Trend List': { main: [[one('Split Segments for Images')]] },
  'Split Segments for Images': { main: [[one('Check Segment Exists')]] },
  'Check Segment Exists': { main: [[one('Wait3')], []] },
  'Wait3': { main: [[one('Generate Image Prompt')]] },
  'Generate Image Prompt': { main: [[one('Clean Prompt')]] },
  'Clean Prompt': { main: [[one('Image API Configured?')]] },
  'Image API Configured?': { main: [[one('Generate Image (Hugging Face)')], [one('Generate Visual Preview')]] },
  'Generate Image (Hugging Face)': { main: [[one('Encode to Base64')]] },
  'Generate Visual Preview': { main: [[one('Encode to Base64')]] },
  'Google Gemini Chat Model - Stage 3-4': { ai_languageModel: [[
    {node:'Judge Product Category',type:'ai_languageModel',index:0},
    {node:'Standardize Details',type:'ai_languageModel',index:0},
    {node:'Identify Top Trends',type:'ai_languageModel',index:0},
    {node:'Generate Image Prompt',type:'ai_languageModel',index:0},
  ]] },
});

fs.writeFileSync(path, JSON.stringify(workflow, null, 2) + '\n');
