import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toMajorUnits, toMajorUnitsString } from "@/lib/payments/money";

// Provider factories read env at import time, so each test that needs a
// configured provider stubs the env and imports the module fresh.
async function withEnv<T>(
  vars: Record<string, string>,
  run: (mod: typeof import("@/lib/payments")) => Promise<T> | T,
): Promise<T> {
  for (const [k, v] of Object.entries(vars)) vi.stubEnv(k, v);
  vi.resetModules();
  const mod = await import("@/lib/payments");
  return run(mod);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("money", () => {
  it("converts minor units to a major-unit number", () => {
    expect(toMajorUnits(18900)).toBe(189);
    expect(toMajorUnits(99)).toBe(0.99);
    expect(toMajorUnits(0)).toBe(0);
  });

  it("formats minor units as a two-decimal major-unit string", () => {
    expect(toMajorUnitsString(18900)).toBe("189.00");
    expect(toMajorUnitsString(50)).toBe("0.50");
  });
});

describe("provider registry", () => {
  it("exposes nothing when no keys are set — the demo/simulated path", async () => {
    await withEnv(
      { PAYSTACK_SECRET_KEY: "", FLUTTERWAVE_SECRET_KEY: "", STRIPE_SECRET_KEY: "" },
      ({ configuredProviders, resolveProvider }) => {
        expect(configuredProviders()).toHaveLength(0);
        expect(resolveProvider()).toBeNull();
        expect(resolveProvider("paystack")).toBeNull();
      },
    );
  });

  it("lists only configured providers, Africa-friendly ones first", async () => {
    await withEnv(
      { PAYSTACK_SECRET_KEY: "sk_test", FLUTTERWAVE_SECRET_KEY: "flw_test", STRIPE_SECRET_KEY: "" },
      ({ publicProviders }) => {
        const ids = publicProviders().map((p) => p.id);
        expect(ids).toEqual(["paystack", "flutterwave"]);
      },
    );
  });

  it("honours the buyer's chosen provider when it is configured", async () => {
    await withEnv(
      { PAYSTACK_SECRET_KEY: "sk_test", FLUTTERWAVE_SECRET_KEY: "flw_test" },
      ({ resolveProvider }) => {
        expect(resolveProvider("flutterwave")?.id).toBe("flutterwave");
      },
    );
  });

  it("falls back to the top-priority provider when the requested one is absent", async () => {
    await withEnv(
      { PAYSTACK_SECRET_KEY: "sk_test", FLUTTERWAVE_SECRET_KEY: "" },
      ({ resolveProvider }) => {
        // Requested stripe is not configured, so the only configured one wins.
        expect(resolveProvider("stripe")?.id).toBe("paystack");
      },
    );
  });
});

describe("paystack webhook verification", () => {
  const secret = "sk_test_paystack";
  const paid = JSON.stringify({ event: "charge.success", data: { reference: "order-1", status: "success" } });

  const sign = (body: string) => createHmac("sha512", secret).update(body).digest("hex");

  it("accepts a correctly signed charge.success as paid", async () => {
    await withEnv({ PAYSTACK_SECRET_KEY: secret }, async ({ getProvider }) => {
      const provider = getProvider("paystack")!;
      const result = await provider.parseWebhook(
        paid,
        new Headers({ "x-paystack-signature": sign(paid) }),
      );
      expect(result).toEqual({ reference: "order-1", status: "paid" });
    });
  });

  it("rejects a body whose signature does not match", async () => {
    await withEnv({ PAYSTACK_SECRET_KEY: secret }, async ({ getProvider }) => {
      const provider = getProvider("paystack")!;
      // Attacker replays a real-looking body but cannot forge the HMAC.
      const result = await provider.parseWebhook(
        paid,
        new Headers({ "x-paystack-signature": sign("tampered") }),
      );
      expect(result.status).toBe("ignored");
    });
  });

  it("ignores a missing signature entirely", async () => {
    await withEnv({ PAYSTACK_SECRET_KEY: secret }, async ({ getProvider }) => {
      const provider = getProvider("paystack")!;
      const result = await provider.parseWebhook(paid, new Headers());
      expect(result.status).toBe("ignored");
    });
  });

  it("does not treat non-success events as paid", async () => {
    await withEnv({ PAYSTACK_SECRET_KEY: secret }, async ({ getProvider }) => {
      const provider = getProvider("paystack")!;
      const failed = JSON.stringify({ event: "charge.failed", data: { reference: "order-1", status: "failed" } });
      const result = await provider.parseWebhook(
        failed,
        new Headers({ "x-paystack-signature": sign(failed) }),
      );
      expect(result.status).toBe("ignored");
    });
  });
});

describe("flutterwave webhook verification", () => {
  const secret = "FLWSECK_test";
  const hash = "my-webhook-hash";
  const paid = JSON.stringify({ event: "charge.completed", data: { tx_ref: "order-9", status: "successful" } });

  it("accepts a matching verif-hash and successful charge as paid", async () => {
    await withEnv(
      { FLUTTERWAVE_SECRET_KEY: secret, FLUTTERWAVE_WEBHOOK_HASH: hash },
      async ({ getProvider }) => {
        const provider = getProvider("flutterwave")!;
        const result = await provider.parseWebhook(paid, new Headers({ "verif-hash": hash }));
        expect(result).toEqual({ reference: "order-9", status: "paid" });
      },
    );
  });

  it("rejects a wrong verif-hash", async () => {
    await withEnv(
      { FLUTTERWAVE_SECRET_KEY: secret, FLUTTERWAVE_WEBHOOK_HASH: hash },
      async ({ getProvider }) => {
        const provider = getProvider("flutterwave")!;
        const result = await provider.parseWebhook(paid, new Headers({ "verif-hash": "wrong" }));
        expect(result.status).toBe("ignored");
      },
    );
  });

  it("ignores a failed charge even with a valid hash", async () => {
    await withEnv(
      { FLUTTERWAVE_SECRET_KEY: secret, FLUTTERWAVE_WEBHOOK_HASH: hash },
      async ({ getProvider }) => {
        const provider = getProvider("flutterwave")!;
        const failed = JSON.stringify({ event: "charge.completed", data: { tx_ref: "order-9", status: "failed" } });
        const result = await provider.parseWebhook(failed, new Headers({ "verif-hash": hash }));
        expect(result).toEqual({ reference: "order-9", status: "failed" });
      },
    );
  });
});
