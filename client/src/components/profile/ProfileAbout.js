import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
	profile: {
		bio,
		skills,
		user: { name },
	},
}) => (
	<div className='profile-about bg-light p-2'>
		{/* if the user has a bio display it only of they have one */}
		{bio && (
			<Fragment>
				<h2 className='text-primary'>
					{/* get users name and split it and only show the first name 
                            by making the string an array and then getting the 0 index of the array
                        */}
					{name.trim().split(' ')[0]}s Bio
				</h2>
				<p>{bio}</p>
				<div className='line' />
			</Fragment>
		)}
		<h2 className='text-primary'>Skill Set</h2>
		<div className='skills'>
			{/* map throught the skills array and get any skills the user has submited */}
			{skills.map((skill, index) => (
				<div key={index} className='p-1'>
					<i className='fas fa-check' /> {skill}
				</div>
			))}
		</div>
	</div>
);

ProfileAbout.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
