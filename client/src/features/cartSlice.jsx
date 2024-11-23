import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch cart products
export const fetchCartProducts = createAsyncThunk(
  "cart/fetchCartProducts",
  async () => {
    try {
      const response = await axios.get(`http://localhost:3000/cart`);
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 404) {
        throw new Error("No products found in the cart.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1, selectedSize }) => {
    try {
      const response = await axios.post(`http://localhost:3000/cart`, {
        productId,
        quantity,
        selectedSize,
      });
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error("Error adding product to cart.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/cart/${productId}`
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Error removing product from cart.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ _id, quantity, selectedSize }) => {
    console.log("Payload: ", { _id, quantity });
    try {
      const response = await axios.put(`http://localhost:3000/cart/${_id}`, {
        quantity,
        selectedSize,
      });
      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      } else {
        throw new Error("Error updating cart item.");
      }
    } catch (error) {
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartProducts: [],
    cartStatus: "idle",
    cartError: null,
    selectedSize: "",
  },
  reducers: {
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    // resetSelectedSize: (state) => {
    //   state.selectedSize = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Products
      .addCase(fetchCartProducts.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.cartStatus = "success";
        state.cartProducts = action.payload; // Load fetched products into state
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartStatus = "success";

        // Check if the product is already in the cart
        const existingProduct = state.cartProducts.find(
          (prod) => prod.productId._id === action.payload.productId._id
        );

        if (existingProduct) {
          // If product exists, update its quantity and selected size
          existingProduct.quantity += action.payload.quantity;
          existingProduct.selectedSize = action.payload.selectedSize;
        } else {
          // Add new product to cart
          state.cartProducts.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartStatus = "success";
        // Remove product from cart by filtering it out
        state.cartProducts = state.cartProducts.filter(
          (prod) => prod._id !== action.payload._id
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      })

      // Update Cart Item Quantity
      .addCase(updateCartItem.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cartStatus = "success";
        // Find the updated product in the cart and update its quantity
        // console.log(cartProducts)
        const updatedProduct = state.cartProducts.find(
          (item) => item._id === action.payload._id
        );
        console.log("Updated Product", updatedProduct);
        if (updatedProduct) {
          updatedProduct.quantity = action.payload.quantity;
          updatedProduct.selectedSize = action.payload.selectedSize;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      });
  },
});

export const { setSelectedSize } = cartSlice.actions;

export default cartSlice.reducer;
