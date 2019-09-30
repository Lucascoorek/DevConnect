import React from 'react';
import PropTypes from 'prop-types';

const ProfileEdu = ({
  education: { school, degree, fieldofstudy, current, to, from, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{school}</h3>
      <p>
        {new Date(from).toISOString().split('T')[0]} -{' '}
        {to === null ? 'Now' : new Date(to).toISOString().split('T')[0]}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field of study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileEdu.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEdu;
