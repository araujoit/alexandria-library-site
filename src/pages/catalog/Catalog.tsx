import { Menu } from "../../Menu";
import styled from 'styled-components';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { Books } from "./books/Books";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // specify a staleTime to only fetch when the data is older than a certain amount of time
      //staleTime: 10000
      staleTime: Infinity
    },
  },
})

const Title = styled.h2`
  text-align: center
`;

export function Catalog() {
  return (
    <>
      <Menu />
      <Title>Catálogo</Title>

      <QueryClientProvider client={queryClient}>
        <Books />
      </QueryClientProvider>
    </>
  )
}