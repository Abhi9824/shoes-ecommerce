const mongoose = require("mongoose");
const express = require("express");

const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

const { initializeDatabase } = require("./db/db.connection");
const { ShoesProducts } = require("./models/products.model");

initializeDatabase();

//utils
const {
  createProduct,
  getProductById,
  updateProductDetails,
  getProductByCategoryGender,
  getProductByBrandName,
} = require("./utils/products.functions");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("./utils/wishlist.functions");

app.get("/", async (req, res) => {
  res.send(`HelLo Guys`);
});

//products Routes
app.get("/products", async (req, res) => {
  try {
    const allProducts = await ShoesProducts.find();
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/products", async (req, res) => {
  const productDetails = req.body;
  try {
    const newProduct = await createProduct(productDetails);
    if (newProduct) {
      res.status(201).json({ message: "Product created", data: newProduct });
    } else {
      res.status(401).json({ error: "Falied to add product" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to post the product", error });
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const products = await getProductById(productId);
    if (products) {
      res.status(201).json({ message: "Product Found", data: products });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Product Not Found", error });
  }
});

app.put("/products/:productId", async (req, res) => {
  const productDetails = req.body;
  const { productId } = req.params;
  try {
    const updateProduct = await updateProductDetails(productId, productDetails);
    if (updateProduct) {
      res
        .status(201)
        .json({ message: "Product updated successfully", data: updateProduct });
    } else {
      res.status(400).json({ message: "Failed to update products" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", error });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const productId = req.params.id;
  try {
    const deleteProduct = await deleteProduct(productId);
    if (deleteProduct) {
      res
        .status(201)
        .json({ message: "Product deleted successfully", data: deleteProduct });
    } else {
      res.status(404).json({ message: "Product Deletion Failed" });
    }
  } catch (error) {}
});

//get products by categoryGender

app.get("/products/category/:categoryGender", async (req, res) => {
  try {
    console.log("Received categoryGender:", req.params.categoryGender);

    const categoryProducts = await getProductByCategoryGender(
      req.params.categoryGender
    );
    res.status(200).json(categoryProducts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Service error", details: error.message });
  }
});

//get products by BrandName

app.get("/products/brand/:brandName", async (req, res) => {
  console.log("brand:", req.params.brandName);
  try {
    const allProducts = await getProductByBrandName(req.params.brandName);
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal Service error" });
  }
});

//wishlist api

app.get("/wishlist", async (req, res) => {
  try {
    const allWishlistProducts = await getWishlist();
    res.status(200).json(allWishlistProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

app.post("/wishlist", async (req, res) => {
  const { productId } = req.body;
  try {
    const addProducts = await addToWishlist(productId);
    res
      .status(200)
      .json({ message: "Product added successfully", addProducts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

app.delete("/wishlist/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const removedProducts = await removeFromWishlist(productId);

    if (!removedProducts) {
      res.status(400).json({
        message:
          "Failed to remove from the wishlist due to internal server error",
      });
    } else {
      res.status(200).json({
        message: "Successfully removed from the wishlist",
        data: removedProducts,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//cart management api's

const { Cart } = require("./models/cart.models");
const {
  updateCart,
  removeFromCart,
  addToCart,
  getAllCart,
} = require("./utils/cart.functions");

// Route to get all items in the cart
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await getAllCart();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add an item to the cart
app.post("/cart", async (req, res) => {
  const { productId, quantity, selectedSize } = req.body;
  console.log(req.body);
  try {
    const newCartItem = await addToCart({ productId, quantity, selectedSize });
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update the quantity of an item in the cart
app.put("/cart/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity, selectedSize } = req.body;

  console.log("Request params:", id);
  console.log("Request body:", quantity);
  console.log(selectedSize);

  try {
    const updatedCartItem = await updateCart(id, { quantity, selectedSize });
    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// Route to remove an item from the cart
app.delete("/cart/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const removedItem = await removeFromCart(id);
    res.status(200).json({ message: "Item removed from cart", removedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//routes for the address

const { AddressDetails } = require("./models/address.models");
const {
  deleteAddress,
  addAddress,
  updateAddress,
  getAllAddress,
} = require("./utils/address.functions");

//add Address
app.post("/addresses", async (req, res) => {
  console.log("Data received in backend:", req.body);

  try {
    const address = await addAddress(req.body);
    res.status(201).json({ message: "Addres added successfully", address });
  } catch (error) {
    console.error("Error adding address:", error); // Add this line to log the error
    res
      .status(400)
      .json({ message: "Error Adding address", error: error.message });
  }
});

app.put("/addresses/:addressId", async (req, res) => {
  const { addressId } = req.params;
  console.log(addressId);
  try {
    const address = await updateAddress(addressId, req.body);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address updated successfully", address });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error updating address", error: error.message });
  }
});

app.delete("/addresses/:addressId", async (req, res) => {
  const { addressId } = req.params;
  console.log(addressId);
  try {
    const deletedAddress = await deleteAddress(addressId);
    res
      .status(200)
      .json({ message: "Address deleted successfully", deletedAddress });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting address", error: error.message });
  }
});

app.get("/addresses", async (req, res) => {
  try {
    const addresses = await getAllAddress();
    res.json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving addresses", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PORT is listening at port ${PORT}`);
});
