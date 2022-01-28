export interface Author {
  id: number;
  name?: string;
}

export interface Editora {
  id: number;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  ddiTelefone?: string;
  dddTelefone?: string;
  celular?: string;
  responsavel?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  descricao?: string;
  logo?: string;
}

export interface Book {
  id?: number;
  title?: string;
  author?: Author[];
  editora?: Editora;
  lote?: string;
}

export interface FormBookProps {
  id?: number;
  title?: string;
  author?: number[];
  editora?: number;
  lote?: string;
}

export interface FormBookMessages {
  title?: string,
  author?: string,
  editora?: string
}