import { useEffect, useState } from 'react';

const usePromise = (func) => {
	const [state, setState] = useState([null, true, null]);
	useEffect(() => {
		func()
			.then((result) => setState([result, false, null]))
			.catch((error) => setState([null, false, error]));
	}, []);
	return state;
};

export default usePromise;
