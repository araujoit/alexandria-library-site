import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { Book } from '../../../interfaces'
import { FormBookProps } from './interfaces';

const baseUrl = 'http://127.0.0.1:9090';

function useBookData() {
  return useQuery<Book[], Error>('books', async () => {
    const response = await fetch(`${baseUrl}/api/book`);

    if (!response.ok) {
      throw new Error('Problem fetching books');
    }

    return await response.json();
  })
}

interface BookProps {
  book: Book
}

function DeleteBook(bookProps: BookProps) {
  const queryClient = useQueryClient();

  const deleteBook = useMutation(async (toDelete: Book) => {
    const response = await fetch(`${baseUrl}/api/book/${toDelete.id}`,
      {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      }
    )

    return await response.status === 200
  }, {
    onSuccess: () => {
      // refetch book list for our Catalog
      queryClient.invalidateQueries(['books'])
    }
  })

  if (deleteBook.isLoading) return <span>Deletando livro...</span>

  if (deleteBook.isError) return <span>Erro deletando livro!</span>

  if (deleteBook.isSuccess) return <span>Livro Deletado!</span>

  const handleDeleteBook = () => {
    deleteBook.mutate(bookProps.book)
  }

  return <span onClick={handleDeleteBook} style={{
    cursor: 'pointer'
  }}>x</span>
}

export function BookTable(bookProps: FormBookProps) {
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
              <th>Author</th>
              <th>Editora</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {data ? data.map(book => {
              return (
                <tr key={book.id}>
                  <td>
                    <a href="#"
                      onClick={() => {
                        console.log('setting book to update', book)
                        //console.log('bookProps:', bookProps)
                        bookProps.setBook(book)
                      }}
                    >
                      {book.id}
                    </a>
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author ? book.author[0] ? book.author[0].name : '' : ''}</td>
                  <td>{book.editora ? book.editora.razaoSocial : ''}</td>
                  <td><DeleteBook book={book} /></td>
                </tr>
              )
            }) : ''}
          </tbody>
        </table>
      </div>
    </>
  )
}