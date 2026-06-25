"use client";

import Image from "next/image";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { saveProduct, deleteProduct } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ProductManager({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const open = creating || editing !== null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => { setCreating(true); setEditing(null); }}>
          <Plus className="h-4 w-4" /> New product
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-secondary">
                      <Image src={p.image_url} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      {p.featured && <Badge variant="accent" className="mt-0.5">Featured</Badge>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">{formatPrice(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock <= 10 ? "text-destructive" : ""}>{p.stock}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setCreating(false); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button variant="ghost" size="icon" type="submit" aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {editing ? "Edit product" : "New product"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setCreating(false); }}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form
              action={async (fd) => {
                await saveProduct(fd);
                setEditing(null);
                setCreating(false);
              }}
              className="mt-5 space-y-4"
            >
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required defaultValue={editing?.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input id="price" name="price" type="number" step="0.01" required
                    defaultValue={editing ? (editing.price / 100).toFixed(2) : ""} />
                </div>
                <div>
                  <Label htmlFor="compare_at_price">Compare at (USD)</Label>
                  <Input id="compare_at_price" name="compare_at_price" type="number" step="0.01"
                    defaultValue={editing?.compare_at_price ? (editing.compare_at_price / 100).toFixed(2) : ""} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" required defaultValue={editing?.stock ?? 0} />
                </div>
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select id="category_id" name="category_id" defaultValue={editing?.category_id ?? ""}>
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" name="image_url" required defaultValue={editing?.image_url} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editing?.description} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={editing?.featured} className="h-4 w-4" />
                Featured product
              </label>
              <Button type="submit" className="w-full">Save product</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
