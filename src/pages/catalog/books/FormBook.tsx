import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { FormBookProps } from "./interfaces";

import { Author, Editora, Book } from '../../../interfaces'

import { toast } from 'react-toastify';

const baseUrl = 'http://127.0.0.1:9090';

function useAuthors() {
  return useQuery<Author[], Error>('authors', async () => {
    const response = await fetch(`${baseUrl}/api/author`);

    if (!response.ok) {
      throw new Error('Problema obtendo autores')
    }

    return await response.json();
  }, {
    //onSuccess: () => toast('Autores carregadas com sucesso'),
    onError: () => toast('Falha ao carregar autores')
  })
}

function useEditoras() {
  return useQuery<Editora[], Error>('editoras', async () => {
    const response = await fetch(`${baseUrl}/api/editora`)

    if (!response.ok) {
      throw new Error('Problema obtendo editoras')
    }

    return await response.json()
  }, {
    //onSuccess: () => toast('Editoras carregadas com sucesso'),
    onError: () => toast('Falha ao carregar editoras')
  })
}

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
  const queryClient = useQueryClient()

  const updateBook = useMutation(requestUpdateBook, {
    // refetch book list for our Catalog
    onSuccess: () => queryClient.invalidateQueries(['books'])
  })

  const autores = useAuthors()
  const editoras = useEditoras()

  if (updateBook.isSuccess) {
    toast("Livro atualizado!")
  }

  if (updateBook.isError) {
    toast("Erro atualizando livro!")
  }

  const handleClearBookState = () => {
    const aBook: Book = {
      title: ''
    };
    bookProps.setBook(aBook);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    if (bookProps.book) {
      updateBook.mutate(bookProps.book)
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
          {bookProps.book ?
            <>
              <label htmlFor="title" style={{
                margin: '5px'
              }}>
                Id
                <span> {bookProps.book.id}</span>
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
                value={bookProps.book ? bookProps.book.title : ''}
                onChange={(event) => {
                  const newBook: Book = {
                    id: bookProps.book?.id,
                    title: event.currentTarget.value,
                    author: bookProps.book?.author,
                    editora: bookProps.book?.editora,
                    lote: bookProps.book?.lote
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
                    id: bookProps.book?.id,
                    title: bookProps.book?.title,
                    author: [newAuthor],
                    editora: bookProps.book?.editora,
                    lote: bookProps.book?.lote
                  }
                  bookProps.setBook(newBook)
                }}
                value={bookProps.book ? bookProps.book.author ? bookProps.book.author[0] ? bookProps.book.author[0].id : '' : '' : ''}
                style={{
                  padding: '5px 0px'
                }}
              >
                <option value="0"></option>
                {autores.data ? autores.data.map(author => {
                  return <option value={author.id}>{author.name}</option>
                }) : ''}
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
                    id: bookProps.book?.id,
                    title: bookProps.book?.title,
                    author: bookProps.book?.author,
                    editora: newEditora,
                    lote: bookProps.book?.lote
                  }
                  bookProps.setBook(newBook)
                }}
                value={
                  bookProps.book
                    ? bookProps.book.editora
                      ? bookProps.book.editora.id
                      : ''
                    : ''
                }
                style={{
                  padding: '5px 0px'
                }}
              >
                <option value="0"></option>
                {editoras.data ? editoras.data.map(editora => {
                  return <option value={editora.id}>{editora.razaoSocial}</option>
                }) : ''}
              </select>
            </label>
          </>

          <div style={{
            display: "flex"
          }}>
            <button type="submit">Adicionar/Atualizar</button>
            <button type="button" onClick={handleClearBookState}>Limpar</button>
          </div>
        </form>
      </div>
    </>
  )
}