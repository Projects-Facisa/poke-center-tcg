import React from 'react';
import "./GithubProfiles.css"
import { FaGithub } from "react-icons/fa";

const GitHubProfileCard = ({ avatarUrl, userName, gitHubUrl }) => {
    return (
      <div className="github-profile-card">
        <a href={gitHubUrl} target="_blank" rel="noopener noreferrer">
        <img src={avatarUrl} alt={userName} className="github-profile-image" />
        <span className="github-profile-name">{userName}</span>
        <span className='fa-github'> <FaGithub/></span>
        </a>
      </div>
    );
  };

export default GitHubProfileCard;