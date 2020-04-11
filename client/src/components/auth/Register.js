import React, { Fragment, useState } from 'react';
// brought in connect interact with redux
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

// setting up the user registration form using the useState hook in react
// props paramter is using the alert from the redux import to show the user an alert when registering.
const Register = ({ setAlert, register, isAuthenticated }) => {
	// setting up blank states form my form
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	// pull all data from the formData
	const { name, email, password, password2 } = formData;

	//getting my value from the name fields within my form and event handler will run the function and store the value.abs
	//this one will only target the name value because i have stored the value in a key inside of an arry otherwise all values for my form //would just return the name letting me use on change for every field inside my form .
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	// on submit will prevent the default setting and fire an event and check the the passwords in both input match.
	const onSubmit = async (e) => {
		e.preventDefault();

		// checking if passwords match or do not match
		if (password !== password2) {
			// setting the alert for a user with  a failed login.
			setAlert('Passwords do not match', 'danger');
		} else {
			register({
				name,
				email,
				password,
			});
		}
	};
	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign Up</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Create Your Account
			</p>
			<form className='form' onSubmit={(e) => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Name'
						name='name'
						value={name}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={(e) => onChange(e)}
					/>
					<small className='form-text'>
						This site uses Gravatar so if you want a profile image,
						use a Gravatar email
					</small>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						name='password'
						minLength='6'
						value={password}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Confirm Password'
						name='password2'
						minLength='6'
						value={password2}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<input
					type='submit'
					className='btn btn-primary'
					value='Register'
				/>
			</form>
			<p className='my-1'>
				Already have an account? <Link to='/login'>Sign In</Link>
			</p>
		</Fragment>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
