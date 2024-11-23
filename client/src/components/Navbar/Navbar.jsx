import React from 'react';
import "./navbar.css";
import { Link } from 'react-router-dom';
import { MdAllInclusive } from "react-icons/md";
import { AiOutlineShoppingCart, AiOutlineHeart } from 'react-icons/ai';
import { IoPersonCircleSharp } from "react-icons/io5";
// import { brandProduct } from '../../features/productSlice';
import { fetchProducts, filterByBrand } from '../../features/productSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.length>0) {
      dispatch(filterByBrand(searchTerm));
      navigate(`/productList/brand/${searchTerm}`);
    }else{
      
      dispatch(fetchProducts())
      navigate(`/productList`);
    }
  };
  return (
    <header>
      <nav className='navbar navbar-expand-lg navigation'>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Brand Section */}
          <div className="brand-icon">
            <Link to="/" className='nav-brand fs-4'>Alcroz</Link>
            <MdAllInclusive style={{ width: "25px", height: "30px", padding:"0px"}} />
          </div>

          {/* Toggle Button */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{ borderColor: 'white' }}>
            <span className="navbar-toggler-icon"></span>
          </button>
   


        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="d-flex justify-content-between w-100"> {/* Added w-100 to stretch it */}
            
            {/* Navigation Links */}
            <ul className='nav-pills mb-0 mx-4'>
            <li className="nav-item">
                <Link to="/productList" className='link'>All Products</Link>
              </li>
              <li className="nav-item">
                <Link to="/productList/category/Mens" className='link'>Mens</Link>
              </li>
              <li className="nav-item">
                <Link to="/productList/category/Womens" className='link'>Womens</Link>
              </li>
              <li className="nav-item">
                <Link to="/productList/category/Unisex" className='link'>Unisex</Link>
              </li>
            </ul>
            </div>

            {/* Search Bar */}
            <div className="search-bar d-flex align-items-center">
            <form onSubmit={handleSearch} className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control search-input me-2"
                    placeholder="Search by Brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn searchBtn">Search</button>
                </form>
              <Link to={`/wishlist`} className="btn icon-button" aria-label="Wishlist">
                <AiOutlineHeart />
              </Link>
            <Link to={`/cart`}>  <button className="btn icon-button" aria-label="Cart">
                <AiOutlineShoppingCart />
              </button>
              </Link>

              <Link to={`/profile`}>
              <button className='btn icon-button' aria-label="profile">
              <IoPersonCircleSharp /></button>
              </Link>
            </div>
          
        </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
