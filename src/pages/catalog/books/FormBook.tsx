import {
  useMutation,
  useQueryClient,
} from 'react-query'

import { FormBookProps } from "./interfaces";

import { Author, Editora, Book } from '../../../interfaces'

const baseUrl = 'http://127.0.0.1:9090';

const requestUpdateBook = async (bookToUpdate: Book) => {
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
};

export function FormBook(bookProps: FormBookProps) {
  const book = bookProps.book;

  const queryClient = useQueryClient();

  const updateBook = useMutation(requestUpdateBook, {
    onSuccess: () => {
      // refetch book list for our Catalog
      queryClient.invalidateQueries(['books'])
    }
  });

  if (updateBook.isLoading) return <span>Atualizando livro...</span>

  if (updateBook.isError) return <span>Erro atualizando livro!</span>

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

  const handleSubmit = (event : any) => {
    event.preventDefault()

    console.log('logStateBook:', book)

    if (book) {
      updateBook.mutate(book)
    }
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
          onSubmit={handleSubmit}
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
            <button type="submit">Adicionar/Atualizar</button>
            <button type="button" onClick={handleTesteBookState}>Teste Book State</button>
            <button type="button" onClick={handleClearBookState}>Clear Book State</button>
          </div>
        </form>
      </div>
    </>
  )
}