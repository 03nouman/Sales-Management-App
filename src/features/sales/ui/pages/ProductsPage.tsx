import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { salesService } from "../../services/salesService";
import { addProduct, type Product } from "../../salesSlice";
import { formatPrice } from "../../../../lib/currency";

type ProductFormValues = {
  name: string;
  category: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
};

const categories = [
  "Metal",
  "Steel",
  "Fasteners",
  "Pipe",
  "Electrical",
  "Tools",
];

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.sales.products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const response = await salesService.getProducts();
        if (isActive) {
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

  const { register, handleSubmit, reset } = useForm<ProductFormValues>({
    defaultValues: {
      category: "Metal",
    },
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  const onSubmit = (data: ProductFormValues) => {
    const newProduct: Product = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      price: Number(data.price),
      cost: Number(data.cost),
      stock: Number(data.stock),
      sku: data.sku || `SKU-${Date.now()}`,
      status: Number(data.stock) <= 10 ? "Low Stock" : "In Stock",
    };

    dispatch(addProduct(newProduct));
    reset();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Products & Inventory
          </h1>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {products.length} total items
          </span>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mb-5 h-24 animate-pulse rounded-2xl bg-slate-200" />
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-6"
        >
          <div className="xl:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Product name
            </label>
            <input
              {...register("name", { required: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              SKU
            </label>
            <input
              {...register("sku", { required: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Cost
            </label>
            <input
              type="number"
              step="0.01"
              {...register("cost", { required: true, valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Selling price
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: true, valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Stock
            </label>
            <input
              type="number"
              {...register("stock", { required: true, valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="xl:col-span-6 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Inventory List
          </h2>
          <div className="flex w-full gap-3 md:w-[60%]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-[40%] rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Selling</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {product.category}
                  </td>
                  <td className="px-4 py-3">{formatPrice(product.cost)}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${product.status === "Low Stock" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
