const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// route    GET api/profile/me
// desc     Get current users profile
// access   Private
router.get('/me', auth, async (req, res) => {
	try {
		// find one user profile with the user id then populate
		// the profile variable with user name and avatar.
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar']);

		// check for a profile and if none is found
		// return a 400 bad request error with the message.
		if (!profile) {
			return res
				.status(400)
				.json({ msg: 'There is no profile for this user' });
		}

		// return any profile found
		res.json(profile);
	} catch (err) {
		console.error(err.message);

		// return 500 server error
		res.status(500).send('Server Error');
	}
});

// route    POST api/profile
// desc     Create or update user profile
// access   Private
router.post(
	'/',
	[
		auth,
		[
			// check the user as filled in the stats input and the skills inputs
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		// run validation checks
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// store all user information with the body parser
		// making it easier and faster to get the user info.
		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		// Build profile object
		const profileFields = {};

		// user information fields
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = Array.isArray(skills)
				? skills
				: skills.split(',').map((skill) => ' ' + skill.trim());
		}

		// Build social object
		profileFields.social = {};
		// add any socials to the users information
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			// Using upsert option (creates new doc if no match is found).
			// find the profile by the user id and update the profile.
			let profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true, upsert: true }
			);

			// return profile
			res.json(profile);
		} catch (err) {
			console.error(err.message);

			// return 500 server error
			res.status(500).send('Server Error');
		}
	}
);

// route    GET api/profile
// desc     Get all profiles
// access   Public
router.get('/', async (req, res) => {
	try {
		// find all profiles and populate the profile variable
		// with the user, name, avatar info.
		const profiles = await Profile.find().populate('user', [
			'name',
			'avatar',
		]);

		// return profiles found
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		// return 500 server error
		res.status(500).send('Server Error');
	}
});

// route    GET api/profile/user/:user_id
// desc     Get profile by user ID
// access   Public
router.get('/user/:user_id', async (req, res) => {
	try {
		// find one profile by the id
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		// check for a profile and if no profile is found return 400 bad request message.
		if (!profile) return res.status(400).json({ msg: 'Profile not found' });

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			// no profile found 400 bad request
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
});

// route    DELETE api/profile
// desc     Delete profile, user & posts
// access   Private
router.delete('/', auth, async (req, res) => {
	try {
		// Removes all users posts that match the id
		// within the mongoDB database collection Post
		await Post.deleteMany({ user: req.user.id });

		// find the users profile that matches the id
		// remove the users profile.
		await Profile.findOneAndRemove({ user: req.user.id });

		// find user by the id and delete user.
		await User.findOneAndRemove({ _id: req.user.id });

		// if successful send user deleted message
		res.json({ msg: 'User deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// route    PUT api/profile/experience
// desc     Add profile experience
// access   Private
router.put(
	'/experience',
	[
		auth,
		[
			// updating the user experience section of the profile by getting
			// the title, company they worked for & from date.
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// get the user experiences and store it in object
		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		} = req.body;

		// store the users new experience before we update the database
		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			// find user profile by the user id
			const profile = await Profile.findOne({ user: req.user.id });

			// add the new user experience
			profile.experience.unshift(newExp);

			// save the info to the database
			await profile.save();

			// return updated profile
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		// find user profile by id
		const foundProfile = await Profile.findOne({ user: req.user.id });

		// map through the user experience
		const expIds = foundProfile.experience.map((exp) => exp._id.toString());
		// if i dont add .toString() it returns this weird mongoose array and the ids are somehow objects and it still deletes anyway even if you put /experience/5
		const removeIndex = expIds.indexOf(req.params.exp_id);
		if (removeIndex === -1) {
			return res.status(500).json({ msg: 'Server error' });
		} else {
			// once profile is found remove  the users experience from the users profile
			foundProfile.experience.splice(removeIndex, 1);
			await foundProfile.save();
			return res.status(200).json(foundProfile);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

// route    PUT api/profile/education
// desc     Add profile education
// access   Private
router.put(
	'/education',
	[
		auth,
		[
			// check that all below fields have been filled in correctly
			check('school', 'School is required').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('fieldofstudy', 'Field of study is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// store all info about education in the object below
		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;

		// save new updated education to the newEdu variable.
		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			// find one profile by id
			const profile = await Profile.findOne({ user: req.user.id });

			// update the education fields within the database
			profile.education.unshift(newEdu);

			// save it to database
			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		// find one profile by id
		const foundProfile = await Profile.findOne({ user: req.user.id });

		const eduIds = foundProfile.education.map((edu) => edu._id.toString());
		// if i dont add .toString() it returns this weird mongoose array and the ids are somehow objects and it still deletes anyway even if you put /education/5
		const removeIndex = eduIds.indexOf(req.params.edu_id);
		if (removeIndex === -1) {
			return res.status(500).json({ msg: 'Server error' });
		} else {
			foundProfile.education.splice(removeIndex, 1);
			await foundProfile.save();
			return res.status(200).json(foundProfile);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});
// route    GET api/profile/github/:username
// desc     Get user repos from Github
// access   Public
router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) console.error(error);

			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No Github profile found' });
			}

			res.json(JSON.parse(body));
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

module.exports = router;
