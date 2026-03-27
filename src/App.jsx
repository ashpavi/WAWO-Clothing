import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./utils/ScrollToTop";
import { ProductProvider } from "./context/ProductContext";


function App() {
  return (
    <BrowserRouter>
      
      <ScrollToTop />
      <CartProvider>
        <ProductProvider>
         <AppRoutes />
         </ProductProvider>
      </CartProvider>
      
    </BrowserRouter>
  );
}

export default App;
