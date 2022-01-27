import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { Author, Editora, Book } from '../interfaces'
import { useEffect, useState } from 'react'

const baseUrl = 'http://127.0.0.1:9090';

function useBookCount() {
  // fixed it
  return useQuery<Book[], Error, number>('books', {
    select: (books) => books.length,
  })
}

function useBookData() {
  return useQuery<Book[], Error>('books', async () => {
    const response = await fetch(`${baseUrl}/api/book`);

    if (!response.ok) {
      throw new Error('Problem fetching books');
    }

    return await response.json();
  })
}

function BookCount() {
  const { isLoading, isError, data, error: any } = useBookCount()

  if (isLoading) return <div>Carregando Qtd Livros</div>

  if (isError) return <div>Falha ao carrega Qtd Livros</div>

  return <div>Quantidade de Livros Cadastrados: {data}</div>
}

interface BookProps {
  book: Book
}

interface FormBookProps {
  book: Book,
  setBook: React.Dispatch<React.SetStateAction<Book>>
}

function FormBook(bookProps: FormBookProps) {
  const book = bookProps.book;

  const queryClient = useQueryClient();

  const addBook = useMutation(async (newBook: Book) => {
    const response = await fetch(`${baseUrl}/api/book`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(newBook)
    });

    return await response.json();
  }, {
    onSuccess: () => {
      // refetch book list for our Catalog
      queryClient.invalidateQueries(['books'])
    }
  });

  const updateBook = useMutation(async (bookToUpdate: Book) => {
    const response = await fetch(`${baseUrl}/api/book`, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(bookToUpdate)
    });

    return await response.json();
  }, {
    onSuccess: () => {
      // refetch book list for our Catalog
      queryClient.invalidateQueries(['books'])
    }
  });

  if (updateBook.isLoading) return <span>Atualizando livro...</span>

  if (updateBook.isError) return <span>Erro atualizando livro!</span>

  //if (updateBook.isSuccess) return <span>Livro Atualizado!</span>

  const handleUpdateBook = () => {
    console.log('atualizando Livro', book)

    if (book) {
      updateBook.mutate(book)
    }
  }

  const handleClearBookState = () => {
    const aBook: Book = {
      title: ''
    };
    bookProps.setBook(aBook);
  }

  const handleTesteBookState = () => {
    const aAuthor: Author = {
      id: 7
    }

    const aBook: Book = {
      id: 18,
      title: 'Um testasso',
      editora: {
        id: 7
      },
      author: [aAuthor]
    };

    bookProps.setBook(aBook);
  }

  return (
    <>
      <div style={{
        border: '1px solid gray',
        padding: '1em'
      }}>
        <div>Adicionar Livro:</div>
        <form
          style={{
            display: "flex",
            flexDirection: 'column'
          }}
          onSubmit={(event) => {
            event.preventDefault()

            console.log('logStateBook:', book)

            const newBook: Book = {
              id: book?.id,
              title: book?.title,
              author: book?.author,
              editora: book?.editora,
              lote: book?.lote
            }

            addBook.mutate(newBook)
          }}
        >
          {book ?
            <>
              <label htmlFor="title" style={{
                margin: '5px'
              }}>
                Id
                <span> {book.id}</span>
              </label>
            </>
            : ''}

          <>
            <label htmlFor="title" style={{
              margin: '5px'
            }}>
              Título
              <input
                name="title"
                type="text"
                maxLength={40}
                style={{
                  padding: '5px 0px'
                }}
                value={book ? book.title : ''}
                onChange={(event) => {
                  const newBook: Book = {
                    id: book?.id,
                    title: event.currentTarget.value,
                    author: book?.author,
                    editora: book?.editora,
                    lote: book?.lote
                  }
                  bookProps.setBook(newBook)
                }}
                required
              />
            </label>
          </>

          <>
            <label htmlFor="author" style={{
              margin: '5px'
            }}>
              Author
              <select
                name="author"
                id="author"
                onChange={(event) => {
                  const newAuthor: Author = {
                    id: parseInt(event.currentTarget.value)
                  }
                  const newBook: Book = {
                    id: book?.id,
                    title: book?.title,
                    author: [newAuthor],
                    editora: book?.editora,
                    lote: book?.lote
                  }
                  bookProps.setBook(newBook)
                }}
                value={book ? book.author ? book.author[0] ? book.author[0].id : '' : '' : ''}
                style={{
                  padding: '5px 0px'
                }}
              >
                <option value="0"></option>
                <option value="3">Paulão</option>
                <option value="5">O Amado</option>
                <option value="6">Carlão</option>
                <option value="7">Asimov</option>
                <option value="8">seiláoqueéisso</option>
                <option value="9">Andrew</option>
              </select>
            </label>
          </>

          <>
            <label htmlFor="editora">
              Editora
              <select
                name="editora"
                id="editora"
                onChange={(event) => {
                  const newEditora: Editora = {
                    id: parseInt(event.currentTarget.value)
                  }
                  const newBook: Book = {
                    id: book?.id,
                    title: book?.title,
                    author: book?.author,
                    editora: newEditora,
                    lote: book?.lote
                  }
                  bookProps.setBook(newBook)
                }}
                value={book ? book.editora ? book.editora.id : '' : ''}
                style={{
                  padding: '5px 0px'
                }}
              >
                <option value="4">Saraiva</option>
                <option value="5">Livraria Cultura</option>
                <option value="6">Objetiva</option>
                <option value="7">Ediouro</option>
              </select>
            </label>
          </>

          <div style={{
            display: "flex"
          }}>
            <button type="submit">Adicionar</button>
            <button type="button" onClick={handleUpdateBook}>Atualizar</button>
            <button type="button" onClick={handleTesteBookState}>Teste Book State</button>
            <button type="button" onClick={handleClearBookState}>Clear Book State</button>
          </div>
        </form>
      </div>
    </>
  )
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

function BookTable(bookProps : FormBookProps) {
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
                  <td>{book.author ? book.author[0] ? book.author[0].name : '' : '' }</td>
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

export function Books() {
  const [book, setBook] = useState<Book>({});

  return (
    <>
      <BookTable book={book} setBook={(_book) => {
        console.log('oxi', _book)
        setBook(_book)
      }} />

      <BookCount />

      <FormBook book={book} setBook={setBook} />
    </>
  )
}