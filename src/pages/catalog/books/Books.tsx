import { Book } from '../../../interfaces'
import { useState } from 'react'
import { BookCount } from './BookCount';
import { BookTable } from './BookTable';
import { FormBook } from './FormBook';

import Grid from '@mui/material/Grid';

export function Books() {
  const [book, setBook] = useState<Book>({});

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <FormBook book={book} setBook={setBook} />
      </Grid>

      <Grid item xs={12} md={6}>
        <BookTable book={book} setBook={(_book) => {
          console.log('oxi', _book)
          setBook(_book)
        }} />
      </Grid>

      <Grid item xs={12} textAlign={'center'}>
        <BookCount />
      </Grid>
    </Grid>
  )
}