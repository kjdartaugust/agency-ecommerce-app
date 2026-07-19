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

// ---------- Fulfilment network ----------

export async function updateFulfillment(formData: FormData) {
  const admin = await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const tracking = String(formData.get("tracking") ?? "").trim();

  if (admin) {
    await admin
      .from("fulfillments")
      // Empty tracking is stored as null, not "", so "has tracking" stays a
      // simple null check everywhere downstream.
      .update({ status, tracking: tracking || null })
      .eq("id", id);
  }
  revalidatePath("/admin/orders");
}

export async function saveSupplier(formData: FormData) {
  const admin = await guard();
  const id = String(formData.get("id") ?? "");
  const row = {
    name: String(formData.get("name")),
    channel_type: String(formData.get("channel_type")),
    contact: String(formData.get("contact")),
    lead_time_days: Number(formData.get("lead_time_days")) || 3,
    active: formData.get("active") === "on",
  };

  if (admin) {
    if (id) await admin.from("suppliers").update(row).eq("id", id);
    else await admin.from("suppliers").insert(row);
  }
  revalidatePath("/admin/suppliers");
  revalidatePath("/admin/orders");
}

/**
 * Points a product at a supplier at an agreed cost. Upserted on
 * (product_id, supplier_id) so re-submitting the same pair edits the existing
 * match instead of creating a duplicate source for one product.
 */
export async function saveMatch(formData: FormData) {
  const admin = await guard();
  const row = {
    product_id: String(formData.get("product_id")),
    supplier_id: String(formData.get("supplier_id")),
    // Costs are entered in whole currency units but stored as cents, matching
    // product prices.
    cost: Math.round(Number(formData.get("cost")) * 100) || 0,
    priority: Number(formData.get("priority")) || 0,
  };

  if (admin) {
    await admin.from("matches").upsert(row, { onConflict: "product_id,supplier_id" });
  }
  revalidatePath("/admin/suppliers");
}

export async function deleteMatch(formData: FormData) {
  const admin = await guard();
  const id = String(formData.get("id"));
  if (admin) await admin.from("matches").delete().eq("id", id);
  revalidatePath("/admin/suppliers");
}
