import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
	addLike,
	removeLike,
	deletePost,
	auth,
	post: { _id, text, name, avatar, user, likes, comments, date },
	showActions,
}) => (
	<div className='post bg-white p-1 my-1'>
		<div>
			<Link to={`/profile/${user}`}>
				{/* get users avatar */}
				<img className='round-img' src={avatar} alt='' />
				<h4>{name}</h4>
			</Link>
		</div>
		<div>
			{/* post text abd date*/}
			<p className='my-1'>{text}</p>
			<p className='post-date'>
				{/* use moment to get the date */}
				Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
			</p>

			{/* show user actions with like and unlike */}
			{showActions && (
				<Fragment>
					<button
						onClick={() => addLike(_id)}
						type='button'
						className='btn btn-light'
					>
						<i className='fas fa-thumbs-up' />{' '}
						{/* displayed how many likes the post has */}
						<span>
							{likes.length > 0 && <span>{likes.length}</span>}
						</span>
					</button>
					<button
						onClick={() => removeLike(_id)}
						type='button'
						className='btn btn-light'
					>
						<i className='fas fa-thumbs-down' />
					</button>
					<Link to={`/posts/${_id}`} className='btn btn-primary'>
						{/* show the number of comments if greater than 0 */}
						Discussion
						{comments.length > 0 && (
							<span className='comment-count'>
								{comments.length}
							</span>
						)}
					</Link>
					{/* if not loading and user is equeal to the logged in user show  button */}
					{!auth.loading && user === auth.user._id && (
						<button
							onClick={() => deletePost(_id)}
							type='button'
							className='btn btn-danger'
						>
							<i className='fas fa-times' />
						</button>
					)}
				</Fragment>
			)}
		</div>
	</div>
);

PostItem.defaultProps = {
	showActions: true,
};

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	removeLike: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
	showActions: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
	PostItem
);
