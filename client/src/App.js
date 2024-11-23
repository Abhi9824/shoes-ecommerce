import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle";
import ProductsView from "./pages/products/ProductsView";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProductList from "./pages/products/ProductList";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import AddressForm from "./pages/AddressForm/AddressForm";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<ProductsView/>}/>
        <Route path="/productList" element={<ProductList/>}/>
        <Route path="/productList/category/:categoryGender" element={<ProductList />}/>
        <Route path="/productDetails/:productId" element={<ProductDetails />}/>
        <Route path="/productList/brand/:searchBrand" element={<ProductList />}/>

        <Route path="/wishlist" element={<Wishlist />}/>
        <Route path="/cart" element={<Cart />}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/profile" element={<Profile/>}>
        <Route path="address" element={<AddressForm/>}/>

        </Route>
    





      </Routes>
    </Router>
     
    </div>
  );
}

export default App;
