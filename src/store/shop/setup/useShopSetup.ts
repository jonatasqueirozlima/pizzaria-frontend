import create from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { IShopSettings } from "@/types/shop.type";

export interface ShopSettingsState {
  shopSettings: Partial<IShopSettings> | null;
  setShopSettings: (shopSettings: Partial<IShopSettings>) => void;
}

const useShopSettings = create<ShopSettingsState>()(
  persist(
    (set, get) => ({
      shopSettings: null,
      setShopSettings: (shopSettings) => {
        set({
          shopSettings: { ...get().shopSettings, ...shopSettings },
        });
      },
    }),
    {
      name: "shop-settings-storage",
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({
        shopSettings: state.shopSettings,
      }),
    }
  )
);

export default useShopSettings;
