const fs = require('fs');
const path = require('path');
const sqlite3 = require('../.n8n-runtime/node_modules/sqlite3').verbose();
const { parse } = require('../.n8n-runtime/node_modules/.pnpm/flatted@3.4.2/node_modules/flatted');

const root = path.resolve(__dirname, '..');
const executionId = Number(process.argv[2]);
if (!Number.isInteger(executionId)) throw new Error('Usage: node export-project4-execution.js <execution-id>');

const database = path.join(root, '.n8n-local', '.n8n', 'database.sqlite');
const outputHtml = path.join(root, 'output', 'html', 'wayfair-enhanced-content-strategy-report.html');
const outputSummary = path.join(root, 'output', 'data', 'project-4-step-3-execution-summary.json');
const db = new sqlite3.Database(database);

db.get('SELECT data FROM execution_data WHERE executionId = ?', [executionId], (error, row) => {
  if (error) throw error;
  if (!row) throw new Error(`Execution ${executionId} was not found.`);

  const execution = parse(row.data);
  const runData = execution.resultData.runData;
  const latest = (name) => runData[name]?.at(-1)?.data?.main?.[0]?.[0]?.json;
  const extracted = latest('Extract Files');
  const parsed = latest('Parse Content');
  const built = latest('Build HTML');
  if (!built?.html) throw new Error('Build HTML output was not found.');

  const requiredSections = [
    'Creative Brief',
    'Wayfair Messaging Pillars',
    'Three-Part Email Sequence',
    'Short-Form Video Script',
    'Paid Ad Variations',
    'Product Copy & SEO',
    'Quick Wins',
    'Evaluation Summary',
  ];
  const summary = {
    execution_id: executionId,
    status: 'success',
    parse_mode: parsed.parse_mode,
    is_valid: parsed.is_valid,
    validation_warnings: parsed.validation_warnings,
    validation_notes: parsed.validation_notes,
    input: {
      category: extracted.category,
      focus: extracted.focus,
      audience: extracted.audience,
      season: extracted.season,
      objective: extracted.objective,
      product_focus: extracted.product_focus,
      competitor_focus: extracted.competitor_focus,
      p2_characters: extracted.p2_content.length,
      p3_characters: extracted.p3_content.length,
    },
    output_counts: {
      key_metrics: parsed.content.key_metrics?.length || 0,
      messaging_pillars: parsed.content.messaging_pillars?.length || 0,
      content_ideas: parsed.content.content_ideas?.length || 0,
      email_sequence: parsed.content.email_sequence?.length || 0,
      video_scenes: parsed.content.video_script?.scenes?.length || 0,
      quick_wins: parsed.content.quick_wins?.length || 0,
    },
    html_characters: built.html.length,
    required_sections: Object.fromEntries(requiredSections.map((section) => [section, built.html.includes(section)])),
  };

  fs.mkdirSync(path.dirname(outputHtml), { recursive: true });
  fs.mkdirSync(path.dirname(outputSummary), { recursive: true });
  fs.writeFileSync(outputHtml, built.html);
  fs.writeFileSync(outputSummary, JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ outputHtml, outputSummary, summary }, null, 2));
  db.close();
});
