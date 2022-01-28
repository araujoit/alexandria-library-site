import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import { Author, Editora, FormBookMessages, FormBookProps } from '../../../interfaces'

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

export function FormBook() {
  const queryClient = useQueryClient()

  const updateBook = useMutation(requestUpdateBook, {
    // refetch book list for our Catalog
    onSuccess: ({ status }: any) => {
      if (status === 200) {
        queryClient.invalidateQueries(['books'])
        toast.success("Livro atualizado!")
      } else {
        toast.error("Ocorreu alguma falha ao tentar atualizar Livro!")
      }
    }
  })

  const autores = useAuthors()
  const editoras = useEditoras()

  if (updateBook.isError) {
    toast.warn("Erro atualizando livro!")
  }

  return (
    <Formik
      initialValues={{
        title: '',
        author: [],
        editora: undefined
      }}
      validate={(values: FormBookProps) => {
        const errors: FormBookMessages = {};

        if (!values.title) {
          errors.title = 'Título é obrigatório';
        }

        if (values.author!.length <= 0) {
          errors.author = 'Selecione ao menos um author';
        }

        if (!values.editora) {
          errors.editora = 'Escolha uma editora';
        }

        return errors;
      }}
      onSubmit={(values: FormBookProps, { setSubmitting }: FormikHelpers<FormBookProps>) => {
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
                  name="author"
                  placeholder="Autores"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.author}
                  disabled={isSubmitting}
                  multiple={true}
                >
                  {autores.data && autores.data.map(author => {
                    return <MenuItem key={author.id} value={author.id}>{author.name}</MenuItem>
                  })}
                </Select>

                <FormLabel error={true}>
                  {errors.author && touched.author && errors.author}
                </FormLabel>
              </FormControl>
            </Box>
          </Grid>

          <Grid item p={2}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="editora-label">Editora</InputLabel>

                <Select
                  labelId="editora-label"
                  id="editora-select"
                  label="Editora"
                  name="editora"
                  placeholder="Editora"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.editora}
                  disabled={isSubmitting}
                >
                  {editoras.data && editoras.data.map(editora => {
                    //return <option key={editora.id} value={editora.id}>{editora.razaoSocial}</option>
                    return <MenuItem key={editora.id} value={editora.id}>{editora.razaoSocial}</MenuItem>
                  })}
                </Select>

                <FormLabel error={true}>
                  {errors.editora && touched.editora && errors.editora}
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