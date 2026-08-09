/* Luxury VIP — small-caps display section heading (STUB). */
import type { ReactNode } from "react";
import styles from "./VipSectionHeading.module.css";

export function VipSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className={styles.heading}>{children}</h2>;
}
