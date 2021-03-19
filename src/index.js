import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import ReactDOM from 'react-dom';
import App from './react/app';
import paComTheme from './react/theme';

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={paComTheme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
