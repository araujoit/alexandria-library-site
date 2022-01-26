import { Link } from "react-router-dom";

interface ItemProps {
  path: string,
  label: string
}

function Item(props: ItemProps) {
  return (
    <Link
      to={props.path}
      style={{
        padding: '3px 3px',
        margin: "auto",
      }}
    >
      {props.label}
    </Link>
  )
}

export function Menu() {
  return (
    <ul style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      listStyleType: "none",
    }}>
      <li><Item path="/" label="Home" /></li>
      <li><Item path="/cart" label="Cart" /></li>
      <li><Item path="/catalog" label="Catalog" /></li>
      <li><Item path="/about" label="About" /></li>
    </ul>
  )
}