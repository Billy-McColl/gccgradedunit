const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// load my user models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// route    POST api/posts
// desc     Create a post
// access   Private
router.post(
	'/',
	[
		auth,
		[
			// check that the user has filled in the text field correctly.
			check('text', 'Text is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		// store validation results.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			// find user by the user id but if found do not return the users password.
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			});

			// once all fields are filled in correctly add a new post to mongoDB.
			const post = await newPost.save();

			// return post
			res.json(post);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// route    GET api/posts
// desc     Get all posts
// access   Private
router.get('/', auth, async (req, res) => {
	try {
		// get all posts and then sort the posts by the date sorting the newest first.
		const posts = await Post.find().sort({ date: -1 });

		// return posts.
		res.json(posts);
	} catch (err) {
		// return 500 server error message
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// route    GET api/posts/:id
// desc     Get post by ID
// access   Private
router.get('/:id', auth, async (req, res) => {
	try {
		//  find only the posts that match the user id
		const post = await Post.findById(req.params.id);

		// if no posts return a 400 bad request error and
		//display no posts found message.
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		// return any posts.
		res.json(post);
	} catch (err) {
		console.error(err.message);
		// check the object id are strictly equal if not display
		// post not found and display 500 server error.
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// route    DELETE api/posts/:id
// desc     Delete a post
// access   Private
router.delete('/:id', auth, async (req, res) => {
	try {
		// find post by id
		const post = await Post.findById(req.params.id);

		// if no posts are returned return a 404 not found error
		// with the message post not found.
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		// Check user
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		// await the page to load and remove post
		await post.remove();

		// return message with post removed.
		res.json({ msg: 'Post removed' });
	} catch (err) {
		console.error(err.message);
		// if error and object id match return not found error and message page not found.
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// route    PUT api/posts/like/:id
// desc     Like a post
// access   Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		// find post by id
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked before by the current id that was found before.
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length > 0
		) {
			// return error bad request if we have already liked the post.
			return res.status(400).json({ msg: 'Post already liked' });
		}

		post.likes.unshift({ user: req.user.id });

		// save and refresh
		await post.save();

		// return post likes.
		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		// return  500 server error with server error if something goes wrong.
		res.status(500).send('Server Error');
	}
});

// route    PUT api/posts/unlike/:id
// desc     Like a post
// access   Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		// find post by id
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length === 0
		) {
			return res.status(400).json({ msg: 'Post has not yet been liked' });
		}

		// Get remove index
		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);

		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// route    POST api/posts/comment/:id
// desc     Comment on a post
// access   Private
router.post(
	'/comment/:id',
	[
		auth,
		[
			// check the text in th3 comment box has been filled in correctly
			check('text', 'Text is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			// get user by id but do not get the user password
			const user = await User.findById(req.user.id).select('-password');

			// get user by posts id
			const post = await Post.findById(req.params.id);

			// setting up the new comment but this
			// will not store it into the database.
			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			};

			// adds a comment to the object and gets it ready to be submitted below.
			post.comments.unshift(newComment);

			// save post to database here.
			await post.save();

			// return new post comment
			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// route    DELETE api/posts/comment/:id/:comment_id
// desc     Delete comment
// access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		// find post by id
		const post = await Post.findById(req.params.id);

		// Pull out the comments from the database
		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		// Make sure comment exists
		// if no comment exists return 404 not found error.
		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exist' });
		}

		// Check user has access to this post
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		// Get remove index
		const removeIndex = post.comments
			.map((comment) => comment.id)
			.indexOf(req.params.comment_id);

		// remove comment from index
		post.comments.splice(removeIndex, 1);

		// save and update
		await post.save();

		// return updated comments.
		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
