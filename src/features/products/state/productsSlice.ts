import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";
import type { Product } from "../types/product.type";
import type { ProductsState } from "../types/productState.types";

/* =========================================================
   INITIAL DEMO PRODUCTS

   These are kept only as fallback/demo data until the
   backend provides the product catalog.
========================================================= */

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Aluminium Rod 12mm",
    category: "Metal",
    price: 220,
    cost: 145,
    stock: 48,
    sku: "AL-12-001",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Steel Plate 3mm",
    category: "Steel",
    price: 540,
    cost: 388,
    stock: 18,
    sku: "ST-3-014",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Nail Pack 50pcs",
    category: "Fasteners",
    price: 85,
    cost: 54,
    stock: 96,
    sku: "NA-50-019",
    status: "In Stock",
  },
  {
    id: 4,
    name: "PVC Pipe 1 inch",
    category: "Pipe",
    price: 165,
    cost: 112,
    stock: 24,
    sku: "PVC-1-088",
    status: "In Stock",
  },
];

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: ProductsState = {
  products: initialProducts,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  selectedProductId: null,
};

/* =========================================================
   FETCH PRODUCTS
========================================================= */

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  {
    rejectValue: string;
  }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await productsApi.getProducts();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to fetch products.",
    );
  }
});

/* =========================================================
   FETCH PRODUCT BY ID
========================================================= */

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  {
    rejectValue: string;
  }
>("products/fetchProductById", async (productId, { rejectWithValue }) => {
  try {
    return await productsApi.getProductById(productId);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to fetch product.",
    );
  }
});

/* =========================================================
   SLICE
========================================================= */

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    /* =====================================================
       SELECT PRODUCT
    ===================================================== */

    setSelectedProduct(state, action: PayloadAction<number | null>) {
      state.selectedProductId = action.payload;
    },

    /* =====================================================
       CLEAR SELECTED PRODUCT
    ===================================================== */

    clearSelectedProduct(state) {
      state.selectedProductId = null;
    },

    /* =====================================================
       CLEAR ERROR
    ===================================================== */

    clearProductsError(state) {
      state.error = null;
    },

    /* =====================================================
       ADD PRODUCT LOCALLY
       
       Demo mode until POST /products exists.
    ===================================================== */

    addProductLocal(state, action: PayloadAction<Product>) {
      state.products.unshift(action.payload);
    },

    /* =====================================================
       UPDATE PRODUCT LOCALLY
    ===================================================== */

    updateProductLocal(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id,
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    /* =====================================================
       REMOVE PRODUCT LOCALLY
    ===================================================== */

    removeProductLocal(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );

      if (state.selectedProductId === action.payload) {
        state.selectedProductId = null;
      }
    },

    /* =====================================================
       UPDATE STOCK LOCALLY
    ===================================================== */

    updateProductStockLocal(
      state,
      action: PayloadAction<{
        productId: number;
        stock: number;
      }>,
    ) {
      const product = state.products.find(
        (item) => item.id === action.payload.productId,
      );

      if (!product) {
        return;
      }

      product.stock = Math.max(action.payload.stock, 0);

      if (product.stock === 0) {
        product.status = "Out of Stock";
      } else if (product.stock <= 10) {
        product.status = "Low Stock";
      } else {
        product.status = "In Stock";
      }
    },

    /* =====================================================
       RESET
    ===================================================== */

    resetProducts(state) {
      state.products = [];
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
      state.error = null;
      state.selectedProductId = null;
    },
  },

  /* =======================================================
     EXTRA REDUCERS
  ======================================================= */

  extraReducers: (builder) => {
    builder

      /* ===================================================
         FETCH PRODUCTS
      =================================================== */

      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to fetch products.";
      })

      /* ===================================================
         FETCH PRODUCT BY ID
      =================================================== */

      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );

        if (existingIndex === -1) {
          state.products.push(action.payload);
        } else {
          state.products[existingIndex] = action.payload;
        }

        state.selectedProductId = action.payload.id;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to fetch product.";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  setSelectedProduct,
  clearSelectedProduct,
  clearProductsError,
  addProductLocal,
  updateProductLocal,
  removeProductLocal,
  updateProductStockLocal,
  resetProducts,
} = productsSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default productsSlice.reducer;
