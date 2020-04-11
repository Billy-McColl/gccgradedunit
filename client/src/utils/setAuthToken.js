import axios from 'axios';

// run a function that takes the token and set it to the headers if it exists
// if no token remove from the headers
const setAuthToken = (token) => {
	// see if token in local storage and if there is set it in headers
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
	}
};

export default setAuthToken;
