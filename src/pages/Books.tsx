import {
  useQuery,
  useQueryClient,
} from 'react-query'

import { Author, Editora, Book } from '../interfaces'
import { useEffect } from 'react'

function useBookCount() {
  // fixed it
  return useQuery<Book[], Error, number>('books', {
    select: (books) => books.length,
  })
}

function useBookData() {
  return useQuery<Book[], Error>('books', async() => {
    const response = await fetch('http://127.0.0.1:9090/api/book');

    if (!response.ok) {
      throw new Error('Problem fetching books');
    }

    return await response.json();
  })
}

function BookCount() {
  const { isLoading, isError, data, error: any } = useBookCount()

  if(isLoading) return <div>Carregando Qtd Livros</div>

  if (isError) return <div>Falha ao carrega Qtd Livros</div>

  return <div>Quantidade de Livros Cadastrados: {data}</div>
}

export function Books() {
  // Queries - accessing the client
  const { isLoading, isError, data, error: any } = useBookData()

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error...</span>
  }

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#dddeee',
      }}>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Editora</th>
            </tr>
          </thead>
          <tbody>
            {data ? data.map(book => {
              return (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.editora.razaoSocial}</td>
                </tr>
              )
            }) : ''}
          </tbody>
        </table>
      </div>
      
      <BookCount />
    </>
  )
}