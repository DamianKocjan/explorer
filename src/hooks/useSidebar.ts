import { useDisclosure } from "@chakra-ui/react";
import { create } from "zustand";

interface SidebarMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const _useSidebarMenu = create<SidebarMenuState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export function useSidebarMenu() {
  const { isOpen, open, close } = _useSidebarMenu();

  return useDisclosure({
    isOpen,
    onClose: close,
    onOpen: open,
  });
}
