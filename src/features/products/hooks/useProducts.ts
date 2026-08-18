import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  ITEMS_PER_PAGE,
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../constants/productConstants";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { salesService } from "../../sales/services/salesService";
import { addProduct, type Product } from "../../sales/salesSlice";

export function useProducts() {
  const dispatch = useAppDispatch();

  const products = useAppSelector((state) => state.sales.products);

  /* =====================================================
     UI STATE
  ===================================================== */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  /* =====================================================
     FORM
  ===================================================== */

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      category: PRODUCT_CATEGORIES[0],
      sku: "",
      cost: 0,
      price: 0,
      stock: 0,
    },
  });

  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);

        const response = await salesService.getProducts();

        if (!isActive) return;

        setError(null);

        if (response.length > 0 && products.length === 0) {
          response.forEach((item) => {
            dispatch(
              addProduct({
                ...item,
                status: item.stock <= 10 ? "Low Stock" : "In Stock",
              }),
            );
          });
        }
      } catch {
        if (isActive) {
          setError("Unable to load products right now.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [dispatch, products.length]);

  /* =====================================================
     FILTERING
  ===================================================== */

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    const totalItems = products.reduce(
      (total, product) => total + Number(product.stock || 0),
      0,
    );

    const lowStockAlerts = products.filter(
      (product) => product.stock > 0 && product.stock <= 10,
    ).length;

    const pendingRestock = products.filter(
      (product) => product.stock <= 10,
    ).length;

    const inventoryValue = products.reduce(
      (total, product) =>
        total + Number(product.price || 0) * Number(product.stock || 0),
      0,
    );

    return {
      totalItems,
      lowStockAlerts,
      pendingRestock,
      inventoryValue,
    };
  }, [products]);

  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  const handleAddProduct = (data: ProductFormValues) => {
    const stock = Number(data.stock);
    const cost = Number(data.cost);
    const price = Number(data.price);

    const newProduct: Product = {
      id: Date.now(),
      name: data.name.trim(),
      category: data.category,
      price,
      cost,
      stock,
      sku: data.sku.trim() || `SKU-${Date.now()}`,
      status:
        stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "In Stock",
    };

    dispatch(addProduct(newProduct));

    form.reset();

    setIsAddModalOpen(false);

    setCurrentPage(1);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* =====================================================
     CATEGORY
  ===================================================== */

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setCurrentPage(1);
  };

  /* =====================================================
     MODALS
  ===================================================== */

  const openAddProduct = () => {
    form.reset({
      name: "",
      category: PRODUCT_CATEGORIES[0],
      sku: "",
      cost: 0,
      price: 0,
      stock: 0,
    });

    setIsAddModalOpen(true);
  };

  const closeAddProduct = () => {
    form.reset();
    setIsAddModalOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen((current) => !current);
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  return {
    /* data */
    products,
    filteredProducts,
    paginatedProducts,
    stats,

    /* loading */
    isLoading,
    error,

    /* filters */
    search,
    category,
    handleSearchChange,
    handleCategoryChange,
    resetFilters,

    /* pagination */
    currentPage: safeCurrentPage,
    totalPages,
    goToPage,

    /* modal */
    isAddModalOpen,
    openAddProduct,
    closeAddProduct,

    isFilterOpen,
    toggleFilter,

    /* form */
    form,
    handleAddProduct,
  };
}
