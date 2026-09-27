// Prepare the complete dashboard as a downloadable HTML binary.
const { html, fileName, validation } = $input.first().json;
const buffer = Buffer.from(html, 'utf8');
return [{
  json: { fileName, validation },
  binary: { data: { data: buffer.toString('base64'), mimeType: 'text/html', fileName, fileExtension: 'html' } },
}];
