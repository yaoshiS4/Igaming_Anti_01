/* ============================================================================
 * PerkGallery — per-tier perk tiles (SPEC-03 §club PerkGallery, reused on the
 * VIP/ladder pages). Each perk Card carries an illustration SLOT + name +
 * description + an "unlocks at hạng N" line. For a member, perks above their
 * level render with a lock veil (.mask) — an HONEST locked status, never a
 * fabricated unlock. NO toxic perks (hostess / loss-as-status / luxury) — the
 * fixture already excludes them. Empty fixture → EmptyState.
 * ==========================================================================*/

"use client";

import type { Perk } from "@/lib/types";
import { useAuth } from "@/lib/auth/session";
import { Card, Badge, Icon, EmptyState } from "@/ui";
import { vipCopy } from "./copy";
import styles from "./PerkGallery.module.css";

export interface PerkGalleryProps {
  perks: Perk[];
}

export function PerkGallery({ perks }: PerkGalleryProps) {
  const { isAuthenticated, user } = useAuth();
  const currentLevel = isAuthenticated && user ? user.vipLevel : null;

  if (perks.length === 0) {
    return <EmptyState icon="gift" message={vipCopy.perksHeading} />;
  }

  return (
    <ul className={styles.grid}>
      {perks.map((perk) => {
        const locked = currentLevel != null && perk.unlocksAtLevel > currentLevel;
        return (
          <li key={perk.id} className={styles.item}>
            <Card variant="tile" className={styles.perkCard}>
              {/* illustration SLOT — token-gradient panel awaiting licensed art */}
              <div className={styles.art} aria-hidden>
                <Icon name="gift" size={28} />
                {locked && (
                  <span className={styles.mask}>
                    <Icon name="lock" size={20} />
                  </span>
                )}
              </div>
              <div className={styles.body}>
                <div className={styles.perkHead}>
                  <span className={styles.perkName}>{perk.name}</span>
                  <Badge tone={locked ? "neutral" : "gold"} variant="subtle">
                    {vipCopy.perkUnlockAt(perk.unlocksAtLevel)}
                  </Badge>
                </div>
                <p className={styles.perkDesc}>{perk.description}</p>
                {locked && <p className={styles.lockedNote}>{vipCopy.perkLockedNote}</p>}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
