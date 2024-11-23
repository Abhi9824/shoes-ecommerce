import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterByBrand, toggleWishlist } from "../../features/productSlice";
import { addToCart } from "../../features/cartSlice";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./Wishlist.css";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { brand } = useParams();
  const { products, status, error, wishlistProducts } = useSelector(
    (state) => state.products
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (brand) {
      dispatch(filterByBrand(brand));
    }
  }, [brand]);

  console.log(wishlistProducts);
  const removeFromWishlistHandler = (productId) => {
    dispatch(toggleWishlist(productId));
    toast.success("Removed from Wishlist", {
      autoClose: 1000,
    });
  };

  // Function to handle Add to Cart click and open modal
  const addToCartHandler = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Function to handle size selection and dispatch addToCart
  const handleSizeSubmit = () => {
    if (selectedProduct) {
      dispatch(
        addToCart({ productId: selectedProduct._id, quantity: 1, selectedSize })
      );
      dispatch(toggleWishlist(selectedProduct._id));
      setShowModal(false); // Close modal after adding to cart
      toast.success("Moved to Cart", {
        theme: "dark",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-body mb-4 py-2">
        <p className="fs-4 fw-bold">MY WISHLIST ({wishlistProducts.length})</p>
        {status === "loading" && <p>Loading....</p>}
        {status === "success" && wishlistProducts.length > 0 && (
          <div className="wishlist-products">
            <div className="row py-4">
              {wishlistProducts.map((product) => (
                <div key={product._id} className="col-md-3 mb-4">
                  <div className="wishlist-item card">
                    <Link to={`/productDetails/${product._id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-image card-img-top"
                        onMouseOver={(e) =>
                          (e.currentTarget.src = product.images[1])
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.src = product.images[0])
                        }
                      />
                    </Link>
                    <div className="card-body">
                      <p className="card-text">{product.brand}</p>
                      <h5 className="card-title fw-bold">{product.title}</h5>
                      <p className="card-text">${product.price.toFixed(2)}</p>
                      <button
                        className={`btn ${
                          product.isWishlist ? "btn-danger" : "btn-secondary"
                        }`}
                        // onClick={() => dispatch(toggleWishlist(product._id))}
                        onClick={() => removeFromWishlistHandler(product._id)}
                      >
                        {product.isWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"}
                      </button>
                      <button
                        className="btn btn-dark px-5 py-2 mt-2"
                        onClick={() => addToCartHandler(product)}
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Modal for size selection */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="sizeSelect">
              <Form.Label>Choose a Size</Form.Label>
              <Form.Control
                className="form-select"
                as="select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
              >
                {[7, 8, 9, 10, 11].map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSizeSubmit}>
            Add to Bag
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Wishlist;
