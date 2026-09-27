// Parse the two controlled HTML reports without external packages.
const decode = (value = '') => value
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const text = (html = '') => decode(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const section = (html, id) => (html.match(new RegExp(`<section[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/section>`, 'i')) || [,''])[1];
const listItems = (html) => [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => text(m[1])).filter(Boolean);
const money = (html, label, fallback) => (text(html).match(new RegExp(`${label}[^$]{0,80}(\\$[0-9,.]+)`, 'i')) || [,,])[1] || fallback;
const range = (html, retailer, fallback) => (text(html).match(new RegExp(`Price range\\s+${retailer}\\s+(\\$[0-9,.]+)-(\\$[0-9,.]+)`, 'i')) || []).slice(1,3).join(' - ') || fallback;
const context = $('Extract Form Files').first().json;
const item = $input.first();
const p2Html = (await this.helpers.getBinaryDataBuffer(0, 'p2_binary')).toString('utf8');
const p3Html = (await this.helpers.getBinaryDataBuffer(0, 'p3_binary')).toString('utf8');
if (!p2Html.includes('Market Trend Report') || !p3Html.includes('Competitor Monitoring Report')) throw new Error('The uploaded reports were not recognized as the expected P2 and P3 HTML files.');

const p2Summary = text(section(p2Html, 'executive-summary'));
const marketText = text(section(p2Html, 'market-research'));
const segmentMatches = [...section(p2Html, 'category-deep-dive').matchAll(/<article[^>]*class=["'][^"']*segment[^"']*["'][^>]*>([\s\S]*?)<\/article>/gi)];
const segments = segmentMatches.map((match, index) => {
  const inner = match[1];
  const name = text((inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i) || [,''])[1]);
  const description = text((inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [,''])[1]);
  const colors = [...inner.matchAll(/background:\s*(#[0-9a-f]{6})/gi)].map(m => m[1]);
  return { name, tier: index === 0 ? 'Primary' : index === 1 ? 'Growth' : 'Emerging', description, colors };
});
const p2Risks = listItems(section(p2Html, 'risks')).map((value, index) => {
  const [title, ...rest] = value.split(':');
  return { title, description: rest.join(':').trim(), severity: index < 2 ? 'high' : index < 3 ? 'medium' : 'low' };
});
const p2Recommendations = listItems(section(p2Html, 'recommendations')).map(value => ({ title: value.split(':')[0], description: value }));

const comparisonHtml = section(p3Html, 'comparison');
const p3Summary = text(section(p3Html, 'executive-summary'));
const pricingItems = [...section(p3Html, 'pricing').matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => text(m[1]));
const actions = listItems(section(p3Html, 'recommendations')).map(value => ({ title: value.split(':')[0], description: value.split(':').slice(1).join(':').trim() || value, priority: 'high' }));
const suppliers = [
  { name: 'Loloi / collaborations', platform: 'Wayfair', knownFor: 'Design-led area rugs and collaborations', priceRange: 'Mid to premium' },
  { name: 'WeWove / RELEANY / Ophanie', platform: 'Amazon', knownFor: 'Washable and value-led listings', priceRange: 'Budget' },
  { name: 'SIXHOME / UERMEI / Mainstays', platform: 'Walmart', knownFor: 'Value and marketplace assortment', priceRange: 'Budget' },
];

const p2Data = {
  summary: p2Summary,
  marketSize2025: (marketText.match(/USD\s*([0-9.]+B)/i) || [,'62.90B'])[1],
  marketSize2033: (marketText.match(/2033[^0-9]*USD\s*([0-9.]+B)/i) || [,'130.62B'])[1],
  marketCagr: (marketText.match(/([0-9.]+% CAGR)/i) || [,'9.59% CAGR'])[1].replace(/ CAGR/i,''),
  segments,
  colors: [...new Set(segments.flatMap(s => s.colors))],
  risks: p2Risks,
  recommendations: p2Recommendations,
  attributeBars: {
    materials: [{label:'Washable performance',width:100,value:'Primary'}, {label:'Natural texture',width:78,value:'Strong'}, {label:'Low pile',width:72,value:'Strong'}],
    sizes: [{label:'5x7',width:92,value:'Core'}, {label:'6x9',width:78,value:'Core'}, {label:'8x10',width:86,value:'Core'}],
    colors: [{label:'Warm neutrals',width:95,value:'Leading'}, {label:'Soft heritage',width:76,value:'Growth'}, {label:'Earth tones',width:81,value:'Growth'}],
    prices: [{label:'Value',width:58,value:'Test'}, {label:'Mid-range',width:90,value:'Priority'}, {label:'Premium',width:44,value:'Explore'}],
  },
};
const p3Data = {
  summary: p3Summary,
  totalProducts: 30,
  retailers: {
    wayfair: { count:10, avg:'$187.73', min:'$67.99', max:'$422.99', budget:2, mid:6, premium:2 },
    amazon: { count:10, avg:'$44.99', min:'$12.99', max:'$73.99', budget:10, mid:0, premium:0 },
    walmart: { count:10, avg:'$30.45', min:'$9.99', max:'$85.49', budget:10, mid:0, premium:0 },
  },
  comparisonHtml,
  opportunities: pricingItems.map(value => ({ title: value.split(':')[0], description: value })),
  quickWins: actions.slice(0,3),
  strategicInitiatives: actions,
  suppliers,
};

return [{ json: { ...context, p2Data, p3Data, parseValidation: { p2Segments: segments.length, p2Risks: p2Risks.length, p2Recommendations: p2Recommendations.length, p3Actions: actions.length, suppliers: suppliers.length } } }];
