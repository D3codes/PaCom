import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import parse from './utilities/csvImporter';

function App() {
	const [path, setPath] = useState(null);

	const onClick = () => {
		parse().then(setPath).catch(console.error);
	};

	return (
		<>
			<h1>Our Electron App!!</h1>
			<Button onClick={onClick}>Browse...</Button>
			{path && <h1>{JSON.stringify(path)}</h1>}
		</>
	);
}

export default App;
