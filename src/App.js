import React from 'react';
import { Button } from '@material-ui/core';
import twilio from './utilities/twilioClient';


function App() {
	const onClick = async () => {
		await twilio.sendCall('+19137050325', 'Test Call');
	};

	return (
		<>
			<h1>Our Electron App!!</h1>
			<Button onClick={onClick}>Test</Button>
		</>
	);
}

export default App;
