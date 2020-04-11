import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// making a private route component so i if the user cannot tpye in the url and get access to the router if not loged in
const PrivateRoute = ({
	component: Component,
	auth: { isAuthenticated, loading },
	...rest
}) => (
	<Route
		{...rest}
		render={(props) =>
			// if user is not authenticated and not loading return  to login page
			!isAuthenticated && !loading ? (
				<Redirect to='/login' />
			) : (
				// if the user is authenticated we will load the components
				<Component {...props} />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
