import { Book } from "../../../interfaces";

export interface FormUpdateBookProps {
  book: Book,
  setBook: React.Dispatch<React.SetStateAction<Book>>
}