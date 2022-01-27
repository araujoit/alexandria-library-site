import { Book } from "../../../interfaces";

export interface FormBookProps {
  book: Book,
  setBook: React.Dispatch<React.SetStateAction<Book>>
}