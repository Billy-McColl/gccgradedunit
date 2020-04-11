import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

// setting up the user Login form using the useState hook in react
const Login = ({ login, isAuthenticated }) => {
	// setting up blank states form my form for login
	//tho we only need email and password as with register we needed the name also
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	// pull all data from the formData email is what email the user inputs into the email input
	// password is what the suer inputs into the password input box
	const { email, password } = formData;

	//getting my value from the name fields within my form and event handler will run the function and store the value.abs
	//this one will only target the name value because i have stored the value in a key inside of an arry otherwise all values for my form //would just return the name letting me use on change for every field inside my form .
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	// on submit will prevent the default setting and fire an event and check the the passwords in both input match.
	const onSubmit = async (e) => {
		e.preventDefault();
		login(email, password);
	};

	// redirect if logged in
	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign In</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Sign Into Your Account
			</p>
			<form className='form' onSubmit={(e) => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						name='password'
						minLength='6'
						value={password}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>
				<input
					type='submit'
					className='btn btn-primary'
					value='Login'
				/>
			</form>
			<p className='my-1'>
				Don't have an account? <Link to='/register'>Register</Link>
			</p>
		</Fragment>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
