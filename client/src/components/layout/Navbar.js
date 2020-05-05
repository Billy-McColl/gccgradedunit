import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated }, loading, logout }) => {
	const authLinks = (
		<ul className='web-links'>
			<li>
				<Link to='/onlinesafety'>
					<i className='fas fa-info-circle'></i>{' '}
					<span className='hide-sm'>Online Help</span>
				</Link>
			</li>
			<li>
				<Link to='/profiles'>User Profiles</Link>
			</li>
			<li>
				<Link to='/dashboard'>
					<i className='fas fa-user'></i>{' '}
					<span className='hide-sm'>Dashboard</span>
				</Link>
			</li>
			<li>
				<a onClick={logout} href='#!'>
					<i className='fas fa-sign-out-alt'></i>{' '}
					<span className='hide-sm'>Logout</span>
				</a>
			</li>
		</ul>
	);

	const guestLinks = (
		<ul>
			<li>
				<Link to='/profiles'>User Profiles</Link>
			</li>
			<li>
				<Link to='/register'>Register</Link>
			</li>
			<li>
				<Link to='/login'>Login</Link>
			</li>
		</ul>
	);

	return (
		<nav className='navbar'>
			<h1>
				<Link to='/'>
					<i className='fas fa-user-shield'></i>
				</Link>
			</h1>

			{/* show selected menu items if your a guessed or logged in and only show logout button when logged in */}
			{/* if not loading and the user is authenticated show authlink else show guest links*/}
			{!loading && (
				<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
			)}
		</nav>
	);
};

Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
