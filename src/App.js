import React from "react";
import styled from "styled-components";
import FileUpload from "./components/FileUpload/FileUpload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
const AppContainer = styled.div`
  background-color: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 50px;
`;
 
const Title = styled.h1`
  color: #495865;
`;
 
const App = () => {
  return (
    <AppContainer>
      <Title>RFP Responder</Title>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <FileUpload />
    </AppContainer>
  );
};
 
export default App;