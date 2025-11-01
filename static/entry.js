/**
 * This file is meant to be only run on browser, not on server.
 * It is for hydration purpose.
 * Whereas App.js is meant to be run both on server and client.
 */
import { hydrateRoot } from 'react-dom/client';
import { html } from 'htm/react';
import { App } from './App.js';

// Get the server data from the script tag
const serverDataElement = document.getElementById('server-data');
const serverData = JSON.parse(serverDataElement.textContent);

// Hydrate the React app with the server data
const root = document.getElementById('root');
hydrateRoot(root, html`<${App} ...${serverData} />`);

