import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// when called send user a messgae with an alert type
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
	// using uuid this is give a us random long string for the uuid that is automaticly generated
	const id = uuidv4();

	dispatch({
		type: SET_ALERT,
		// on dispatch we send the data along with
		// the msg we want to display the alert type and the id from above
		payload: { msg, alertType, id },
	});

	// setting the timeout for the alert and it will automatically remove itself
	// after 5 seconds useing the timeout param we set above.
	setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
