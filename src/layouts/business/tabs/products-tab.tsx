import { Input } from "@/components/ui/input";
import { useGetBusinessProducts } from "@/hooks/stats-hook.hook";
import type { BusinessProduct, BusinessProductCategory } from "@/types/product";
import { SearchNormal1 } from "iconsax-reactjs";
import { Loader, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ProductsTab = ({ businessId }: { businessId?: string }) => {
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [categories, setCategories] = useState<BusinessProductCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setProducts([]);
      setCategories([]);
      setSelectedCategoryId("ALL");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetBusinessProducts({
          businessId,
          page: 0,
          size: 10,
          search,
        });

        const payload = response?.data?.data || response?.data || response;
        const productsData = payload?.products?.data;
        const categoriesData = payload?.categories;

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err: any) {
        setProducts([]);
        setCategories([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [businessId, search]);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "ALL") {
      return products;
    }

    return products.filter(
      (item) => item.productCategoryId === selectedCategoryId
    );
  }, [products, selectedCategoryId]);

  const selectedCategoryTitle = useMemo(() => {
    if (selectedCategoryId === "ALL") {
      return "All products";
    }

    return (
      categories.find((item) => item.productCategoryId === selectedCategoryId)
        ?.title || "Products"
    );
  }, [categories, selectedCategoryId]);

  const formatCurrency = (value: number | null | undefined) => {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) {
      return "NGN 0.00";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full py-6">
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex min-h-[560px]">
          <aside className="w-[240px] shrink-0 border-r border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] tracking-[1px] text-[#6B7280] font-[700]">
                CATEGORIES
              </p>
              <button className="h-7 w-7 flex items-center justify-center rounded-md bg-[#F3F4F6]">
                <Pencil size={14} />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategoryId("ALL")}
                className={`w-full text-left px-3 py-2 rounded-md text-[14px] flex items-center justify-between ${
                  selectedCategoryId === "ALL"
                    ? "bg-[#F3F4F6] text-[#111827]"
                    : "text-[#374151]"
                }`}
              >
                <span>All products</span>
                <span className="text-[#9CA3AF]">{products.length}</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.productCategoryId}
                  onClick={() => setSelectedCategoryId(category.productCategoryId)}
                  className={`w-full text-left px-3 py-2 rounded-md text-[14px] flex items-center justify-between ${
                    selectedCategoryId === category.productCategoryId
                      ? "bg-[#F3F4F6] text-[#111827]"
                      : "text-[#374151]"
                  }`}
                >
                  <span>{category.title}</span>
                  <span className="text-[#9CA3AF]">
                    {category.numberOfProductCount || 0}
                  </span>
                </button>
              ))}
            </div>

            <button className="mt-4 text-[#2563EB] text-[14px] flex items-center gap-2">
              <span>Create category</span>
              <Plus size={14} />
            </button>
          </aside>

          <div className="flex-1 p-3">
            <div className="relative mb-4">
              <SearchNormal1
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="pl-9 h-10 rounded-xl border-[#E5E7EB]"
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[20px] font-[700]">{selectedCategoryTitle}</h3>
              <button className="h-9 w-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="flex justify-center">
                  <Loader className="animate-spin" />
                </div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <p className="text-gray-600 px-2">No products found.</p>
            ) : (
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                {filteredProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between gap-3 p-3 border-b border-[#E5E7EB] last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.imageUrl || "/main-logo.png"}
                        alt={product.productName}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-[15px] font-[700] text-[#111827] truncate">
                          {product.productName || "Untitled product"}
                        </p>
                        <p className="text-[13px] text-[#6B7280] truncate">
                          {product.productDescription || "No description"}
                        </p>
                        <p className="text-[14px] text-[#374151] mt-1">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="h-8 w-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                        <Pencil size={15} />
                      </button>
                      <button className="h-8 w-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
