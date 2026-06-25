import { getCategories, getProducts } from "@/lib/data";
import { ProductManager } from "@/components/admin/product-manager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <ProductManager products={products} categories={categories} />;
}
