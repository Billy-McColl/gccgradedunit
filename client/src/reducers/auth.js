import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
} from '../actions/types';

// creating a variable to keep it tidy when exporting the information.
const initialState = {
	// get the token and then we will store it in local storage.
	token: localStorage.getItem('token'),

	// set it to null to start with but once we have a successful registration we will
	// update this to true.
	isAuthenticated: null,
	loading: true,

	// set to null be default but user information will go in here
	// once updated and successful registered
	user: null,
};

export default function (state = initialState, action) {
	// destruction my code so i have access to the values below
	const { type, payload } = action;

	switch (type) {
		// if user is has logged in
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload,
			};

		// If registration is successfully the user will get back a token.
		// setting up a case for when the user has registered successfully
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem('token', payload.token);
			return {
				/// using the spread operator ... we will return anything that is currently stored in the state.
				...state,
				// sending the users payload(data)
				...payload,
				// change the user to true
				isAuthenticated: true,
				loading: false,
			};

		// setting up a case for when the user has failed registration.
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
			// remove the token from local storage
			localStorage.removeItem('token');
			return {
				// return the current state
				...state,
				// set the token to null as user is not authenticated
				token: null,
				isAuthenticated: false,
				loading: false,
			};

		default:
			return state;
	}
}
