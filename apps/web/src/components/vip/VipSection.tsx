/* ============================================================================
 * VipSection — a thin titled-section wrapper used by the VIP + ladder pages to
 * keep consistent vertical rhythm and headings. Presentational, SC-safe.
 * ==========================================================================*/

import type { ReactNode } from "react";
import { Icon, type IconName } from "@/ui";
import styles from "./VipSection.module.css";

export interface VipSectionProps {
  title: string;
  icon?: IconName;
  /** optional right-aligned link/action node */
  action?: ReactNode;
  children: ReactNode;
}

export function VipSection({ title, icon, action, children }: VipSectionProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          {icon && <Icon name={icon} size={20} className={styles.icon} />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
