const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// route    GET api/auth
// desc     Test route
// access   Public
router.get('/', auth, async (req, res) => {
	try {
		// find user by id but to not add the password the the information we found.
		const user = await User.findById(req.user.id).select('-password');
		// respond with the suer details
		res.json(user);
	} catch (err) {
		// console log the error message.
		console.error(err.message);
		// return a 500 server error to the user.
		res.status(500).send('Server Error');
	}
});

// route    POST api/auth
// desc     Authenticate user & get token
// access   Public
router.post(
	'/',
	[
		// email & password validation check to make sure the user as filled out the form correctly
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		// if the user does not fill out the input form correctly return a 400 error and
		//list all fields within the error array below.
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// using body parser get user information regarding the user email and password
		// and store them in the below object so we have a quick way to access these values.
		const { email, password } = req.body;

		try {
			// find user by the user email.
			let user = await User.findOne({ email });

			// if no user is returned return a 400 error with a error message.
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			// here we compair the users password that they have tried to login with and
			// the one we have stored an stored the result in the isMatch variable.
			const isMatch = await bcrypt.compare(password, user.password);

			// if there is not a match found return a 400 bad request error and error message
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			// get the user payload (payload means data).
			const payload = {
				user: {
					id: user.id,
				},
			};

			// once loged in we will check the secret within the web token and then set it to expire
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
