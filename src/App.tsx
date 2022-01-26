import './App.css';
import { AppRoutes } from "./AppRoutes";

import styled from 'styled-components';

const Wrapper = styled.div`
  /*border: 1px dashed darkblue;*/
  height: 100vh;
`;


function App() {

  return (
    <Wrapper>
      <AppRoutes />
    </Wrapper>
  )
}

export default App
