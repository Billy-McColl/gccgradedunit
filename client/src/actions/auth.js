import axios from 'axios';
import { setAlert } from './alert';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// load the user and check auth
export const loadUser = () => async (dispatch) => {
	// check local storage
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get('/api/auth');
		// If success load user data from the users payload
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (err) {
		// if failed dispatch auth error
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

// REGISTER USER ACTION
export const register = ({ name, email, password }) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = JSON.stringify({ name, email, password });

	try {
		const res = await axios.post('/api/users', body, config);

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		});

		dispatch(loadUser());
	} catch (err) {
		// store any errors that may occur
		const errors = err.response.data.errors;

		// check if any errors then dispatch that error with
		// a message and with the colour danger set in my css
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: REGISTER_FAIL,
		});
	}
};

// lOGIN USER ACTION
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = JSON.stringify({ email, password });

	try {
		const res = await axios.post('/api/auth', body, config);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});

		dispatch(loadUser());
	} catch (err) {
		// store any errors that may occur
		const errors = err.response.data.errors;

		// check if any errors then dispatch that error with
		// a message and with the colour danger set in my css
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: LOGIN_FAIL,
		});
	}
};

// Logout and clear profile
export const logout = () => (dispatch) => {
	dispatch({
		type: LOGOUT,
	});
};
