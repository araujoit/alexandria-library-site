import { Book } from '../../../interfaces'
import { useState } from 'react'
import { BookCount } from './BookCount';
import { BookTable } from './BookTable';
import { FormBook } from './FormBook';

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