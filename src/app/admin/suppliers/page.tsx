import { Mail, Phone, Sheet, Webhook } from "lucide-react";
import { getMatches, getProducts, getSuppliers } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { marginPercent } from "@/lib/fulfillment";
import type { ChannelType } from "@/lib/types";
import { deleteMatch, saveMatch, saveSupplier } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";

const channels: ChannelType[] = ["api", "email", "sheet", "manual"];

const channelIcon: Record<ChannelType, typeof Mail> = {
  api: Webhook,
  email: Mail,
  sheet: Sheet,
  manual: Phone,
};

const channelHint: Record<ChannelType, string> = {
  api: "Orders POST to an endpoint automatically.",
  email: "Orders are emailed as a picking list.",
  sheet: "Orders append a row to a shared sheet.",
  manual: "Orders are sent to a person — phone or messaging.",
};

export default async function AdminSuppliersPage() {
  const [suppliers, matches, products] = await Promise.all([
    getSuppliers(),
    getMatches(),
    getProducts(),
  ]);

  const productById = new Map(products.map((p) => [p.id, p]));
  const supplierById = new Map(suppliers.map((s) => [s.id, s]));

  // Products with no active supplier can be sold but not fulfilled — the most
  // useful thing this page can tell you, so it leads.
  const activeSupplierIds = new Set(suppliers.filter((s) => s.active).map((s) => s.id));
  const unmatched = products.filter(
    (p) => !matches.some((m) => m.product_id === p.id && activeSupplierIds.has(m.supplier_id)),
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Suppliers</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Who can fulfil what, and at what cost. A supplier needs no software — an
        inbox or a phone number is a valid channel.
      </p>

      {unmatched.length > 0 && (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4">
          <p className="text-sm font-semibold">Sellable but not fulfillable</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {unmatched.map((p) => p.name).join(", ")} — no active supplier. Orders
            containing these will route incomplete.
          </p>
        </div>
      )}

      {/* ---------- Suppliers ---------- */}
      <div className="mt-8 space-y-3">
        {suppliers.map((s) => {
          const Icon = channelIcon[s.channel_type];
          const supplied = matches.filter((m) => m.supplier_id === s.id);

          return (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{s.channel_type}</Badge>
                  <Badge variant={s.active ? "default" : "outline"}>
                    {s.active ? "active" : "paused"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {supplied.length} product{supplied.length === 1 ? "" : "s"} · ~{s.lead_time_days}d
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {channelHint[s.channel_type]}
              </p>

              <form action={saveSupplier} className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <input type="hidden" name="id" value={s.id} />
                <input
                  name="name"
                  defaultValue={s.name}
                  className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                />
                <select
                  name="channel_type"
                  defaultValue={s.channel_type}
                  className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                >
                  {channels.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  name="contact"
                  defaultValue={s.contact}
                  className="min-w-48 flex-1 rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                />
                <input
                  name="lead_time_days"
                  type="number"
                  min={0}
                  defaultValue={s.lead_time_days}
                  className="w-20 rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={s.active} />
                  Active
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium hover:bg-secondary/80"
                >
                  Save
                </button>
              </form>
            </div>
          );
        })}
      </div>

      {/* ---------- Add supplier ---------- */}
      <div className="mt-6 rounded-2xl border border-dashed border-border p-5">
        <p className="font-medium">Add a supplier</p>
        <form action={saveSupplier} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            name="name"
            placeholder="Name"
            required
            className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          />
          <select
            name="channel_type"
            className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          >
            {channels.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            name="contact"
            placeholder="Email, URL, or phone number"
            required
            className="min-w-56 flex-1 rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          />
          <input
            name="lead_time_days"
            type="number"
            min={0}
            defaultValue={3}
            className="w-20 rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked />
            Active
          </label>
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add
          </button>
        </form>
      </div>

      {/* ---------- Matches ---------- */}
      <h2 className="mt-12 font-display text-xl font-semibold">Product matches</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Lowest priority wins. Add a second supplier to a product so routing has
        somewhere to fall through to when the first is paused.
      </p>

      <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
        {matches.map((m) => {
          const product = productById.get(m.product_id);
          const supplier = supplierById.get(m.supplier_id);
          const margin = product ? product.price - m.cost : 0;

          return (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{product?.name ?? m.product_id}</p>
                <p className="text-sm text-muted-foreground">
                  {supplier?.name ?? m.supplier_id}
                  {supplier && !supplier.active && " (paused)"} · priority {m.priority}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {formatPrice(m.cost)} cost
                </span>
                {product && (
                  <span>
                    {formatPrice(margin)} margin ·{" "}
                    {marginPercent(product.price, margin).toFixed(0)}%
                  </span>
                )}
                <form action={deleteMatch}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-input px-3 py-1 text-xs hover:bg-secondary"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Add match ---------- */}
      <div className="mt-6 rounded-2xl border border-dashed border-border p-5">
        <p className="font-medium">Point a product at a supplier</p>
        <form action={saveMatch} className="mt-3 flex flex-wrap items-center gap-2">
          <select
            name="product_id"
            className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            name="supplier_id"
            className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            name="cost"
            type="number"
            step="0.01"
            min={0}
            placeholder="Unit cost"
            required
            className="w-32 rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          />
          <input
            name="priority"
            type="number"
            min={0}
            defaultValue={0}
            title="Lower wins"
            className="w-20 rounded-full border border-input bg-background px-4 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save match
          </button>
        </form>
      </div>
    </div>
  );
}
