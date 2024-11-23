import {configureStore} from "@reduxjs/toolkit"
import productSlice from "../features/productSlice"
import cartSlice from "../features/cartSlice"
import addressSlice from "../features/addressSlice"

export default configureStore({
    reducer:{
        products:productSlice,
        cart:cartSlice,
        address:addressSlice
    }
})