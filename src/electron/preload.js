const { init } = require('@sentry/electron/dist/renderer');
const appSettings = require('./appSettings.json');

// eslint-disable-next-line import/no-extraneous-dependencies
window.ipcRenderer = require('electron').ipcRenderer;

init({ dsn: appSettings.sentry.dsn });
