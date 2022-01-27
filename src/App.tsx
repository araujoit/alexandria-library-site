import './App.css';
import { AppRoutes } from "./AppRoutes";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styled from 'styled-components';

const Wrapper = styled.div`
  /*border: 1px dashed darkblue;*/
  height: 100vh;
`;


function App() {

  return (
    <Wrapper>
      <AppRoutes />
      <ToastContainer />
    </Wrapper>
  )
}

export default App
