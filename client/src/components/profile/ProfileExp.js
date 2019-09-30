import React from 'react';
import PropTypes from 'prop-types';

const ProfileExp = ({
  experience: { company, title, location, current, to, from, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        {new Date(from).toISOString().split('T')[0]} -{' '}
        {to === null ? 'Now' : new Date(to).toISOString().split('T')[0]}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileExp.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExp;
