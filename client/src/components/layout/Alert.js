import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// alert component  where the div key is equal to the alert id within the redux state managment.
const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map((alert) => (
		<div key='alert.id' className={`alert alert-${alert.alertType}`}>
			{alert.msg}
		</div>
	));

// get the react redux state.

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
