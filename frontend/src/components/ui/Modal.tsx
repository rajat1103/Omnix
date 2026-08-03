import React from "react";
import { Dialog } from "@/components/ui/Dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export function Modal({ open, onClose, title, children, description }: ModalProps): React.ReactElement | null {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      {children}
    </Dialog>
  );
}
