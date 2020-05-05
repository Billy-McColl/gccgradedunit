import {
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKES,
	DELETE_POST,
	ADD_POST,
	GET_POST,
	ADD_COMMENT,
	REMOVE_COMMENT,
} from '../actions/types';

const initialState = {
	posts: [],
	post: null,
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_POSTS:
			// return the object with current state and fill the post with the users payload.
			return {
				...state,
				posts: payload,
				loading: false,
			};
		case GET_POST:
			return {
				// single post
				...state,
				post: payload,
				loading: false,
			};
		case ADD_POST:
			return {
				...state,
				posts: [payload, ...state.posts],
				loading: false,
			};
		case DELETE_POST:
			return {
				...state,
				posts: state.posts.filter((post) => post._id !== payload),
				loading: false,
			};
		case POST_ERROR:
			// fill the errors on the page with the payload
			return {
				...state,
				error: payload,
				loading: false,
			};
		case UPDATE_LIKES:
			// return state with current state and map through the posts and for each post
			// equals the post id with payload id and if it matches return post and update the likes
			return {
				...state,
				posts: state.posts.map((post) =>
					post._id === payload.id
						? { ...post, likes: payload.likes }
						: post
				),
				loading: false,
			};
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: payload },
				loading: false,
			};
		case REMOVE_COMMENT:
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.filter(
						(comment) => comment._id !== payload
					),
				},
				loading: false,
			};
		default:
			// return state
			return state;
	}
}
