import express from 'express';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { html } from 'htm/react';
import { App } from './static/App.js';
import { stringify } from 'html-safe-json';

const app = express();
const PORT = 4000;
const isDev = process.env.NODE_ENV !== 'production';

let templateHtmlCache;

// Serve static files (for client-side JS)
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  // Server-side data that will be passed to the React component
  const data = { initialCount: 5 };
  let templateHtml = templateHtmlCache || readFileSync('./template.html', 'utf-8');
  if (!isDev) {
    templateHtmlCache = templateHtml;
  }

  // Render React component to HTML string
  const start = performance.now();
  const appHtml = renderToString(html`<${App} ...${data} />`);
  console.log(`Time taken to render: ${(performance.now() - start).toFixed(2)} milliseconds`);

  // Replace placeholders in the HTML template
  const livereloadScript = isDev 
    ? '<script src="http://localhost:35729/livereload.js?snipver=1"></script>'
    : '';
  
  const completeHtml = templateHtml
    .replace('{{APP_HTML}}', appHtml)
    .replace('{{SERVER_DATA}}', stringify(data))
    .replace('{{LIVERELOAD_SCRIPT}}', livereloadScript);

  res.send(completeHtml);
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`, isDev ? 'in development mode' : 'in production mode');
  
  if (isDev) {
    // Trigger livereload after server restart by touching template.html
    setTimeout(async () => {
      try {
        const { utimes } = await import('fs/promises');
        const now = new Date();
        await utimes('./template.html', now, now);
      } catch (err) {
        // do nothing
      }
    }, 200);
  }
});

