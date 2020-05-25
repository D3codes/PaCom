import { useEffect, useState } from 'react';

const usePromise = (func, dependencies) => {
	const [state, setState] = useState([null, true, null]);
	useEffect(() => {
		func()
			.then((result) => setState([result, false, null]))
			.catch((error) => setState([null, false, error]));
	}, [dependencies]);
	return state;
};

export default usePromise;
