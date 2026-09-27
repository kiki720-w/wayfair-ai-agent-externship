// Build context for Parse P2 & P3 Reports.
const formItem = $('Upload Form').first();
const form = formItem.json || {};
const templateItem = $input.first();
const templateHtml = templateItem.json?.data || templateItem.json?.body || '';
const categoryName = form['Product Category'] || 'Area Rug';
const dateFolderName = new Date().toISOString().split('T')[0];
const files = Object.entries(formItem.binary || {});

const byName = (pattern) => files.find(([, file]) => pattern.test(String(file.fileName || '')))?.[1] || null;
const p2Binary = byName(/market|trend|project.?2|p2/i) || files[0]?.[1] || null;
const p3Binary = byName(/competitor|project.?3|p3/i) || files.find(([, file]) => file !== p2Binary)?.[1] || files[1]?.[1] || null;

if (!templateHtml) throw new Error('Dashboard template was empty. Check Fetch Template response settings.');
if (!p2Binary || !p3Binary) throw new Error(`Expected two HTML uploads; received ${files.length}.`);

return [{
  json: { categoryName, dateFolderName, templateHtml },
  binary: { p2_binary: p2Binary, p3_binary: p3Binary },
}];
