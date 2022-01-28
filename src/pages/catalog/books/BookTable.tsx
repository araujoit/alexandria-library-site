import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { Book } from '../../../interfaces'
import { FormUpdateBookProps } from './interfaces';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { toast } from 'react-toastify';

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

  const [disabled, setDisabled] = useState(false)

  const deleteBook = useMutation(async (toDelete: Book) => {
    setDisabled(true);
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
      toast.success('Livro deletado!');
    },
    onMutate: () => {
      // reenable buttons
      setDisabled(false)
    }
  })

  if (deleteBook.isError)  {
    toast.warn('Erro deletando livro...');
  }

  const handleDeleteBook = () => {
    deleteBook.mutate(bookProps.book)
  }

  // return <span onClick={handleDeleteBook} style={{ cursor: 'pointer' }}>x</span>
  return (
    <Button
      variant='outlined'
      size="small"
      onClick={handleDeleteBook}
      style={{ cursor: 'pointer' }}
      disabled={disabled}
    >
      x
    </Button>
  )
}

export function BookTable(bookProps: FormUpdateBookProps) {
  // Queries - accessing the client
  const { isLoading, isError, data, error: any } = useBookData()

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error...</span>
  }

  return (
    <Grid item p={2}>
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
                  <td>{book.author && book.author.map(author => author.name).join(',')}</td>
                  <td>{book.editora ? book.editora.razaoSocial : ''}</td>
                  <td style={{ textAlign: 'center' }}><DeleteBook book={book} /></td>
                </tr>
              )
            }) : ''}
          </tbody>
        </table>
      </div>
    </Grid>
  )
}