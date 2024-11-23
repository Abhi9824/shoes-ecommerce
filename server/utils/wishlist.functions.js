const { ShoesProducts } = require('../models/products.model');

// Get all products in the wishlist
const getWishlist = async () => {
  try {
    const wishlistProducts = await ShoesProducts.find({ isWishlist: true });
    return wishlistProducts;
  } catch (error) {
    throw new Error("Error fetching wishlist products: " + error.message);
  }
};

// Add a product to the wishlist
const addToWishlist = async (productId) => {
  try {
    const product = await ShoesProducts.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    product.isWishlist = true;
    await product.save();
    return product;
  } catch (error) {
    throw new Error("Error adding product to wishlist: " + error.message);
  }
};

// Remove a product from the wishlist
const removeFromWishlist = async (productId) => {
  try {
    const product = await ShoesProducts.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    product.isWishlist = false;
    await product.save();
    return product;
  } catch (error) {
    throw new Error("Error removing product from wishlist: " + error.message);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
