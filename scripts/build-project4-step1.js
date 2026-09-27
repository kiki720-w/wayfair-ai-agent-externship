const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'downloads', 'project4-agent-source.json');
const output = path.join(root, 'workflows', 'project-4-content-strategy-agent.json');
const workflow = JSON.parse(fs.readFileSync(source, 'utf8'));

workflow.name = 'P4_ContentStrategy_WangLuofei';
workflow.id = workflow.id || randomUUID();
workflow.active = false;

const form = workflow.nodes.find((node) => node.name === 'Upload Form');
if (!form) throw new Error('Expected Upload Form node was not found.');
form.parameters.path = form.parameters.path || form.webhookId || 'p4-content-strategy-v3';
form.parameters.responseMode = form.parameters.responseMode || 'onReceived';

const model = workflow.nodes.find((node) => node.name === 'Mistral');
if (!model) throw new Error('Expected Mistral model node was not found.');

model.name = 'Google Gemini';
model.type = '@n8n/n8n-nodes-langchain.lmChatGoogleGemini';
model.typeVersion = 1;
model.parameters = {
  modelName: 'models/gemini-3.5-flash-lite',
  options: { temperature: 0.3 },
};
model.retryOnFail = true;
model.maxTries = 3;
model.waitBetweenTries = 8000;
model.credentials = {
  googlePalmApi: {
    id: 'nIhJuI7VZdMJdETs',
    name: 'Google Gemini(PaLM) Api account',
  },
};

workflow.connections['Google Gemini'] = workflow.connections.Mistral;
delete workflow.connections.Mistral;

const note = workflow.nodes.find((node) => node.name === 'Notes');
if (note?.parameters?.content) {
  note.parameters.content += '\n\n### Local compatibility update\nThe original empty Mistral credential was replaced with the existing Google Gemini credential and a currently available Gemini 3.5 Flash Lite model. Automatic retry is enabled, and no API key is stored in this workflow JSON.';
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(output);
