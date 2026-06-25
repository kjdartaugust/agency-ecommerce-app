"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function guard() {
  const ctx = await getAdminContext();
  if (ctx.configured && !ctx.isAdmin) throw new Error("Unauthorized");
  return createAdminClient();
}

export async function saveProduct(formData: FormData) {
  const admin = await guard();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name"));
  const record = {
    name,
    slug: String(formData.get("slug") || "") || slugify(name),
    description: String(formData.get("description") || ""),
    price: Math.round(Number(formData.get("price")) * 100),
    compare_at_price: formData.get("compare_at_price")
      ? Math.round(Number(formData.get("compare_at_price")) * 100)
      : null,
    image_url: String(formData.get("image_url")),
    category_id: String(formData.get("category_id") || "") || null,
    stock: Number(formData.get("stock")),
    featured: formData.get("featured") === "on",
  };

  if (!admin) {
    revalidatePath("/admin/products");
    return; // demo mode — nothing to persist
  }

  if (id) {
    await admin.from("products").update(record).eq("id", id);
  } else {
    await admin.from("products").insert(record);
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProduct(formData: FormData) {
  const admin = await guard();
  const id = String(formData.get("id"));
  if (admin) await admin.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateOrderStatus(formData: FormData) {
  const admin = await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (admin) await admin.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
}
