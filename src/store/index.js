import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

// Import slice tambahan di sini setelah dibuat
// import productReducer from './slices/productSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // products: productReducer,
  },
})

export default store
