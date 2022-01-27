import {
  useQuery,
} from 'react-query'

import { Book } from '../../../interfaces'

function useBookCount() {
  // fixed it
  return useQuery<Book[], Error, number>('books', {
    select: (books) => books.length,
  })
}

export function BookCount() {
  const { isLoading, isError, data, error: any } = useBookCount()

  if (isLoading) return <div>Carregando Qtd Livros</div>

  if (isError) return <div>Falha ao carrega Qtd Livros</div>

  return <div>Quantidade de Livros Cadastrados: {data}</div>
}