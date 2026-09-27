const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const source = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const run = (name, mocks, thisArg = {}) => new AsyncFunction('$', '$input', source(name)).call(thisArg, mocks.$, mocks.$input);
const binary = (fileName, content) => ({ data: Buffer.from(content).toString('base64'), fileName, mimeType: 'text/html', fileExtension: 'html' });

(async () => {
  const templateHtml = fs.readFileSync(path.join(root, 'tmp', 'project5-dashboard-template.html'), 'utf8');
  const p2Html = fs.readFileSync(path.join(root, 'output', 'html', 'area-rug-market-trend-report.html'), 'utf8');
  const p3Html = fs.readFileSync(path.join(root, 'output', 'html', 'wayfair-competitor-analysis-report.html'), 'utf8');
  const formItem = { json: { 'Product Category': 'Area Rug' }, binary: { data_0: binary('area-rug-market-trend-report.html', p2Html), data_1: binary('wayfair-competitor-analysis-report.html', p3Html) } };
  const extract = await run('project5-extract-form-files.js', { $: name => ({ first: () => name === 'Upload Form' ? formItem : null }), $input: { first: () => ({ json: { data: templateHtml } }) } });
  const extracted = extract[0];
  const parse = await run('project5-parse-reports.js', {
    $: name => ({ first: () => name === 'Extract Form Files' ? extracted : null }),
    $input: { first: () => extracted },
  }, { helpers: { getBinaryDataBuffer: async (_index, key) => Buffer.from(extracted.binary[key].data, 'base64') } });
  const built = await run('project5-build-dashboard.js', { $: () => null, $input: { first: () => parse[0] } });
  const prepared = await run('project5-prepare-download.js', { $: () => null, $input: { first: () => built[0] } });
  const outputPath = path.join(root, 'output', 'html', 'Area_Rug_Dashboard_2026-09-27.html');
  fs.writeFileSync(outputPath, Buffer.from(prepared[0].binary.data.data, 'base64'));
  const html = fs.readFileSync(outputPath, 'utf8');
  const checks = {
    outputPath,
    length: html.length,
    placeholders: (html.match(/\{\{/g) || []).length,
    hasTitle: html.includes('Area Rug Category Dashboard'),
    hasPrices: ['$187.73', '$44.99', '$30.45'].every(v => html.includes(v)),
    hasSegments: ['Modern Washable Neutrals', 'Soft Vintage Medallions', 'Natural Textured Minimalism'].every(v => html.includes(v)),
    parseValidation: parse[0].json.parseValidation,
  };
  console.log(JSON.stringify(checks, null, 2));
  if (checks.placeholders || !checks.hasTitle || !checks.hasPrices || !checks.hasSegments) process.exitCode = 1;
})();
