import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./utils/ScrollToTop";
import { ProductProvider } from "./context/ProductContext";


function App() {
  return (
    <BrowserRouter>
      
      <ScrollToTop />
      
        <ProductProvider>
         <AppRoutes />
         </ProductProvider>
      
      
    </BrowserRouter>
  );
}

export default App;
