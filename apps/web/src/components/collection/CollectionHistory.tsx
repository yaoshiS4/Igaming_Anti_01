/* ============================================================================
 * Yaobet — BỘ SƯU TẬP · the history.
 * ----------------------------------------------------------------------------
 * SELF-CONTAINED: it does its own audit read and owns its own loading, empty
 * and error states, so any surface can mount it with two props. It reads from
 * the AUDIT port, never from local component state, so it is the same record
 * support sees — a history a player cannot check against support is decoration.
 *
 * BOUNDED. `trace` takes a limit and a cursor and this renders one page at a
 * time behind `Xem thêm`. An unbounded log only breaks on the heaviest
 * accounts, which is the worst possible place to find it.
 *
 * It is a PAGE component, not an overlay one: it assumes ordinary page flow.
 * Putting an unbounded, unpaginated log inside a focus-trapped, body-scroll-
 * locked sheet is a scroll-trap on a phone with no floor.
 * ==========================================================================*/

"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuditEntry, CollectionPorts } from "@/lib/collection";
import { cardById, setById } from "@/lib/collection/fixtures/epl";
import styles from "./history.module.css";

const PLAYER = "demo-player";

/** Rows per page. The `Xem thêm` control fetches the next one. */
const PAGE = 50;

interface Props {
  ports: CollectionPorts;
  /** refresh trigger — a changed value re-reads the trace from the first page */
  nonce: number;
}

type Status = "loading" | "error" | "ready";

export function CollectionHistory({ ports, nonce }: Props) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [more, setMore] = useState(false);

  const loadFirst = useCallback(async () => {
    setStatus("loading");
    const env = await ports.audit.trace(PLAYER, { limit: PAGE });
    if (env.status === "error") {
      setStatus("error");
      return;
    }
    // `absent` is the truthful envelope for a player with no record yet — it
    // is an empty history, not a failure.
    const page = env.status === "live" ? env.value : { entries: [], nextCursor: null };
    setEntries(page.entries);
    setCursor(page.nextCursor);
    setStatus("ready");
  }, [ports]);

  useEffect(() => {
    // One-shot read on mount and on every nonce change, not a render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFirst();
  }, [loadFirst, nonce]);

  const loadMore = useCallback(async () => {
    if (!cursor || more) return;
    setMore(true);
    const env = await ports.audit.trace(PLAYER, { limit: PAGE, cursor });
    if (env.status === "live") {
      setEntries((prev) => [...prev, ...env.value.entries]);
      setCursor(env.value.nextCursor);
    } else if (env.status === "absent") {
      // The record ended between the two reads. Nothing more to offer.
      setCursor(null);
    }
    // On `error` the cursor is kept, so the control stays available to retry.
    setMore(false);
  }, [cursor, more, ports]);

  if (status === "loading") {
    return <p className={styles.empty}>Đang tải…</p>;
  }

  if (status === "error") {
    return (
      <div className={styles.failure}>
        <p className={styles.empty}>Không tải được lịch sử.</p>
        <button type="button" className={styles.btn} onClick={() => void loadFirst()}>
          Thử lại
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return <p className={styles.empty}>Chưa có hoạt động nào.</p>;
  }

  return (
    <div className={styles.history}>
      <ul className={styles.log}>
        {entries.map((e) => (
          <LogRow key={e.id} entry={e} />
        ))}
      </ul>

      {cursor && (
        <button
          type="button"
          className={styles.btn}
          onClick={() => void loadMore()}
          disabled={more}
        >
          {more ? "Đang tải…" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * One history row. The event key maps to a Vietnamese sentence — the same
 * sentence support reads, never a different internal one.
 * --------------------------------------------------------------------------*/

function LogRow({ entry }: { entry: AuditEntry }) {
  const { label, detail, kind } = describe(entry);
  return (
    <li className={styles.row}>
      <span className={`${styles.badge} ${styles[kind]}`}>{label}</span>
      <span className={styles.detail}>{detail}</span>
      <time className={styles.time} dateTime={entry.at}>
        {formatTime(entry.at)}
      </time>
    </li>
  );
}

type Kind = "earn" | "draw" | "dupe" | "reward" | "info";

function describe(e: AuditEntry): { label: string; detail: string; kind: Kind } {
  const card = cardById(e.subjectId);
  const set = setById(e.subjectId);

  switch (e.event) {
    case "entitlement.earned":
      return {
        label: "Nhận lượt",
        detail: `+${e.subjectId} lượt mở từ cược đã kết toán`,
        kind: "earn",
      };
    case "draw.new":
      return {
        label: "Thẻ mới",
        detail: card ? `${card.name} · ${card.club}` : e.subjectId,
        kind: "draw",
      };
    case "draw.duplicate":
      return {
        label: "Trùng thẻ",
        detail: `${card ? card.name : e.subjectId}${e.reason ? ` · ${e.reason}` : ""}`,
        kind: "dupe",
      };
    case "reward.exchanged":
      return {
        label: "Đổi thưởng",
        detail: set ? set.name : e.subjectId,
        kind: "reward",
      };
    case "draw.refused":
    case "consume.refused":
      return { label: "Từ chối", detail: e.reason ?? "", kind: "info" };
    case "collection.completed":
      return {
        label: "Hoàn thành",
        detail: set ? `Đủ bộ ${set.name}` : e.subjectId,
        kind: "reward",
      };
    case "activity.simulated":
      return {
        label: "Hoạt động",
        detail: `Cược mô phỏng ${e.subjectId}`,
        kind: "info",
      };
    default:
      return { label: "Khác", detail: e.reason ?? e.subjectId, kind: "info" };
  }
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
