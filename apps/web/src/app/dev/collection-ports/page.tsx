/* ============================================================================
 * Yaobet — COLLECTION ports harness (GC-101 demonstrable proxy).
 * ----------------------------------------------------------------------------
 * Calls all eleven interfaces and renders, for each, which of the four
 * envelope states came back. This is the story's acceptance evidence: the seam
 * exists, it is exercisable, and the loading and error paths are visible
 * before any real surface consumes them.
 *
 * It also proves GC-102's two acceptance conditions:
 *   · a loading state is visible for at least the configured delay
 *   · a double-submitted mutation is rejected once and succeeds once
 *
 * THROWAWAY. Deleted when GC-207 lands. Dev-only route, not linked from
 * anywhere in the product.
 * ==========================================================================*/

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Envelope } from "@/lib/types";
import { FixtureCollectionAdapters } from "@/lib/collection/adapters/fixtures";
import styles from "./page.module.css";

type StateName = "live" | "loading" | "error" | "absent";

interface Probe {
  port: string;
  state: StateName;
  detail: string;
}

const PLAYER = "demo-player";

const PORT_NAMES = [
  "activity",
  "entitlement",
  "outcome",
  "wallet",
  "risk",
  "rg",
  "catalogue",
  "state",
  "clock",
  "audit",
  "holdout",
] as const;

export default function CollectionPortsHarness() {
  const adapters = useMemo(() => new FixtureCollectionAdapters("demo-a"), []);
  const ports = useMemo(() => adapters.toPorts(), [adapters]);

  const [probes, setProbes] = useState<Probe[]>(() =>
    PORT_NAMES.map((port) => ({ port, state: "loading" as StateName, detail: "…" })),
  );
  const [dupeLog, setDupeLog] = useState<string[]>([]);

  const runAll = useCallback(async () => {
    // Yield before the first setState so the initial probe does not cascade
    // renders synchronously inside the mount effect.
    await Promise.resolve();
    setProbes(
      PORT_NAMES.map((port) => ({ port, state: "loading" as StateName, detail: "…" })),
    );

    const settle = (port: string, state: StateName, detail: string) =>
      setProbes((prev) =>
        prev.map((p) => (p.port === port ? { port, state, detail } : p)),
      );

    const readInto = async <T,>(port: string, run: () => Promise<Envelope<T>>) => {
      const env = await run();
      settle(port, env.status, describe(env));
    };

    await Promise.all([
      readInto("activity", () => ports.activity.getPosition(PLAYER)),
      readInto("entitlement", () => ports.entitlement.list(PLAYER)),
      readInto("risk", () => ports.risk.check(PLAYER)),
      readInto("rg", () => ports.rg.renderVerdict(PLAYER)),
      readInto("catalogue", () => ports.catalogue.getCatalogue()),
      readInto("state", () => ports.state.get(PLAYER)),
      readInto("audit", () => ports.audit.trace(PLAYER)),
      readInto("holdout", () => ports.holdout.isHeldOut(PLAYER)),
      (async () => {
        const r = await ports.outcome.draw(PLAYER, "none", "probe-outcome");
        settle(
          "outcome",
          r.status === "rejected" ? "absent" : "live",
          r.status === "rejected" ? r.reason : "drew",
        );
      })(),
      (async () => {
        const r = await ports.wallet.credit(
          PLAYER,
          "probe-set",
          "cash-like",
          `probe-wallet-${Date.now()}`,
        );
        settle(
          "wallet",
          r.status === "rejected" ? "error" : "live",
          r.status === "rejected" ? r.reason : `txn ${r.value.transactionId}`,
        );
      })(),
      (async () => {
        settle("clock", "live", `${ports.clock.now()} · ${ports.clock.timezone()}`);
      })(),
    ]);
  }, [ports]);

  useEffect(() => {
    // The rule guards against cascading renders from synchronous setState in
    // an effect. `runAll` awaits before its first setState, so this is a
    // one-shot probe on mount, not a render loop — and probing on open is the
    // whole point of a harness page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void runAll();
  }, [runAll]);

  /* GC-102 — the same key twice: applied once, duplicate once. */
  const testIdempotency = useCallback(async () => {
    const key = `dup-test-${Date.now()}`;
    setDupeLog(["submitting the same key twice…"]);
    const [a, b] = await Promise.all([
      ports.state.setPriorityOrder(PLAYER, ["s1", "s2"], key),
      ports.state.setPriorityOrder(PLAYER, ["s1", "s2"], key),
    ]);
    setDupeLog([`first  → ${a.status}`, `second → ${b.status}`]);
  }, [ports]);

  const fire = useCallback(() => {
    adapters.fireActivity(1);
    adapters.mintEarnedOpens();
    void runAll();
  }, [adapters, runAll]);

  const reset = useCallback(() => {
    adapters.resetDemo();
    setDupeLog([]);
    void runAll();
  }, [adapters, runAll]);

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Collection ports — harness</h1>
        <p className={styles.note}>
          GC-101 proxy. Eleven ports, four envelope states. Fixtures inject
          latency and seeded failure by default, so loading and error paths are
          visible here before any surface consumes them. Catalogue and outcome
          refuse on purpose — they are blocked on BR-03, BR-04 and BR-05.
        </p>
      </header>

      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={() => void runAll()}>
          Re-probe all 11
        </button>
        <button type="button" className={styles.btn} onClick={fire}>
          Fire simulated activity
        </button>
        <button type="button" className={styles.btn} onClick={() => void testIdempotency()}>
          Double-submit one key
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            adapters.clock.shift(24 * 60 * 60 * 1000);
            void runAll();
          }}
        >
          Clock +1 day
        </button>
        <button type="button" className={styles.btn} onClick={reset}>
          Reset demo account
        </button>
      </div>

      {dupeLog.length > 0 && (
        <div className={styles.row}>
          <div className={styles.port}>
            <span className={styles.portName}>Idempotency</span>
            <span className={styles.portDetail}>{dupeLog.join("  ·  ")}</span>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {probes.map((p) => (
          <div key={p.port} className={styles.row}>
            <div className={styles.port}>
              <span className={styles.portName}>{p.port}</span>
              <span className={styles.portDetail}>{p.detail}</span>
            </div>
            <span className={`${styles.state} ${styles[p.state]}`}>{p.state}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

function describe<T>(env: Envelope<T>): string {
  if (env.status === "live") return preview(env.value);
  if (env.status === "error") return "error envelope — retryable";
  if (env.status === "absent") return "no real source — surface omits";
  return "…";
}

function preview(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    return json.length > 140 ? `${json.slice(0, 140)}…` : json;
  }
  return String(value);
}
