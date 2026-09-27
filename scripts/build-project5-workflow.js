const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const workflow = {
  id: 'p5-dashboard-wangluofei',
  name: 'P5_DashboardBuilder_WangLuofei',
  nodes: [
    {
      parameters: {
        formTitle: 'Project 5: Build Dashboard',
        formDescription: 'Upload your Project 2 (Market Trend) and Project 3 (Competitor Analysis) HTML reports to generate a category dashboard.',
        formFields: { values: [
          { fieldLabel: 'Product Category', placeholder: 'e.g., Area Rug, Outdoor Rug, Hallway Runner, Shag Rug', requiredField: true },
          { fieldLabel: 'P2 Market Trend Report', fieldType: 'file', requiredField: true, acceptFileTypes: '.html' },
          { fieldLabel: 'P3 Competitor Analysis Report', fieldType: 'file', requiredField: true, acceptFileTypes: '.html' },
        ] },
        options: {},
        path: 'p5-dashboard-builder-wang-luofei',
        responseMode: 'onReceived',
      },
      type: 'n8n-nodes-base.formTrigger', typeVersion: 2.1, position: [160, 300], id: 'p5-upload-form', name: 'Upload Form', webhookId: 'p5-dashboard-builder-wang-luofei',
    },
    {
      parameters: {
        url: 'http://34.196.186.128:8000/api/dashboard/template',
        options: { timeout: 30000, response: { response: { responseFormat: 'text', outputPropertyName: 'data' } } },
      },
      type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [400, 300], id: 'p5-fetch-template', name: 'Fetch Template',
    },
    { parameters: { jsCode: code('project5-extract-form-files.js') }, type: 'n8n-nodes-base.code', typeVersion: 2, position: [640, 300], id: 'p5-extract-files', name: 'Extract Form Files' },
    { parameters: { jsCode: code('project5-parse-reports.js') }, type: 'n8n-nodes-base.code', typeVersion: 2, position: [900, 300], id: 'p5-parse-reports', name: 'Parse P2 & P3 Reports' },
    { parameters: { jsCode: code('project5-build-dashboard.js') }, type: 'n8n-nodes-base.code', typeVersion: 2, position: [1160, 300], id: 'p5-build-dashboard', name: 'Build Dashboard HTML' },
    { parameters: { jsCode: code('project5-prepare-download.js') }, type: 'n8n-nodes-base.code', typeVersion: 2, position: [1420, 300], id: 'p5-prepare-download', name: 'Prepare Download' },
  ],
  pinData: {},
  connections: {
    'Upload Form': { main: [[{ node: 'Fetch Template', type: 'main', index: 0 }]] },
    'Fetch Template': { main: [[{ node: 'Extract Form Files', type: 'main', index: 0 }]] },
    'Extract Form Files': { main: [[{ node: 'Parse P2 & P3 Reports', type: 'main', index: 0 }]] },
    'Parse P2 & P3 Reports': { main: [[{ node: 'Build Dashboard HTML', type: 'main', index: 0 }]] },
    'Build Dashboard HTML': { main: [[{ node: 'Prepare Download', type: 'main', index: 0 }]] },
  },
  active: false,
  settings: { executionOrder: 'v1' },
  versionId: '4f253fe7-8192-4a0c-a498-116f52905a07',
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};

const out = path.join(root, 'workflows', 'project-5-dashboard-builder-agent.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2) + '\n');
console.log(out);
