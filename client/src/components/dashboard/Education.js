import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Education = ({ education }) => {
  const educationArr = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td>
        {new Date(edu.from).toISOString().split('T')[0]} -{' '}
        {edu.to === null ? 'Now' : new Date(edu.to).toISOString().split('T')[0]}
      </td>
      <td>
        <button className='btn btn-danger'>Delete</button>
      </td>
    </tr>
  ));
  return (
    <>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educationArr}</tbody>
      </table>
    </>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired
};

export default Education;
