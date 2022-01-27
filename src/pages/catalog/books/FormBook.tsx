import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { Author, Editora } from '../../../interfaces'

import { toast } from 'react-toastify';
import {
  Formik,
  Form,
  Field,
} from 'formik';

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

const requestUpdateBook = async (bookToUpdate: FormBookProps) => {
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

interface FormBookProps {
  id?: number;
  title?: string;
  author?: number[];
  editora?: number;
  lote?: string;
}

interface FormBookMessages {
  title?: string,
  author?: string,
  editora?: string
}

export function FormBook() {
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

  return (
    <>
      <Formik
        initialValues={{
          title: '',
          author: [],
          editora: 0
        }}
        validate={values => {
          const errors: FormBookMessages = {};

          if (!values.title) {
            errors.title = 'Título é obrigatório';
          }

          if (values.author.length <= 0) {
            errors.author = 'Selecione ao menos um author';
          }

          if (values.editora <= 0) {
            errors.editora = 'Escolha uma editora';
          }

          return errors;
        }}
        onSubmit={(values: FormBookProps, { setSubmitting }) => {
          updateBook.mutate(values)
          setSubmitting(false);
        }}
      >
        {({
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form>
            <div>
              <label htmlFor='title'>Título</label>
              <Field type="text" name="title" placeholder="Título do Livro" disabled={isSubmitting} />
            </div>
            {errors.title && touched.title && <span>{errors.title}</span>}

            <div>
              <label htmlFor='author'>Autores</label>
              <Field as="select" name="author" placeholder="Autores do Livro" multiple={true} disabled={isSubmitting}>
                <option key={0} value={0} disabled>-- Selecione um Autor --</option>
                {autores.data && autores.data.map(author => {
                  return <option key={author.id} value={author.id}>{author.name}</option>
                })}
              </Field>
            </div>
            {errors.author && touched.author && <span>{errors.author}</span>}

            <div>
              <label htmlFor='editora'>Editora</label>
              <Field as="select" name="editora" placeholder="Editora" disabled={isSubmitting}>
                <option key={0} value={0} disabled>-- Selecione uma Editora --</option>
                {editoras.data && editoras.data.map(editora => {
                  return <option key={editora.id} value={editora.id}>{editora.razaoSocial}</option>
                })}
              </Field>
            </div>
            {errors.editora && touched.editora && <span>{errors.editora}</span>}

            <button type="submit" disabled={isSubmitting}>Atualizar</button>
          </Form>
        )}

      </Formik>
    </>
  )
}