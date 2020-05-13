import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import parse from './utilities/csvImporter';

function App() {
	const [path, setPath] = useState(null);

	const onClick = () => {
		parse().then(setPath);
	};

	return (
		<>
			<h1>Our Electron App!!</h1>
			<Button onClick={onClick}>Browse...</Button>
			<h1>{path}</h1>
		</>
	);
}

export default App;
