import React from 'react';
import styled from 'styled-components';
import FileUpload from './components/FileUpload/FileUpload';

const AppContainer = styled.div`
  background-color: #ffffff;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 50px;
`;

const App = () => {
  return (
    <AppContainer>
      <FileUpload />
    </AppContainer>
  );
};

export default App;
