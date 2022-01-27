import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { About } from "./pages/About";

import { Cart } from "./pages/Cart";
import { Catalog } from "./pages/catalog/Catalog";
import { Home } from "./pages/Home";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/cart" element={ <Cart /> } />
        <Route path="/catalog" element={ <Catalog /> } />
        <Route path="/" element={ <Home /> } />
        <Route path="/about" element={ <About /> } />
      </Routes>
    </Router>
  )
}