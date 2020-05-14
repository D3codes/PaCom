import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import parse from './utilities/csvImporter';
import fromPulse from './transformers/fromPulse';

function App() {
	const [path, setPath] = useState(null);

	const onClick = () => {
		parse().then(({ data }) => fromPulse(data)).then((reminders) => {
			setPath(reminders);
		});
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
