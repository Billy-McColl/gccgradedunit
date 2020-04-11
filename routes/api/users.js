const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// load the User model
const User = require('../../models/User');

// route    POST api/users
// desc     Register user
// access   Public
router.post(
	'/',
	[
		// check the the name input fields has been correctly filled in and is not empty
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		// check the the email input fields has been correctly filled in and is not empty
		check('email', 'Please include a valid email').isEmail(),
		//// check the the password input fields has been correctly filled in and is not empty
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// return a 400 error message is the above input fields are left empty
			return res.status(400).json({ errors: errors.array() });
		}

		// sort all data from the req.body into a object so we have access to them more easily
		const { name, email, password } = req.body;

		try {
			// find one user by the user emial
			let user = await User.findOne({ email });

			// if user exists return an error message with the message user already exists
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}

			// bring in our gravatar email to use
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			user = new User({
				name,
				email,
				avatar,
				password
			});

			// start to salt the password for password hashing
			const salt = await bcrypt.genSalt(10);

			// get the users password and hash it with the salt
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user.id
				}
			};

			// json web token secret that is inside of my config folder and expiration of the token itself
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 3600000000 },
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
