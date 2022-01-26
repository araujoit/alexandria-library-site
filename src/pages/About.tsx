import { Menu } from "../Menu";
import styled from 'styled-components';

const Paragraph = styled.p`
  text-align: center
`;

export function About() {
  return (
    <>
      <Menu />
      <Paragraph>Tudo sobre a Alexandria</Paragraph>
    </>
  )
}