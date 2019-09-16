import React from 'react';
import styled from 'styled-components';
import gitHubURL from './GitHub.png';

export function GitHubIcon() {
  return (
    <a
      href="https://github.com/DennisTismenko/nodome"
      target="_blank"
      rel="noopener noreferrer"
      style={{display: 'inline-block'}}
    >
      <GitHubIMG src={gitHubURL} alt="GitHub" />
    </a>
  );
}

const GitHubIMG = styled.img`
  background-color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
`;
