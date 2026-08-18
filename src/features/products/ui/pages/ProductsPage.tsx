import { useProducts } from "../../hooks/useProducts";
import AddProductModal from "../components/AddProductModal";
import InventoryHeader from "../components/InventoryHeader";
import InventoryStats from "../components/InventoryStats";
import InventoryTable from "../components/InventoryTable";
import InventoryToolbar from "../components/InventoryToolbar";

export function ProductsPage() {
  const products = useProducts();

  return (
    <div className="space-y-5">
      <InventoryHeader
        totalProducts={products.products.length}
        onAddProduct={products.openAddProduct}
      />

      {products.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {products.error}
        </div>
      )}

      <InventoryStats stats={products.stats} isLoading={products.isLoading} />

      <section
        className="
          overflow-hidden
          rounded-2xl
          border border-[#dedce8]
          bg-white
          shadow-[0_1px_3px_rgba(30,30,70,0.03)]
        "
      >
        <InventoryToolbar
          search={products.search}
          category={products.category}
          isFilterOpen={products.isFilterOpen}
          onSearchChange={products.handleSearchChange}
          onCategoryChange={products.handleCategoryChange}
          onToggleFilter={products.toggleFilter}
          onResetFilters={products.resetFilters}
          onAddProduct={products.openAddProduct}
        />

        <InventoryTable
          products={products.paginatedProducts}
          isLoading={products.isLoading}
          currentPage={products.currentPage}
          totalPages={products.totalPages}
          totalResults={products.filteredProducts.length}
          onPageChange={products.goToPage}
        />
      </section>

      <AddProductModal
        isOpen={products.isAddModalOpen}
        form={products.form}
        onClose={products.closeAddProduct}
        onSubmit={products.handleAddProduct}
      />
    </div>
  );
}
