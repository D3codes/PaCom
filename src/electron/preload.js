const { init } = require('@sentry/electron/dist/renderer');

// eslint-disable-next-line import/no-extraneous-dependencies
window.ipcRenderer = require('electron').ipcRenderer;

init({ dsn: 'https://a040b8dcc2ae49bf8bbe2107c765846a@o569343.ingest.sentry.io/5714969' });
