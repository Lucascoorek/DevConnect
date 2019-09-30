import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGitRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileGit = ({ username, getGitRepos, repos }) => {
  useEffect(() => {
    getGitRepos(username);
  }, [getGitRepos, username]);
  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>Github Repos</h2>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repo => (
          <div className='repo bg-white p-1 my-1' key={repo.id}>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGit.propTypes = {
  repos: PropTypes.array.isRequired,
  getGitRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  repos: state.profile.repos
});
export default connect(
  mapStateToProps,
  { getGitRepos }
)(ProfileGit);
