export interface AuthorPageable {
  content: Author[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  last: boolean,
  size: number,
  number: number,
  sort: Sort,
  numberOfElements: number,
  first: boolean,
  empty: boolean
}

export interface BookPageable {
  content: Book[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  last: boolean,
  size: number,
  number: number,
  sort: Sort,
  numberOfElements: number,
  first: boolean,
  empty: boolean
}

export interface Sort {
  empty: boolean,
  unsorted: boolean,
  sorted: boolean
}

export interface Pageable {
  sort: Sort,
  offset: number,
  pageNumber: number,
  pageSize: number,
  paged: boolean,
  unpaged: boolean
}

export interface Author {
  id: number;
  name?: string;
}

export interface Editora {
  id: number;
  corporateName?: string;
}

export interface Book {
  id?: number;
  title?: string;
  authors?: Author[];
}

export interface FormBookProps {
  id?: number;
  title?: string;
  authors?: Author[];
  editora?: number;
  lote?: string;
}

export interface FormBookMessages {
  title?: string,
  authors?: string,
  editora?: string
}