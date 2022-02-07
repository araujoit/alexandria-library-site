import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { AuthorPageable, Book, Editora, FormBookMessages, FormBookProps } from '../../../interfaces'

import { toast } from 'react-toastify';
import {
  Formik,
  Form,
  FormikHelpers,
} from 'formik';

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { FormLabel } from '@mui/material';

const baseUrl = 'http://127.0.0.1:8080';

function useAuthors() {
  return useQuery<AuthorPageable, Error>('authors', async () => {
    const response = await fetch(`${baseUrl}/authors`);

    if (!response.ok) {
      throw new Error('Problema obtendo autores')
    }

    return response.json();
  }, {
    //onSuccess: () => toast('Autores carregadas com sucesso'),
    onError: () => toast('Falha ao carregar autores')
  })
}

const requestUpdateBook = async (bookToUpdate: Book) => {
  const response = await fetch(`${baseUrl}/books`, {
    method: 'POST',
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

  return response.json();
};

export function FormBook() {
  const queryClient = useQueryClient()

  const updateBook = useMutation(requestUpdateBook, {
    // refetch book list for our Catalog
    onSuccess: ({ id }: any) => {
      if (id > 0) {
        queryClient.invalidateQueries(['books'])
        toast.success(`Livro com id ${id} atualizado!`)
      } else {
        toast.error("Ocorreu alguma falha ao tentar atualizar Livro!")
      }
    }
  })

  const autores = useAuthors()

  if (updateBook.isError) {
    toast.warn("Erro atualizando livro!")
  }

  return (
    <Formik
      initialValues={{
        title: '',
        authors: []
      }}
      validate={(values: Book) => {
        const errors: FormBookMessages = {};

        if (!values.title) {
          errors.title = 'Título é obrigatório';
        }

        if (values.authors!.length <= 0) {
          errors.authors = 'Selecione ao menos um author';
        }

        return errors;
      }}
      onSubmit={(values: Book, { setSubmitting }: FormikHelpers<Book>) => {
        console.log('values:', values)
        updateBook.mutate(values)
        setSubmitting(false);
      }}
    >
      {({
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        values,
        handleReset,
      }) => (
        <Form>
          <Grid item p={2}>
            <FormControl fullWidth>
              <TextField
                label="Título"
                name="title"
                id="title"
                placeholder="Título do Livro"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                disabled={isSubmitting}
              />
              <FormLabel error={true}>
                {errors.title && touched.title && errors.title}
              </FormLabel>
            </FormControl>
          </Grid>

          <Grid item p={2}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="author-label">Autores do Livro</InputLabel>

                <Select
                  labelId="author-label"
                  id="author-select"
                  label="Editora"
                  name="authors"
                  placeholder="Autores"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.authors}
                  disabled={isSubmitting}
                  multiple={true}
                >
                  {autores.data && autores.data.content.map(author => {
                    // @ts-ignore author versão atual com bug no objeto, fica acusando falha ao tentar passsar objeto como valor
                    return <MenuItem key={author.id} value={author}>{author.name}</MenuItem>
                  })}
                </Select>

                <FormLabel error={true}>
                  {errors.authors && touched.authors && errors.authors}
                </FormLabel>
              </FormControl>
            </Box>
          </Grid>

          <Grid item p={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              size="small"
              style={{
                margin: '2px'
              }}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              size="small"
              style={{
                margin: '2px'
              }}
            >
              Resetar
            </Button>
          </Grid>
        </Form>
      )}

    </Formik>
  )
}