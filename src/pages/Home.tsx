import { Menu } from "../Menu";
import styled from 'styled-components';

const Welcome = styled.section`
  /*border: 1px dashed green;*/
  padding: 2em;
  font-size: 1.5em;
  text-align: center;
  color: blue;
`;

export function Home() {
  return (
    <>
      <Menu />
      <Welcome>Bem Vindo a Alexandria Library</Welcome>
    </>
  )
}