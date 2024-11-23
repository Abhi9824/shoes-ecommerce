// const {ShoesProducts}=require('../models/products.model')
const { Cart } = require("../models/cart.models");
const { ShoesProducts } = require("../models/products.model");

const getAllCart = async () => {
  try {
    const products = await Cart.find().populate("productId");
    // console.log(products)
    return products;
  } catch (error) {
    throw error;
  }
};

const addToCart = async ({ productId, quantity = 1, selectedSize }) => {
  try {
    const product = await ShoesProducts.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.isInCart = true;
    product.isWishlist = false;
    await product.save();

    // Check if product already exists in the cart
    const existingCartItem = await Cart.findOne({ productId: product._id });
    if (existingCartItem) {
      // If product already exists in cart, update the quantity and selected size
      existingCartItem.quantity += quantity; // Increment quantity
      existingCartItem.selectedSize = selectedSize; // Update selected size
      await existingCartItem.save(); // Save changes
      return await existingCartItem.populate("productId"); // Return updated cart item
    }

    // Create new cart item if it doesn't exist
    const newCartItem = new Cart({
      productId: product._id,
      quantity,
      selectedSize,
      priceDetails: {
        price: product.price,
        discountedPrice: product.discountedPrice || 0,
      },
    });

    await newCartItem.save();
    return await newCartItem.populate("productId");
  } catch (error) {
    throw error;
  }
};

const removeFromCart = async (productId) => {
  try {
    // Find the cart item using productId
    const cartItem = await Cart.findOne({ productId: productId });
    // console.log(cartItem)

    if (!cartItem) {
      throw new Error("Product is not in the Cart");
    }

    // Remove the cart item if it exists
    await Cart.findByIdAndDelete(cartItem._id);
    return cartItem;
  } catch (error) {
    throw error;
  }
};

const updateCart = async (cartItemId, { quantity, selectedSize }) => {
  try {
    console.log(`Updating cart item ${cartItemId} with quantity ${quantity}`);
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    const updatedCartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity, selectedSize },
      { new: true }
    ).populate("productId");

    if (!updatedCartItem) {
      throw new Error("Item not found in cart");
    }

    return updatedCartItem;
  } catch (error) {
    console.error("Error in updateCart: ", error.message);
    throw error;
  }
};

module.exports = { updateCart, removeFromCart, addToCart, getAllCart };
