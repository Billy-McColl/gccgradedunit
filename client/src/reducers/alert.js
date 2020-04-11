import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initalState = [];

export default function (state = initalState, action) {
	// destructuring the type and payload
	const { type, payload } = action;

	switch (type) {
		// setting alert type
		case SET_ALERT:
			// return state and if state already there return that plus new state and payload will equal the data
			//retuning the array with the new payload(data)  and the new alert
			return [...state, payload];
		case REMOVE_ALERT:
			// remove a specific alert thats not equal to the id
			return state.filter((alert) => alert.id !== payload);
		default:
			// wil return all alerts except the one the matches the payload
			return state;
	}
}
