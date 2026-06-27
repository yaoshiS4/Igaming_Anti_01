/* ============================================================================
 * LogoutButton — sign-out with a CONFIRM step (SPEC-03 §account). NEVER one-tap:
 * tapping "Đăng xuất" opens a lazy confirm Modal (the Dialog primitive,
 * focus-trapped, Esc/scrim closable) with an explicit cancel/confirm pair. Only
 * the confirm actually calls signOut(). Hidden entirely for a guest.
 *
 * Two trigger shapes share one confirm Modal: <LogoutButton/> (a full-width
 * row, used on the mobile hub) and <LogoutMenuItem/> (an icon-grid tile, the
 * last entry in the MemberSidebar menu — J9's 退出 menu entry).
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { vi } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button, Icon, Modal } from "@/ui";
import styles from "./LogoutButton.module.css";

/** Shared confirm Modal chrome for both trigger shapes. */
function LogoutModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vi.auth.logout}
      size="sm"
      footer={
        <div className={styles.actions}>
          <Button variant="ghost" size="md" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm}>
            {vi.auth.logout}
          </Button>
        </div>
      }
    >
      <p className={styles.body}>Bạn có chắc muốn đăng xuất khỏi tài khoản?</p>
    </Modal>
  );
}

export function LogoutButton() {
  const { isAuthenticated, signOut } = useAuth();
  const [confirming, setConfirming] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="lg"
        fullWidth
        icon="account"
        onClick={() => setConfirming(true)}
        className={styles.trigger}
      >
        {vi.auth.logout}
      </Button>

      <LogoutModal
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          signOut();
        }}
      />
    </>
  );
}

/** Icon-grid tile variant — the last menu tile on the MemberSidebar. */
export function LogoutMenuItem({ className }: { className?: string }) {
  const { isAuthenticated, signOut } = useAuth();
  const [confirming, setConfirming] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <button type="button" className={className} onClick={() => setConfirming(true)}>
        <Icon name="close" size={24} className={styles.menuIcon} />
        <span>{vi.auth.logout}</span>
      </button>

      <LogoutModal
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          signOut();
        }}
      />
    </>
  );
}
