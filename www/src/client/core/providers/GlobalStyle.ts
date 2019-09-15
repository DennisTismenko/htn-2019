import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 400;
    padding: 0;
    margin: 0;
    background: #fefefe;
    --input-border-color: #461885;
    --input-background-color: #D2AAF7;
    --box-shadow-1: 0px 1px 3px 0px rgba(0,0,0,0.2),
                    0px 1px 1px 0px rgba(0,0,0,0.14),
                    0px 2px 1px -1px rgba(0,0,0,0.12);
    --box-shadow-2: 0px 5px 5px -3px rgba(0,0,0,0.2),
                    0px 8px 10px 1px rgba(0,0,0,0.14),
                    0px 3px 14px 2px rgba(0,0,0,0.12);;
  }
`;
